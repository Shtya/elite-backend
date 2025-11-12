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
exports.TrafficController = void 0;
const common_1 = require("@nestjs/common");
const traffic_service_1 = require("./traffic.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
let TrafficController = class TrafficController {
    constructor(service) {
        this.service = service;
    }
    createPartner(body) {
        return this.service.createPartnerAndShareUrl(body);
    }
    buildShareUrl(id, body) {
        return this.service.buildShareUrlForPartner(+id, body);
    }
    partnerPerformance(id, q) {
        return this.service.getPartnerPerformance(+id, q);
    }
    listPartners(q) {
        return this.service.listPartners(q);
    }
    updatePartner(id, body) {
        return this.service.updatePartner(+id, body);
    }
    deletePartner(id) {
        return this.service.deletePartner(+id);
    }
    track(body, req) {
        body.userAgent = body.userAgent ?? req.headers['user-agent'];
        const fwd = req.headers['x-forwarded-for'] || '';
        body.ipAddress = body.ipAddress ?? (fwd.split(',')[0]?.trim() || req.socket.remoteAddress || '');
        return this.service.trackVisitor(body);
    }
    createConversion(body, req) {
        const headerRef = req.headers['x-ref'] || undefined;
        return this.service.createConversion({
            ...body,
            referralCode: body.referralCode ?? headerRef,
        });
    }
};
exports.TrafficController = TrafficController;
__decorate([
    (0, common_1.Post)('partners'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.MARKETER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrafficController.prototype, "createPartner", null);
__decorate([
    (0, common_1.Post)('partners/:id/share-url'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.MARKETER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TrafficController.prototype, "buildShareUrl", null);
__decorate([
    (0, common_1.Get)('partners/:id/performance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.MARKETER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TrafficController.prototype, "partnerPerformance", null);
__decorate([
    (0, common_1.Get)('partners'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.MARKETER),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrafficController.prototype, "listPartners", null);
__decorate([
    (0, common_1.Patch)('partners/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.MARKETER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TrafficController.prototype, "updatePartner", null);
__decorate([
    (0, common_1.Delete)('partners/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.MARKETER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrafficController.prototype, "deletePartner", null);
__decorate([
    (0, common_1.Post)('track'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TrafficController.prototype, "track", null);
__decorate([
    (0, common_1.Post)('conversions'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TrafficController.prototype, "createConversion", null);
exports.TrafficController = TrafficController = __decorate([
    (0, common_1.Controller)('traffic'),
    __metadata("design:paramtypes", [traffic_service_1.TrafficService])
], TrafficController);
//# sourceMappingURL=traffic.controller.js.map