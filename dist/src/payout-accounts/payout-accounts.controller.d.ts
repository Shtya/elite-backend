import { PayoutAccountsService } from './payout-accounts.service';
import { CreatePayoutAccountDto, UpdatePayoutAccountDto } from '../dto/payout-accounts.dto';
export declare class PayoutAccountsController {
    private readonly payoutAccountsService;
    constructor(payoutAccountsService: PayoutAccountsService);
    findAll(query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").AgentPayoutAccount>>;
    create(createPayoutAccountDto: CreatePayoutAccountDto): Promise<import("src/entities/global.entity").AgentPayoutAccount>;
    findByAgent(agentId: string): Promise<import("src/entities/global.entity").AgentPayoutAccount>;
    findOne(id: string): Promise<import("src/entities/global.entity").AgentPayoutAccount>;
    update(id: string, updatePayoutAccountDto: UpdatePayoutAccountDto): Promise<import("src/entities/global.entity").AgentPayoutAccount>;
    remove(id: string): Promise<void>;
    verifyAccount(agentId: string): Promise<{
        verified: boolean;
        message: string;
    }>;
}
