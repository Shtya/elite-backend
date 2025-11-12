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
exports.TimelineController = void 0;
const common_1 = require("@nestjs/common");
const timeline_service_1 = require("./timeline.service");
const timeline_dto_1 = require("../dto/timeline.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
const crud_service_1 = require("../../common/crud.service");
let TimelineController = class TimelineController {
    constructor(timelineService) {
        this.timelineService = timelineService;
    }
    create(createTimelineEventDto) {
        return this.timelineService.create(createTimelineEventDto);
    }
    findAll(query) {
        const filters = {};
        if (query.customerId)
            filters.customer = { id: Number(query.customerId) };
        if (query.eventType)
            filters.eventType = query.eventType;
        return crud_service_1.CRUD.findAll(this.timelineService.timelineEventsRepository, 'customer_timeline_event', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'DESC', ['customer', 'actorUser'], ['notes', 'eventType', 'relatedTable'], filters);
    }
    findByCustomer(customerId, query) {
        const filters = {
            customer: { id: Number(customerId) },
        };
        if (query.eventType)
            filters.eventType = query.eventType;
        return crud_service_1.CRUD.findAll(this.timelineService.timelineEventsRepository, 'customer_timeline_event', query.q || query.search, query.page, query.limit ?? 50, query.sortBy ?? 'createdAt', query.sortOrder ?? 'DESC', ['actorUser'], ['notes', 'eventType', 'relatedTable'], filters);
    }
    logAppointmentStatusChange(appointmentId, oldStatus, newStatus, notes) {
        return this.timelineService.logAppointmentStatusChange(+appointmentId, oldStatus, newStatus, notes);
    }
    logCustomerRegistration(customerId) {
        return this.timelineService.logCustomerRegistration(+customerId);
    }
};
exports.TimelineController = TimelineController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [timeline_dto_1.CreateTimelineEventDto]),
    __metadata("design:returntype", void 0)
], TimelineController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT, global_entity_1.UserType.QUALITY, global_entity_1.UserType.CUSTOMER),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TimelineController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('customer/:customerId'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT, global_entity_1.UserType.QUALITY, global_entity_1.UserType.CUSTOMER),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TimelineController.prototype, "findByCustomer", null);
__decorate([
    (0, common_1.Post)('appointment/:appointmentId/status-change'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, common_1.Body)('oldStatus')),
    __param(2, (0, common_1.Body)('newStatus')),
    __param(3, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], TimelineController.prototype, "logAppointmentStatusChange", null);
__decorate([
    (0, common_1.Post)('customer/:customerId/registration'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TimelineController.prototype, "logCustomerRegistration", null);
exports.TimelineController = TimelineController = __decorate([
    (0, common_1.Controller)('timeline'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [timeline_service_1.TimelineService])
], TimelineController);
//# sourceMappingURL=timeline.controller.js.map