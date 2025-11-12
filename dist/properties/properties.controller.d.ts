import { PropertiesService } from './properties.service';
import { CreatePropertyDto, UpdatePropertyDto, CreateManyPropertyMediaDto } from '../dto/properties.dto';
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    create(createPropertyDto: CreatePropertyDto, files: Express.Multer.File[]): Promise<import("src/entities/global.entity").Property>;
    findAll(query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").Property>>;
    findOne(id: string): Promise<import("src/entities/global.entity").Property>;
    update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<import("src/entities/global.entity").Property>;
    remove(id: string): Promise<void>;
    addMedia(id: string, body: CreateManyPropertyMediaDto, files: Express.Multer.File[]): Promise<import("src/entities/global.entity").PropertyMedia[]>;
    removeMedia(id: string, mediaId: string): Promise<void>;
}
