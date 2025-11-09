import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, UpdateNotificationDto, NotificationQueryDto, SendNotificationDto } from '../../dto/notifications.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from 'entities/global.entity';
import { CRUD } from 'common/crud.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles(UserType.ADMIN)
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @Roles(UserType.ADMIN,UserType.AGENT)
  findAll(@Query() query: any) {
    const filters: Record<string, any> = {};
    if (query.userId) filters.user = { id: Number(query.userId) };
    if (query.type) filters.type = query.type;
    if (query.status) filters.status = query.status;
    if (query.channel) filters.channel = query.channel;

    return CRUD.findAll(
      this.notificationsService.notificationsRepository, // repo
      'notification', // alias
      query.q || query.search, // search
      query.page, // page
      query.limit, // limit
      query.sortBy ?? 'createdAt', // sortBy
      query.sortOrder ?? 'DESC', // sortOrder
      ['user'], // relations
      ['title', 'message'], // searchFields on root columns
      filters, // filters (no ranges)
    );
  }

  @Get('my')
  getMyNotifications(@Query() query: any, @Req() req: any) {
    const userId = Number(req?.user?.id);
    const filters: Record<string, any> = { user: { id: userId } };
    if (query.type) filters.type = query.type;
    if (query.status) filters.status = query.status;
    if (query.channel) filters.channel = query.channel;

    return CRUD.findAll(
      this.notificationsService.notificationsRepository,
      'notification',
      query.q || query.search,
      query.page,
      query.limit,
      query.sortBy ?? 'createdAt',
      query.sortOrder ?? 'DESC',
      [], // no extra relations needed here (already scoped to user)
      ['title', 'message'], // searchable fields
      filters,
    );
  }

  @Get(':id')
  @Roles(UserType.ADMIN)
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserType.ADMIN)
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }

  @Post('send')
  @Roles(UserType.ADMIN)
  sendNotification(@Body() sendNotificationDto: SendNotificationDto) {
    return this.notificationsService.sendImmediate(sendNotificationDto);
  }

  @Post(':id/mark-read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(+id);
  }

  @Post('mark-all-read')
  markAllAsRead() {
    const userId = 1; // Replace with actual user ID from token
    return this.notificationsService.markAllAsRead(userId);
  }
}
