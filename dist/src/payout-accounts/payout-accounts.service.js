"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutAccountsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
let PayoutAccountsService = class PayoutAccountsService {
    constructor(payoutAccountsRepository, usersRepository) {
        this.payoutAccountsRepository = payoutAccountsRepository;
        this.usersRepository = usersRepository;
    }
    async create(createPayoutAccountDto) {
        const agent = await this.usersRepository.findOne({
            where: { id: createPayoutAccountDto.agentId }
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const existingAccount = await this.payoutAccountsRepository.findOne({
            where: { agent: { id: createPayoutAccountDto.agentId } }
        });
        if (existingAccount) {
            throw new common_1.ConflictException('Payout account already exists for this agent');
        }
        if (!this.validateIBAN(createPayoutAccountDto.iban)) {
            throw new common_1.ConflictException('Invalid IBAN format');
        }
        const payoutAccount = this.payoutAccountsRepository.create({
            ...createPayoutAccountDto,
            agent,
        });
        return this.payoutAccountsRepository.save(payoutAccount);
    }
    async findByAgent(agentId) {
        const payoutAccount = await this.payoutAccountsRepository.findOne({
            where: { agent: { id: agentId } },
            relations: ['agent']
        });
        if (!payoutAccount) {
            throw new common_1.NotFoundException('Payout account not found for this agent');
        }
        return payoutAccount;
    }
    async findOne(id) {
        const payoutAccount = await this.payoutAccountsRepository.findOne({
            where: { id },
            relations: ['agent']
        });
        if (!payoutAccount) {
            throw new common_1.NotFoundException('Payout account not found');
        }
        return payoutAccount;
    }
    async update(id, updatePayoutAccountDto) {
        const payoutAccount = await this.findOne(id);
        if (updatePayoutAccountDto.iban && !this.validateIBAN(updatePayoutAccountDto.iban)) {
            throw new common_1.ConflictException('Invalid IBAN format');
        }
        Object.assign(payoutAccount, updatePayoutAccountDto);
        return this.payoutAccountsRepository.save(payoutAccount);
    }
    async remove(id) {
        const payoutAccount = await this.findOne(id);
        await this.payoutAccountsRepository.remove(payoutAccount);
    }
    async verifyAccount(agentId) {
        const payoutAccount = await this.findByAgent(agentId);
        const isValid = this.validateIBAN(payoutAccount.iban) &&
            payoutAccount.accountHolderName.length > 0 &&
            payoutAccount.bankName.length > 0;
        return {
            verified: isValid,
            message: isValid ? 'Account verified successfully' : 'Account verification failed'
        };
    }
    validateIBAN(iban) {
        const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
        return ibanRegex.test(iban.replace(/\s/g, '').toUpperCase());
    }
};
exports.PayoutAccountsService = PayoutAccountsService;
exports.PayoutAccountsService = PayoutAccountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.AgentPayoutAccount)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PayoutAccountsService);
//# sourceMappingURL=payout-accounts.service.js.map