"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const QueryFailedErrorFilter_1 = require("../common/QueryFailedErrorFilter");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const agents_module_1 = require("./agents/agents.module");
const properties_module_1 = require("./properties/properties.module");
const appointments_module_1 = require("./appointments/appointments.module");
const reviews_module_1 = require("./reviews/reviews.module");
const payments_module_1 = require("./payments/payments.module");
const campaigns_module_1 = require("./campaigns/campaigns.module");
const notifications_module_1 = require("./notifications/notifications.module");
const cms_module_1 = require("./cms/cms.module");
const quality_module_1 = require("./quality/quality.module");
const reports_module_1 = require("./reports/reports.module");
const traffic_module_1 = require("./traffic/traffic.module");
const property_listing_requests_module_1 = require("./property-listing-requests/property-listing-requests.module");
const agent_availability_module_1 = require("./agent-availability/agent-availability.module");
const calendar_module_1 = require("./calendar/calendar.module");
const timeline_module_1 = require("./timeline/timeline.module");
const payout_accounts_module_1 = require("./payout-accounts/payout-accounts.module");
const master_data_module_1 = require("./master-data/master-data.module");
const message_templates_module_1 = require("./message-templates/message-templates.module");
const global_entity_1 = require("./entities/global.entity");
const system_status_module_1 = require("./system-status/system-status.module");
const favorite_property_module_1 = require("./favorite-property/favorite-property.module");
const export_module_1 = require("./export/export.module");
const team_member_module_1 = require("./team-member/team-member.module");
const contactUs_module_1 = require("./contactUs/contactUs.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DATABASE_HOST,
                port: parseInt(process.env.DATABASE_PORT, 10),
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([global_entity_1.UserRole, global_entity_1.Role]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            agents_module_1.AgentsModule,
            properties_module_1.PropertiesModule,
            appointments_module_1.AppointmentsModule,
            reviews_module_1.ReviewsModule,
            payments_module_1.PaymentsModule,
            campaigns_module_1.CampaignsModule,
            notifications_module_1.NotificationsModule,
            cms_module_1.CmsModule,
            quality_module_1.QualityModule,
            reports_module_1.ReportsModule,
            traffic_module_1.TrafficModule,
            property_listing_requests_module_1.PropertyListingRequestsModule,
            agent_availability_module_1.AgentAvailabilityModule,
            calendar_module_1.CalendarModule,
            timeline_module_1.TimelineModule,
            payout_accounts_module_1.PayoutAccountsModule,
            master_data_module_1.MasterDataModule,
            message_templates_module_1.MessageTemplatesModule,
            system_status_module_1.SystemModule,
            favorite_property_module_1.FavoritesModule,
            export_module_1.ExportModule,
            team_member_module_1.TeamModule,
            contactUs_module_1.ContactUsModule
        ],
        providers: [
            QueryFailedErrorFilter_1.QueryFailedErrorFilter,
        ],
        exports: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map