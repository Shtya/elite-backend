import { Repository } from 'typeorm';
import { Agent, AgentBalance, AgentPayment, Appointment, CustomerReview, User } from 'src/entities/global.entity';
import { CreateAgentDto, UpdateAgentDto, ApproveAgentDto, AgentQueryDto } from '../dto/agents.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
export declare class AgentsService {
    agentsRepository: Repository<Agent>;
    private usersRepository;
    private appointmentRepo;
    private paymentRepo;
    private reviewRepo;
    private balanceRepo;
    private notificationsService;
    constructor(agentsRepository: Repository<Agent>, usersRepository: Repository<User>, appointmentRepo: Repository<Appointment>, paymentRepo: Repository<AgentPayment>, reviewRepo: Repository<CustomerReview>, balanceRepo: Repository<AgentBalance>, notificationsService: NotificationsService);
    create(createAgentDto: CreateAgentDto, userId: number): Promise<Agent>;
    findAll(query: AgentQueryDto): Promise<{
        data: Agent[];
        total: number;
    }>;
    findOne(id: number): Promise<Agent>;
    update(id: number, updateAgentDto: UpdateAgentDto): Promise<Agent>;
    remove(id: number): Promise<void>;
    approve(id: number, approveAgentDto: ApproveAgentDto): Promise<Agent>;
    findByUserId(userId: number): Promise<Agent>;
    getDashboard(agentId: number): Promise<{
        stats: {
            totalAppointments: number;
            totalEarnings: string | number;
            pendingBalance: string | number;
            averageRating: number;
        };
        recentPayments: AgentPayment[];
        recentReviews: CustomerReview[];
        recentAppointments: Appointment[];
    }>;
}
