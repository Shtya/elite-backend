import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto, UpdateCampaignDto, CampaignImageDto } from '../dto/campaigns.dto';
export declare class CampaignsController {
    private readonly campaignsService;
    constructor(campaignsService: CampaignsService);
    create(createCampaignDto: CreateCampaignDto, req: any): Promise<import("src/entities/global.entity").Campaign>;
    findAll(query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").Campaign>>;
    findOne(id: string): Promise<import("src/entities/global.entity").Campaign>;
    update(id: string, updateCampaignDto: UpdateCampaignDto): Promise<import("src/entities/global.entity").Campaign>;
    remove(id: string): Promise<void>;
    startCampaign(id: string): Promise<import("src/entities/global.entity").Campaign>;
    pauseCampaign(id: string): Promise<import("src/entities/global.entity").Campaign>;
    stopCampaign(id: string): Promise<import("src/entities/global.entity").Campaign>;
    addImage(id: string, campaignImageDto: CampaignImageDto): Promise<import("src/entities/global.entity").CampaignImage>;
    getCampaignAnalytics(id: string): Promise<any>;
}
