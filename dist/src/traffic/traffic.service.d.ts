import { Repository } from 'typeorm';
import { User, Campaign, ReferralPartner, VisitorTracking, Conversion } from 'src/entities/global.entity';
type ConversionType = 'registration' | 'appointment';
interface CreatePartnerDto {
    name: string;
    kind?: 'external' | 'internal';
    platform?: string;
    campaignId: number;
    baseShareUrl?: string;
    utm?: {
        utm_source?: string;
        utm_campaign?: string;
        utm_content?: string;
    };
}
interface BuildShareUrlDto {
    baseShareUrl?: string;
    utm?: {
        utm_source?: string;
        utm_campaign?: string;
        utm_content?: string;
    };
}
interface TrackVisitorDto {
    visitedUrl: string;
    landingPage?: string;
    referralCode: string;
    campaignId: number;
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
    campaignId?: number;
}
export declare class TrafficService {
    private readonly campaignRepo;
    private readonly partnerRepo;
    private readonly visitRepo;
    private readonly convRepo;
    private readonly userRepo;
    constructor(campaignRepo: Repository<Campaign>, partnerRepo: Repository<ReferralPartner>, visitRepo: Repository<VisitorTracking>, convRepo: Repository<Conversion>, userRepo: Repository<User>);
    private ensureCampaign;
    private ensurePartner;
    private generateReferralCode;
    private uniqueReferralCode;
    private buildShareUrlBase;
    private buildShareUrlQuery;
    private toSlug;
    private buildShareUrlInternal;
    private getAttributionWindowDays;
    createPartnerAndShareUrl(body: CreatePartnerDto): Promise<{
        partner: ReferralPartner;
        shareUrl: string;
    }>;
    buildShareUrlForPartner(partnerId: number, body: BuildShareUrlDto): Promise<{
        shareUrl: string;
    }>;
    listPartners(q: any): Promise<{
        page: number;
        limit: number;
        total: number;
        items: ReferralPartner[];
    }>;
    updatePartner(id: number, body: Partial<CreatePartnerDto>): Promise<{
        partner: ReferralPartner;
        shareUrl: string;
    }>;
    deletePartner(id: number): Promise<{
        deleted: boolean;
    }>;
    trackVisitor(dto: TrackVisitorDto): Promise<{
        visitorId: number;
    }>;
    createConversion(dto: CreateConversionDto): Promise<Conversion>;
    getPartnerPerformance(partnerId: number, q: {
        startDate?: string;
        endDate?: string;
    }): Promise<{
        partner: {
            id: number;
            name: string;
            platform: string;
            referralCode: string;
            campaignId: any;
            isActive: boolean;
        };
        campaign: {
            id: number;
            name: any;
            defaultChannel: any;
            defaultUtmSource: any;
            attributionWindowDays: number;
        };
        metrics: {
            visits: number;
            registrations: number;
            appointments: number;
            conversionRate: string;
        };
        series: {
            visitsByDay: Record<string, number>;
            registrationsByDay: Record<string, number>;
            appointmentsByDay: Record<string, number>;
        };
        status: {
            active: boolean;
            healthFlags: any[];
        };
        period: {
            startDate: string;
            endDate: string;
        };
    }>;
}
export {};
