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
exports.ExportService = exports.moduleRepoMap = exports.ModuleName = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const ExcelJS = require("exceljs");
const global_entity_1 = require("../entities/global.entity");
var ModuleName;
(function (ModuleName) {
    ModuleName["USER"] = "user";
    ModuleName["ROLE"] = "role";
    ModuleName["PERMISSION"] = "permission";
    ModuleName["ROLE_PERMISSION"] = "role_permission";
    ModuleName["USER_ROLE"] = "user_role";
    ModuleName["CITY"] = "city";
    ModuleName["AREA"] = "area";
    ModuleName["PROPERTY_TYPE"] = "property_type";
    ModuleName["PROPERTY"] = "property";
    ModuleName["PROPERTY_MEDIA"] = "property_media";
    ModuleName["FAVORITE_PROPERTY"] = "favorite_property";
    ModuleName["PROPERTY_LISTING_REQUEST"] = "property_listing_request";
    ModuleName["PROPERTY_LISTING_REQUEST_ATTACHMENT"] = "property_listing_request_attachment";
    ModuleName["AGENT"] = "agent";
    ModuleName["AGENT_AVAILABILITY"] = "agent_availability";
    ModuleName["AGENT_PREFERRED_PROPERTY"] = "agent_preferred_property";
    ModuleName["APPOINTMENT"] = "appointment";
    ModuleName["APPOINTMENT_STATUS_HISTORY"] = "appointment_status_history";
    ModuleName["CUSTOMER_TIMELINE_EVENT"] = "customer_timeline_event";
    ModuleName["CALENDAR_ACCOUNT"] = "calendar_account";
    ModuleName["APPOINTMENT_CALENDAR_SYNC"] = "appointment_calendar_sync";
    ModuleName["CUSTOMER_REVIEW"] = "customer_review";
    ModuleName["CUSTOMER_REVIEW_DIMENSION"] = "customer_review_dimension";
    ModuleName["AGENT_REVIEW"] = "agent_review";
    ModuleName["AGENT_REVIEW_DIMENSION"] = "agent_review_dimension";
    ModuleName["AGENT_PAYMENT"] = "agent_payment";
    ModuleName["AGENT_BALANCE"] = "agent_balance";
    ModuleName["AGENT_PAYOUT_ACCOUNT"] = "agent_payout_account";
    ModuleName["AUTH_SESSION"] = "auth_session";
    ModuleName["CAMPAIGN"] = "campaign";
    ModuleName["CAMPAIGN_IMAGE"] = "campaign_image";
    ModuleName["MESSAGE_TEMPLATE"] = "message_template";
    ModuleName["REFERRAL_PARTNER"] = "referral_partner";
    ModuleName["VISITOR_TRACKING"] = "visitor_tracking";
    ModuleName["CONVERSION"] = "conversion";
    ModuleName["NOTIFICATION"] = "notification";
    ModuleName["SITE_SETTINGS"] = "site_settings";
    ModuleName["FOOTER_SETTINGS"] = "footer_settings";
    ModuleName["STATIC_PAGE"] = "static_page";
    ModuleName["PAGE_SECTION"] = "page_section";
    ModuleName["HOME_BACKGROUND"] = "home_background";
    ModuleName["PARTNER_LOGO"] = "partner_logo";
    ModuleName["HOME_COMMON_QUESTION"] = "home_common_question";
    ModuleName["ABOUT_FEATURE"] = "about_feature";
    ModuleName["ABOUT_STEP"] = "about_step";
    ModuleName["ABOUT_HIGHLIGHT"] = "about_highlight";
    ModuleName["ABOUT_STAT"] = "about_stat";
    ModuleName["ABOUT_TEAM"] = "about_team";
    ModuleName["FAQ_GROUP"] = "faq_group";
    ModuleName["FAQ_ITEM"] = "faq_item";
    ModuleName["PRIVACY_GROUP"] = "privacy_group";
    ModuleName["PRIVACY_ITEM"] = "privacy_item";
    ModuleName["TERMS_BLOCK"] = "terms_block";
    ModuleName["QUALITY_CASE"] = "quality_case";
    ModuleName["QUALITY_CASE_NOTE"] = "quality_case_note";
    ModuleName["REPORT_SNAPSHOT"] = "report_snapshot";
})(ModuleName || (exports.ModuleName = ModuleName = {}));
exports.moduleRepoMap = {
    [ModuleName.USER]: global_entity_1.User,
    [ModuleName.ROLE]: global_entity_1.Role,
    [ModuleName.PERMISSION]: global_entity_1.Permission,
    [ModuleName.ROLE_PERMISSION]: global_entity_1.RolePermission,
    [ModuleName.USER_ROLE]: global_entity_1.UserRole,
    [ModuleName.CITY]: global_entity_1.City,
    [ModuleName.AREA]: global_entity_1.Area,
    [ModuleName.PROPERTY_TYPE]: global_entity_1.PropertyType,
    [ModuleName.PROPERTY]: global_entity_1.Property,
    [ModuleName.PROPERTY_MEDIA]: global_entity_1.PropertyMedia,
    [ModuleName.FAVORITE_PROPERTY]: global_entity_1.FavoriteProperty,
    [ModuleName.PROPERTY_LISTING_REQUEST]: global_entity_1.PropertyListingRequest,
    [ModuleName.PROPERTY_LISTING_REQUEST_ATTACHMENT]: global_entity_1.PropertyListingRequestAttachment,
    [ModuleName.AGENT]: global_entity_1.Agent,
    [ModuleName.AGENT_AVAILABILITY]: global_entity_1.AgentAvailability,
    [ModuleName.AGENT_PREFERRED_PROPERTY]: global_entity_1.AgentPreferredProperty,
    [ModuleName.APPOINTMENT]: global_entity_1.Appointment,
    [ModuleName.APPOINTMENT_STATUS_HISTORY]: global_entity_1.AppointmentStatusHistory,
    [ModuleName.CUSTOMER_TIMELINE_EVENT]: global_entity_1.CustomerTimelineEvent,
    [ModuleName.CALENDAR_ACCOUNT]: global_entity_1.CalendarAccount,
    [ModuleName.APPOINTMENT_CALENDAR_SYNC]: global_entity_1.AppointmentCalendarSync,
    [ModuleName.CUSTOMER_REVIEW]: global_entity_1.CustomerReview,
    [ModuleName.CUSTOMER_REVIEW_DIMENSION]: global_entity_1.CustomerReviewDimension,
    [ModuleName.AGENT_REVIEW]: global_entity_1.AgentReview,
    [ModuleName.AGENT_REVIEW_DIMENSION]: global_entity_1.AgentReviewDimension,
    [ModuleName.AGENT_PAYMENT]: global_entity_1.AgentPayment,
    [ModuleName.AGENT_BALANCE]: global_entity_1.AgentBalance,
    [ModuleName.AGENT_PAYOUT_ACCOUNT]: global_entity_1.AgentPayoutAccount,
    [ModuleName.AUTH_SESSION]: global_entity_1.AuthSession,
    [ModuleName.CAMPAIGN]: global_entity_1.Campaign,
    [ModuleName.CAMPAIGN_IMAGE]: global_entity_1.CampaignImage,
    [ModuleName.MESSAGE_TEMPLATE]: global_entity_1.MessageTemplate,
    [ModuleName.REFERRAL_PARTNER]: global_entity_1.ReferralPartner,
    [ModuleName.VISITOR_TRACKING]: global_entity_1.VisitorTracking,
    [ModuleName.CONVERSION]: global_entity_1.Conversion,
    [ModuleName.NOTIFICATION]: global_entity_1.Notification,
    [ModuleName.SITE_SETTINGS]: global_entity_1.SiteSettings,
    [ModuleName.FOOTER_SETTINGS]: global_entity_1.FooterSettings,
    [ModuleName.STATIC_PAGE]: global_entity_1.StaticPage,
    [ModuleName.PAGE_SECTION]: global_entity_1.PageSection,
    [ModuleName.HOME_BACKGROUND]: global_entity_1.HomeBackground,
    [ModuleName.PARTNER_LOGO]: global_entity_1.PartnerLogo,
    [ModuleName.HOME_COMMON_QUESTION]: global_entity_1.HomeCommonQuestion,
    [ModuleName.ABOUT_FEATURE]: global_entity_1.AboutFeature,
    [ModuleName.ABOUT_STEP]: global_entity_1.AboutStep,
    [ModuleName.ABOUT_HIGHLIGHT]: global_entity_1.AboutHighlight,
    [ModuleName.ABOUT_STAT]: global_entity_1.AboutStat,
    [ModuleName.ABOUT_TEAM]: global_entity_1.AboutTeam,
    [ModuleName.FAQ_GROUP]: global_entity_1.FaqGroup,
    [ModuleName.FAQ_ITEM]: global_entity_1.FaqItem,
    [ModuleName.PRIVACY_GROUP]: global_entity_1.PrivacyGroup,
    [ModuleName.PRIVACY_ITEM]: global_entity_1.PrivacyItem,
    [ModuleName.TERMS_BLOCK]: global_entity_1.TermsBlock,
    [ModuleName.QUALITY_CASE]: global_entity_1.QualityCase,
    [ModuleName.QUALITY_CASE_NOTE]: global_entity_1.QualityCaseNote,
    [ModuleName.REPORT_SNAPSHOT]: global_entity_1.ReportSnapshot,
};
let ExportService = class ExportService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async exportEntityToExcel(dataSource, moduleName, res, options = {}) {
        const normalized = (moduleName || '').toLowerCase().trim();
        const entityClass = exports.moduleRepoMap[normalized];
        if (!entityClass) {
            const allowed = Object.values(ModuleName);
            throw new common_1.BadRequestException({
                message: `Invalid module "${moduleName}". Allowed modules are: ${allowed.join(', ')}`,
                allowedModules: allowed,
            });
        }
        const repository = dataSource.getRepository(entityClass);
        const rawLimit = options.exportLimit;
        let take;
        if (rawLimit === 'all' || (typeof rawLimit === 'string' && rawLimit.toLowerCase().trim() === 'all')) {
            take = undefined;
        }
        else if (rawLimit === undefined || rawLimit === null || rawLimit === '') {
            take = 10;
        }
        else {
            const n = typeof rawLimit === 'number' ? rawLimit : Number(rawLimit);
            take = Number.isFinite(n) && n > 0 ? Math.floor(n) : 10;
        }
        const findOptions = {};
        if (take !== undefined)
            findOptions.take = take;
        const entities = await repository.find(findOptions);
        const serialize = (v) => {
            if (v === null || v === undefined)
                return '';
            if (typeof v !== 'object')
                return v;
            if ('id' in v && typeof v.id !== 'object')
                return v.id;
            try {
                return JSON.stringify(v);
            }
            catch {
                return String(v);
            }
        };
        const rows = entities.map(e => {
            const plain = {};
            Object.entries(e).forEach(([k, v]) => {
                if (k === 'deletedAt' || k === 'updatedAt')
                    return;
                plain[k] = serialize(v);
            });
            return plain;
        });
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');
        const columns = options.columns ?? (rows.length > 0 ? Object.keys(rows[0]).map(key => ({ header: key, key, width: 20 })) : []);
        worksheet.columns = columns;
        rows.forEach(r => {
            const row = worksheet.addRow(r);
            row.eachCell(cell => {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        });
        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCCC' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
        worksheet.columns.forEach(column => {
            let maxLength = 10;
            column.eachCell({ includeEmpty: true }, cell => {
                const val = cell.value ? String(cell.value) : '';
                if (val.length > maxLength)
                    maxLength = val.length;
            });
            column.width = Math.min(maxLength + 2, 60);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${normalized}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    }
    async exportRowsToExcel(res, rows, options = {}) {
        const ExcelJS = await Promise.resolve().then(() => require('exceljs'));
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(options.sheetName || 'Report');
        const columns = options.columns ?? (rows.length > 0 ? Object.keys(rows[0]).map(key => ({ header: key, key, width: 20 })) : []);
        worksheet.columns = columns;
        rows.forEach(r => {
            const row = worksheet.addRow(r);
            row.eachCell(cell => {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        });
        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCCC' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
        worksheet.columns.forEach(col => {
            let max = 10;
            col.eachCell({ includeEmpty: true }, cell => {
                const v = cell.value ? String(cell.value) : '';
                if (v.length > max)
                    max = v.length;
            });
            col.width = Math.min(max + 2, 60);
        });
        const fileName = (options.fileName || 'export') + '.xlsx';
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        await workbook.xlsx.write(res);
        res.end();
    }
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ExportService);
//# sourceMappingURL=export.service.js.map