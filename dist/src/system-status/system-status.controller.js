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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemStatusController = void 0;
const common_1 = require("@nestjs/common");
const global_entity_1 = require("../entities/global.entity");
let SystemStatusController = class SystemStatusController {
    getAllStatuses() {
        return {
            userType: Object.values(global_entity_1.UserType),
            verificationStatus: Object.values(global_entity_1.VerificationStatus),
            agentApprovalStatus: Object.values(global_entity_1.AgentApprovalStatus),
            socialPlatform: Object.values(global_entity_1.SocialPlatform),
            trafficSource: Object.values(global_entity_1.TrafficSource),
            accessType: Object.values(global_entity_1.AccessType),
            relationshipType: Object.values(global_entity_1.RelationshipType),
            listingRequestStatus: Object.values(global_entity_1.ListingRequestStatus),
            appointmentStatus: Object.values(global_entity_1.AppointmentStatus),
            createdChannel: Object.values(global_entity_1.CreatedChannel),
            conversionType: Object.values(global_entity_1.ConversionType),
            timelineEventType: Object.values(global_entity_1.TimelineEventType),
            ratingDimension: Object.values(global_entity_1.RatingDimension),
            paymentStatus: Object.values(global_entity_1.PaymentStatus),
            paymentGateway: Object.values(global_entity_1.PaymentGateway),
            campaignChannel: Object.values(global_entity_1.CampaignChannel),
            campaignAudience: Object.values(global_entity_1.CampaignAudience),
            campaignRunType: Object.values(global_entity_1.CampaignRunType),
            campaignFrequency: Object.values(global_entity_1.CampaignFrequency),
            campaignStatus: Object.values(global_entity_1.CampaignStatus),
            notificationType: Object.values(global_entity_1.NotificationType),
            notificationChannel: Object.values(global_entity_1.NotificationChannel),
            notificationStatus: Object.values(global_entity_1.NotificationStatus),
            staticPageSlug: Object.values(global_entity_1.StaticPageSlug),
            sectionKey: Object.values(global_entity_1.SectionKey),
            calendarProvider: Object.values(global_entity_1.CalendarProvider),
            qualityCaseStatus: Object.values(global_entity_1.QualityCaseStatus),
            qualityCasePriority: Object.values(global_entity_1.QualityCasePriority),
            reportSnapshotType: Object.values(global_entity_1.ReportSnapshotType),
        };
    }
};
exports.SystemStatusController = SystemStatusController;
__decorate([
    (0, common_1.Get)('statuses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SystemStatusController.prototype, "getAllStatuses", null);
exports.SystemStatusController = SystemStatusController = __decorate([
    (0, common_1.Controller)('system')
], SystemStatusController);
//# sourceMappingURL=system-status.controller.js.map