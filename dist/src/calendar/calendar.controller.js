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
exports.CalendarController = void 0;
const common_1 = require("@nestjs/common");
const calendar_service_1 = require("./calendar.service");
const calendar_dto_1 = require("../dto/calendar.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
const crud_service_1 = require("../../common/crud.service");
let CalendarController = class CalendarController {
    constructor(calendarService) {
        this.calendarService = calendarService;
    }
    connectAccount(connectCalendarAccountDto) {
        return this.calendarService.connectAccount(connectCalendarAccountDto);
    }
    getAccounts(query) {
        const filters = {};
        if (query.provider)
            filters.provider = query.provider;
        if (query.userId)
            filters.user = { id: Number(query.userId) };
        return crud_service_1.CRUD.findAll(this.calendarService.calendarAccountRepository, 'calendar_account', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'DESC', ['user'], ['provider', 'email', 'accountLabel'], filters);
    }
    getAccount(id) {
        return this.calendarService.getAccount(+id);
    }
    disconnectAccount(id) {
        return this.calendarService.disconnectAccount(+id);
    }
    syncAppointment(syncAppointmentDto) {
        return this.calendarService.syncAppointment(syncAppointmentDto);
    }
    getAppointmentSync(appointmentId) {
        return this.calendarService.getAppointmentSync(+appointmentId);
    }
    refreshTokens() {
        return this.calendarService.refreshExpiredTokens();
    }
};
exports.CalendarController = CalendarController;
__decorate([
    (0, common_1.Post)('connect'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calendar_dto_1.ConnectCalendarAccountDto]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "connectAccount", null);
__decorate([
    (0, common_1.Get)('accounts'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "getAccounts", null);
__decorate([
    (0, common_1.Get)('accounts/:id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "getAccount", null);
__decorate([
    (0, common_1.Delete)('accounts/:id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "disconnectAccount", null);
__decorate([
    (0, common_1.Post)('sync/appointment'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calendar_dto_1.SyncAppointmentDto]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "syncAppointment", null);
__decorate([
    (0, common_1.Get)('sync/appointment/:appointmentId'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('appointmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "getAppointmentSync", null);
__decorate([
    (0, common_1.Post)('sync/refresh-tokens'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "refreshTokens", null);
exports.CalendarController = CalendarController = __decorate([
    (0, common_1.Controller)('calendar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [calendar_service_1.CalendarService])
], CalendarController);
//# sourceMappingURL=calendar.controller.js.map