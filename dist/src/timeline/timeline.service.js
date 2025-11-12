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
exports.TimelineService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
let TimelineService = class TimelineService {
    constructor(timelineEventsRepository, usersRepository, appointmentsRepository) {
        this.timelineEventsRepository = timelineEventsRepository;
        this.usersRepository = usersRepository;
        this.appointmentsRepository = appointmentsRepository;
    }
    async create(createTimelineEventDto) {
        const customer = await this.usersRepository.findOne({
            where: { id: createTimelineEventDto.customerId },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        let actorUser = null;
        if (createTimelineEventDto.actorUserId) {
            actorUser = await this.usersRepository.findOne({
                where: { id: createTimelineEventDto.actorUserId },
            });
        }
        const timelineEvent = this.timelineEventsRepository.create({
            ...createTimelineEventDto,
            customer,
            actorUser,
        });
        return this.timelineEventsRepository.save(timelineEvent);
    }
    async logAppointmentStatusChange(appointmentId, oldStatus, newStatus, notes) {
        const appointment = await this.appointmentsRepository.findOne({
            where: { id: appointmentId },
            relations: ['customer'],
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        let eventType;
        switch (newStatus) {
            case 'assigned':
                eventType = global_entity_1.TimelineEventType.APPOINTMENT_ASSIGNED;
                break;
            case 'confirmed':
                eventType = global_entity_1.TimelineEventType.APPOINTMENT_CONFIRMED;
                break;
            case 'in_progress':
                eventType = global_entity_1.TimelineEventType.APPOINTMENT_IN_PROGRESS;
                break;
            case 'completed':
                eventType = global_entity_1.TimelineEventType.APPOINTMENT_COMPLETED;
                break;
            case 'cancelled':
                eventType = global_entity_1.TimelineEventType.APPOINTMENT_CANCELLED;
                break;
            default:
                eventType = global_entity_1.TimelineEventType.APPOINTMENT_CREATED;
        }
        const timelineEvent = this.timelineEventsRepository.create({
            customer: appointment.customer,
            eventType,
            relatedId: appointmentId,
            relatedTable: 'appointments',
            notes: notes || `Appointment status changed from ${oldStatus} to ${newStatus}`,
        });
        return this.timelineEventsRepository.save(timelineEvent);
    }
    async logCustomerRegistration(customerId) {
        const customer = await this.usersRepository.findOne({
            where: { id: customerId },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const timelineEvent = this.timelineEventsRepository.create({
            customer,
            eventType: global_entity_1.TimelineEventType.REGISTRATION,
            notes: 'Customer registered in the system',
        });
        return this.timelineEventsRepository.save(timelineEvent);
    }
    async logDocumentVerification(customerId, status, notes) {
        const customer = await this.usersRepository.findOne({
            where: { id: customerId },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const eventType = status === 'verified' ? global_entity_1.TimelineEventType.DOCUMENT_VERIFIED : global_entity_1.TimelineEventType.DOCUMENT_REJECTED;
        const timelineEvent = this.timelineEventsRepository.create({
            customer,
            eventType,
            notes: notes || `Document ${status}`,
        });
        return this.timelineEventsRepository.save(timelineEvent);
    }
};
exports.TimelineService = TimelineService;
exports.TimelineService = TimelineService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.CustomerTimelineEvent)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(global_entity_1.Appointment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TimelineService);
//# sourceMappingURL=timeline.service.js.map