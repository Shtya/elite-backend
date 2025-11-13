import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between, MoreThanOrEqual, LessThanOrEqual, FindOptionsWhere } from 'typeorm';
import { User, Campaign, ReferralPartner, VisitorTracking, Conversion } from 'entities/global.entity';
type ConversionType = 'registration' | 'appointment';

interface CreatePartnerDto {
  name: string;
  kind?: 'external' | 'internal';
  platform?: string;
  campaignId: number; // Required
  baseShareUrl?: string; // e.g. https://site.com/landing
  utm?: { utm_source?: string; utm_campaign?: string; utm_content?: string };
}

interface BuildShareUrlDto {
  baseShareUrl?: string;
  utm?: { utm_source?: string; utm_campaign?: string; utm_content?: string };
}

interface TrackVisitorDto {
  visitedUrl: string;
  landingPage?: string;
  referralCode: string; // Required (نلتزم به)
  campaignId: number; // Required
  utmSource?: string;
  utmCampaign?: string;
  utmContent?: string;
  userAgent?: string;
  ipAddress?: string;
}

interface CreateConversionDto {
  userId: number;
  type: ConversionType;
  visitorId?: number;
  referralCode?: string;
  campaignId?: number; // اختياري، بنستنبطه من الزيارة غالبًا
}

@Injectable()
export class TrafficService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
    @InjectRepository(ReferralPartner)
    private readonly partnerRepo: Repository<ReferralPartner>,
    @InjectRepository(VisitorTracking)
    private readonly visitRepo: Repository<VisitorTracking>,
    @InjectRepository(Conversion)
    private readonly convRepo: Repository<Conversion>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ============ Helpers ============
  private async ensureCampaign(id: number): Promise<Campaign> {
    const c = await this.campaignRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Campaign not found');
    return c;
  }

  private async ensurePartner(id: number): Promise<ReferralPartner> {
    const p = await this.partnerRepo.findOne({ where: { id }, relations: ['campaign'] });
    if (!p) throw new NotFoundException('Partner not found');
    return p;
  }

  private generateReferralCode(len = 6): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // بدون المتشابهات
    let out = '';
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  private async uniqueReferralCode(): Promise<string> {
    for (let i = 0; i < 5; i++) {
      const code = this.generateReferralCode(6);
      const exists = await this.partnerRepo.findOne({ where: { referralCode: code } });
      if (!exists) return code;
    }
    throw new ConflictException('Failed to generate unique referral code');
  }

  private buildShareUrlBase(campaign: Campaign, baseShareUrl?: string): URL {
  const DEFAULT_ORIGIN = process.env.APP_PUBLIC_ORIGIN || 'https://your-frontend.com';
  const base = baseShareUrl || `${DEFAULT_ORIGIN}/landing`;
  try {
    return new URL(base); // absolute
  } catch {
    return new URL(base, DEFAULT_ORIGIN); // relative → prefix origin
  }
}


  private buildShareUrlQuery(u: URL, params: Record<string, string | number | undefined | null>) {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return;
      u.searchParams.set(k, String(v));
    });
  }

	private toSlug(input?: string | null): string | undefined {
  if (!input) return undefined;
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/(^-|-$)/g, '');
}


  private buildShareUrlInternal(
  partner: ReferralPartner,
  campaign: Campaign,
  opts?: { baseShareUrl?: string; utm?: Record<string, string | undefined> }
) {
  const u = this.buildShareUrlBase(campaign, opts?.baseShareUrl);

  const utmSource =
    opts?.utm?.utm_source ||
    partner.platform ||                       // ← الأفضل لو متسجّل
    (campaign as any).targetChannel ||        // ← عندك في الكائن فعليًا
    'direct';

  const utmCampaign =
    opts?.utm?.utm_campaign ||
    this.toSlug((campaign as any).name || (campaign as any).title); // ← موجودين في الكائن

  this.buildShareUrlQuery(u, {
    ref: partner.referralCode,
    campaignId: campaign.id,
    utm_source: utmSource,
    utm_campaign: utmCampaign,
    utm_content: opts?.utm?.utm_content || undefined,
  });

  return u.toString();
}


  private getAttributionWindowDays(campaign: Campaign): number {
    const n = Number((campaign as any).attributionWindowDays ?? 60);
    return Number.isFinite(n) && n > 0 ? n : 60;
  }

  // ============ Partners ============
  // ... داخل TrafficService

  async createPartnerAndShareUrl(body: CreatePartnerDto) {
  if (!body.campaignId) throw new BadRequestException('campaignId is required');

  const campaign = await this.ensureCampaign(body.campaignId);

  // uniqueness على (campaign, name, kind)
  const exist = await this.partnerRepo.findOne({
    where: { campaign: { id: campaign.id }, name: body.name, kind: (body.kind ?? 'external') as any } as any,
  });
  if (exist) throw new ConflictException('Partner with same (campaign, name, kind) already exists');

  const referralCode = await this.uniqueReferralCode();

  const partner = this.partnerRepo.create({
    name: body.name,
    kind: body.kind ?? 'external',
    platform: body.platform ?? null, // ← مفيش default من الحملة، خليه من البودي
    referralCode,
    isActive: true,
    campaign,
  });
  const saved = await this.partnerRepo.save(partner);

  // سيب الـUTM للـbuilder يتولد من (platform/targetChannel + campaign.name)
  const shareUrl = this.buildShareUrlInternal(saved, campaign, {
    baseShareUrl: body.baseShareUrl,
  });

  return { partner: saved, shareUrl };
}


  async buildShareUrlForPartner(partnerId: number, body: BuildShareUrlDto) {
    const partner = await this.ensurePartner(partnerId);
    const campaign = await this.ensureCampaign((partner.campaign as any).id || partner.campaign);
    const shareUrl = this.buildShareUrlInternal(partner, campaign, {
      baseShareUrl: body.baseShareUrl,
      utm: body.utm,
    });
    return { shareUrl };
  }

  // (اختياري) إدارة بسيطة
  async listPartners(q: any) {
    const page = Math.max(1, Number(q.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(q.limit) || 20));
    const where: FindOptionsWhere<ReferralPartner> = {};
    if (q.q) (where as any).name = ILike(`%${q.q}%`);
    if (typeof q.isActive !== 'undefined') (where as any).isActive = String(q.isActive) === 'true';
    if (q.campaignId) (where as any).campaign = { id: Number(q.campaignId) };

    const [items, total] = await this.partnerRepo.findAndCount({
      where,
      relations: ['campaign'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { page, limit, total, items };
  }

  async updatePartner(id: number, body: Partial<CreatePartnerDto>) {
    const partner = await this.ensurePartner(id);
    if (body.campaignId && body.campaignId !== (partner.campaign as any).id) {
      const camp = await this.ensureCampaign(body.campaignId);
      (partner as any).campaign = camp;
    }
    if (typeof body.name === 'string') partner.name = body.name;
    if (body.kind) partner.kind = body.kind;
    if (typeof body.platform !== 'undefined') partner.platform = body.platform || null;
    const saved = await this.partnerRepo.save(partner);

    // اختياري: رجّع Share URL افتراضي سريع
    const shareUrl = this.buildShareUrlInternal(saved, (partner as any).campaign, {});
    return { partner: saved, shareUrl };
  }

  async deletePartner(id: number) {
    const partner = await this.ensurePartner(id);
    await this.partnerRepo.remove(partner);
    return { deleted: true };
  }

  async trackVisitor(dto: TrackVisitorDto) {
  if (!dto.referralCode) throw new BadRequestException('referralCode is required');
  if (!dto.campaignId) throw new BadRequestException('campaignId is required');

  const campaign = await this.ensureCampaign(dto.campaignId);

  const partner = await this.partnerRepo.findOne({
    where: { referralCode: dto.referralCode, isActive: true },
    relations: ['campaign'],
  });
  if (!partner) throw new NotFoundException('Partner (by referralCode) not found or inactive');

  const partnerCampaignId = (partner.campaign as any).id || partner.campaign;
  if (partnerCampaignId !== dto.campaignId) {
    throw new BadRequestException('referralCode does not belong to the given campaignId');
  }

  const utmSource = dto.utmSource || partner.platform || (campaign as any).targetChannel || 'direct';
  const utmCampaign = dto.utmCampaign || this.toSlug((campaign as any).name || (campaign as any).title) || null;

  const visit = this.visitRepo.create({
    visitedUrl: dto.visitedUrl,
    landingPage: dto.landingPage ?? null,
    utmSource,
    utmCampaign,
    utmContent: dto.utmContent ?? null,
    userAgent: dto.userAgent ?? null,
    ipAddress: dto.ipAddress ?? null,
    referralCode: dto.referralCode,
    partner,
    campaign,
  });
  const saved = await this.visitRepo.save(visit);

  return { visitorId: saved.id };
}


  // ============ Conversions ============
  async createConversion(dto: CreateConversionDto) {
    if (!dto.userId) throw new BadRequestException('userId is required');
    if (!dto.type) throw new BadRequestException('type is required');

    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    let visit: VisitorTracking | null = null;

    if (dto.visitorId) {
      visit = await this.visitRepo.findOne({
        where: { id: dto.visitorId },
        relations: ['partner', 'campaign'],
      });
      if (!visit) throw new NotFoundException('Visitor not found');
    } else if (dto.referralCode) {
      // Resolve by ref within campaign window
      // campaignId اختياري؛ لو مش موجود هنحاول ناخده من آخر زيارة لنفس ref
      let campaign: Campaign | null = null;

      if (dto.campaignId) {
        campaign = await this.ensureCampaign(dto.campaignId);
      }

      // آخر زيارة بنفس ref (ولو فيه campaignId نقيّد عليها)
      const where: FindOptionsWhere<VisitorTracking> = { referralCode: dto.referralCode };
      if (campaign) (where as any).campaign = { id: campaign.id };

      visit = await this.visitRepo.findOne({
        where,
        relations: ['partner', 'campaign'],
        order: { createdAt: 'DESC' },
      });

      if (!visit) throw new NotFoundException('No visit found for referralCode');
      campaign = visit.campaign;

      // نافذة الإسناد من الحملة
      const days = this.getAttributionWindowDays(campaign);
      const since = new Date();
      since.setDate(since.getDate() - days);
      if (visit.createdAt < since) {
        throw new BadRequestException('Visit is outside the campaign attribution window');
      }
    } else {
      throw new BadRequestException('Provide visitorId or referralCode');
    }

    // Idempotency: منع تكرار نفس التحويل لنفس اليوم
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const existing = await this.convRepo.findOne({
      where: {
        user: { id: user.id },
        type: dto.type as any,
        convertedAt: Between(start, end),
      },
    });
    if (existing) return existing;

    const conv = this.convRepo.create({
      user,
      type: dto.type as any,
      visitor: visit,
      partner: visit.partner,
      campaign: visit.campaign,
      referralCode: visit.referralCode,
      convertedAt: new Date(),
    });

    return this.convRepo.save(conv);
  }

  // ============ Performance ============
  async getPartnerPerformance(partnerId: number, q: { startDate?: string; endDate?: string }) {
    const partner = await this.ensurePartner(partnerId);
    const campaign = await this.ensureCampaign((partner.campaign as any).id || partner.campaign);

    const start = q.startDate ? new Date(q.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = q.endDate ? new Date(q.endDate) : new Date();

    const [visits, regs, appts] = await Promise.all([
      this.visitRepo.find({
        where: {
          partner: { id: partner.id },
          createdAt: Between(start, end),
        },
        select: ['id', 'createdAt'],
      }),
      this.convRepo.find({
        where: {
          partner: { id: partner.id },
          type: 'registration' as any,
          convertedAt: Between(start, end),
        },
        select: ['id', 'convertedAt'],
      }),
      this.convRepo.find({
        where: {
          partner: { id: partner.id },
          type: 'appointment' as any,
          convertedAt: Between(start, end),
        },
        select: ['id', 'convertedAt'],
      }),
    ]);

    const visitsByDay = visits.reduce<Record<string, number>>((acc, v) => {
      const d = v.createdAt.toISOString().slice(0, 10);
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});

    const regsByDay = regs.reduce<Record<string, number>>((acc, v) => {
      const d = v.convertedAt.toISOString().slice(0, 10);
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});

    const apptsByDay = appts.reduce<Record<string, number>>((acc, v) => {
      const d = v.convertedAt.toISOString().slice(0, 10);
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});

    const totalVisitors = visits.length;
    const totalRegistrations = regs.length;
    const totalAppointments = appts.length;
    const conversionRate = totalVisitors ? `${((totalRegistrations / totalVisitors) * 100).toFixed(2)}%` : '0%';

    return {
      partner: {
        id: partner.id,
        name: partner.name,
        platform: partner.platform,
        referralCode: partner.referralCode,
        campaignId: (partner.campaign as any).id || partner.campaign,
        isActive: partner.isActive,
      },
      campaign: {
        id: campaign.id,
        name: (campaign as any).name,
        defaultChannel: (campaign as any).defaultChannel,
        defaultUtmSource: (campaign as any).defaultUtmSource,
        attributionWindowDays: this.getAttributionWindowDays(campaign),
      },
      metrics: {
        visits: totalVisitors,
        registrations: totalRegistrations,
        appointments: totalAppointments,
        conversionRate,
      },
      series: {
        visitsByDay,
        registrationsByDay: regsByDay,
        appointmentsByDay: apptsByDay,
      },
      status: {
        active: partner.isActive,
        healthFlags: [], // تقدر تضيف تحليلات IP/UA لاحقًا
      },
      period: { startDate: start.toISOString(), endDate: end.toISOString() },
    };
  }
}
