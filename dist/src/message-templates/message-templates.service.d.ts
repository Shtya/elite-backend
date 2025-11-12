import { Repository } from 'typeorm';
import { MessageTemplate, NotificationChannel } from 'src/entities/global.entity';
import { CreateMessageTemplateDto, UpdateMessageTemplateDto } from '../dto/message-templates.dto';
export declare class MessageTemplatesService {
    readonly messageTemplatesRepository: Repository<MessageTemplate>;
    constructor(messageTemplatesRepository: Repository<MessageTemplate>);
    create(createMessageTemplateDto: CreateMessageTemplateDto): Promise<MessageTemplate>;
    findOne(id: number): Promise<MessageTemplate>;
    update(id: number, updateMessageTemplateDto: UpdateMessageTemplateDto): Promise<MessageTemplate>;
    remove(id: number): Promise<void>;
    approve(id: number): Promise<MessageTemplate>;
    disapprove(id: number): Promise<MessageTemplate>;
    findByChannel(channel: NotificationChannel, locale?: string): Promise<MessageTemplate[]>;
    previewTemplate(id: number, variables: Record<string, any>): Promise<{
        preview: string;
    }>;
    getTemplateByName(name: string, channel: NotificationChannel, locale?: string): Promise<MessageTemplate>;
    renderTemplate(name: string, channel: NotificationChannel, variables: Record<string, any>, locale?: string): Promise<string>;
}
