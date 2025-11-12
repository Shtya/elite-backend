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
exports.CmsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
let CmsService = class CmsService {
    constructor(staticPagesRepository, pageSectionsRepository, siteSettingsRepository, footerSettingsRepository, homeBackgroundsRepository, partnerLogosRepository, faqGroupsRepository, faqItemsRepository, aboutFeaturesRepository, aboutStepsRepository, aboutStatsRepository, aboutTeamRepository, aboutHighlightsRepository) {
        this.staticPagesRepository = staticPagesRepository;
        this.pageSectionsRepository = pageSectionsRepository;
        this.siteSettingsRepository = siteSettingsRepository;
        this.footerSettingsRepository = footerSettingsRepository;
        this.homeBackgroundsRepository = homeBackgroundsRepository;
        this.partnerLogosRepository = partnerLogosRepository;
        this.faqGroupsRepository = faqGroupsRepository;
        this.faqItemsRepository = faqItemsRepository;
        this.aboutFeaturesRepository = aboutFeaturesRepository;
        this.aboutStepsRepository = aboutStepsRepository;
        this.aboutStatsRepository = aboutStatsRepository;
        this.aboutTeamRepository = aboutTeamRepository;
        this.aboutHighlightsRepository = aboutHighlightsRepository;
    }
    async getAllPages() {
        return this.staticPagesRepository.find({
            relations: ['sections'],
            order: { createdAt: 'ASC' },
        });
    }
    async getPageBySlug(slug) {
        const page = await this.staticPagesRepository.findOne({
            where: { slug: slug },
            relations: ['sections'],
        });
        if (!page) {
            throw new common_1.NotFoundException('Page not found');
        }
        return page;
    }
    async createPage(createStaticPageDto) {
        const page = this.staticPagesRepository.create(createStaticPageDto);
        return this.staticPagesRepository.save(page);
    }
    async updatePage(id, updateStaticPageDto) {
        const page = await this.staticPagesRepository.findOne({ where: { id } });
        if (!page) {
            throw new common_1.NotFoundException('Page not found');
        }
        Object.assign(page, updateStaticPageDto);
        return this.staticPagesRepository.save(page);
    }
    async createSection(pageId, createSectionDto) {
        const page = await this.staticPagesRepository.findOne({ where: { id: pageId } });
        if (!page) {
            throw new common_1.NotFoundException('Page not found');
        }
        const section = this.pageSectionsRepository.create({
            ...createSectionDto,
            page,
        });
        return this.pageSectionsRepository.save(section);
    }
    async updateSection(id, updateSectionDto) {
        const section = await this.pageSectionsRepository.findOne({
            where: { id },
            relations: ['page'],
        });
        if (!section) {
            throw new common_1.NotFoundException('Section not found');
        }
        Object.assign(section, updateSectionDto);
        return this.pageSectionsRepository.save(section);
    }
    async getSiteSettings() {
        const [settings] = await this.siteSettingsRepository.find({
            order: { createdAt: 'DESC' },
            take: 1,
        });
        if (!settings) {
            const created = this.siteSettingsRepository.create({
                customerCount: 0,
                yearsExperience: 0,
                projectCount: 0,
                email: 'info@example.com',
                phoneNumber: '+1234567890',
            });
            return this.siteSettingsRepository.save(created);
        }
        return settings;
    }
    async updateSiteSettings(dto, updatedBy) {
        const [settings] = await this.siteSettingsRepository.find({
            order: { createdAt: 'DESC' },
            take: 1,
        });
        if (!settings) {
            const created = this.siteSettingsRepository.create({
                ...dto,
                updatedBy: updatedBy ?? null,
            });
            return this.siteSettingsRepository.save(created);
        }
        Object.assign(settings, dto);
        if (updatedBy)
            settings.updatedBy = updatedBy;
        return this.siteSettingsRepository.save(settings);
    }
    async getFooterSettings() {
        const [settings] = await this.footerSettingsRepository.find({
            order: { createdAt: 'DESC' },
            take: 1,
        });
        if (!settings) {
            const created = this.footerSettingsRepository.create({});
            return this.footerSettingsRepository.save(created);
        }
        return settings;
    }
    async updateFooterSettings(dto, updatedBy) {
        const [settings] = await this.footerSettingsRepository.find({
            order: { createdAt: 'DESC' },
            take: 1,
        });
        if (!settings) {
            const created = this.footerSettingsRepository.create({
                ...dto,
                updatedBy: updatedBy ?? null,
            });
            return this.footerSettingsRepository.save(created);
        }
        Object.assign(settings, dto);
        if (updatedBy)
            settings.updatedBy = updatedBy;
        return this.footerSettingsRepository.save(settings);
    }
    async createFaqGroup(dto) {
        const exists = await this.faqGroupsRepository.findOne({ where: { title: dto.title } });
        if (exists)
            throw new common_1.BadRequestException('FAQ group title already exists');
        const group = this.faqGroupsRepository.create(dto);
        return this.faqGroupsRepository.save(group);
    }
    async updateFaqGroup(id, dto) {
        const group = await this.faqGroupsRepository.findOne({ where: { id } });
        if (!group)
            throw new common_1.NotFoundException('FAQ group not found');
        Object.assign(group, dto);
        return this.faqGroupsRepository.save(group);
    }
    async createHomeBackground(createHomeBackgroundDto) {
        const background = this.homeBackgroundsRepository.create(createHomeBackgroundDto);
        return this.homeBackgroundsRepository.save(background);
    }
    async createPartnerLogo(createPartnerLogoDto) {
        const logo = this.partnerLogosRepository.create(createPartnerLogoDto);
        return this.partnerLogosRepository.save(logo);
    }
    async createFaqItem(createFaqItemDto) {
        const group = await this.faqGroupsRepository.findOne({
            where: { id: createFaqItemDto.groupId },
        });
        if (!group) {
            throw new common_1.NotFoundException('FAQ group not found');
        }
        const item = this.faqItemsRepository.create({
            ...createFaqItemDto,
            group,
        });
        return this.faqItemsRepository.save(item);
    }
    async createAboutFeature(dto) {
        const entity = this.aboutFeaturesRepository.create(dto);
        return this.aboutFeaturesRepository.save(entity);
    }
    async createAboutStep(dto) {
        const entity = this.aboutStepsRepository.create(dto);
        return this.aboutStepsRepository.save(entity);
    }
    async createAboutHighlight(dto) {
        const entity = this.aboutHighlightsRepository.create(dto);
        return this.aboutHighlightsRepository.save(entity);
    }
    async createAboutStat(dto) {
        const entity = this.aboutStatsRepository.create(dto);
        return this.aboutStatsRepository.save(entity);
    }
    async createAboutTeam(dto) {
        const entity = this.aboutTeamRepository.create(dto);
        return this.aboutTeamRepository.save(entity);
    }
};
exports.CmsService = CmsService;
exports.CmsService = CmsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.StaticPage)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.PageSection)),
    __param(2, (0, typeorm_1.InjectRepository)(global_entity_1.SiteSettings)),
    __param(3, (0, typeorm_1.InjectRepository)(global_entity_1.FooterSettings)),
    __param(4, (0, typeorm_1.InjectRepository)(global_entity_1.HomeBackground)),
    __param(5, (0, typeorm_1.InjectRepository)(global_entity_1.PartnerLogo)),
    __param(6, (0, typeorm_1.InjectRepository)(global_entity_1.FaqGroup)),
    __param(7, (0, typeorm_1.InjectRepository)(global_entity_1.FaqItem)),
    __param(8, (0, typeorm_1.InjectRepository)(global_entity_1.AboutFeature)),
    __param(9, (0, typeorm_1.InjectRepository)(global_entity_1.AboutStep)),
    __param(10, (0, typeorm_1.InjectRepository)(global_entity_1.AboutStat)),
    __param(11, (0, typeorm_1.InjectRepository)(global_entity_1.AboutTeam)),
    __param(12, (0, typeorm_1.InjectRepository)(global_entity_1.AboutHighlight)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CmsService);
//# sourceMappingURL=cms.service.js.map