import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaticPage, PageSection, SiteSettings, FooterSettings, HomeBackground, PartnerLogo, FaqGroup, FaqItem, AboutFeature, AboutStep, AboutStat, AboutTeam, StaticPageSlug, User, AboutHighlight } from 'entities/global.entity';
import { CreateStaticPageDto, UpdateStaticPageDto, CreatePageSectionDto, UpdatePageSectionDto, UpdateSiteSettingsDto, UpdateFooterSettingsDto, CreateHomeBackgroundDto, CreatePartnerLogoDto, CreateFaqItemDto, CreateFaqGroupDto, UpdateFaqGroupDto, CreateAboutFeatureDto, CreateAboutStepDto, CreateAboutHighlightDto, CreateAboutStatDto, CreateAboutTeamDto } from '../../dto/cms.dto';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(StaticPage)
    public readonly staticPagesRepository: Repository<StaticPage>, // 👈 expose
    @InjectRepository(PageSection)
    public readonly pageSectionsRepository: Repository<PageSection>, // 👈 expose
    @InjectRepository(SiteSettings)
    public readonly siteSettingsRepository: Repository<SiteSettings>,
    @InjectRepository(FooterSettings)
    public readonly footerSettingsRepository: Repository<FooterSettings>,
    @InjectRepository(HomeBackground)
    public readonly homeBackgroundsRepository: Repository<HomeBackground>, // 👈 expose
    @InjectRepository(PartnerLogo)
    public readonly partnerLogosRepository: Repository<PartnerLogo>, // 👈 expose
    @InjectRepository(FaqGroup)
    public readonly faqGroupsRepository: Repository<FaqGroup>, // 👈 expose
    @InjectRepository(FaqItem)
    public readonly faqItemsRepository: Repository<FaqItem>, // 👈 expose
    @InjectRepository(AboutFeature)
    public readonly aboutFeaturesRepository: Repository<AboutFeature>, // 👈 expose
    @InjectRepository(AboutStep)
    public readonly aboutStepsRepository: Repository<AboutStep>, // 👈 expose
    @InjectRepository(AboutStat)
    public readonly aboutStatsRepository: Repository<AboutStat>, // 👈 expose
    @InjectRepository(AboutTeam)
    public readonly aboutTeamRepository: Repository<AboutTeam>, // 👈 expose
    @InjectRepository(AboutHighlight)
    public readonly aboutHighlightsRepository: Repository<AboutHighlight>, // 👈 expose
  ) {}

  // Static Pages
  async getAllPages(): Promise<StaticPage[]> {
    return this.staticPagesRepository.find({
      relations: ['sections'],
      order: { createdAt: 'ASC' },
    });
  }

  async getPageBySlug(slug: string): Promise<StaticPage> {
    const page = await this.staticPagesRepository.findOne({
      where: { slug: slug as StaticPageSlug },
      relations: ['sections'],
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async createPage(createStaticPageDto: CreateStaticPageDto): Promise<StaticPage> {
    const page = this.staticPagesRepository.create(createStaticPageDto);
    return this.staticPagesRepository.save(page);
  }

  async updatePage(id: number, updateStaticPageDto: UpdateStaticPageDto): Promise<StaticPage> {
    const page = await this.staticPagesRepository.findOne({ where: { id } });
    if (!page) {
      throw new NotFoundException('Page not found');
    }

    Object.assign(page, updateStaticPageDto);
    return this.staticPagesRepository.save(page);
  }

  // Page Sections
  async createSection(pageId: number, createSectionDto: CreatePageSectionDto): Promise<PageSection> {
    const page = await this.staticPagesRepository.findOne({ where: { id: pageId } });
    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const section = this.pageSectionsRepository.create({
      ...createSectionDto,
      page,
    });

    return this.pageSectionsRepository.save(section);
  }

  async updateSection(id: number, updateSectionDto: UpdatePageSectionDto): Promise<PageSection> {
    const section = await this.pageSectionsRepository.findOne({
      where: { id },
      relations: ['page'],
    });
    if (!section) {
      throw new NotFoundException('Section not found');
    }

    Object.assign(section, updateSectionDto);
    return this.pageSectionsRepository.save(section);
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings> {
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

  async updateSiteSettings(dto: UpdateSiteSettingsDto, updatedBy?: User): Promise<SiteSettings> {
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
    if (updatedBy) settings.updatedBy = updatedBy;
    return this.siteSettingsRepository.save(settings);
  }

  async getFooterSettings(): Promise<FooterSettings> {
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

  async updateFooterSettings(
    dto: UpdateFooterSettingsDto,
    updatedBy?: User, // pass the current user if you track it
  ): Promise<FooterSettings> {
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
    if (updatedBy) settings.updatedBy = updatedBy;

    return this.footerSettingsRepository.save(settings);
  }

  async createFaqGroup(dto: CreateFaqGroupDto): Promise<FaqGroup> {
    // Optional: prevent duplicate titles
    const exists = await this.faqGroupsRepository.findOne({ where: { title: dto.title } });
    if (exists) throw new BadRequestException('FAQ group title already exists');

    const group = this.faqGroupsRepository.create(dto);
    return this.faqGroupsRepository.save(group);
  }

  async updateFaqGroup(id: number, dto: UpdateFaqGroupDto): Promise<FaqGroup> {
    const group = await this.faqGroupsRepository.findOne({ where: { id } });
    if (!group) throw new NotFoundException('FAQ group not found');

    Object.assign(group, dto);
    return this.faqGroupsRepository.save(group);
  }

  async createHomeBackground(createHomeBackgroundDto: CreateHomeBackgroundDto): Promise<HomeBackground> {
    const background = this.homeBackgroundsRepository.create(createHomeBackgroundDto);
    return this.homeBackgroundsRepository.save(background);
  }

  async createPartnerLogo(createPartnerLogoDto: CreatePartnerLogoDto): Promise<PartnerLogo> {
    const logo = this.partnerLogosRepository.create(createPartnerLogoDto);
    return this.partnerLogosRepository.save(logo);
  }

  async createFaqItem(createFaqItemDto: CreateFaqItemDto): Promise<FaqItem> {
    const group = await this.faqGroupsRepository.findOne({
      where: { id: createFaqItemDto.groupId },
    });
    if (!group) {
      throw new NotFoundException('FAQ group not found');
    }

    const item = this.faqItemsRepository.create({
      ...createFaqItemDto,
      group,
    });

    return this.faqItemsRepository.save(item);
  }

  async createAboutFeature(dto: CreateAboutFeatureDto) {
    const entity = this.aboutFeaturesRepository.create(dto);
    return this.aboutFeaturesRepository.save(entity);
  }

  async createAboutStep(dto: CreateAboutStepDto) {
    const entity = this.aboutStepsRepository.create(dto);
    return this.aboutStepsRepository.save(entity);
  }

  async createAboutHighlight(dto: CreateAboutHighlightDto) {
    const entity = this.aboutHighlightsRepository.create(dto);
    return this.aboutHighlightsRepository.save(entity);
  }

  async createAboutStat(dto: CreateAboutStatDto) {
    const entity = this.aboutStatsRepository.create(dto);
    return this.aboutStatsRepository.save(entity);
  }

  async createAboutTeam(dto: CreateAboutTeamDto) {
    const entity = this.aboutTeamRepository.create(dto);
    return this.aboutTeamRepository.save(entity);
  }
}
