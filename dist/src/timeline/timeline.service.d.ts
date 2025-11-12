import { Repository } from 'typeorm';
import { CustomerTimelineEvent, User, Appointment } from 'src/entities/global.entity';
import { CreateTimelineEventDto } from '../dto/timeline.dto';
export declare class TimelineService {
    readonly timelineEventsRepository: Repository<CustomerTimelineEvent>;
    private usersRepository;
    private appointmentsRepository;
    constructor(timelineEventsRepository: Repository<CustomerTimelineEvent>, usersRepository: Repository<User>, appointmentsRepository: Repository<Appointment>);
    create(createTimelineEventDto: CreateTimelineEventDto): Promise<CustomerTimelineEvent>;
    logAppointmentStatusChange(appointmentId: number, oldStatus: string, newStatus: string, notes?: string): Promise<CustomerTimelineEvent>;
    logCustomerRegistration(customerId: number): Promise<CustomerTimelineEvent>;
    logDocumentVerification(customerId: number, status: 'verified' | 'rejected', notes?: string): Promise<CustomerTimelineEvent>;
}
