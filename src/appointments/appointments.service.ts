import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatusHistory, AppointmentStatus, User, Property, NotificationType, NotificationChannel, UserType } from 'src/entities/global.entity';
import { CreateAppointmentDto, UpdateAppointmentDto, UpdateStatusDto, AppointmentQueryDto } from '../dto/appointments.dto';
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
    private notificationsService: NotificationsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const property = await this.propertiesRepository.findOne({
      where: { id: createAppointmentDto.propertyId },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const customer = await this.usersRepository.findOne({
      where: { id: createAppointmentDto.customerId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    let agent = null;
    
      agent = await this.usersRepository.findOne({
        where: { id: property.createdBy.id },
      });
      if (!agent) {
        throw new NotFoundException('Agent not found');
      }

    const appointment = this.appointmentsRepository.create({
      ...createAppointmentDto,
      property,
      customer,
      agent,
    });

    await this.notificationsService.createNotification({
      userId: appointment.customer.id,
      type: NotificationType.APPOINTMENT_REMINDER,
      title: 'Appointment Booked',
      message: `Your appointment to view the property has been booked for ${appointment.appointmentDate} at ${appointment.startTime}.`,
      relatedId: appointment.id,
      channel: NotificationChannel.IN_APP,
    });

    // Notify the assigned agent (if any)
    if (appointment.agent) {
      await this.notificationsService.createNotification({
        userId: appointment.agent.id,
        type: NotificationType.APPOINTMENT_REMINDER,
        title: 'New Appointment Assigned to You',
        message: `A new appointment has been assigned to you with the client ${appointment.customer.fullName}.`,
        relatedId: appointment.id,
        channel: NotificationChannel.IN_APP,
      });
    }

    // Notify the admin about the new appointment
    await this.notificationsService.notifyUserType(UserType.ADMIN, {
      type: NotificationType.SYSTEM,
      title: 'New Appointment Booked',
      message: `A new appointment has been booked for the property: ${appointment.property.title}.`,
      relatedId: appointment.id,
      channel: NotificationChannel.IN_APP,
    });

    return this.appointmentsRepository.save(appointment);
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
