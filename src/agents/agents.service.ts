import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent, AgentApprovalStatus, AgentBalance, AgentPayment, Appointment, Area, City, CustomerReview, NotificationChannel, NotificationType, User, UserType, VerificationStatus } from 'entities/global.entity';
import { CreateAgentDto, UpdateAgentDto, ApproveAgentDto, AgentQueryDto } from '../../dto/agents.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from 'dto/auth.dto';

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

    @InjectRepository(City)
    private cityRepository: Repository<City>,
@InjectRepository(Area)
    private areaRepository: Repository<Area>,
    private notificationsService: NotificationsService,
  ) {}

  async create(createAgentDto: CreateAgentDto, byAdmin: boolean): Promise<Agent> {

    const existingAgent = await this.agentsRepository.findOne({
      where: { user: { id: createAgentDto.userId } },
    });
  
    if (existingAgent) {
      throw new ConflictException("Agent application already exists for this user");
    }
  
    const user = await this.usersRepository.findOne({ where: { id: createAgentDto.userId } });
  
    if (!user) throw new NotFoundException("User not found");
  
    // business rule:
    if (createAgentDto.cityIds.length > 1) {
      createAgentDto.areaIds = []; // wipe areas
    }
  
    const agent = this.agentsRepository.create({
      user,
  
      // many cities
      cities: createAgentDto.cityIds.map(id => ({ id })),
  
      // many areas
      areas: createAgentDto.areaIds?.map(id => ({ id })) ?? [],
  
      identityProofUrl: createAgentDto.identityProof,
      residencyDocumentUrl: createAgentDto.residencyDocument,
      status: byAdmin ? AgentApprovalStatus.APPROVED : AgentApprovalStatus.PENDING,
    });
  
    user.userType = byAdmin ? UserType.AGENT : UserType.CUSTOMER;
    await user.save();
  
    if (!byAdmin) {
      await this.notificationsService.notifyUserType(UserType.ADMIN, {
        type: NotificationType.SYSTEM,
        title: "New Agent Application",
        message: `Agent ${user.fullName} submitted application.`,
        channel: NotificationChannel.IN_APP,
      });
    }
  
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

  async update(id: number, dto: UpdateAgentDto): Promise<Agent> {
    const agent = await this.findOne(id);
  
    if (dto.cityIds) {
      agent.cities = await this.cityRepository.findByIds(dto.cityIds);
  
      if (dto.cityIds.length > 1) {
        agent.areas = []; // forbidden
      }
    }
  
    if (dto.areaIds) {
      if (agent.cities.length === 1) {
        agent.areas = await this.areaRepository.findByIds(dto.areaIds);
      } else {
        throw new BadRequestException("Areas can only be assigned when agent has exactly ONE city");
      }
    }
  
    Object.assign(agent, dto);
  
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

async registerAgent(
  registerDto: RegisterDto & { cityIds: number[]; areaIds?: number[] },
  files?: {
    identityProof?: Express.Multer.File[];
    residencyDocument?: Express.Multer.File[];
  },
): Promise<{ message: string }> {
  // 1️⃣ Check if user exists
  const existingUser = await this.usersRepository.findOne({
    where: [
      { email: registerDto.email },
      ...(registerDto.phoneNumber ? [{ phoneNumber: registerDto.phoneNumber }] : []),
    ],
  });

  if (existingUser) {
    throw new ConflictException("User with this email (or phone) already exists");
  }

  // 2️⃣ Hash password and create user
  const passwordHash = await bcrypt.hash(registerDto.password, 12);
  const user = this.usersRepository.create({
    email: registerDto.email,
    phoneNumber: registerDto.phoneNumber,
    fullName: registerDto.fullName,
    userType: UserType.AGENT,
    profilePhotoUrl: registerDto.profilePhotoUrl,
    passwordHash,
    verificationStatus: VerificationStatus.VERIFIED,
  });
  await this.usersRepository.save(user);


  // 5️⃣ Notifications for the user
  await this.notificationsService.createNotification({
    userId: user.id,
    type: NotificationType.SYSTEM,
    title: "Welcome to the Real Estate Platform",
    message: `Hello ${user.fullName}! Your account has been successfully created as an agent.`,
    channel: NotificationChannel.IN_APP,
  });

  // 6️⃣ Notification for admin
  const adminUsers = await this.usersRepository.find({ where: { userType: UserType.ADMIN } });
  if (adminUsers.length > 0) {
    await this.notificationsService.createNotification({
      userId: adminUsers[0].id,
      type: NotificationType.SYSTEM,
      title: "New Agent Registered",
      message: `A new agent named ${user.fullName} has registered on the platform.`,
      channel: NotificationChannel.IN_APP,
    });
  }

  // 7️⃣ Create Agent entity
  const agent = this.agentsRepository.create({
    user,
    identityProofUrl: files?.identityProof?.[0]
      ? `/uploads/images/${files.identityProof[0].filename}`
      : undefined,
    residencyDocumentUrl: files?.residencyDocument?.[0]
      ? `/uploads/images/${files.residencyDocument[0].filename}`
      : undefined,
  });

  // Fetch cities and areas from DB
  const cities = await this.cityRepository.findByIds(registerDto.cityIds);
  if (!cities.length) throw new BadRequestException("Invalid city IDs");
  agent.cities = cities;

  if (registerDto.areaIds) {
    if (cities.length === 1) {
      const areas = await this.areaRepository.findByIds(registerDto.areaIds);
      agent.areas = areas;
    } else {
      agent.areas = []; // can't assign areas if multiple cities
    }
  }

  await this.agentsRepository.save(agent);

  return { message: "Agent registered successfully." };
}

}
