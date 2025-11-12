import { MasterDataService } from "./master-data.service";
import { CreateCityDto, UpdateCityDto, CreateAreaDto, UpdateAreaDto, CreatePropertyTypeDto, UpdatePropertyTypeDto } from "../dto/master-data.dto";
export declare class MasterDataController {
    private readonly masterDataService;
    constructor(masterDataService: MasterDataService);
    getCities(query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").City>>;
    getCity(id: string): Promise<import("src/entities/global.entity").City>;
    createCity(createCityDto: CreateCityDto): Promise<import("src/entities/global.entity").City>;
    updateCity(id: string, updateCityDto: UpdateCityDto): Promise<import("src/entities/global.entity").City>;
    getAreas(query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").Area>>;
    getAreasByCity(cityId: string, query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").Area>>;
    getArea(id: string): Promise<import("src/entities/global.entity").Area>;
    createArea(createAreaDto: CreateAreaDto): Promise<import("src/entities/global.entity").Area>;
    updateArea(id: string, updateAreaDto: UpdateAreaDto): Promise<import("src/entities/global.entity").Area>;
    getPropertyTypes(query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").PropertyType>>;
    getPropertyType(id: string): Promise<import("src/entities/global.entity").PropertyType>;
    createPropertyType(createPropertyTypeDto: CreatePropertyTypeDto): Promise<import("src/entities/global.entity").PropertyType>;
    updatePropertyType(id: string, updatePropertyTypeDto: UpdatePropertyTypeDto): Promise<import("src/entities/global.entity").PropertyType>;
    removeCity(id: string): Promise<void>;
    removeArea(id: string): Promise<void>;
    removePropertyType(id: string): Promise<void>;
}
