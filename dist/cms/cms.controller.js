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
exports.CmsController = void 0;
const common_1 = require("@nestjs/common");
const cms_service_1 = require("./cms.service");
const cms_dto_1 = require("../dto/cms.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
const crud_service_1 = require("../../common/crud.service");
let CmsController = class CmsController {
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    getAllPages(query) {
        const filters = {};
        if (query.slug)
            filters.slug = query.slug;
        if (query.title)
            filters.title = query.title;
        return crud_service_1.CRUD.findAll(this.cmsService.staticPagesRepository, 'static_page', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'ASC', ['sections'], ['title', 'slug'], filters);
    }
    listSections(pageId, query) {
        const filters = { page: { id: Number(pageId) } };
        return crud_service_1.CRUD.findAll(this.cmsService.pageSectionsRepository, 'page_section', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'ASC', ['page'], ['title', 'key'], filters);
    }
    getPageBySlug(slug) {
        return this.cmsService.getPageBySlug(slug);
    }
    createPage(createStaticPageDto) {
        return this.cmsService.createPage(createStaticPageDto);
    }
    updatePage(id, updateStaticPageDto) {
        return this.cmsService.updatePage(+id, updateStaticPageDto);
    }
    createSection(pageId, createSectionDto) {
        return this.cmsService.createSection(+pageId, createSectionDto);
    }
    updateSection(id, updateSectionDto) {
        return this.cmsService.updateSection(+id, updateSectionDto);
    }
    getSiteSettings() {
        return this.cmsService.getSiteSettings();
    }
    updateSiteSettings(dto) {
        return this.cmsService.updateSiteSettings(dto);
    }
    getFooterSettings() {
        return this.cmsService.getFooterSettings();
    }
    updateFooterSettings(updateFooterSettingsDto) {
        return this.cmsService.updateFooterSettings(updateFooterSettingsDto);
    }
    getHomeBackgrounds(query) {
        return crud_service_1.CRUD.findAll(this.cmsService.homeBackgroundsRepository, 'home_background', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'DESC', [], ['title', 'imageUrl'], {});
    }
    createHomeBackground(createHomeBackgroundDto) {
        return this.cmsService.createHomeBackground(createHomeBackgroundDto);
    }
    deleteHomeBackground(id) {
        return crud_service_1.CRUD.softDelete(this.cmsService.homeBackgroundsRepository, 'home_background', id);
    }
    getPartnerLogos(query) {
        return crud_service_1.CRUD.findAll(this.cmsService.partnerLogosRepository, 'partner_logo', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'ASC', [], ['name', 'logoUrl'], {});
    }
    createPartnerLogo(createPartnerLogoDto) {
        return this.cmsService.createPartnerLogo(createPartnerLogoDto);
    }
    deletePartnerLogo(id) {
        return crud_service_1.CRUD.softDelete(this.cmsService.partnerLogosRepository, 'partner_logo', id);
    }
    createFaqGroup(dto) {
        return this.cmsService.createFaqGroup(dto);
    }
    updateFaqGroup(id, dto) {
        return this.cmsService.updateFaqGroup(id, dto);
    }
    deleteFaqGroup(id) {
        return crud_service_1.CRUD.softDelete(this.cmsService.faqGroupsRepository, 'faq_group', id);
    }
    getFaqGroups(query) {
        const filters = {};
        if (query.groupId)
            filters.id = Number(query.groupId);
        return crud_service_1.CRUD.findAll(this.cmsService.faqGroupsRepository, 'faq_group', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'ASC', ['items'], ['title'], filters);
    }
    createFaqItem(createFaqItemDto) {
        return this.cmsService.createFaqItem(createFaqItemDto);
    }
    deleteFaqItem(id) {
        return crud_service_1.CRUD.softDelete(this.cmsService.faqItemsRepository, 'faq_item', id);
    }
    createAboutFeature(dto) {
        return this.cmsService.createAboutFeature(dto);
    }
    createAboutStep(dto) {
        return this.cmsService.createAboutStep(dto);
    }
    createAboutHighlight(dto) {
        return this.cmsService.createAboutHighlight(dto);
    }
    createAboutStat(dto) {
        return this.cmsService.createAboutStat(dto);
    }
    createAboutTeam(dto) {
        return this.cmsService.createAboutTeam(dto);
    }
    deleteAboutHighlight(id) {
        return crud_service_1.CRUD.softDelete(this.cmsService.aboutHighlightsRepository, 'about_highlight', id);
    }
    getAboutHighlights(query) {
        return crud_service_1.CRUD.findAll(this.cmsService.aboutHighlightsRepository, 'about_highlight', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'ASC', [], ['title', 'description'], {});
    }
    getAboutFeatures(query) {
        return crud_service_1.CRUD.findAll(this.cmsService.aboutFeaturesRepository, 'about_feature', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'ASC', [], ['title', 'description'], {});
    }
    deleteAboutFeature(id) {
        return crud_service_1.CRUD.softDelete(this.cmsService.aboutFeaturesRepository, 'about_feature', id);
    }
    getAboutSteps(query) {
        return crud_service_1.CRUD.findAll(this.cmsService.aboutStepsRepository, 'about_step', query.q || query.search, query.page, query.limit, query.sortBy ?? 'stepNumber', query.sortOrder ?? 'ASC', [], ['title', 'description'], {});
    }
    deleteAboutStep(id) {
        return crud_service_1.CRUD.softDelete(this.cmsService.aboutStepsRepository, 'about_step', id);
    }
    getAboutStats(query) {
        return crud_service_1.CRUD.findAll(this.cmsService.aboutStatsRepository, 'about_stat', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'ASC', [], ['label'], {});
    }
    deleteAboutStat(id) {
        return crud_service_1.CRUD.softDelete(this.cmsService.aboutStatsRepository, 'about_stat', id);
    }
    getAboutTeam(query) {
        return crud_service_1.CRUD.findAll(this.cmsService.aboutTeamRepository, 'about_team', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'ASC', [], ['name', 'role'], {});
    }
    deleteAboutTeam(id) {
        return crud_service_1.CRUD.softDelete(this.cmsService.aboutTeamRepository, 'about_team', id);
    }
};
exports.CmsController = CmsController;
__decorate([
    (0, common_1.Get)('pages'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getAllPages", null);
__decorate([
    (0, common_1.Get)('pages/:pageId/sections'),
    __param(0, (0, common_1.Param)('pageId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "listSections", null);
__decorate([
    (0, common_1.Get)('pages/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getPageBySlug", null);
__decorate([
    (0, common_1.Post)('pages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cms_dto_1.CreateStaticPageDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "createPage", null);
__decorate([
    (0, common_1.Patch)('pages/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cms_dto_1.UpdateStaticPageDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "updatePage", null);
__decorate([
    (0, common_1.Post)('pages/:pageId/sections'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('pageId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cms_dto_1.CreatePageSectionDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "createSection", null);
__decorate([
    (0, common_1.Patch)('sections/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cms_dto_1.UpdatePageSectionDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Get)('settings/site'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getSiteSettings", null);
__decorate([
    (0, common_1.Patch)('settings/site'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cms_dto_1.UpdateSiteSettingsDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "updateSiteSettings", null);
__decorate([
    (0, common_1.Get)('settings/footer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getFooterSettings", null);
__decorate([
    (0, common_1.Patch)('settings/footer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cms_dto_1.UpdateFooterSettingsDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "updateFooterSettings", null);
__decorate([
    (0, common_1.Get)('home/backgrounds'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getHomeBackgrounds", null);
__decorate([
    (0, common_1.Post)('home/backgrounds'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cms_dto_1.CreateHomeBackgroundDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "createHomeBackground", null);
__decorate([
    (0, common_1.Delete)('home/backgrounds/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "deleteHomeBackground", null);
__decorate([
    (0, common_1.Get)('home/partners'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getPartnerLogos", null);
__decorate([
    (0, common_1.Post)('home/partners'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cms_dto_1.CreatePartnerLogoDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "createPartnerLogo", null);
__decorate([
    (0, common_1.Delete)('home/partners/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "deletePartnerLogo", null);
__decorate([
    (0, common_1.Post)('faq/groups'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cms_dto_1.CreateFaqGroupDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "createFaqGroup", null);
__decorate([
    (0, common_1.Patch)('faq/groups/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, cms_dto_1.UpdateFaqGroupDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "updateFaqGroup", null);
__decorate([
    (0, common_1.Delete)('faq/groups/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "deleteFaqGroup", null);
__decorate([
    (0, common_1.Get)('faq'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getFaqGroups", null);
__decorate([
    (0, common_1.Post)('faq/items'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cms_dto_1.CreateFaqItemDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "createFaqItem", null);
__decorate([
    (0, common_1.Delete)('faq/items/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "deleteFaqItem", null);
__decorate([
    (0, common_1.Post)('about/features'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cms_dto_1.CreateAboutFeatureDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "createAboutFeature", null);
__decorate([
    (0, common_1.Post)('about/steps'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cms_dto_1.CreateAboutStepDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "createAboutStep", null);
__decorate([
    (0, common_1.Post)('about/highlights'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cms_dto_1.CreateAboutHighlightDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "createAboutHighlight", null);
__decorate([
    (0, common_1.Post)('about/stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cms_dto_1.CreateAboutStatDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "createAboutStat", null);
__decorate([
    (0, common_1.Post)('about/team'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cms_dto_1.CreateAboutTeamDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "createAboutTeam", null);
__decorate([
    (0, common_1.Delete)('about/highlights/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "deleteAboutHighlight", null);
__decorate([
    (0, common_1.Get)('about/highlights'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getAboutHighlights", null);
__decorate([
    (0, common_1.Get)('about/features'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getAboutFeatures", null);
__decorate([
    (0, common_1.Delete)('about/features/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "deleteAboutFeature", null);
__decorate([
    (0, common_1.Get)('about/steps'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getAboutSteps", null);
__decorate([
    (0, common_1.Delete)('about/steps/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "deleteAboutStep", null);
__decorate([
    (0, common_1.Get)('about/stats'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getAboutStats", null);
__decorate([
    (0, common_1.Delete)('about/stats/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "deleteAboutStat", null);
__decorate([
    (0, common_1.Get)('about/team'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getAboutTeam", null);
__decorate([
    (0, common_1.Delete)('about/team/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "deleteAboutTeam", null);
exports.CmsController = CmsController = __decorate([
    (0, common_1.Controller)('cms'),
    __metadata("design:paramtypes", [cms_service_1.CmsService])
], CmsController);
//# sourceMappingURL=cms.controller.js.map