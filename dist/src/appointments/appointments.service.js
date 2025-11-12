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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let AppointmentsService = class AppointmentsService {
    constructor(appointmentsRepository, statusHistoryRepository, usersRepository, propertiesRepository, notificationsService) {
        this.appointmentsRepository = appointmentsRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.usersRepository = usersRepository;
        this.propertiesRepository = propertiesRepository;
        this.notificationsService = notificationsService;
    }
    async create(createAppointmentDto) {
        const property = await this.propertiesRepository.findOne({
            where: { id: createAppointmentDto.propertyId },
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        const customer = await this.usersRepository.findOne({
            where: { id: createAppointmentDto.customerId },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        let agent = null;
        agent = await this.usersRepository.findOne({
            where: { id: property.createdBy.id },
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const appointment = this.appointmentsRepository.create({
            ...createAppointmentDto,
            property,
            customer,
            agent,
        });
        await this.notificationsService.createNotification({
            userId: appointment.customer.id,
            type: global_entity_1.NotificationType.APPOINTMENT_REMINDER,
            title: 'Appointment Booked',
            message: `Your appointment to view the property has been booked for ${appointment.appointmentDate} at ${appointment.startTime}.`,
            relatedId: appointment.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        if (appointment.agent) {
            await this.notificationsService.createNotification({
                userId: appointment.agent.id,
                type: global_entity_1.NotificationType.APPOINTMENT_REMINDER,
                title: 'New Appointment Assigned to You',
                message: `A new appointment has been assigned to you with the client ${appointment.customer.fullName}.`,
                relatedId: appointment.id,
                channel: global_entity_1.NotificationChannel.IN_APP,
            });
        }
        await this.notificationsService.notifyUserType(global_entity_1.UserType.ADMIN, {
            type: global_entity_1.NotificationType.SYSTEM,
            title: 'New Appointment Booked',
            message: `A new appointment has been booked for the property: ${appointment.property.title}.`,
            relatedId: appointment.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        return this.appointmentsRepository.save(appointment);
    }
    async findOne(id) {
        const appointment = await this.appointmentsRepository.findOne({
            where: { id },
            relations: ['property', 'customer', 'agent', 'property.city', 'property.area'],
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        return appointment;
    }
    async update(id, updateAppointmentDto) {
        const appointment = await this.findOne(id);
        if (updateAppointmentDto.agentId) {
            const agent = await this.usersRepository.findOne({
                where: { id: updateAppointmentDto.agentId },
            });
            if (!agent) {
                throw new common_1.NotFoundException('Agent not found');
            }
            appointment.agent = agent;
        }
        Object.assign(appointment, updateAppointmentDto);
        return this.appointmentsRepository.save(appointment);
    }
    async assignAgent(appointmentId, agentId) {
        const appointment = await this.findOne(appointmentId);
        const agent = await this.usersRepository.findOne({ where: { id: agentId } });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        appointment.agent = agent;
        await this.notificationsService.createNotification({
            userId: appointment.customer.id,
            type: global_entity_1.NotificationType.APPOINTMENT_REMINDER,
            title: 'Agent Assigned to Your Appointment',
            message: `Agent ${agent.fullName} has been assigned to your property viewing appointment.`,
            relatedId: appointment.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        await this.notificationsService.createNotification({
            userId: agent.id,
            type: global_entity_1.NotificationType.APPOINTMENT_REMINDER,
            title: 'You Have Been Assigned to a New Appointment',
            message: `You have been assigned to an appointment with the client ${appointment.customer.fullName}.`,
            relatedId: appointment.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        return this.appointmentsRepository.save(appointment);
    }
    async updateStatus(appointmentId, updateStatusDto) {
        const appointment = await this.findOne(appointmentId);
        const oldStatus = appointment.status;
        appointment.status = updateStatusDto.status;
        const statusHistory = this.statusHistoryRepository.create({
            appointment,
            oldStatus,
            newStatus: updateStatusDto.status,
            changedBy: { id: 1 },
            notes: updateStatusDto.notes,
        });
        await this.statusHistoryRepository.save(statusHistory);
        const statusMessages = {
            assigned: 'An agent has been assigned to your appointment.',
            confirmed: 'Your appointment has been confirmed.',
            in_progress: 'Your appointment is currently in progress.',
            completed: 'Your appointment has been completed.',
            cancelled: 'Your appointment has been cancelled.',
        };
        if (statusMessages[updateStatusDto.status]) {
            await this.notificationsService.createNotification({
                userId: appointment.customer.id,
                type: global_entity_1.NotificationType.APPOINTMENT_REMINDER,
                title: 'Appointment Status Updated',
                message: statusMessages[updateStatusDto.status],
                relatedId: appointment.id,
                channel: global_entity_1.NotificationChannel.IN_APP,
            });
            if (appointment.agent) {
                await this.notificationsService.createNotification({
                    userId: appointment.agent.id,
                    type: global_entity_1.NotificationType.APPOINTMENT_REMINDER,
                    title: 'Appointment Status Updated',
                    message: statusMessages[updateStatusDto.status],
                    relatedId: appointment.id,
                    channel: global_entity_1.NotificationChannel.IN_APP,
                });
            }
        }
        return this.appointmentsRepository.save(appointment);
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.Appointment)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.AppointmentStatusHistory)),
    __param(2, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(global_entity_1.Property)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map