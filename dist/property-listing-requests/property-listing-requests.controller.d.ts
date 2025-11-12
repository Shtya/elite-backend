import { PropertyListingRequestsService } from './property-listing-requests.service';
import { AddAttachmentDto, CreatePropertyListingRequestDto, UpdatePropertyListingRequestDto } from '../dto/property-listing-requests.dto';
interface RequestWithUser extends Request {
    user: any;
}
export declare class PropertyListingRequestsController {
    private readonly propertyListingRequestsService;
    constructor(propertyListingRequestsService: PropertyListingRequestsService);
    create(files: {
        authorizationDoc?: Express.Multer.File[];
        ownershipDoc?: Express.Multer.File[];
        attachments?: Express.Multer.File[];
    }, createDto: CreatePropertyListingRequestDto, req: RequestWithUser): Promise<import("src/entities/global.entity").PropertyListingRequest>;
    findAll(query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").PropertyListingRequest>>;
    findOne(id: string): Promise<import("src/entities/global.entity").PropertyListingRequest>;
    update(id: string, files: {
        authorizationDoc?: Express.Multer.File[];
        ownershipDoc?: Express.Multer.File[];
        attachments?: Express.Multer.File[];
    }, updateDto: UpdatePropertyListingRequestDto): Promise<import("src/entities/global.entity").PropertyListingRequest>;
    remove(id: string): Promise<void>;
    addAttachment(id: string, addAttachmentDto: AddAttachmentDto): Promise<import("src/entities/global.entity").PropertyListingRequestAttachment>;
    approve(id: string): Promise<import("src/entities/global.entity").PropertyListingRequest>;
    reject(id: string, reason: string): Promise<import("src/entities/global.entity").PropertyListingRequest>;
    publish(id: string): Promise<import("src/entities/global.entity").PropertyListingRequest>;
    findByOwner(ownerId: string): Promise<import("src/entities/global.entity").PropertyListingRequest[]>;
}
export {};
