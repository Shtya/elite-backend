import { UserType, VerificationStatus, AgentApprovalStatus, SocialPlatform, TrafficSource, AccessType, RelationshipType, ListingRequestStatus, AppointmentStatus, CreatedChannel, ConversionType, TimelineEventType, RatingDimension, PaymentStatus, PaymentGateway, CampaignChannel, CampaignAudience, CampaignRunType, CampaignFrequency, CampaignStatus, NotificationType, NotificationChannel, NotificationStatus, StaticPageSlug, SectionKey, CalendarProvider, QualityCaseStatus, QualityCasePriority, ReportSnapshotType } from 'src/entities/global.entity';
export declare class SystemStatusController {
    getAllStatuses(): {
        userType: UserType[];
        verificationStatus: VerificationStatus[];
        agentApprovalStatus: AgentApprovalStatus[];
        socialPlatform: SocialPlatform[];
        trafficSource: TrafficSource[];
        accessType: AccessType[];
        relationshipType: RelationshipType[];
        listingRequestStatus: ListingRequestStatus[];
        appointmentStatus: AppointmentStatus[];
        createdChannel: CreatedChannel[];
        conversionType: ConversionType[];
        timelineEventType: TimelineEventType[];
        ratingDimension: RatingDimension[];
        paymentStatus: PaymentStatus[];
        paymentGateway: PaymentGateway[];
        campaignChannel: CampaignChannel[];
        campaignAudience: CampaignAudience[];
        campaignRunType: CampaignRunType[];
        campaignFrequency: CampaignFrequency[];
        campaignStatus: CampaignStatus[];
        notificationType: NotificationType[];
        notificationChannel: NotificationChannel[];
        notificationStatus: NotificationStatus[];
        staticPageSlug: StaticPageSlug[];
        sectionKey: SectionKey[];
        calendarProvider: CalendarProvider[];
        qualityCaseStatus: QualityCaseStatus[];
        qualityCasePriority: QualityCasePriority[];
        reportSnapshotType: ReportSnapshotType[];
    };
}
