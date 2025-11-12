import { Repository } from 'typeorm';
import { ContactUs } from 'src/entities/global.entity';
import { CreateContactUsDto } from '../dto/users.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
export declare class ContactUsService {
    readonly contactUsRepository: Repository<ContactUs>;
    private readonly notificationsService;
    constructor(contactUsRepository: Repository<ContactUs>, notificationsService: NotificationsService);
    create(createContactUsDto: CreateContactUsDto): Promise<ContactUs>;
    findOne(id: number): Promise<ContactUs>;
    remove(id: number): Promise<ContactUs>;
}
