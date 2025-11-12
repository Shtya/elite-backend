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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
let NotificationsService = class NotificationsService {
    constructor(notificationsRepository, usersRepository) {
        this.notificationsRepository = notificationsRepository;
        this.usersRepository = usersRepository;
    }
    async create(createNotificationDto) {
        const user = await this.usersRepository.findOne({
            where: { id: createNotificationDto.userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const notification = this.notificationsRepository.create({
            ...createNotificationDto,
            user,
        });
        return this.notificationsRepository.save(notification);
    }
    async findAll(query) {
        const { userId, type, status, channel, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (userId)
            where.user = { id: userId };
        if (type)
            where.type = type;
        if (status)
            where.status = status;
        if (channel)
            where.channel = channel;
        const [data, total] = await this.notificationsRepository.findAndCount({
            where,
            relations: ['user'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { data, total };
    }
    async findByUser(userId, query) {
        const { type, status, channel, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const where = { user: { id: userId } };
        if (type)
            where.type = type;
        if (status)
            where.status = status;
        if (channel)
            where.channel = channel;
        const [data, total] = await this.notificationsRepository.findAndCount({
            where,
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { data, total };
    }
    async findOne(id) {
        const notification = await this.notificationsRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return notification;
    }
    async update(id, updateNotificationDto) {
        const notification = await this.findOne(id);
        Object.assign(notification, updateNotificationDto);
        return this.notificationsRepository.save(notification);
    }
    async remove(id) {
        const notification = await this.findOne(id);
        await this.notificationsRepository.remove(notification);
    }
    async sendImmediate(sendNotificationDto) {
        const user = await this.usersRepository.findOne({
            where: { id: sendNotificationDto.userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const notification = this.notificationsRepository.create({
            ...sendNotificationDto,
            user,
            status: global_entity_1.NotificationStatus.PENDING,
            sentAt: new Date(),
        });
        await this.sendToExternalService(notification);
        notification.status = global_entity_1.NotificationStatus.DELIVERED;
        return this.notificationsRepository.save(notification);
    }
    async markAsRead(id) {
        const notification = await this.findOne(id);
        return notification;
    }
    async markAllAsRead(userId) {
        return { message: 'All notifications marked as read' };
    }
    async sendToExternalService(notification) {
        console.log(`Sending notification via ${notification.channel}:`, {
            to: notification.user.phoneNumber,
            title: notification.title,
            message: notification.message,
        });
    }
    async sendAppointmentReminder(appointmentId) {
    }
    async sendRatingRequest(appointmentId) {
    }
    async createNotification(data) {
        const user = await this.usersRepository.findOne({ where: { id: data.userId } });
        const notification = this.notificationsRepository.create({
            user,
            type: data.type,
            title: data.title,
            message: data.message,
            relatedId: data.relatedId,
            channel: data.channel || global_entity_1.NotificationChannel.IN_APP,
            status: global_entity_1.NotificationStatus.PENDING,
            scheduledFor: data.scheduledFor,
        });
        return this.notificationsRepository.save(notification);
    }
    async createBulkNotifications(userIds, data) {
        const notifications = await Promise.all(userIds.map(async (userId) => {
            const user = await this.usersRepository.findOne({ where: { id: userId } });
            return this.notificationsRepository.create({
                user,
                ...data,
                status: global_entity_1.NotificationStatus.PENDING,
            });
        }));
        await this.notificationsRepository.save(notifications);
    }
    async notifyUserType(userType, data) {
        const users = await this.usersRepository.find({ where: { userType } });
        const userIds = users.map(user => user.id);
        await this.createBulkNotifications(userIds, data);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map