import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto, AssignAgentDto, UpdateStatusDto } from '../dto/appointments.dto';
interface RequestWithUser extends Request {
    user: any;
}
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createAppointmentDto: CreateAppointmentDto, req: RequestWithUser): Promise<import("src/entities/global.entity").Appointment>;
    findAll(query: any): Promise<{
        total_records: number;
        current_page: number;
        per_page: number;
        records: import("src/entities/global.entity").Appointment[];
    }>;
    findOne(id: string): Promise<import("src/entities/global.entity").Appointment>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<import("src/entities/global.entity").Appointment>;
    assignAgent(id: string, assignAgentDto: AssignAgentDto): Promise<import("src/entities/global.entity").Appointment>;
    updateStatus(id: string, updateStatusDto: UpdateStatusDto): Promise<import("src/entities/global.entity").Appointment>;
    findByCustomer(customerId: string, query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").Appointment>>;
    findByAgent(agentId: string, query: any): Promise<{
        total_records: number;
        current_page: number;
        per_page: number;
        records: import("src/entities/global.entity").Appointment[];
    }>;
}
export {};
