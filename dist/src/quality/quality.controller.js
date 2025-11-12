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
exports.QualityController = void 0;
const common_1 = require("@nestjs/common");
const quality_service_1 = require("./quality.service");
const quality_dto_1 = require("../dto/quality.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
const crud_service_1 = require("../../common/crud.service");
let QualityController = class QualityController {
    constructor(qualityService) {
        this.qualityService = qualityService;
    }
    createCase(createQualityCaseDto) {
        return this.qualityService.createCase(createQualityCaseDto);
    }
    findAllCases(query) {
        const filters = {};
        if (query.status)
            filters.status = query.status;
        if (query.priority)
            filters.priority = query.priority;
        if (query.assigneeId)
            filters.assignee = { id: Number(query.assigneeId) };
        return crud_service_1.CRUD.findAll(this.qualityService.qualityCasesRepository, 'quality_case', query.q || query.search, query.page, query.limit, query.sortBy ?? 'priority', query.sortOrder ?? 'DESC', ['assignee', 'notes', 'notes.author'], ['title', 'description'], filters);
    }
    findCase(id) {
        return this.qualityService.findCase(+id);
    }
    updateCase(id, updateQualityCaseDto) {
        return this.qualityService.updateCase(+id, updateQualityCaseDto);
    }
    addCaseNote(id, addCaseNoteDto) {
        return this.qualityService.addCaseNote(+id, addCaseNoteDto);
    }
    assignCase(id, assigneeId) {
        return this.qualityService.assignCase(+id, assigneeId);
    }
    closeCase(id) {
        return this.qualityService.closeCase(+id);
    }
    getQualityStats() {
        return this.qualityService.getQualityStats();
    }
};
exports.QualityController = QualityController;
__decorate([
    (0, common_1.Post)('cases'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [quality_dto_1.CreateQualityCaseDto]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "createCase", null);
__decorate([
    (0, common_1.Get)('cases'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "findAllCases", null);
__decorate([
    (0, common_1.Get)('cases/:id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "findCase", null);
__decorate([
    (0, common_1.Patch)('cases/:id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, quality_dto_1.UpdateQualityCaseDto]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "updateCase", null);
__decorate([
    (0, common_1.Post)('cases/:id/notes'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, quality_dto_1.AddCaseNoteDto]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "addCaseNote", null);
__decorate([
    (0, common_1.Post)('cases/:id/assign'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('assigneeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "assignCase", null);
__decorate([
    (0, common_1.Post)('cases/:id/close'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "closeCase", null);
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "getQualityStats", null);
exports.QualityController = QualityController = __decorate([
    (0, common_1.Controller)('quality'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [quality_service_1.QualityService])
], QualityController);
//# sourceMappingURL=quality.controller.js.map