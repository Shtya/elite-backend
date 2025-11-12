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
exports.FavoritesController = void 0;
const common_1 = require("@nestjs/common");
const favorite_property_service_1 = require("./favorite-property.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
const favorites_dto_1 = require("../dto/favorites.dto");
let FavoritesController = class FavoritesController {
    constructor(svc) {
        this.svc = svc;
    }
    async findAll(req, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search) {
        if (!req.user || !req.user.id) {
            throw new common_1.BadRequestException('User ID missing from request');
        }
        const userId = req.user.id;
        const skip = (page - 1) * limit;
        const qb = this.svc.favRepo
            .createQueryBuilder('favorite_properties')
            .leftJoinAndSelect('favorite_properties.user', 'user')
            .leftJoinAndSelect('favorite_properties.property', 'property')
            .where('user.id = :userId', { userId });
        if (search) {
            qb.andWhere('(property.title ILIKE :search OR property.location ILIKE :search)', { search: `%${search}%` });
        }
        qb.orderBy(`favorite_properties.${sortBy}`, sortOrder)
            .skip(skip)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return {
            total,
            page: Number(page),
            limit: Number(limit),
            data,
        };
    }
    isFavorite(req, propertyId, userId) {
        const asUserId = userId ? Number(userId) : undefined;
        return this.svc.isFavorite(req.user, propertyId, asUserId);
    }
    add(req, dto, userId) {
        const asUserId = userId ? Number(userId) : undefined;
        return this.svc.toggle(req.user, dto.propertyId, dto.note, asUserId);
    }
    remove(req, propertyId, userId) {
        const asUserId = userId ? Number(userId) : undefined;
        return this.svc.remove(req.user, propertyId, asUserId);
    }
};
exports.FavoritesController = FavoritesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('sortBy')),
    __param(4, (0, common_1.Query)('sortOrder')),
    __param(5, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':propertyId/is-favorite'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.CUSTOMER, global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('propertyId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], FavoritesController.prototype, "isFavorite", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, favorites_dto_1.CreateFavoriteDto, Number]),
    __metadata("design:returntype", void 0)
], FavoritesController.prototype, "add", null);
__decorate([
    (0, common_1.Delete)(':propertyId'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.CUSTOMER, global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('propertyId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], FavoritesController.prototype, "remove", null);
exports.FavoritesController = FavoritesController = __decorate([
    (0, common_1.Controller)('favorites'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [favorite_property_service_1.FavoritesService])
], FavoritesController);
//# sourceMappingURL=favorite-property.controller.js.map