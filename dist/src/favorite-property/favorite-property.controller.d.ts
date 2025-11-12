import { FavoritesService } from './favorite-property.service';
import { UserType } from 'src/entities/global.entity';
import { CreateFavoriteDto } from 'src/dto/favorites.dto';
import { FavoriteProperty } from 'src/entities/global.entity';
type ReqUser = {
    user: {
        id: number;
        userType: UserType;
    };
};
export declare class FavoritesController {
    private readonly svc;
    constructor(svc: FavoritesService);
    findAll(req: any, page?: number, limit?: number, sortBy?: string, sortOrder?: 'ASC' | 'DESC', search?: string): Promise<{
        total: number;
        page: number;
        limit: number;
        data: FavoriteProperty[];
    }>;
    isFavorite(req: ReqUser, propertyId: number, userId?: number): Promise<{
        favorite: boolean;
    }>;
    add(req: ReqUser, dto: CreateFavoriteDto, userId?: number): Promise<{
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
    remove(req: ReqUser, propertyId: number, userId?: number): Promise<{
        ok: boolean;
    }>;
}
export {};
