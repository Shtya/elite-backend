"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
let MasterDataService = class MasterDataService {
    constructor(citiesRepository, areasRepository, propertyTypesRepository) {
        this.citiesRepository = citiesRepository;
        this.areasRepository = areasRepository;
        this.propertyTypesRepository = propertyTypesRepository;
    }
    async getCity(id) {
        const city = await this.citiesRepository.findOne({ where: { id } });
        if (!city) {
            throw new common_1.NotFoundException("City not found");
        }
        return city;
    }
    async createCity(createCityDto) {
        const existingCity = await this.citiesRepository.findOne({
            where: { name: createCityDto.name },
        });
        if (existingCity) {
            throw new common_1.ConflictException("City with this name already exists");
        }
        const city = this.citiesRepository.create(createCityDto);
        return this.citiesRepository.save(city);
    }
    async updateCity(id, updateCityDto) {
        const city = await this.getCity(id);
        if (updateCityDto.name && updateCityDto.name !== city.name) {
            const existingCity = await this.citiesRepository.findOne({
                where: { name: updateCityDto.name },
            });
            if (existingCity) {
                throw new common_1.ConflictException("City with this name already exists");
            }
        }
        Object.assign(city, updateCityDto);
        return this.citiesRepository.save(city);
    }
    async getArea(id) {
        const area = await this.areasRepository.findOne({
            where: { id },
            relations: ["city"],
        });
        if (!area) {
            throw new common_1.NotFoundException("Area not found");
        }
        return area;
    }
    async createArea(createAreaDto) {
        const city = await this.citiesRepository.findOne({
            where: { id: createAreaDto.cityId },
        });
        if (!city) {
            throw new common_1.NotFoundException("City not found");
        }
        const existingArea = await this.areasRepository.findOne({
            where: {
                name: createAreaDto.name,
                city: { id: createAreaDto.cityId },
            },
        });
        if (existingArea) {
            throw new common_1.ConflictException("Area with this name already exists in this city");
        }
        const area = this.areasRepository.create({
            ...createAreaDto,
            city,
        });
        return this.areasRepository.save(area);
    }
    async updateArea(id, updateAreaDto) {
        const area = await this.getArea(id);
        if (updateAreaDto.name && updateAreaDto.name !== area.name) {
            const existingArea = await this.areasRepository.findOne({
                where: {
                    name: updateAreaDto.name,
                    city: { id: area.city.id },
                },
            });
            if (existingArea) {
                throw new common_1.ConflictException("Area with this name already exists in this city");
            }
        }
        Object.assign(area, updateAreaDto);
        return this.areasRepository.save(area);
    }
    async getPropertyType(id) {
        const propertyType = await this.propertyTypesRepository.findOne({
            where: { id },
        });
        if (!propertyType) {
            throw new common_1.NotFoundException("Property type not found");
        }
        return propertyType;
    }
    async createPropertyType(createPropertyTypeDto) {
        const existingPropertyType = await this.propertyTypesRepository.findOne({
            where: { name: createPropertyTypeDto.name },
        });
        if (existingPropertyType) {
            throw new common_1.ConflictException("Property type with this name already exists");
        }
        const propertyType = this.propertyTypesRepository.create(createPropertyTypeDto);
        return this.propertyTypesRepository.save(propertyType);
    }
    async updatePropertyType(id, updatePropertyTypeDto) {
        const propertyType = await this.getPropertyType(id);
        if (updatePropertyTypeDto.name &&
            updatePropertyTypeDto.name !== propertyType.name) {
            const existingPropertyType = await this.propertyTypesRepository.findOne({
                where: { name: updatePropertyTypeDto.name },
            });
            if (existingPropertyType) {
                throw new common_1.ConflictException("Property type with this name already exists");
            }
        }
        Object.assign(propertyType, updatePropertyTypeDto);
        return this.propertyTypesRepository.save(propertyType);
    }
    async removeCity(id) {
        const city = await this.getCity(id);
        await this.citiesRepository.remove(city);
    }
    async removeArea(id) {
        const area = await this.getArea(id);
        await this.areasRepository.remove(area);
    }
    async removePropertyType(id) {
        const propertyType = await this.getPropertyType(id);
        await this.propertyTypesRepository.remove(propertyType);
    }
};
exports.MasterDataService = MasterDataService;
exports.MasterDataService = MasterDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.City)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.Area)),
    __param(2, (0, typeorm_1.InjectRepository)(global_entity_1.PropertyType)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MasterDataService);
//# sourceMappingURL=master-data.service.js.map