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
exports.TrafficService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
let TrafficService = class TrafficService {
    constructor(campaignRepo, partnerRepo, visitRepo, convRepo, userRepo) {
        this.campaignRepo = campaignRepo;
        this.partnerRepo = partnerRepo;
        this.visitRepo = visitRepo;
        this.convRepo = convRepo;
        this.userRepo = userRepo;
    }
    async ensureCampaign(id) {
        const c = await this.campaignRepo.findOne({ where: { id } });
        if (!c)
            throw new common_1.NotFoundException('Campaign not found');
        return c;
    }
    async ensurePartner(id) {
        const p = await this.partnerRepo.findOne({ where: { id }, relations: ['campaign'] });
        if (!p)
            throw new common_1.NotFoundException('Partner not found');
        return p;
    }
    generateReferralCode(len = 6) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let out = '';
        for (let i = 0; i < len; i++)
            out += chars[Math.floor(Math.random() * chars.length)];
        return out;
    }
    async uniqueReferralCode() {
        for (let i = 0; i < 5; i++) {
            const code = this.generateReferralCode(6);
            const exists = await this.partnerRepo.findOne({ where: { referralCode: code } });
            if (!exists)
                return code;
        }
        throw new common_1.ConflictException('Failed to generate unique referral code');
    }
    buildShareUrlBase(campaign, baseShareUrl) {
        const DEFAULT_ORIGIN = process.env.APP_PUBLIC_ORIGIN || 'https://your-frontend.com';
        const base = baseShareUrl || `${DEFAULT_ORIGIN}/landing`;
        try {
            return new URL(base);
        }
        catch {
            return new URL(base, DEFAULT_ORIGIN);
        }
    }
    buildShareUrlQuery(u, params) {
        Object.entries(params).forEach(([k, v]) => {
            if (v === undefined || v === null || v === '')
                return;
            u.searchParams.set(k, String(v));
        });
    }
    toSlug(input) {
        if (!input)
            return undefined;
        return input
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/gi, '-')
            .replace(/(^-|-$)/g, '');
    }
    buildShareUrlInternal(partner, campaign, opts) {
        const u = this.buildShareUrlBase(campaign, opts?.baseShareUrl);
        const utmSource = opts?.utm?.utm_source ||
            partner.platform ||
            campaign.targetChannel ||
            'direct';
        const utmCampaign = opts?.utm?.utm_campaign ||
            this.toSlug(campaign.name || campaign.title);
        this.buildShareUrlQuery(u, {
            ref: partner.referralCode,
            campaignId: campaign.id,
            utm_source: utmSource,
            utm_campaign: utmCampaign,
            utm_content: opts?.utm?.utm_content || undefined,
        });
        return u.toString();
    }
    getAttributionWindowDays(campaign) {
        const n = Number(campaign.attributionWindowDays ?? 60);
        return Number.isFinite(n) && n > 0 ? n : 60;
    }
    async createPartnerAndShareUrl(body) {
        if (!body.campaignId)
            throw new common_1.BadRequestException('campaignId is required');
        const campaign = await this.ensureCampaign(body.campaignId);
        const exist = await this.partnerRepo.findOne({
            where: { campaign: { id: campaign.id }, name: body.name, kind: (body.kind ?? 'external') },
        });
        if (exist)
            throw new common_1.ConflictException('Partner with same (campaign, name, kind) already exists');
        const referralCode = await this.uniqueReferralCode();
        const partner = this.partnerRepo.create({
            name: body.name,
            kind: body.kind ?? 'external',
            platform: body.platform ?? null,
            referralCode,
            isActive: true,
            campaign,
        });
        const saved = await this.partnerRepo.save(partner);
        const shareUrl = this.buildShareUrlInternal(saved, campaign, {
            baseShareUrl: body.baseShareUrl,
        });
        return { partner: saved, shareUrl };
    }
    async buildShareUrlForPartner(partnerId, body) {
        const partner = await this.ensurePartner(partnerId);
        const campaign = await this.ensureCampaign(partner.campaign.id || partner.campaign);
        const shareUrl = this.buildShareUrlInternal(partner, campaign, {
            baseShareUrl: body.baseShareUrl,
            utm: body.utm,
        });
        return { shareUrl };
    }
    async listPartners(q) {
        const page = Math.max(1, Number(q.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(q.limit) || 20));
        const where = {};
        if (q.q)
            where.name = (0, typeorm_2.ILike)(`%${q.q}%`);
        if (typeof q.isActive !== 'undefined')
            where.isActive = String(q.isActive) === 'true';
        if (q.campaignId)
            where.campaign = { id: Number(q.campaignId) };
        const [items, total] = await this.partnerRepo.findAndCount({
            where,
            relations: ['campaign'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { page, limit, total, items };
    }
    async updatePartner(id, body) {
        const partner = await this.ensurePartner(id);
        if (body.campaignId && body.campaignId !== partner.campaign.id) {
            const camp = await this.ensureCampaign(body.campaignId);
            partner.campaign = camp;
        }
        if (typeof body.name === 'string')
            partner.name = body.name;
        if (body.kind)
            partner.kind = body.kind;
        if (typeof body.platform !== 'undefined')
            partner.platform = body.platform || null;
        const saved = await this.partnerRepo.save(partner);
        const shareUrl = this.buildShareUrlInternal(saved, partner.campaign, {});
        return { partner: saved, shareUrl };
    }
    async deletePartner(id) {
        const partner = await this.ensurePartner(id);
        await this.partnerRepo.remove(partner);
        return { deleted: true };
    }
    async trackVisitor(dto) {
        if (!dto.referralCode)
            throw new common_1.BadRequestException('referralCode is required');
        if (!dto.campaignId)
            throw new common_1.BadRequestException('campaignId is required');
        const campaign = await this.ensureCampaign(dto.campaignId);
        const partner = await this.partnerRepo.findOne({
            where: { referralCode: dto.referralCode, isActive: true },
            relations: ['campaign'],
        });
        if (!partner)
            throw new common_1.NotFoundException('Partner (by referralCode) not found or inactive');
        const partnerCampaignId = partner.campaign.id || partner.campaign;
        if (partnerCampaignId !== dto.campaignId) {
            throw new common_1.BadRequestException('referralCode does not belong to the given campaignId');
        }
        const utmSource = dto.utmSource || partner.platform || campaign.targetChannel || 'direct';
        const utmCampaign = dto.utmCampaign || this.toSlug(campaign.name || campaign.title) || null;
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
    async createConversion(dto) {
        if (!dto.userId)
            throw new common_1.BadRequestException('userId is required');
        if (!dto.type)
            throw new common_1.BadRequestException('type is required');
        const user = await this.userRepo.findOne({ where: { id: dto.userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        let visit = null;
        if (dto.visitorId) {
            visit = await this.visitRepo.findOne({
                where: { id: dto.visitorId },
                relations: ['partner', 'campaign'],
            });
            if (!visit)
                throw new common_1.NotFoundException('Visitor not found');
        }
        else if (dto.referralCode) {
            let campaign = null;
            if (dto.campaignId) {
                campaign = await this.ensureCampaign(dto.campaignId);
            }
            const where = { referralCode: dto.referralCode };
            if (campaign)
                where.campaign = { id: campaign.id };
            visit = await this.visitRepo.findOne({
                where,
                relations: ['partner', 'campaign'],
                order: { createdAt: 'DESC' },
            });
            if (!visit)
                throw new common_1.NotFoundException('No visit found for referralCode');
            campaign = visit.campaign;
            const days = this.getAttributionWindowDays(campaign);
            const since = new Date();
            since.setDate(since.getDate() - days);
            if (visit.createdAt < since) {
                throw new common_1.BadRequestException('Visit is outside the campaign attribution window');
            }
        }
        else {
            throw new common_1.BadRequestException('Provide visitorId or referralCode');
        }
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const existing = await this.convRepo.findOne({
            where: {
                user: { id: user.id },
                type: dto.type,
                convertedAt: (0, typeorm_2.Between)(start, end),
            },
        });
        if (existing)
            return existing;
        const conv = this.convRepo.create({
            user,
            type: dto.type,
            visitor: visit,
            partner: visit.partner,
            campaign: visit.campaign,
            referralCode: visit.referralCode,
            convertedAt: new Date(),
        });
        return this.convRepo.save(conv);
    }
    async getPartnerPerformance(partnerId, q) {
        const partner = await this.ensurePartner(partnerId);
        const campaign = await this.ensureCampaign(partner.campaign.id || partner.campaign);
        const start = q.startDate ? new Date(q.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = q.endDate ? new Date(q.endDate) : new Date();
        const [visits, regs, appts] = await Promise.all([
            this.visitRepo.find({
                where: {
                    partner: { id: partner.id },
                    createdAt: (0, typeorm_2.Between)(start, end),
                },
                select: ['id', 'createdAt'],
            }),
            this.convRepo.find({
                where: {
                    partner: { id: partner.id },
                    type: 'registration',
                    convertedAt: (0, typeorm_2.Between)(start, end),
                },
                select: ['id', 'convertedAt'],
            }),
            this.convRepo.find({
                where: {
                    partner: { id: partner.id },
                    type: 'appointment',
                    convertedAt: (0, typeorm_2.Between)(start, end),
                },
                select: ['id', 'convertedAt'],
            }),
        ]);
        const visitsByDay = visits.reduce((acc, v) => {
            const d = v.createdAt.toISOString().slice(0, 10);
            acc[d] = (acc[d] || 0) + 1;
            return acc;
        }, {});
        const regsByDay = regs.reduce((acc, v) => {
            const d = v.convertedAt.toISOString().slice(0, 10);
            acc[d] = (acc[d] || 0) + 1;
            return acc;
        }, {});
        const apptsByDay = appts.reduce((acc, v) => {
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
                campaignId: partner.campaign.id || partner.campaign,
                isActive: partner.isActive,
            },
            campaign: {
                id: campaign.id,
                name: campaign.name,
                defaultChannel: campaign.defaultChannel,
                defaultUtmSource: campaign.defaultUtmSource,
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
                healthFlags: [],
            },
            period: { startDate: start.toISOString(), endDate: end.toISOString() },
        };
    }
};
exports.TrafficService = TrafficService;
exports.TrafficService = TrafficService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.Campaign)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.ReferralPartner)),
    __param(2, (0, typeorm_1.InjectRepository)(global_entity_1.VisitorTracking)),
    __param(3, (0, typeorm_1.InjectRepository)(global_entity_1.Conversion)),
    __param(4, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TrafficService);
//# sourceMappingURL=traffic.service.js.map