import { Repository } from 'typeorm';
import { CustomerReview, AgentReview, CustomerReviewDimension, AgentReviewDimension, Appointment, User } from 'src/entities/global.entity';
import { CreateCustomerReviewDto, CreateAgentReviewDto, UpdateReviewDto } from '../dto/reviews.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
export declare class ReviewsService {
    customerReviewRepository: Repository<CustomerReview>;
    agentReviewRepository: Repository<AgentReview>;
    customerReviewDimensionRepository: Repository<CustomerReviewDimension>;
    agentReviewDimensionRepository: Repository<AgentReviewDimension>;
    appointmentRepository: Repository<Appointment>;
    usersRepository: Repository<User>;
    private notificationsService;
    constructor(customerReviewRepository: Repository<CustomerReview>, agentReviewRepository: Repository<AgentReview>, customerReviewDimensionRepository: Repository<CustomerReviewDimension>, agentReviewDimensionRepository: Repository<AgentReviewDimension>, appointmentRepository: Repository<Appointment>, usersRepository: Repository<User>, notificationsService: NotificationsService);
    createCustomerReview(createDto: CreateCustomerReviewDto): Promise<CustomerReview>;
    createAgentReview(createDto: CreateAgentReviewDto): Promise<AgentReview>;
    findCustomerReview(id: number): Promise<CustomerReview>;
    findAgentReview(id: number): Promise<AgentReview>;
    updateCustomerReview(id: number, updateDto: UpdateReviewDto): Promise<CustomerReview>;
    updateAgentReview(id: number, updateDto: UpdateReviewDto): Promise<AgentReview>;
    getAgentReviewSummary(agentId: number): Promise<any>;
}
