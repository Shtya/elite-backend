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
exports.AgentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const upload_config_1 = require("../../common/upload.config");
const agents_service_1 = require("./agents.service");
const agents_dto_1 = require("../dto/agents.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
let AgentsController = class AgentsController {
    constructor(agentsService) {
        this.agentsService = agentsService;
    }
    async create(createAgentDto, req, files) {
        createAgentDto.cityId = Number(createAgentDto.cityId);
        if (isNaN(createAgentDto.cityId)) {
            throw new common_1.BadRequestException('cityId must be a number');
        }
        if (req.user.type == global_entity_1.UserType.ADMIN && !createAgentDto.userId) {
            throw new common_1.BadRequestException('The admin must provide userId for the customer');
        }
        if (files?.identityProof?.[0]) {
            createAgentDto.identityProof = `/uploads/images/${files.identityProof[0].filename}`;
        }
        if (files?.residencyDocument?.[0]) {
            createAgentDto.residencyDocument = `/uploads/images/${files.residencyDocument[0].filename}`;
        }
        if (!createAgentDto.identityProof || !createAgentDto.residencyDocument) {
            throw new common_1.BadRequestException('identityProof or residencyDocument is missing (send as URL or file)');
        }
        return this.agentsService.create(createAgentDto, req.user.id);
    }
    async getMyDashboard(req) {
        const agentId = req.user?.id;
        if (!agentId) {
            throw new common_1.BadRequestException("Agent information not found in token");
        }
        return this.agentsService.getDashboard(agentId);
    }
    async findAll(query) {
        const repository = this.agentsService.agentsRepository;
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const qb = repository.createQueryBuilder('agent')
            .leftJoinAndSelect('agent.user', 'agent_user')
            .leftJoinAndSelect('agent.city', 'city')
            .skip(skip)
            .take(limit)
            .orderBy('agent.createdAt', 'DESC');
        if (query.status)
            qb.andWhere('agent.status = :status', { status: query.status });
        if (query.cityId)
            qb.andWhere('city.id = :cityId', { cityId: Number(query.cityId) });
        qb.andWhere('agent_user.user_type = :userType', { userType: global_entity_1.UserType.AGENT });
        const [records, total] = await qb.getManyAndCount();
        return {
            total_records: total,
            current_page: page,
            per_page: limit,
            records,
        };
    }
    findOne(id) {
        return this.agentsService.findOne(+id);
    }
    update(id, updateAgentDto, files) {
        if (files?.identityProof?.[0]) {
            updateAgentDto.identityProofUrl = `/uploads/images/${files.identityProof[0].filename}`;
        }
        if (files?.residencyDocument?.[0]) {
            updateAgentDto.residencyDocumentUrl = `/uploads/images/${files.residencyDocument[0].filename}`;
        }
        return this.agentsService.update(+id, updateAgentDto);
    }
    remove(id) {
        return this.agentsService.remove(+id);
    }
    approve(id, approveAgentDto) {
        return this.agentsService.approve(+id, approveAgentDto);
    }
    findByUserId(userId) {
        return this.agentsService.findByUserId(+userId);
    }
};
exports.AgentsController = AgentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.CUSTOMER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'identityProof', maxCount: 1 },
        { name: 'residencyDocument', maxCount: 1 },
    ], upload_config_1.imageUploadOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("dashboard"),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.AGENT),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "getMyDashboard", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY, global_entity_1.UserType.AGENT),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: "identityProof", maxCount: 1 },
        { name: "residencyDocument", maxCount: 1 },
    ], upload_config_1.imageUploadOptions)),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(":id/approve"),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, agents_dto_1.ApproveAgentDto]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "approve", null);
__decorate([
    (0, common_1.Get)("user/:userId"),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "findByUserId", null);
exports.AgentsController = AgentsController = __decorate([
    (0, common_1.Controller)("agents"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [agents_service_1.AgentsService])
], AgentsController);
//# sourceMappingURL=agents.controller.js.map