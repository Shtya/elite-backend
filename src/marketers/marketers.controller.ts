import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MarketersService } from './marketers.service';
import { CreateMarketerDto, UpdateMarketerDto, MarketerQueryDto, GenerateReferralCodeDto } from '../../dto/marketers.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from 'entities/global.entity';
import { CRUD } from 'common/crud.service';

@Controller('marketers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarketersController {
  constructor(private readonly marketersService: MarketersService) {}

	
  @Post()
  @Roles(UserType.ADMIN)
  create(@Body() createMarketerDto: CreateMarketerDto) {
    return this.marketersService.create(createMarketerDto);
  }

  @Get()
  @Roles(UserType.ADMIN)
  findAll(@Query() query: any) {
    const filters: Record<string, any> = {};

    // nested filter (createdBy.id)
    if (query.createdById) {
      filters.createdBy = { id: Number(query.createdById) };
    }

    return CRUD.findAll(
      this.marketersService.marketersRepository, // repo
      'marketer',                                // alias (must match QB alias)
      query.q || query.search,                   // search string
      query.page,                                // page
      query.limit,                               // limit
      query.sortBy  ,               // sortBy (avoid 'created_at' mismatch)
      query.sortOrder  ,                 // sortOrder
      ['user', 'createdBy'],                     // relations
      [],                                        // searchFields (none/safe; add if you have root cols)
      filters,                                   // filters (supports nested)
    );
  }

  @Get(':id')
  @Roles(UserType.ADMIN, UserType.MARKETER)
  findOne(@Param('id') id: string) {
    return this.marketersService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserType.ADMIN)
  update(@Param('id') id: string, @Body() updateMarketerDto: UpdateMarketerDto) {
    return this.marketersService.update(+id, updateMarketerDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  remove(@Param('id') id: string) {
    return this.marketersService.remove(+id);
  }

  @Get('user/:userId')
  @Roles(UserType.ADMIN, UserType.MARKETER)
  findByUserId(@Param('userId') userId: string) {
    return this.marketersService.findByUserId(+userId);
  }

  @Get('referral/:referralCode')
  findByReferralCode(@Param('referralCode') referralCode: string) {
    return this.marketersService.findByReferralCode(referralCode);
  }

  @Post('generate-referral')
  @Roles(UserType.ADMIN)
  generateReferralCode(@Body() generateReferralCodeDto: GenerateReferralCodeDto) {
    return this.marketersService.generateReferralCode(generateReferralCodeDto.marketerName);
  }

  @Get(':id/performance')
  @Roles(UserType.ADMIN, UserType.MARKETER)
  getPerformance(@Param('id') id: string) {
    return this.marketersService.getPerformance(+id);
  }
}