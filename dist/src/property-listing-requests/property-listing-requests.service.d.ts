import { Repository } from 'typeorm';
import { PropertyListingRequest, PropertyListingRequestAttachment, User, PropertyType } from 'src/entities/global.entity';
import { CreatePropertyListingRequestDto, UpdatePropertyListingRequestDto, AddAttachmentDto } from '../dto/property-listing-requests.dto';
export declare class PropertyListingRequestsService {
    propertyListingRequestsRepository: Repository<PropertyListingRequest>;
    private attachmentsRepository;
    private usersRepository;
    private propertyTypesRepository;
    constructor(propertyListingRequestsRepository: Repository<PropertyListingRequest>, attachmentsRepository: Repository<PropertyListingRequestAttachment>, usersRepository: Repository<User>, propertyTypesRepository: Repository<PropertyType>);
    create(dto: CreatePropertyListingRequestDto, attachmentsFiles?: Express.Multer.File[]): Promise<PropertyListingRequest>;
    findOne(id: number): Promise<PropertyListingRequest>;
    update(id: number, updateDto: UpdatePropertyListingRequestDto): Promise<PropertyListingRequest>;
    remove(id: number): Promise<void>;
    addAttachment(requestId: number, addAttachmentDto: AddAttachmentDto): Promise<PropertyListingRequestAttachment>;
    approve(id: number): Promise<PropertyListingRequest>;
    reject(id: number, reason: string): Promise<PropertyListingRequest>;
    publish(id: number): Promise<PropertyListingRequest>;
    findByOwner(ownerId: number): Promise<PropertyListingRequest[]>;
    private createPropertyFromRequest;
}
