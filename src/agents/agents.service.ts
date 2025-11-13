import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent, AgentApprovalStatus, AgentBalance, AgentPayment, Appointment, CustomerReview, NotificationChannel, NotificationType, User, UserType } from 'entities/global.entity';
import { CreateAgentDto, UpdateAgentDto, ApproveAgentDto, AgentQueryDto } from '../../dto/agents.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    public agentsRepository: Repository<Agent>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(AgentPayment)
    private paymentRepo: Repository<AgentPayment>,
    @InjectRepository(CustomerReview)
    private reviewRepo: Repository<CustomerReview>,
    @InjectRepository(AgentBalance)
    private balanceRepo: Repository<AgentBalance>,
    private notificationsService: NotificationsService,
  ) {}

  async create(createAgentDto: CreateAgentDto): Promise<Agent> {

    const existingAgentRecord = await this.agentsRepository.findOne({
      where: { user: { id: createAgentDto.userId } },
    });
    if (existingAgentRecord) {
      throw new ConflictException('Agent application already exists for this user');
    }

    const agent = this.agentsRepository.create({
      user: existingAgentRecord.user,
      city: { id: createAgentDto.cityId },
      identityProofUrl: createAgentDto.identityProof,
      residencyDocumentUrl: createAgentDto.residencyDocument,
    });

    await this.notificationsService.notifyUserType(UserType.ADMIN, {
      type: NotificationType.SYSTEM,
      title: 'New Agent Application',
      message: `Agent ${existingAgentRecord.user.fullName} has submitted a new application and requires approval.`,
      relatedId: agent.id,
      channel: NotificationChannel.IN_APP,
    });

    return this.agentsRepository.save(agent);
  }

  async findAll(query: AgentQueryDto): Promise<{ data: Agent[]; total: number }> {
    const { status, cityId, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (cityId) where.city = { id: cityId };

    const [data, total] = await this.agentsRepository.findAndCount({
      where,
      relations: ['user', 'city'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Agent> {
    const agent = await this.agentsRepository.findOne({
      where: { id },
      relations: ['user', 'city', 'updatedBy'],
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return agent;
  }

  async update(id: number, updateAgentDto: UpdateAgentDto): Promise<Agent> {
    const agent = await this.findOne(id);

    if (updateAgentDto.cityId) {
      agent.city = { id: updateAgentDto.cityId } as any;
    }

    Object.assign(agent, updateAgentDto);
    return this.agentsRepository.save(agent);
  }

  async remove(id: number): Promise<void> {
    const agent = await this.findOne(id);
    await this.agentsRepository.remove(agent);
  }

  async approve(id: number, approveAgentDto: ApproveAgentDto): Promise<Agent> {
    const agent = await this.findOne(id);

    agent.status = approveAgentDto.status;
    if (approveAgentDto.kycNotes) {
      agent.kycNotes = approveAgentDto.kycNotes;
    }
    if (approveAgentDto.status === AgentApprovalStatus.APPROVED) {
      agent.user.userType = UserType.AGENT;
      await this.usersRepository.save(agent.user);
    }
    await this.notificationsService.createNotification({
      userId: agent.user.id,
      type: NotificationType.SYSTEM,
      title: 'Agent Registration Decision',
      message: `Your agent registration request has been ${approveAgentDto.status === 'approved' ? 'approved' : 'rejected'}`,
      channel: NotificationChannel.IN_APP,
    });

    return this.agentsRepository.save(agent);
  }

  async findByUserId(userId: number): Promise<Agent> {
    const agent = await this.agentsRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'city'],
    });

    if (!agent) {
      throw new NotFoundException('Agent not found for this user');
    }

    return agent;
  }
async getDashboard(agentId: number) {
  const agent = await this.agentsRepository.findOne({where:{user:{id:agentId}}});
  if (!agent) {
    throw new NotFoundException('Agent not found for this user');
  }

  const totalAppointments = await this.appointmentRepo.count({
    where: { agent: { id: agent.id } },
  });
  const balance = await this.balanceRepo.findOne({ where: { agent: { id: agent.id } } });

  const recentPayments = await this.paymentRepo.find({
    where: { agent: { id: agent.id } },
    order: { createdAt: 'DESC' },
    take: 5,
  });

  const reviews = await this.reviewRepo.find({
    where: { agentId:agent.id },
    order: { createdAt: 'DESC' },
    take: 5,
  });

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  const recentAppointments = await this.appointmentRepo.find({
    where: { agent: { id: agent.id } },
    order: { appointmentDate: 'DESC' },
    take: 5,
    relations: ['customer', 'property'],
  });

  return {
    stats: {
      totalAppointments,
      totalEarnings: balance?.totalEarnings || 0,
      pendingBalance: balance?.pendingBalance || 0,
      averageRating,
    },
    recentPayments,
    recentReviews: reviews,
    recentAppointments,
  };
}
}
