import { TrafficSource, ConversionType, SocialPlatform } from 'src/entities/global.entity';
export declare class TrackVisitorDto {
    referralCode?: string;
    marketerId?: number;
    source: TrafficSource;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    influencerId?: number;
    landingPage?: string;
    userAgent?: string;
    ipAddress?: string;
    visitedUrl: string;
}
export declare class CreateConversionDto {
    marketerId?: number;
    visitorId: number;
    userId: number;
    conversionType?: ConversionType;
}
export declare class TrafficQueryDto {
    marketerId?: number;
    influencerId?: number;
    source?: TrafficSource;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}
export declare class CreateInfluencerDto {
    name: string;
    handle?: string;
    platform: SocialPlatform;
    code?: string;
    userId?: number;
}
export declare class UpdateInfluencerDto {
    name?: string;
    handle?: string;
    platform?: SocialPlatform;
    isActive?: boolean;
}
