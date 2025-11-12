import { Repository } from 'typeorm';
import { AgentPayoutAccount, User } from 'src/entities/global.entity';
import { CreatePayoutAccountDto, UpdatePayoutAccountDto } from '../dto/payout-accounts.dto';
export declare class PayoutAccountsService {
    readonly payoutAccountsRepository: Repository<AgentPayoutAccount>;
    private usersRepository;
    constructor(payoutAccountsRepository: Repository<AgentPayoutAccount>, usersRepository: Repository<User>);
    create(createPayoutAccountDto: CreatePayoutAccountDto): Promise<AgentPayoutAccount>;
    findByAgent(agentId: number): Promise<AgentPayoutAccount>;
    findOne(id: number): Promise<AgentPayoutAccount>;
    update(id: number, updatePayoutAccountDto: UpdatePayoutAccountDto): Promise<AgentPayoutAccount>;
    remove(id: number): Promise<void>;
    verifyAccount(agentId: number): Promise<{
        verified: boolean;
        message: string;
    }>;
    private validateIBAN;
}
