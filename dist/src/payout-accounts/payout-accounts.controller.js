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
exports.PayoutAccountsController = void 0;
const common_1 = require("@nestjs/common");
const payout_accounts_service_1 = require("./payout-accounts.service");
const payout_accounts_dto_1 = require("../dto/payout-accounts.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
const crud_service_1 = require("../../common/crud.service");
let PayoutAccountsController = class PayoutAccountsController {
    constructor(payoutAccountsService) {
        this.payoutAccountsService = payoutAccountsService;
    }
    findAll(query) {
        const filters = {};
        if (query.agentId)
            filters.agent = { id: Number(query.agentId) };
        if (typeof query.isVerified !== 'undefined') {
            filters.isVerified = query.isVerified === 'true' ? true : query.isVerified === 'false' ? false : query.isVerified;
        }
        return crud_service_1.CRUD.findAll(this.payoutAccountsService.payoutAccountsRepository, 'agent_payout_account', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'DESC', ['agent'], [], filters);
    }
    create(createPayoutAccountDto) {
        return this.payoutAccountsService.create(createPayoutAccountDto);
    }
    findByAgent(agentId) {
        return this.payoutAccountsService.findByAgent(+agentId);
    }
    findOne(id) {
        return this.payoutAccountsService.findOne(+id);
    }
    update(id, updatePayoutAccountDto) {
        return this.payoutAccountsService.update(+id, updatePayoutAccountDto);
    }
    remove(id) {
        return this.payoutAccountsService.remove(+id);
    }
    verifyAccount(agentId) {
        return this.payoutAccountsService.verifyAccount(+agentId);
    }
};
exports.PayoutAccountsController = PayoutAccountsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PayoutAccountsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payout_accounts_dto_1.CreatePayoutAccountDto]),
    __metadata("design:returntype", void 0)
], PayoutAccountsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('agent/:agentId'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayoutAccountsController.prototype, "findByAgent", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayoutAccountsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payout_accounts_dto_1.UpdatePayoutAccountDto]),
    __metadata("design:returntype", void 0)
], PayoutAccountsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayoutAccountsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('agent/:agentId/verify'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayoutAccountsController.prototype, "verifyAccount", null);
exports.PayoutAccountsController = PayoutAccountsController = __decorate([
    (0, common_1.Controller)('payout-accounts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [payout_accounts_service_1.PayoutAccountsService])
], PayoutAccountsController);
//# sourceMappingURL=payout-accounts.controller.js.map