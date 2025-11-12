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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
const global_entity_2 = require("../entities/global.entity");
let FavoritesService = class FavoritesService {
    constructor(favRepo, propertyRepo, userRepo) {
        this.favRepo = favRepo;
        this.propertyRepo = propertyRepo;
        this.userRepo = userRepo;
    }
    ensureSelfOrAdmin(requestingUser, targetUserId) {
        const isSelf = requestingUser.id === targetUserId;
        const isAdmin = requestingUser.userType === global_entity_1.UserType.ADMIN || requestingUser.userType === global_entity_1.UserType.QUALITY;
        if (!isSelf && !isAdmin)
            throw new common_1.ForbiddenException('You cannot access other users favorites.');
    }
    async add(user, dto, asUserId) {
        const userId = asUserId ?? user.id;
        this.ensureSelfOrAdmin(user, userId);
        const property = await this.propertyRepo.findOne({ where: { id: dto.propertyId } });
        if (!property)
            throw new common_1.NotFoundException('Property not found');
        let fav = await this.favRepo.findOne({
            where: {
                user: { id: userId },
                property: { id: dto.propertyId },
            },
            withDeleted: true,
        });
        if (fav) {
            if (fav.deletedAt) {
                await this.favRepo.restore(fav.id);
            }
            fav.note = dto.note ?? fav.note ?? null;
            return this.favRepo.save(fav);
        }
        fav = this.favRepo.create({
            user: { id: userId },
            property: { id: dto.propertyId },
            note: dto.note ?? null,
        });
        return this.favRepo.save(fav);
    }
    async remove(user, propertyId, asUserId) {
        const userId = asUserId ?? user.id;
        this.ensureSelfOrAdmin(user, userId);
        const fav = await this.favRepo.findOne({
            where: { user: { id: userId }, property: { id: propertyId } },
        });
        if (!fav)
            throw new common_1.NotFoundException('Favorite not found');
        await this.favRepo.softDelete(fav.id);
        return { ok: true };
    }
    async toggle(authUser, propertyId, note, asUserId) {
        const targetUserId = asUserId ?? authUser.id;
        const [user, property] = await Promise.all([this.userRepo.findOne({ where: { id: targetUserId } }), this.propertyRepo.findOne({ where: { id: propertyId } })]);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (!property)
            throw new common_1.NotFoundException('Property not found');
        const existing = await this.favRepo.findOne({
            where: { user: { id: user.id }, property: { id: property.id } },
            withDeleted: true,
            relations: ['user', 'property'],
        });
        if (existing && !existing.deletedAt) {
            if ('deletedAt' in existing) {
                await this.favRepo.softRemove(existing);
            }
            else {
                await this.favRepo.remove(existing);
            }
            return {
                status: 'removed',
                toggled: false,
                message: 'Property removed from favorites.',
                data: { propertyId, userId: user.id },
            };
        }
        if (existing && existing.deletedAt) {
            await this.favRepo.restore(existing.id);
            if (note !== undefined) {
                await this.favRepo.update(existing.id, { note: note ?? null });
            }
            const restored = await this.favRepo.findOne({ where: { id: existing.id } });
            return {
                status: 'added',
                toggled: true,
                message: 'Property added to favorites.',
                data: restored,
            };
        }
        const created = this.favRepo.create({ user, property, note: note ?? null });
        const saved = await this.favRepo.save(created);
        return {
            status: 'added',
            toggled: true,
            message: 'Property added to favorites.',
            data: saved,
        };
    }
    async isFavorite(user, propertyId, asUserId) {
        const userId = asUserId ?? user.id;
        this.ensureSelfOrAdmin(user, userId);
        const fav = await this.favRepo.findOne({
            where: { user: { id: userId }, property: { id: propertyId } },
        });
        return { favorite: !!fav };
    }
    async list(user, query) {
        const page = query.page ?? 1;
        const limit = Math.min(query.limit ?? 20, 100);
        const userId = query.userId ?? user.id;
        this.ensureSelfOrAdmin(user, userId);
        const qb = this.favRepo
            .createQueryBuilder('fav')
            .leftJoinAndSelect('fav.property', 'property')
            .leftJoinAndSelect('property.city', 'city')
            .leftJoinAndSelect('property.area', 'area')
            .where('fav.user_id = :userId', { userId })
            .andWhere('fav.deleted_at IS NULL')
            .orderBy('fav.created_at', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [items, total] = await qb.getManyAndCount();
        return {
            items,
            meta: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_2.FavoriteProperty)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.Property)),
    __param(2, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FavoritesService);
//# sourceMappingURL=favorite-property.service.js.map