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
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let PropertiesService = class PropertiesService {
    constructor(propertiesRepository, propertyMediaRepository, propertyTypeRepository, cityRepository, areaRepository, notificationsService) {
        this.propertiesRepository = propertiesRepository;
        this.propertyMediaRepository = propertyMediaRepository;
        this.propertyTypeRepository = propertyTypeRepository;
        this.cityRepository = cityRepository;
        this.areaRepository = areaRepository;
        this.notificationsService = notificationsService;
    }
    async create(createPropertyDto) {
        const propertyType = await this.propertyTypeRepository.findOne({
            where: { id: createPropertyDto.propertyTypeId },
        });
        if (!propertyType) {
            throw new common_1.NotFoundException('Property type not found');
        }
        const city = await this.cityRepository.findOne({
            where: { id: createPropertyDto.cityId },
        });
        if (!city) {
            throw new common_1.NotFoundException('City not found');
        }
        const area = await this.areaRepository.findOne({
            where: { id: createPropertyDto.areaId },
        });
        if (!area) {
            throw new common_1.NotFoundException('Area not found');
        }
        const property = await this.propertiesRepository.create({
            ...createPropertyDto,
            propertyType,
            city,
            area,
            createdBy: { id: 1 },
        });
        await this.notificationsService.notifyUserType(global_entity_1.UserType.ADMIN, {
            type: global_entity_1.NotificationType.SYSTEM,
            title: 'New Property Added',
            message: `A new property has been added: ${property.title}`,
            relatedId: property.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        await this.notificationsService.notifyUserType(global_entity_1.UserType.QUALITY, {
            type: global_entity_1.NotificationType.SYSTEM,
            title: 'New Property Pending Review',
            message: `The property "${property.title}" has been added and requires a quality review.`,
            relatedId: property.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        return this.propertiesRepository.save(property);
    }
    async findOne(id) {
        const property = await this.propertiesRepository.findOne({
            where: { id },
            relations: ['propertyType', 'city', 'area', 'createdBy', 'medias'],
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        return property;
    }
    async update(id, updatePropertyDto) {
        const property = await this.findOne(id);
        if (updatePropertyDto.propertyTypeId) {
            property.propertyType = await this.propertyTypeRepository.findOne({
                where: { id: updatePropertyDto.propertyTypeId },
            });
        }
        if (updatePropertyDto.cityId) {
            property.city = await this.cityRepository.findOne({
                where: { id: updatePropertyDto.cityId },
            });
        }
        if (updatePropertyDto.areaId) {
            property.area = await this.areaRepository.findOne({
                where: { id: updatePropertyDto.areaId },
            });
        }
        Object.assign(property, updatePropertyDto);
        await this.notificationsService.createNotification({
            userId: property.createdBy.id,
            type: global_entity_1.NotificationType.SYSTEM,
            title: 'Property Updated',
            message: `The property information has been updated: ${property.title}`,
            relatedId: property.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        return this.propertiesRepository.save(property);
    }
    async remove(id) {
        const property = await this.findOne(id);
        await this.propertiesRepository.softDelete(id);
    }
    async mustGetProperty(id) {
        const p = await this.propertiesRepository.findOne({ where: { id } });
        if (!p)
            throw new common_1.NotFoundException('Property not found');
        return p;
    }
    async addManyMedia(propertyId, items) {
        const property = await this.mustGetProperty(propertyId);
        const rows = items.map(m => this.propertyMediaRepository.create({
            property,
            mediaUrl: m.mediaUrl,
            isPrimary: m.isPrimary ?? false,
            orderIndex: m.orderIndex ?? 0,
        }));
        return this.propertyMediaRepository.save(rows);
    }
    async removeMedia(propertyId, mediaId) {
        const media = await this.propertyMediaRepository.findOne({
            where: { id: mediaId, property: { id: propertyId } },
        });
        if (!media) {
            throw new common_1.NotFoundException('Media not found');
        }
        await this.propertyMediaRepository.remove(media);
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.Property)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.PropertyMedia)),
    __param(2, (0, typeorm_1.InjectRepository)(global_entity_1.PropertyType)),
    __param(3, (0, typeorm_1.InjectRepository)(global_entity_1.City)),
    __param(4, (0, typeorm_1.InjectRepository)(global_entity_1.Area)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map