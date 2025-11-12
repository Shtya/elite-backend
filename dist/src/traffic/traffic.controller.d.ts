import { Request } from 'express';
import { TrafficService } from './traffic.service';
export declare class TrafficController {
    private readonly service;
    constructor(service: TrafficService);
    createPartner(body: any): Promise<{
        partner: import("src/entities/global.entity").ReferralPartner;
        shareUrl: string;
    }>;
    buildShareUrl(id: string, body: any): Promise<{
        shareUrl: string;
    }>;
    partnerPerformance(id: string, q: any): Promise<{
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
    listPartners(q: any): Promise<{
        page: number;
        limit: number;
        total: number;
        items: import("src/entities/global.entity").ReferralPartner[];
    }>;
    updatePartner(id: string, body: any): Promise<{
        partner: import("src/entities/global.entity").ReferralPartner;
        shareUrl: string;
    }>;
    deletePartner(id: string): Promise<{
        deleted: boolean;
    }>;
    track(body: any, req: Request): Promise<{
        visitorId: number;
    }>;
    createConversion(body: any, req: Request): Promise<import("src/entities/global.entity").Conversion>;
}
