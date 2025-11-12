import { Repository } from 'typeorm';
import { Property, UserType, User } from 'src/entities/global.entity';
import { CreateFavoriteDto, FavoriteQueryDto } from 'src/dto/favorites.dto';
import { FavoriteProperty } from 'src/entities/global.entity';
export declare class FavoritesService {
    readonly favRepo: Repository<FavoriteProperty>;
    readonly propertyRepo: Repository<Property>;
    readonly userRepo: Repository<User>;
    constructor(favRepo: Repository<FavoriteProperty>, propertyRepo: Repository<Property>, userRepo: Repository<User>);
    private ensureSelfOrAdmin;
    add(user: {
        id: number;
        userType: UserType;
    }, dto: CreateFavoriteDto, asUserId?: number): Promise<FavoriteProperty>;
    remove(user: {
        id: number;
        userType: UserType;
    }, propertyId: number, asUserId?: number): Promise<{
        ok: boolean;
    }>;
    toggle(authUser: any, propertyId: number, note?: string | null, asUserId?: number): Promise<{
        status: string;
        toggled: boolean;
        message: string;
        data: {
            propertyId: number;
            userId: number;
        };
    } | {
        status: string;
        toggled: boolean;
        message: string;
        data: FavoriteProperty;
    }>;
    isFavorite(user: {
        id: number;
        userType: UserType;
    }, propertyId: number, asUserId?: number): Promise<{
        favorite: boolean;
    }>;
    list(user: {
        id: number;
        userType: UserType;
    }, query: FavoriteQueryDto): Promise<{
        items: FavoriteProperty[];
        meta: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
}
