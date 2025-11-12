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
exports.PropertiesController = void 0;
const common_1 = require("@nestjs/common");
const properties_service_1 = require("./properties.service");
const properties_dto_1 = require("../dto/properties.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
const crud_service_1 = require("../../common/crud.service");
const platform_express_1 = require("@nestjs/platform-express");
const uplaod_config_1 = require("./uplaod.config");
function parseMedias(input) {
    if (!input)
        return [];
    if (Array.isArray(input))
        return input;
    if (typeof input === 'string') {
        try {
            const parsed = JSON.parse(input);
            return Array.isArray(parsed) ? parsed : [];
        }
        catch {
            return [];
        }
    }
    return [];
}
let PropertiesController = class PropertiesController {
    constructor(propertiesService) {
        this.propertiesService = propertiesService;
    }
    async create(createPropertyDto, files) {
        const property = await this.propertiesService.create(createPropertyDto);
        if (files && files.length > 0) {
            const uploadedMedias = files.map((file, i) => {
                const isImage = /^image\//.test(file.mimetype);
                const basePath = isImage ? '/uploads/images/' : '/uploads/videos/';
                return {
                    mediaUrl: `${basePath}${file.filename}`,
                    isPrimary: i === 0,
                    orderIndex: i,
                };
            });
            await this.propertiesService.addManyMedia(property.id, uploadedMedias);
        }
        return this.propertiesService.findOne(property.id);
    }
    findAll(query) {
        const filters = {};
        if (query.cityId)
            filters.city = { id: Number(query.cityId) };
        if (query.areaId)
            filters.area = { id: Number(query.areaId) };
        if (query.propertyTypeId)
            filters.propertyType = { id: Number(query.propertyTypeId) };
        if (typeof query.isActive !== 'undefined') {
            if (query.isActive === 'true')
                filters.isActive = true;
            else if (query.isActive === 'false')
                filters.isActive = false;
        }
        return crud_service_1.CRUD.findAll(this.propertiesService.propertiesRepository, 'property', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'DESC', ['propertyType', 'city', 'area', 'createdBy', 'medias'], ['title', 'description', 'price'], filters, {
            priceMin: query.priceMin ? Number(query.priceMin) : undefined,
            priceMax: query.priceMax ? Number(query.priceMax) : undefined,
            type: query.type || undefined,
        });
    }
    findOne(id) {
        return this.propertiesService.findOne(+id);
    }
    update(id, updatePropertyDto) {
        return this.propertiesService.update(+id, updatePropertyDto);
    }
    remove(id) {
        return this.propertiesService.remove(+id);
    }
    async addMedia(id, body, files) {
        const propertyId = +id;
        const metaFromBody = parseMedias(body?.medias);
        const uploadedAsItems = (files ?? []).map((f, i) => {
            const isImg = /^image\//.test(f.mimetype);
            const base = isImg ? '/uploads/images/' : '/uploads/videos/';
            return {
                mediaUrl: `${base}${f.filename}`,
                isPrimary: false,
                orderIndex: i,
            };
        });
        let finalItems = [];
        if (uploadedAsItems.length && metaFromBody.length && uploadedAsItems.length === metaFromBody.length) {
            finalItems = uploadedAsItems.map((fileItem, i) => ({
                mediaUrl: fileItem.mediaUrl,
                isPrimary: metaFromBody[i]?.isPrimary ?? fileItem.isPrimary ?? false,
                orderIndex: metaFromBody[i]?.orderIndex ?? fileItem.orderIndex ?? 0,
            }));
        }
        else {
            finalItems = [...uploadedAsItems, ...metaFromBody];
        }
        finalItems = finalItems.filter(x => !!x.mediaUrl);
        return this.propertiesService.addManyMedia(propertyId, finalItems);
    }
    removeMedia(id, mediaId) {
        return this.propertiesService.removeMedia(+id, +mediaId);
    }
};
exports.PropertiesController = PropertiesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('media', 50, uplaod_config_1.mixedUploadOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [properties_dto_1.CreatePropertyDto, Array]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, properties_dto_1.UpdatePropertyDto]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/media'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('media', 50, uplaod_config_1.mixedUploadOptions)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, properties_dto_1.CreateManyPropertyMediaDto, Array]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "addMedia", null);
__decorate([
    (0, common_1.Delete)(':id/media/:mediaId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('mediaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "removeMedia", null);
exports.PropertiesController = PropertiesController = __decorate([
    (0, common_1.Controller)('properties'),
    __metadata("design:paramtypes", [properties_service_1.PropertiesService])
], PropertiesController);
//# sourceMappingURL=properties.controller.js.map