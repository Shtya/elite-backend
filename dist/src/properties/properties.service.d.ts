import { Repository } from 'typeorm';
import { Property, PropertyMedia, PropertyType, City, Area } from 'src/entities/global.entity';
import { CreatePropertyDto, UpdatePropertyDto, PropertyMediaDto } from '../dto/properties.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
export declare class PropertiesService {
    propertiesRepository: Repository<Property>;
    private propertyMediaRepository;
    private propertyTypeRepository;
    private cityRepository;
    private areaRepository;
    private notificationsService;
    constructor(propertiesRepository: Repository<Property>, propertyMediaRepository: Repository<PropertyMedia>, propertyTypeRepository: Repository<PropertyType>, cityRepository: Repository<City>, areaRepository: Repository<Area>, notificationsService: NotificationsService);
    create(createPropertyDto: CreatePropertyDto): Promise<Property>;
    findOne(id: number): Promise<Property>;
    update(id: number, updatePropertyDto: UpdatePropertyDto): Promise<Property>;
    remove(id: number): Promise<void>;
    private mustGetProperty;
    addManyMedia(propertyId: number, items: PropertyMediaDto[]): Promise<PropertyMedia[]>;
    removeMedia(propertyId: number, mediaId: number): Promise<void>;
}
