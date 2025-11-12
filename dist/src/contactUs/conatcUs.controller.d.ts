import { ContactUsService } from './contactUs.service';
import { CreateContactUsDto } from 'src/dto/users.dto';
export declare class ContactUsController {
    private readonly contactUsService;
    constructor(contactUsService: ContactUsService);
    create(createContactUsDto: CreateContactUsDto): Promise<import("src/entities/global.entity").ContactUs>;
    findAll(query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").ContactUs>>;
    findOne(id: string): Promise<import("src/entities/global.entity").ContactUs>;
    remove(id: string): Promise<import("src/entities/global.entity").ContactUs>;
}
