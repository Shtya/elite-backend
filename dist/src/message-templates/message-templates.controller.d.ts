import { MessageTemplatesService } from './message-templates.service';
import { CreateMessageTemplateDto, UpdateMessageTemplateDto } from '../dto/message-templates.dto';
export declare class MessageTemplatesController {
    private readonly messageTemplatesService;
    constructor(messageTemplatesService: MessageTemplatesService);
    create(createMessageTemplateDto: CreateMessageTemplateDto): Promise<import("src/entities/global.entity").MessageTemplate>;
    findAll(query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").MessageTemplate>>;
    findOne(id: string): Promise<import("src/entities/global.entity").MessageTemplate>;
    update(id: string, updateMessageTemplateDto: UpdateMessageTemplateDto): Promise<import("src/entities/global.entity").MessageTemplate>;
    remove(id: string): Promise<void>;
    approve(id: string): Promise<import("src/entities/global.entity").MessageTemplate>;
    disapprove(id: string): Promise<import("src/entities/global.entity").MessageTemplate>;
    findByChannel(channel: string, locale?: string): Promise<import("src/entities/global.entity").MessageTemplate[]>;
    previewTemplate(id: string, variables: Record<string, any>): Promise<{
        preview: string;
    }>;
}
