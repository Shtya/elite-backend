
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { TrafficService } from './traffic.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from 'entities/global.entity';

@Controller('traffic')
export class TrafficController {
  constructor(private readonly service: TrafficService) {}

  // -------- Partners (Admin/Marketer) --------
  @Post('partners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.MARKETER)
  createPartner(@Body() body: any) {
    // body: { name, kind?, platform?, campaignId, baseShareUrl?, utm?: { utm_source?, utm_campaign?, utm_content? } }
    return this.service.createPartnerAndShareUrl(body);
  }

  @Post('partners/:id/share-url')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.MARKETER)
  buildShareUrl(@Param('id') id: string, @Body() body: any) {
    // body: { baseShareUrl?, utm?: {...} }
    return this.service.buildShareUrlForPartner(+id, body);
  }

  @Get('partners/:id/performance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.MARKETER)
  partnerPerformance(@Param('id') id: string, @Query() q: any) {
    // q: { startDate?, endDate? }
    return this.service.getPartnerPerformance(+id, q);
  }

  // (اختياري) إدارة بسيطة
  @Get('partners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.MARKETER)
  listPartners(@Query() q: any) {
    return this.service.listPartners(q);
  }

  @Patch('partners/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.MARKETER)
  updatePartner(@Param('id') id: string, @Body() body: any) {
    return this.service.updatePartner(+id, body);
  }

  @Delete('partners/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.MARKETER)
  deletePartner(@Param('id') id: string) {
    return this.service.deletePartner(+id);
  }

  // -------- Tracking (Public) --------
  @Post('track')
  track(@Body() body: any, @Req() req: Request) {
    // body: { visitedUrl, landingPage?, referralCode, campaignId, utmSource?, utmCampaign?, utmContent? }
    // التلقّط التلقائي لـ UA/IP
    body.userAgent = body.userAgent ?? req.headers['user-agent'];
    const fwd = (req.headers['x-forwarded-for'] as string) || '';
    body.ipAddress = body.ipAddress ?? (fwd.split(',')[0]?.trim() || req.socket.remoteAddress || '');
    return this.service.trackVisitor(body);
  }

  // -------- Conversions (Admin/Marketer) --------
  @Post('conversions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.MARKETER)
  createConversion(@Body() body: any, @Req() req: Request) {
    // body: { userId, type: 'registration'|'appointment', visitorId?, referralCode?, campaignId? }
    const headerRef = (req.headers['x-ref'] as string) || undefined;
    return this.service.createConversion({
      ...body,
      referralCode: body.referralCode ?? headerRef,
    });
  }
}
