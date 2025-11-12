import { Repository } from 'typeorm';
import { Appointment, AppointmentStatusHistory, User, Property } from 'src/entities/global.entity';
import { CreateAppointmentDto, UpdateAppointmentDto, UpdateStatusDto } from '../dto/appointments.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
export declare class AppointmentsService {
    appointmentsRepository: Repository<Appointment>;
    statusHistoryRepository: Repository<AppointmentStatusHistory>;
    usersRepository: Repository<User>;
    propertiesRepository: Repository<Property>;
    private notificationsService;
    constructor(appointmentsRepository: Repository<Appointment>, statusHistoryRepository: Repository<AppointmentStatusHistory>, usersRepository: Repository<User>, propertiesRepository: Repository<Property>, notificationsService: NotificationsService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment>;
    findOne(id: number): Promise<Appointment>;
    update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment>;
    assignAgent(appointmentId: number, agentId: number): Promise<Appointment>;
    updateStatus(appointmentId: number, updateStatusDto: UpdateStatusDto): Promise<Appointment>;
}
