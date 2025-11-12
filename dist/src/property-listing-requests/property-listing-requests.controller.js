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
exports.PropertyListingRequestsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const property_listing_requests_service_1 = require("./property-listing-requests.service");
const property_listing_requests_dto_1 = require("../dto/property-listing-requests.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
const crud_service_1 = require("../../common/crud.service");
const upload_config_1 = require("../../common/upload.config");
let PropertyListingRequestsController = class PropertyListingRequestsController {
    constructor(propertyListingRequestsService) {
        this.propertyListingRequestsService = propertyListingRequestsService;
    }
    async create(files, createDto, req) {
        if (!req.user || !req.user.id) {
            throw new common_1.BadRequestException('Owner ID is required from JWT');
        }
        createDto.ownerId = Number(req.user.id);
        if (files.authorizationDoc?.[0]) {
            createDto.authorizationDocUrl = (0, upload_config_1.toWebPathFiles)(files.authorizationDoc[0].filename);
        }
        if (files.ownershipDoc?.[0]) {
            createDto.ownershipDocUrl = (0, upload_config_1.toWebPathFiles)(files.ownershipDoc[0].filename);
        }
        if (files.attachments?.length) {
            createDto.attachments = files.attachments.map(f => (0, upload_config_1.toWebPathFiles)(f.filename));
        }
        const attachmentsFiles = files.attachments ?? [];
        if (!createDto.relationshipType)
            throw new common_1.BadRequestException('relationshipType is required');
        if (!createDto.propertyTypeId)
            throw new common_1.BadRequestException('propertyTypeId is required');
        if (!createDto.location)
            throw new common_1.BadRequestException('location is required');
        if (!createDto.specifications)
            throw new common_1.BadRequestException('specifications are required');
        return this.propertyListingRequestsService.create(createDto, attachmentsFiles);
    }
    findAll(query) {
        const filters = {};
        if (query.ownerId)
            filters.owner = { id: Number(query.ownerId) };
        if (query.status)
            filters.status = query.status;
        if (query.relationshipType)
            filters.relationshipType = query.relationshipType;
        return crud_service_1.CRUD.findAll(this.propertyListingRequestsService.propertyListingRequestsRepository, 'property_listing_request', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'DESC', ['owner', 'propertyType', 'attachments', 'updatedBy'], [], filters);
    }
    findOne(id) {
        return this.propertyListingRequestsService.findOne(+id);
    }
    async update(id, files, updateDto) {
        if (files.authorizationDoc?.[0]) {
            updateDto.authorizationDocUrl = (0, upload_config_1.toWebPathFiles)(files.authorizationDoc[0].filename);
        }
        if (files.ownershipDoc?.[0]) {
            updateDto.ownershipDocUrl = (0, upload_config_1.toWebPathFiles)(files.ownershipDoc[0].filename);
        }
        if (files.attachments?.length) {
            updateDto.attachments = files.attachments.map(f => (0, upload_config_1.toWebPathFiles)(f.filename));
        }
        return this.propertyListingRequestsService.update(+id, updateDto);
    }
    remove(id) {
        return this.propertyListingRequestsService.remove(+id);
    }
    addAttachment(id, addAttachmentDto) {
        return this.propertyListingRequestsService.addAttachment(+id, addAttachmentDto);
    }
    approve(id) {
        return this.propertyListingRequestsService.approve(+id);
    }
    reject(id, reason) {
        return this.propertyListingRequestsService.reject(+id, reason);
    }
    publish(id) {
        return this.propertyListingRequestsService.publish(+id);
    }
    findByOwner(ownerId) {
        return this.propertyListingRequestsService.findByOwner(+ownerId);
    }
};
exports.PropertyListingRequestsController = PropertyListingRequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'authorizationDoc', maxCount: 1 },
        { name: 'ownershipDoc', maxCount: 1 },
        { name: 'attachments', maxCount: 10 },
    ], upload_config_1.genericUploadOptions)),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, property_listing_requests_dto_1.CreatePropertyListingRequestDto, Object]),
    __metadata("design:returntype", Promise)
], PropertyListingRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PropertyListingRequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT, global_entity_1.UserType.QUALITY, global_entity_1.UserType.CUSTOMER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyListingRequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'authorizationDoc', maxCount: 1 },
        { name: 'ownershipDoc', maxCount: 1 },
        { name: 'attachments', maxCount: 10 },
    ], upload_config_1.genericUploadOptions)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, property_listing_requests_dto_1.UpdatePropertyListingRequestDto]),
    __metadata("design:returntype", Promise)
], PropertyListingRequestsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.CUSTOMER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyListingRequestsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/attachments'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.CUSTOMER, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, property_listing_requests_dto_1.AddAttachmentDto]),
    __metadata("design:returntype", void 0)
], PropertyListingRequestsController.prototype, "addAttachment", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyListingRequestsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PropertyListingRequestsController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyListingRequestsController.prototype, "publish", null);
__decorate([
    (0, common_1.Get)('owner/:ownerId'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.CUSTOMER, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('ownerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyListingRequestsController.prototype, "findByOwner", null);
exports.PropertyListingRequestsController = PropertyListingRequestsController = __decorate([
    (0, common_1.Controller)('property-listing-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [property_listing_requests_service_1.PropertyListingRequestsService])
], PropertyListingRequestsController);
//# sourceMappingURL=property-listing-requests.controller.js.map