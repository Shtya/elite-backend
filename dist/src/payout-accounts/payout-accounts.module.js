"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutAccountsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const payout_accounts_service_1 = require("./payout-accounts.service");
const payout_accounts_controller_1 = require("./payout-accounts.controller");
const global_entity_1 = require("../entities/global.entity");
let PayoutAccountsModule = class PayoutAccountsModule {
};
exports.PayoutAccountsModule = PayoutAccountsModule;
exports.PayoutAccountsModule = PayoutAccountsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([global_entity_1.AgentPayoutAccount, global_entity_1.User])],
        controllers: [payout_accounts_controller_1.PayoutAccountsController],
        providers: [payout_accounts_service_1.PayoutAccountsService],
        exports: [payout_accounts_service_1.PayoutAccountsService],
    })
], PayoutAccountsModule);
//# sourceMappingURL=payout-accounts.module.js.map