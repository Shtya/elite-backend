import { Repository } from 'typeorm';
import { QualityCase, QualityCaseNote, User } from 'src/entities/global.entity';
import { CreateQualityCaseDto, UpdateQualityCaseDto, AddCaseNoteDto } from '../dto/quality.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
export declare class QualityService {
    readonly qualityCasesRepository: Repository<QualityCase>;
    private caseNotesRepository;
    private usersRepository;
    private notificationsService;
    constructor(qualityCasesRepository: Repository<QualityCase>, caseNotesRepository: Repository<QualityCaseNote>, usersRepository: Repository<User>, notificationsService: NotificationsService);
    createCase(createQualityCaseDto: CreateQualityCaseDto): Promise<QualityCase>;
    findCase(id: number): Promise<QualityCase>;
    updateCase(id: number, updateQualityCaseDto: UpdateQualityCaseDto): Promise<QualityCase>;
    addCaseNote(caseId: number, addCaseNoteDto: AddCaseNoteDto): Promise<QualityCaseNote>;
    assignCase(caseId: number, assigneeId: number): Promise<QualityCase>;
    closeCase(caseId: number): Promise<QualityCase>;
    getQualityStats(): Promise<any>;
}
