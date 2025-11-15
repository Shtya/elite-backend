import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Appointment, AppointmentStatusHistory, AppointmentStatus, User, Property, NotificationType, NotificationChannel, UserType, AgentAppointmentRequest, Agent, AgentAppointmentRequestStatus } from 'entities/global.entity';
import { CreateAppointmentDto, UpdateAppointmentDto, UpdateStatusDto, AppointmentQueryDto } from '../../dto/appointments.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    public appointmentsRepository: Repository<Appointment>,
    @InjectRepository(AppointmentStatusHistory)
    public statusHistoryRepository: Repository<AppointmentStatusHistory>,
    @InjectRepository(User)
    public usersRepository: Repository<User>,
    @InjectRepository(Property)
    public propertiesRepository: Repository<Property>,
    @InjectRepository(AgentAppointmentRequest)
    public agentAppointmentRequestRepository: Repository<AgentAppointmentRequest>,
    @InjectRepository(Agent)
    public agentRepository: Repository<Agent>,
    private notificationsService: NotificationsService,


  ) {}
  private combineDateTime(date: string, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const d = new Date(date);
    d.setUTCHours(hours, minutes, 0, 0);
    return d;
  }
  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // 1. Property
    const startDateTime = this.combineDateTime(createAppointmentDto.appointmentDate, createAppointmentDto.startTime);
    const endDateTime = this.combineDateTime(createAppointmentDto.appointmentDate, createAppointmentDto.endTime);
  
    if (endDateTime <= startDateTime) {
      throw new BadRequestException("End time must be after start time.");
    }
  
    const property = await this.propertiesRepository.findOne({
      where: { id: createAppointmentDto.propertyId },
      relations: ["area"],
    });
    if (!property) throw new NotFoundException("Property not found");
  
    // 2. Customer
    const customer = await this.usersRepository.findOne({
      where: { id: createAppointmentDto.customerId },
    });
    if (!customer) throw new NotFoundException("Customer not found");
  
    // 3. Check for overlapping ACCEPTED or PENDING appointments
    const overlapping = await this.appointmentsRepository
      .createQueryBuilder("appointment")
      .where("appointment.customer_id = :customerId", { customerId: createAppointmentDto.customerId })
      .andWhere("appointment.property_id = :propertyId", { propertyId: createAppointmentDto.propertyId })
      .andWhere("appointment.status IN (:...statuses)", { statuses: [AppointmentStatus.PENDING, AppointmentStatus.ACCEPTED] })
      .andWhere(
        "(:startTime < appointment.endTime AND :endTime > appointment.startTime)",
        {
          startTime: createAppointmentDto.startTime,
          endTime: createAppointmentDto.endTime,
        }
      )
      .getOne();
  
    if (overlapping) {
      throw new ConflictException(
        "You already have an appointment (pending or accepted) at this time for this property."
      );
    }
  
    // 4. Get all agents in the same area
    const areaAgents = await this.agentRepository.find({
      where: { area: { id: property.area.id } },
    });
    if (areaAgents.length === 0) {
      throw new NotFoundException("No agents available in this area");
    }
  
    // 5. Create the appointment (status: PENDING)
    const appointment = this.appointmentsRepository.create({
      ...createAppointmentDto,
      property,
      customer,
      agent: null,
      status: AppointmentStatus.PENDING,
    });
  
    const savedAppointment = await this.appointmentsRepository.save(appointment);
  
    // 6. Create agent requests & send notifications
    for (const agent of areaAgents) {
      const request = this.agentAppointmentRequestRepository.create({
        appointment: savedAppointment,
        agent: agent.user.id ? agent : await this.usersRepository.findOne({ where: { id: agent.user.id } }),
        status: AgentAppointmentRequestStatus.PENDING,
      });
  
      await this.agentAppointmentRequestRepository.save(request);
  
      await this.notificationsService.createNotification({
        userId: agent.id,
        type: NotificationType.SYSTEM,
        title: "New Appointment Request",
        message: "A customer wants to visit a property in your area. Please accept or reject the request.",
        relatedId: savedAppointment.id,
        channel: NotificationChannel.IN_APP,
      });
    }
  
    // 7. Notify customer
    await this.notificationsService.createNotification({
      userId: customer.id,
      type: NotificationType.APPOINTMENT_REMINDER,
      title: "Appointment Created",
      message: "Your appointment request was sent to agents in the area.",
      relatedId: savedAppointment.id,
      channel: NotificationChannel.IN_APP,
    });
  
    // 8. Notify admin
    await this.notificationsService.notifyUserType(UserType.ADMIN, {
      type: NotificationType.SYSTEM,
      title: "New Appointment Created",
      message: `A customer created an appointment for property: ${property.title}`,
      relatedId: savedAppointment.id,
      channel: NotificationChannel.IN_APP,
    });
  
    return savedAppointment;
  }
  
  
  
  
  async respondToAppointmentRequest(
    requestId: number,
    agentId: number,
    status: AgentAppointmentRequestStatus
  ) {
    const request = await this.agentAppointmentRequestRepository.findOne({
      where: { id: requestId },
      relations: ["appointment", "agent"],
    });
    const agents = await this.agentRepository.findOne({ where: { user: { id: agentId } } });
  
    if (!request) throw new NotFoundException("Request not found");
  
    if (request.agent.id !== agents.id) {
      throw new ForbiddenException("You don't have access to this request");
    }
  
    if (request.status !== AgentAppointmentRequestStatus.PENDING) {
      throw new BadRequestException("Request has already been processed");
    }
  
    const appointment = request.appointment;
  
    // Helper to combine date and time

  
    const startDateTime = this.combineDateTime(appointment.appointmentDate, appointment.startTime);
    const endDateTime = this.combineDateTime(appointment.appointmentDate, appointment.endTime);
  
    // ✔ Check for overlapping appointments if agent ACCEPTS
    if (status === AgentAppointmentRequestStatus.ACCEPTED) {
      const agentAppointments = await this.appointmentsRepository.find({
        where: {
          agent: { id: agentId },
          status: In([AppointmentStatus.CONFIRMED, AppointmentStatus.ACCEPTED]),
        },
      });
  
      for (const appt of agentAppointments) {
        const existingStart = this.combineDateTime(appt.appointmentDate, appt.startTime);
        const existingEnd = this.combineDateTime(appt.appointmentDate, appt.endTime);
  
        if (startDateTime < existingEnd && endDateTime > existingStart) {
          throw new ConflictException(
            `You already have another appointment at this time: ${appt.appointmentDate} ${appt.startTime}-${appt.endTime}`
          );
        }
      }
  
      // Assign agent and update appointment
      appointment.agent = request.agent;
      appointment.status = AppointmentStatus.CONFIRMED;
      await this.appointmentsRepository.save(appointment);
  
      // Reject all other pending requests for this appointment
      await this.agentAppointmentRequestRepository.update(
        {
          appointment: { id: appointment.id },
          status: AgentAppointmentRequestStatus.PENDING,
        },
        {
          status: AgentAppointmentRequestStatus.REJECTED,
          respondedAt: new Date(),
        }
      );
  
      // Notify customer
      await this.notificationsService.createNotification({
        userId: appointment.customer.id,
        type: NotificationType.APPOINTMENT_REMINDER,
        title: "Agent Accepted Appointment",
        message: `Agent ${request.agent.fullName} accepted your appointment request.`,
        relatedId: appointment.id,
        channel: NotificationChannel.IN_APP,
      });
  
      // Notify admin
      await this.notificationsService.notifyUserType(UserType.ADMIN, {
        type: NotificationType.SYSTEM,
        title: "Appointment Assigned",
        message: `Appointment has been assigned to agent ${request.agent.fullName}.`,
        relatedId: appointment.id,
        channel: NotificationChannel.IN_APP,
      });
    }
  
    // Update request status and respondedAt
    request.status = status;
    request.respondedAt = new Date();
    await this.agentAppointmentRequestRepository.save(request);
  
    return request;
  }
  async getAgentAppointments(
    agentId: number,
    page: number = 1,
    limit: number = 10,
    pendingPage: number = 1,
    pendingLimit: number = 10
  ) {
    const agent = await this.agentRepository.findOne({
      where: { user: { id: agentId } },
    });
  
    if (!agent) {
      throw new NotFoundException("Agent not found");
    }
  
    const skip = (page - 1) * limit;
    const pendingSkip = (pendingPage - 1) * pendingLimit;
  
    // ---- Confirmed Appointments (Paginated) ----
    const [appointments, totalAppointments] =
      await this.appointmentsRepository.findAndCount({
        where: [
          { agent: { id: agent.id } },
        ],
        relations: ["property", "customer"],
        order: { appointmentDate: "ASC", startTime: "ASC" },
        skip,
        take: limit,
      });
  
    // ---- Pending Requests (Paginated) ----
    const [pendingRequests, totalPending] =
      await this.agentAppointmentRequestRepository.findAndCount({
        where: {
          agent: { id: agent.id },
          status: AgentAppointmentRequestStatus.PENDING,
        },
        relations: [
          "appointment",
          "appointment.property",
          "appointment.customer",
        ],
        skip: pendingSkip,
        take: pendingLimit,
      });
  
    return {
      confirmed: {
        data: appointments,
        page,
        limit,
        total: totalAppointments,
        totalPages: Math.ceil(totalAppointments / limit),
      },
      pending: {
        data: pendingRequests,
        page: pendingPage,
        limit: pendingLimit,
        total: totalPending,
        totalPages: Math.ceil(totalPending / pendingLimit),
      },
    };
  }
  
  
  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['property', 'customer', 'agent', 'property.city', 'property.area'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);

    if (updateAppointmentDto.agentId) {
      const agent = await this.usersRepository.findOne({
        where: { id: updateAppointmentDto.agentId },
      });
      if (!agent) {
        throw new NotFoundException('Agent not found');
      }
      appointment.agent = agent;
    }

    Object.assign(appointment, updateAppointmentDto);
    return this.appointmentsRepository.save(appointment);
  }

  async assignAgent(appointmentId: number, agentId: number): Promise<Appointment> {
    const appointment = await this.findOne(appointmentId);
    const agent = await this.usersRepository.findOne({ where: { id: agentId } });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    appointment.agent = agent;

    // Notify the customer about the assigned agent
    await this.notificationsService.createNotification({
      userId: appointment.customer.id,
      type: NotificationType.APPOINTMENT_REMINDER,
      title: 'Agent Assigned to Your Appointment',
      message: `Agent ${agent.fullName} has been assigned to your property viewing appointment.`,
      relatedId: appointment.id,
      channel: NotificationChannel.IN_APP,
    });

    // Notify the agent about the new assignment
    await this.notificationsService.createNotification({
      userId: agent.id,
      type: NotificationType.APPOINTMENT_REMINDER,
      title: 'You Have Been Assigned to a New Appointment',
      message: `You have been assigned to an appointment with the client ${appointment.customer.fullName}.`,
      relatedId: appointment.id,
      channel: NotificationChannel.IN_APP,
    });

    return this.appointmentsRepository.save(appointment);
  }

  async updateStatus(appointmentId: number, updateStatusDto: UpdateStatusDto): Promise<Appointment> {
    const appointment = await this.findOne(appointmentId);

    const oldStatus = appointment.status;
    appointment.status = updateStatusDto.status;

    // Save status history
    const statusHistory = this.statusHistoryRepository.create({
      appointment,
      oldStatus,
      newStatus: updateStatusDto.status,
      changedBy: { id: 1 } as User, // This should come from authenticated user
      notes: updateStatusDto.notes,
    });
    await this.statusHistoryRepository.save(statusHistory);

    // Notification for appointment status change
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
        type: NotificationType.APPOINTMENT_REMINDER,
        title: 'Appointment Status Updated',
        message: statusMessages[updateStatusDto.status],
        relatedId: appointment.id,
        channel: NotificationChannel.IN_APP,
      });

      if (appointment.agent) {
        await this.notificationsService.createNotification({
          userId: appointment.agent.id,
          type: NotificationType.APPOINTMENT_REMINDER,
          title: 'Appointment Status Updated',
          message: statusMessages[updateStatusDto.status],
          relatedId: appointment.id,
          channel: NotificationChannel.IN_APP,
        });
      }
    }

    return this.appointmentsRepository.save(appointment);
  }
}
