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
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
let CalendarService = class CalendarService {
    constructor(calendarAccountRepository, appointmentSyncRepository, usersRepository, appointmentsRepository) {
        this.calendarAccountRepository = calendarAccountRepository;
        this.appointmentSyncRepository = appointmentSyncRepository;
        this.usersRepository = usersRepository;
        this.appointmentsRepository = appointmentsRepository;
    }
    async connectAccount(connectCalendarAccountDto) {
        const user = await this.usersRepository.findOne({
            where: { id: 1 }
        });
        const existingAccount = await this.calendarAccountRepository.findOne({
            where: {
                user: { id: user.id },
                provider: connectCalendarAccountDto.provider,
            }
        });
        if (existingAccount) {
            Object.assign(existingAccount, connectCalendarAccountDto);
            return this.calendarAccountRepository.save(existingAccount);
        }
        const calendarAccount = this.calendarAccountRepository.create({
            ...connectCalendarAccountDto,
            user,
            tokenExpiresAt: new Date(connectCalendarAccountDto.tokenExpiresAt),
        });
        return this.calendarAccountRepository.save(calendarAccount);
    }
    async getAccount(id) {
        const account = await this.calendarAccountRepository.findOne({
            where: { id },
            relations: ['user']
        });
        if (!account) {
            throw new common_1.NotFoundException('Calendar account not found');
        }
        return account;
    }
    async disconnectAccount(id) {
        const account = await this.getAccount(id);
        await this.calendarAccountRepository.remove(account);
    }
    async syncAppointment(syncAppointmentDto) {
        const appointment = await this.appointmentsRepository.findOne({
            where: { id: syncAppointmentDto.appointmentId },
            relations: ['customer', 'agent', 'property']
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        const provider = syncAppointmentDto.provider || global_entity_1.CalendarProvider.GOOGLE;
        const existingSync = await this.appointmentSyncRepository.findOne({
            where: {
                appointment: { id: syncAppointmentDto.appointmentId },
                provider,
            }
        });
        if (existingSync) {
            return existingSync;
        }
        const providerEventId = await this.createCalendarEvent(appointment, provider);
        const appointmentSync = this.appointmentSyncRepository.create({
            appointment,
            provider,
            providerEventId,
            syncedAt: new Date(),
        });
        return this.appointmentSyncRepository.save(appointmentSync);
    }
    async getAppointmentSync(appointmentId) {
        return this.appointmentSyncRepository.find({
            where: { appointment: { id: appointmentId } },
            relations: ['appointment'],
        });
    }
    async refreshExpiredTokens() {
        const expiredAccounts = await this.calendarAccountRepository.find({
            where: {
                tokenExpiresAt: new Date(),
            }
        });
        let updatedCount = 0;
        for (const account of expiredAccounts) {
            try {
                const newTokens = await this.refreshTokenForProvider(account);
                if (newTokens) {
                    account.accessToken = newTokens.accessToken;
                    account.refreshToken = newTokens.refreshToken;
                    account.tokenExpiresAt = newTokens.expiresAt;
                    await this.calendarAccountRepository.save(account);
                    updatedCount++;
                }
            }
            catch (error) {
                console.error(`Failed to refresh token for account ${account.id}:`, error);
            }
        }
        return { updated: updatedCount };
    }
    async createCalendarEvent(appointment, provider) {
        const eventData = {
            summary: `Property Viewing - ${appointment.property.title}`,
            description: `Property viewing appointment with ${appointment.customer.fullName}`,
            start: {
                dateTime: `${appointment.appointmentDate}T${appointment.startTime}:00`,
                timeZone: 'Asia/Riyadh',
            },
            end: {
                dateTime: `${appointment.appointmentDate}T${appointment.endTime}:00`,
                timeZone: 'Asia/Riyadh',
            },
            attendees: [
                { email: appointment.customer.email, displayName: appointment.customer.fullName },
                { email: appointment.agent?.email, displayName: appointment.agent?.fullName },
            ],
        };
        return `cal_event_${appointment.id}_${Date.now()}`;
    }
    async refreshTokenForProvider(account) {
        try {
            return {
                accessToken: 'new_access_token_' + Date.now(),
                refreshToken: account.refreshToken,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            };
        }
        catch (error) {
            return null;
        }
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.CalendarAccount)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.AppointmentCalendarSync)),
    __param(2, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(global_entity_1.Appointment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map