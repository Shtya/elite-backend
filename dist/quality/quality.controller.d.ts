import { QualityService } from './quality.service';
import { CreateQualityCaseDto, UpdateQualityCaseDto, AddCaseNoteDto } from '../dto/quality.dto';
export declare class QualityController {
    private readonly qualityService;
    constructor(qualityService: QualityService);
    createCase(createQualityCaseDto: CreateQualityCaseDto): Promise<import("src/entities/global.entity").QualityCase>;
    findAllCases(query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").QualityCase>>;
    findCase(id: string): Promise<import("src/entities/global.entity").QualityCase>;
    updateCase(id: string, updateQualityCaseDto: UpdateQualityCaseDto): Promise<import("src/entities/global.entity").QualityCase>;
    addCaseNote(id: string, addCaseNoteDto: AddCaseNoteDto): Promise<import("src/entities/global.entity").QualityCaseNote>;
    assignCase(id: string, assigneeId: number): Promise<import("src/entities/global.entity").QualityCase>;
    closeCase(id: string): Promise<import("src/entities/global.entity").QualityCase>;
    getQualityStats(): Promise<any>;
}
