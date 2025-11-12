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
exports.CampaignsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let CampaignsService = class CampaignsService {
    constructor(campaignsRepository, campaignImagesRepository, usersRepository, notificationsService) {
        this.campaignsRepository = campaignsRepository;
        this.campaignImagesRepository = campaignImagesRepository;
        this.usersRepository = usersRepository;
        this.notificationsService = notificationsService;
    }
    async create(createCampaignDto, userId) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found.`);
        }
        const campaign = this.campaignsRepository.create({
            ...createCampaignDto,
            images: (createCampaignDto.images ?? []).map((url) => ({ imageUrl: url })),
            createdBy: user,
        });
        const savedCampaign = await this.campaignsRepository.save(campaign);
        if (createCampaignDto.images && createCampaignDto.images.length > 0) {
            const images = createCampaignDto.images.map(imageUrl => this.campaignImagesRepository.create({
                campaign: savedCampaign,
                imageUrl,
            }));
            await this.campaignImagesRepository.save(images);
        }
        await this.notificationsService.notifyUserType(global_entity_1.UserType.ADMIN, {
            type: global_entity_1.NotificationType.CAMPAIGN,
            title: 'New Campaign Added',
            message: `A new campaign "${savedCampaign.name}" has been created and requires approval.`,
            relatedId: savedCampaign.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        return this.findOne(savedCampaign.id);
    }
    async findAll(query) {
        const { status, targetChannel, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (targetChannel)
            where.targetChannel = targetChannel;
        const [data, total] = await this.campaignsRepository.findAndCount({
            where,
            relations: ['createdBy', 'images'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { data, total };
    }
    async findOne(id) {
        const campaign = await this.campaignsRepository.findOne({
            where: { id },
            relations: ['createdBy', 'images'],
        });
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        return campaign;
    }
    async update(id, updateCampaignDto) {
        const campaign = await this.findOne(id);
        Object.assign(campaign, updateCampaignDto);
        return this.campaignsRepository.save(campaign);
    }
    async remove(id) {
        const campaign = await this.findOne(id);
        await this.campaignsRepository.remove(campaign);
    }
    async startCampaign(id) {
        const campaign = await this.findOne(id);
        if (campaign.status !== global_entity_1.CampaignStatus.DRAFT && campaign.status !== global_entity_1.CampaignStatus.PAUSED) {
            throw new common_1.BadRequestException('Campaign can only be started from draft or paused status');
        }
        campaign.status = global_entity_1.CampaignStatus.RUNNING;
        await this.notificationsService.notifyUserType(global_entity_1.UserType.MARKETER, {
            type: global_entity_1.NotificationType.CAMPAIGN,
            title: 'New Campaign Started',
            message: `The campaign "${campaign.name}" has been launched.`,
            relatedId: campaign.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        await this.notificationsService.notifyUserType(global_entity_1.UserType.ADMIN, {
            type: global_entity_1.NotificationType.CAMPAIGN,
            title: 'Campaign Launched Successfully',
            message: `The campaign "${campaign.name}" has been successfully launched.`,
            relatedId: campaign.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        return this.campaignsRepository.save(campaign);
    }
    async pauseCampaign(id) {
        const campaign = await this.findOne(id);
        if (campaign.status !== global_entity_1.CampaignStatus.RUNNING) {
            throw new common_1.BadRequestException('Only running campaigns can be paused');
        }
        campaign.status = global_entity_1.CampaignStatus.PAUSED;
        return this.campaignsRepository.save(campaign);
    }
    async stopCampaign(id) {
        const campaign = await this.findOne(id);
        if (campaign.status === global_entity_1.CampaignStatus.COMPLETED || campaign.status === global_entity_1.CampaignStatus.CANCELLED) {
            throw new common_1.BadRequestException('Campaign is already stopped');
        }
        campaign.status = global_entity_1.CampaignStatus.CANCELLED;
        return this.campaignsRepository.save(campaign);
    }
    async addImage(id, imageDto) {
        const campaign = await this.findOne(id);
        const image = this.campaignImagesRepository.create({
            ...imageDto,
            campaign,
        });
        return this.campaignImagesRepository.save(image);
    }
    async getCampaignAnalytics(id) {
        const campaign = await this.findOne(id);
        return {
            id: campaign.id,
            name: campaign.name,
            status: campaign.status,
            actualRecipients: campaign.actualRecipients || 0,
            views: campaign.views || 0,
            responses: campaign.responses || 0,
            engagementRate: campaign.actualRecipients ? (((campaign.responses || 0) / campaign.actualRecipients) * 100).toFixed(2) + '%' : '0%',
        };
    }
};
exports.CampaignsService = CampaignsService;
exports.CampaignsService = CampaignsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.Campaign)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.CampaignImage)),
    __param(2, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], CampaignsService);
//# sourceMappingURL=campaigns.service.js.map