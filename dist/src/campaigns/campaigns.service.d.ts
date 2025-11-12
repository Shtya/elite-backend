import { Repository } from 'typeorm';
import { Campaign, CampaignImage, User } from 'src/entities/global.entity';
import { CreateCampaignDto, UpdateCampaignDto, CampaignQueryDto, CampaignImageDto } from '../dto/campaigns.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
export declare class CampaignsService {
    readonly campaignsRepository: Repository<Campaign>;
    private campaignImagesRepository;
    private usersRepository;
    private notificationsService;
    constructor(campaignsRepository: Repository<Campaign>, campaignImagesRepository: Repository<CampaignImage>, usersRepository: Repository<User>, notificationsService: NotificationsService);
    create(createCampaignDto: CreateCampaignDto, userId: number): Promise<Campaign>;
    findAll(query: CampaignQueryDto): Promise<{
        data: Campaign[];
        total: number;
    }>;
    findOne(id: number): Promise<Campaign>;
    update(id: number, updateCampaignDto: UpdateCampaignDto): Promise<Campaign>;
    remove(id: number): Promise<void>;
    startCampaign(id: number): Promise<Campaign>;
    pauseCampaign(id: number): Promise<Campaign>;
    stopCampaign(id: number): Promise<Campaign>;
    addImage(id: number, imageDto: CampaignImageDto): Promise<CampaignImage>;
    getCampaignAnalytics(id: number): Promise<any>;
}
