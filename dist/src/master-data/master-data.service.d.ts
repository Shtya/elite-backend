import { Repository } from "typeorm";
import { City, Area, PropertyType } from "src/entities/global.entity";
import { CreateCityDto, UpdateCityDto, CreateAreaDto, UpdateAreaDto, CreatePropertyTypeDto, UpdatePropertyTypeDto } from "../dto/master-data.dto";
export declare class MasterDataService {
    readonly citiesRepository: Repository<City>;
    readonly areasRepository: Repository<Area>;
    readonly propertyTypesRepository: Repository<PropertyType>;
    constructor(citiesRepository: Repository<City>, areasRepository: Repository<Area>, propertyTypesRepository: Repository<PropertyType>);
    getCity(id: number): Promise<City>;
    createCity(createCityDto: CreateCityDto): Promise<City>;
    updateCity(id: number, updateCityDto: UpdateCityDto): Promise<City>;
    getArea(id: number): Promise<Area>;
    createArea(createAreaDto: CreateAreaDto): Promise<Area>;
    updateArea(id: number, updateAreaDto: UpdateAreaDto): Promise<Area>;
    getPropertyType(id: number): Promise<PropertyType>;
    createPropertyType(createPropertyTypeDto: CreatePropertyTypeDto): Promise<PropertyType>;
    updatePropertyType(id: number, updatePropertyTypeDto: UpdatePropertyTypeDto): Promise<PropertyType>;
    removeCity(id: number): Promise<void>;
    removeArea(id: number): Promise<void>;
    removePropertyType(id: number): Promise<void>;
}
