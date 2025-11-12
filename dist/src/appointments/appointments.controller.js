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
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const appointments_service_1 = require("./appointments.service");
const appointments_dto_1 = require("../dto/appointments.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
const crud_service_1 = require("../../common/crud.service");
let AppointmentsController = class AppointmentsController {
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    create(createAppointmentDto, req) {
        const userId = Number(req.user.id);
        createAppointmentDto.customerId = userId;
        return this.appointmentsService.create(createAppointmentDto);
    }
    async findAll(query) {
        const repository = this.appointmentsService.appointmentsRepository;
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = query.sortBy || 'appointmentDate';
        const sortOrder = (query.sortOrder || 'DESC').toUpperCase();
        const qb = repository.createQueryBuilder('appointment')
            .skip(skip)
            .take(limit);
        const relations = ['property', 'property.city', 'property.area', 'customer', 'agent'];
        const addedAliases = new Set();
        relations.forEach(path => {
            const segments = path.split('.');
            let parentAlias = 'appointment';
            segments.forEach(seg => {
                const alias = `${parentAlias}_${seg}`;
                if (!addedAliases.has(alias)) {
                    qb.leftJoinAndSelect(`${parentAlias}.${seg}`, alias);
                    addedAliases.add(alias);
                }
                parentAlias = alias;
            });
        });
        if (query.customerId)
            qb.andWhere('appointment.customer_id = :customerId', { customerId: Number(query.customerId) });
        if (query.agentId)
            qb.andWhere('appointment.agent_id = :agentId', { agentId: Number(query.agentId) });
        if (query.propertyId)
            qb.andWhere('appointment.property_id = :propertyId', { propertyId: Number(query.propertyId) });
        if (query.status)
            qb.andWhere('appointment.status = :status', { status: query.status });
        if (query.q) {
            qb.andWhere('(appointment.customer_notes ILIKE :search OR appointment.agent_notes ILIKE :search)', { search: `%${query.q}%` });
        }
        qb.orderBy(`appointment.${sortBy}`, sortOrder);
        const [records, total] = await qb.getManyAndCount();
        return {
            total_records: total,
            current_page: page,
            per_page: limit,
            records,
        };
    }
    findOne(id) {
        return this.appointmentsService.findOne(+id);
    }
    update(id, updateAppointmentDto) {
        return this.appointmentsService.update(+id, updateAppointmentDto);
    }
    assignAgent(id, assignAgentDto) {
        return this.appointmentsService.assignAgent(+id, assignAgentDto.agentId);
    }
    updateStatus(id, updateStatusDto) {
        return this.appointmentsService.updateStatus(+id, updateStatusDto);
    }
    findByCustomer(customerId, query) {
        const filters = {
            customer: { id: Number(customerId) },
        };
        if (query.status)
            filters.status = query.status;
        if (query.propertyId)
            filters.property = { id: Number(query.propertyId) };
        return crud_service_1.CRUD.findAll(this.appointmentsService.appointmentsRepository, 'appointment', query.q || query.search, query.page, query.limit, query.sortBy ?? 'appointmentDate', query.sortOrder ?? 'DESC', ['property', 'agent', 'property.city', 'property.area'], [], filters);
    }
    async findByAgent(agentId, query) {
        const repository = this.appointmentsService.appointmentsRepository;
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const qb = repository.createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.property', 'property')
            .leftJoinAndSelect('property.city', 'city')
            .leftJoinAndSelect('property.area', 'area')
            .leftJoinAndSelect('appointment.customer', 'customer')
            .leftJoinAndSelect('appointment.agent', 'agent')
            .where('appointment.agent_id = :agentId', { agentId: Number(agentId) })
            .skip(skip)
            .take(limit)
            .orderBy('appointment.appointmentDate', 'DESC');
        if (query.status) {
            qb.andWhere('appointment.status = :status', { status: query.status });
        }
        if (query.propertyId) {
            qb.andWhere('property.id = :propertyId', { propertyId: Number(query.propertyId) });
        }
        const [records, total] = await qb.getManyAndCount();
        return {
            total_records: total,
            current_page: page,
            per_page: limit,
            records,
        };
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.CUSTOMER, global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [appointments_dto_1.CreateAppointmentDto, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT, global_entity_1.UserType.CUSTOMER, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointments_dto_1.UpdateAppointmentDto]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/assign-agent'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointments_dto_1.AssignAgentDto]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "assignAgent", null);
__decorate([
    (0, common_1.Post)(':id/update-status'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT, global_entity_1.UserType.CUSTOMER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointments_dto_1.UpdateStatusDto]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('customer/:customerId'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.CUSTOMER, global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findByCustomer", null);
__decorate([
    (0, common_1.Get)('agent/:agentId'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "findByAgent", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, common_1.Controller)('appointments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map