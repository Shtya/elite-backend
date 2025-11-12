import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, Req, ParseIntPipe, Patch } from '@nestjs/common';
import { FavoritesService } from './favorite-property.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from 'entities/global.entity';
import { CreateFavoriteDto, FavoriteQueryDto } from 'dto/favorites.dto';
import { FavoriteProperty } from 'entities/global.entity';
import { CRUD } from 'common/crud.service';
type ReqUser = { user: { id: number; userType: UserType } };

@Controller('favorites')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FavoritesController {
  constructor(private readonly svc: FavoritesService) {}

  @Get()
  findAll(@Query() query: any) {
    return CRUD.findAll(
      this.svc.favRepo, // repo
      'favorite_properties', // alias
      query.q || query.search, // search
      query.page, // page
      query.limit, // limit
      query.sortBy ?? 'createdAt', // sortBy (avoid default 'created_at' mismatch)
      query.sortOrder ?? 'DESC', // sortOrder
      ['user', 'property'], // relations
      [], // searchFields on root columns (adjust to your entity)
      query.filters,
    );
  }

  @Get(':propertyId/is-favorite')
  @Roles(UserType.CUSTOMER, UserType.ADMIN, UserType.QUALITY)
  isFavorite(@Req() req: ReqUser, @Param('propertyId', ParseIntPipe) propertyId: number, @Query('userId') userId?: number) {
    const asUserId = userId ? Number(userId) : undefined;
    return this.svc.isFavorite(req.user, propertyId, asUserId);
  }

  @Post()
  @Roles(UserType.CUSTOMER, UserType.ADMIN)
  add(
    @Req() req: ReqUser,
    @Body() dto: CreateFavoriteDto,
    @Query('userId') userId?: number, // optional impersonation (admin)
  ) {
    const asUserId = userId ? Number(userId) : undefined;
    return this.svc.toggle(req.user, dto.propertyId, dto.note, asUserId);
  }

  /** Remove from favorites */
  @Delete(':propertyId')
  @Roles(UserType.CUSTOMER, UserType.ADMIN)
  remove(@Req() req: ReqUser, @Param('propertyId', ParseIntPipe) propertyId: number, @Query('userId') userId?: number) {
    const asUserId = userId ? Number(userId) : undefined;
    return this.svc.remove(req.user, propertyId, asUserId);
  }
}
