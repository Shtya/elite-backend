import { Repository } from 'typeorm';
import { AgentPayment, AgentBalance, Appointment, User } from 'src/entities/global.entity';
import { CreatePaymentDto, UpdatePaymentDto, ProcessPaymentDto, PaymentQueryDto } from '../dto/payments.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
export declare class PaymentsService {
    readonly paymentsRepository: Repository<AgentPayment>;
    private balanceRepository;
    private appointmentRepository;
    private usersRepository;
    private notificationsService;
    constructor(paymentsRepository: Repository<AgentPayment>, balanceRepository: Repository<AgentBalance>, appointmentRepository: Repository<Appointment>, usersRepository: Repository<User>, notificationsService: NotificationsService);
    create(createPaymentDto: CreatePaymentDto): Promise<any>;
    findAll(query: PaymentQueryDto): Promise<{
        data: AgentPayment[];
        total: number;
    }>;
    findOne(id: number): Promise<AgentPayment>;
    update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<AgentPayment>;
    processPayment(id: number, processPaymentDto: ProcessPaymentDto): Promise<AgentPayment>;
    completePayment(id: number): Promise<AgentPayment>;
    private updateAgentBalance;
    getAgentBalance(agentId: number): Promise<AgentBalance>;
    getAgentPayments(agentId: number, query: PaymentQueryDto): Promise<{
        data: AgentPayment[];
        total: number;
    }>;
}
