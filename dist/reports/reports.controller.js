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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const reports_dto_1 = require("../dto/reports.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
const crud_service_1 = require("../../common/crud.service");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    generateReport(generateReportDto) {
        return this.reportsService.generateReport(generateReportDto);
    }
    getReportSnapshots(query) {
        const filters = {};
        if (query.type)
            filters.type = query.type;
        return crud_service_1.CRUD.findAll(this.reportsService.reportSnapshotsRepository, 'report_snapshot', query.q || query.search, query.page, query.limit, query.sortBy ?? 'generatedAt', query.sortOrder ?? 'DESC', [], [], filters);
    }
    getReportSnapshot(id) {
        return this.reportsService.getReportSnapshot(+id);
    }
    getAdminDashboard() {
        return this.reportsService.getAdminDashboard();
    }
    getAgentPerformance(query) {
        return this.reportsService.getAgentPerformance(query);
    }
    getMarketingPerformance(query) {
        return this.reportsService.getMarketingPerformance(query);
    }
    getFinancialOverview(query) {
        return this.reportsService.getFinancialOverview(query);
    }
    getAgentSummary(agentId, query) {
        return this.reportsService.getAgentSummary(+agentId, query);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.GenerateReportDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Get)('snapshots'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getReportSnapshots", null);
__decorate([
    (0, common_1.Get)('snapshots/:id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getReportSnapshot", null);
__decorate([
    (0, common_1.Get)('dashboard/admin'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getAdminDashboard", null);
__decorate([
    (0, common_1.Get)('performance/agents'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.AgentPerformanceQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getAgentPerformance", null);
__decorate([
    (0, common_1.Get)('performance/marketing'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.MARKETER),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.MarketingPerformanceQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getMarketingPerformance", null);
__decorate([
    (0, common_1.Get)('financial/overview'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.ReportQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getFinancialOverview", null);
__decorate([
    (0, common_1.Get)('agent/:agentId/summary'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reports_dto_1.AgentPerformanceQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getAgentSummary", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map