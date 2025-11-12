import { Repository } from 'typeorm';
import { Notification, NotificationChannel, NotificationType, User } from 'src/entities/global.entity';
import { CreateNotificationDto, UpdateNotificationDto, NotificationQueryDto, SendNotificationDto } from '../dto/notifications.dto';
export declare class NotificationsService {
    readonly notificationsRepository: Repository<Notification>;
    private usersRepository;
    constructor(notificationsRepository: Repository<Notification>, usersRepository: Repository<User>);
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    findAll(query: NotificationQueryDto): Promise<{
        data: Notification[];
        total: number;
    }>;
    findByUser(userId: number, query: NotificationQueryDto): Promise<{
        data: Notification[];
        total: number;
    }>;
    findOne(id: number): Promise<Notification>;
    update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification>;
    remove(id: number): Promise<void>;
    sendImmediate(sendNotificationDto: SendNotificationDto): Promise<Notification>;
    markAsRead(id: number): Promise<Notification>;
    markAllAsRead(userId: number): Promise<{
        message: string;
    }>;
    private sendToExternalService;
    sendAppointmentReminder(appointmentId: number): Promise<void>;
    sendRatingRequest(appointmentId: number): Promise<void>;
    createNotification(data: {
        userId: number;
        type: NotificationType;
        title: string;
        message: string;
        relatedId?: number;
        channel?: NotificationChannel;
        scheduledFor?: Date;
    }): Promise<Notification>;
    createBulkNotifications(userIds: number[], data: {
        type: NotificationType;
        title: string;
        message: string;
        relatedId?: number;
        channel?: NotificationChannel;
    }): Promise<void>;
    notifyUserType(userType: any, data: {
        type: NotificationType;
        title: string;
        message: string;
        relatedId?: number;
        channel?: NotificationChannel;
    }): Promise<void>;
}
