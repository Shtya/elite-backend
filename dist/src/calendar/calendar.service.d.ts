import { Repository } from 'typeorm';
import { CalendarAccount, AppointmentCalendarSync, User, Appointment } from 'src/entities/global.entity';
import { ConnectCalendarAccountDto, SyncAppointmentDto } from '../dto/calendar.dto';
export declare class CalendarService {
    readonly calendarAccountRepository: Repository<CalendarAccount>;
    readonly appointmentSyncRepository: Repository<AppointmentCalendarSync>;
    private usersRepository;
    private appointmentsRepository;
    constructor(calendarAccountRepository: Repository<CalendarAccount>, appointmentSyncRepository: Repository<AppointmentCalendarSync>, usersRepository: Repository<User>, appointmentsRepository: Repository<Appointment>);
    connectAccount(connectCalendarAccountDto: ConnectCalendarAccountDto): Promise<CalendarAccount>;
    getAccount(id: number): Promise<CalendarAccount>;
    disconnectAccount(id: number): Promise<void>;
    syncAppointment(syncAppointmentDto: SyncAppointmentDto): Promise<AppointmentCalendarSync>;
    getAppointmentSync(appointmentId: number): Promise<AppointmentCalendarSync[]>;
    refreshExpiredTokens(): Promise<{
        updated: number;
    }>;
    private createCalendarEvent;
    private refreshTokenForProvider;
}
