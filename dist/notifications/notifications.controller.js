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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
const notifications_dto_1 = require("../dto/notifications.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
const crud_service_1 = require("../../common/crud.service");
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    create(createNotificationDto) {
        return this.notificationsService.create(createNotificationDto);
    }
    findAll(query) {
        const filters = {};
        if (query.userId)
            filters.user = { id: Number(query.userId) };
        if (query.type)
            filters.type = query.type;
        if (query.status)
            filters.status = query.status;
        if (query.channel)
            filters.channel = query.channel;
        return crud_service_1.CRUD.findAll(this.notificationsService.notificationsRepository, 'notification', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'DESC', ['user'], ['title', 'message'], filters);
    }
    async getMyNotifications(query, req) {
        const repository = this.notificationsService.notificationsRepository;
        const userId = Number(req?.user?.id);
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const qb = repository.createQueryBuilder('notification')
            .leftJoinAndSelect('notification.user', 'user')
            .where('user.id = :userId', { userId })
            .skip(skip)
            .take(limit)
            .orderBy('notification.createdAt', query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC');
        if (query.type) {
            qb.andWhere('notification.type = :type', { type: query.type });
        }
        if (query.status) {
            qb.andWhere('notification.status = :status', { status: query.status });
        }
        if (query.channel) {
            qb.andWhere('notification.channel = :channel', { channel: query.channel });
        }
        if (query.q || query.search) {
            const search = `%${query.q || query.search}%`;
            qb.andWhere('(notification.title ILIKE :search OR notification.message ILIKE :search)', { search });
        }
        const [records, total] = await qb.getManyAndCount();
        return {
            total_records: total,
            current_page: page,
            per_page: limit,
            records,
        };
    }
    findOne(id) {
        return this.notificationsService.findOne(+id);
    }
    update(id, updateNotificationDto) {
        return this.notificationsService.update(+id, updateNotificationDto);
    }
    remove(id) {
        return this.notificationsService.remove(+id);
    }
    sendNotification(sendNotificationDto) {
        return this.notificationsService.sendImmediate(sendNotificationDto);
    }
    markAsRead(id) {
        return this.notificationsService.markAsRead(+id);
    }
    markAllAsRead() {
        const userId = 1;
        return this.notificationsService.markAllAsRead(userId);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notifications_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getMyNotifications", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, notifications_dto_1.UpdateNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('send'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notifications_dto_1.SendNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Post)(':id/mark-read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('mark-all-read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAllAsRead", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map