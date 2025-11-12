import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto, ProcessPaymentDto } from '../dto/payments.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: CreatePaymentDto): Promise<any>;
    findAll(query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").AgentPayment>>;
    findOne(id: string): Promise<import("src/entities/global.entity").AgentPayment>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<import("src/entities/global.entity").AgentPayment>;
    processPayment(id: string, processPaymentDto: ProcessPaymentDto): Promise<import("src/entities/global.entity").AgentPayment>;
    completePayment(id: string): Promise<import("src/entities/global.entity").AgentPayment>;
    getAgentBalance(agentId: string): Promise<import("src/entities/global.entity").AgentBalance>;
    getAgentPayments(agentId: string, query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").AgentPayment>>;
}
