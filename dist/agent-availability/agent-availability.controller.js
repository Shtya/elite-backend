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
exports.AgentAvailabilityController = void 0;
const common_1 = require("@nestjs/common");
const agent_availability_service_1 = require("./agent-availability.service");
const agent_availability_dto_1 = require("../dto/agent-availability.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
const crud_service_1 = require("../../common/crud.service");
let AgentAvailabilityController = class AgentAvailabilityController {
    constructor(agentAvailabilityService) {
        this.agentAvailabilityService = agentAvailabilityService;
    }
    createAvailability(createAgentAvailabilityDto) {
        return this.agentAvailabilityService.createAvailability(createAgentAvailabilityDto);
    }
    getAvailability(query) {
        const filters = {};
        if (query.agentId)
            filters.agentId = Number(query.agentId);
        if (query.agentId && !filters.agentId)
            filters.agent = { id: Number(query.agentId) };
        if (typeof query.dayOfWeek !== 'undefined')
            filters.dayOfWeek = Number(query.dayOfWeek);
        return crud_service_1.CRUD.findAll(this.agentAvailabilityService.agentAvailabilityRepository, 'agent_availability', query.q || query.search, query.page, query.limit, query.sortBy ?? 'dayOfWeek', query.sortOrder ?? 'ASC', ['agent'], [], filters);
    }
    getAvailabilityById(id) {
        return this.agentAvailabilityService.getAvailabilityById(+id);
    }
    updateAvailability(id, updateAgentAvailabilityDto) {
        return this.agentAvailabilityService.updateAvailability(+id, updateAgentAvailabilityDto);
    }
    deleteAvailability(id) {
        return this.agentAvailabilityService.deleteAvailability(+id);
    }
    addPreferredProperty(createAgentPreferredPropertyDto) {
        return this.agentAvailabilityService.addPreferredProperty(createAgentPreferredPropertyDto);
    }
    getPreferredProperties(agentId, query) {
        const filters = { agent: { id: Number(agentId) } };
        return crud_service_1.CRUD.findAll(this.agentAvailabilityService.preferredPropertyRepository, 'agent_preferred_property', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'DESC', ['agent', 'property', 'property.city', 'property.area'], [], filters);
    }
    removePreferredProperty(id) {
        return this.agentAvailabilityService.removePreferredProperty(+id);
    }
    getAvailableAgents(date, time) {
        return this.agentAvailabilityService.getAvailableAgents(date, time);
    }
};
exports.AgentAvailabilityController = AgentAvailabilityController;
__decorate([
    (0, common_1.Post)('availability'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agent_availability_dto_1.CreateAgentAvailabilityDto]),
    __metadata("design:returntype", void 0)
], AgentAvailabilityController.prototype, "createAvailability", null);
__decorate([
    (0, common_1.Get)('availability'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AgentAvailabilityController.prototype, "getAvailability", null);
__decorate([
    (0, common_1.Get)('availability/:id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentAvailabilityController.prototype, "getAvailabilityById", null);
__decorate([
    (0, common_1.Patch)('availability/:id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, agent_availability_dto_1.UpdateAgentAvailabilityDto]),
    __metadata("design:returntype", void 0)
], AgentAvailabilityController.prototype, "updateAvailability", null);
__decorate([
    (0, common_1.Delete)('availability/:id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentAvailabilityController.prototype, "deleteAvailability", null);
__decorate([
    (0, common_1.Post)('preferred-properties'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agent_availability_dto_1.CreateAgentPreferredPropertyDto]),
    __metadata("design:returntype", void 0)
], AgentAvailabilityController.prototype, "addPreferredProperty", null);
__decorate([
    (0, common_1.Get)('preferred-properties/:agentId'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AgentAvailabilityController.prototype, "getPreferredProperties", null);
__decorate([
    (0, common_1.Delete)('preferred-properties/:id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentAvailabilityController.prototype, "removePreferredProperty", null);
__decorate([
    (0, common_1.Get)('agents/available'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.CUSTOMER),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('time')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AgentAvailabilityController.prototype, "getAvailableAgents", null);
exports.AgentAvailabilityController = AgentAvailabilityController = __decorate([
    (0, common_1.Controller)('agent-availability'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [agent_availability_service_1.AgentAvailabilityService])
], AgentAvailabilityController);
//# sourceMappingURL=agent-availability.controller.js.map