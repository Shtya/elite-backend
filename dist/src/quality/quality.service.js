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
exports.QualityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let QualityService = class QualityService {
    constructor(qualityCasesRepository, caseNotesRepository, usersRepository, notificationsService) {
        this.qualityCasesRepository = qualityCasesRepository;
        this.caseNotesRepository = caseNotesRepository;
        this.usersRepository = usersRepository;
        this.notificationsService = notificationsService;
    }
    async createCase(createQualityCaseDto) {
        const qualityCase = this.qualityCasesRepository.create(createQualityCaseDto);
        await this.notificationsService.notifyUserType(global_entity_1.UserType.QUALITY, {
            type: global_entity_1.NotificationType.SYSTEM,
            title: 'New Quality Case',
            message: `A new quality case has been created: ${qualityCase.title}`,
            relatedId: qualityCase.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        if (createQualityCaseDto.priority === 'high' || createQualityCaseDto.priority === 'critical') {
            await this.notificationsService.notifyUserType(global_entity_1.UserType.ADMIN, {
                type: global_entity_1.NotificationType.SYSTEM,
                title: 'High Priority Quality Case',
                message: `A high-priority quality case requires attention: ${qualityCase.title}`,
                relatedId: qualityCase.id,
                channel: global_entity_1.NotificationChannel.IN_APP,
            });
        }
        return this.qualityCasesRepository.save(qualityCase);
    }
    async findCase(id) {
        const qualityCase = await this.qualityCasesRepository.findOne({
            where: { id },
            relations: ['assignee', 'notes', 'notes.author'],
        });
        if (!qualityCase) {
            throw new common_1.NotFoundException('Quality case not found');
        }
        return qualityCase;
    }
    async updateCase(id, updateQualityCaseDto) {
        const qualityCase = await this.findCase(id);
        if (updateQualityCaseDto.assigneeId) {
            const assignee = await this.usersRepository.findOne({
                where: { id: updateQualityCaseDto.assigneeId },
            });
            if (!assignee) {
                throw new common_1.NotFoundException('Assignee not found');
            }
            qualityCase.assignee = assignee;
        }
        Object.assign(qualityCase, updateQualityCaseDto);
        return this.qualityCasesRepository.save(qualityCase);
    }
    async addCaseNote(caseId, addCaseNoteDto) {
        const qualityCase = await this.findCase(caseId);
        const note = this.caseNotesRepository.create({
            ...addCaseNoteDto,
            case: qualityCase,
            author: { id: 1 },
        });
        return this.caseNotesRepository.save(note);
    }
    async assignCase(caseId, assigneeId) {
        const qualityCase = await this.findCase(caseId);
        const assignee = await this.usersRepository.findOne({
            where: { id: assigneeId },
        });
        if (!assignee) {
            throw new common_1.NotFoundException('Assignee not found');
        }
        qualityCase.assignee = assignee;
        await this.notificationsService.createNotification({
            userId: assignee.id,
            type: global_entity_1.NotificationType.SYSTEM,
            title: 'You Have Been Assigned to a Quality Case',
            message: `You have been assigned to the quality case: ${qualityCase.title}`,
            relatedId: qualityCase.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        return this.qualityCasesRepository.save(qualityCase);
    }
    async closeCase(caseId) {
        const qualityCase = await this.findCase(caseId);
        qualityCase.status = global_entity_1.QualityCaseStatus.CLOSED;
        return this.qualityCasesRepository.save(qualityCase);
    }
    async getQualityStats() {
        const totalCases = await this.qualityCasesRepository.count();
        const openCases = await this.qualityCasesRepository.count({
            where: { status: global_entity_1.QualityCaseStatus.OPEN },
        });
        const inProgressCases = await this.qualityCasesRepository.count({
            where: { status: global_entity_1.QualityCaseStatus.IN_PROGRESS },
        });
        const resolvedCases = await this.qualityCasesRepository.count({
            where: { status: global_entity_1.QualityCaseStatus.RESOLVED },
        });
        const priorityStats = await this.qualityCasesRepository.createQueryBuilder('case').select('case.priority', 'priority').addSelect('COUNT(*)', 'count').groupBy('case.priority').getRawMany();
        return {
            totalCases,
            openCases,
            inProgressCases,
            resolvedCases,
            priorityStats: priorityStats.reduce((acc, stat) => {
                acc[stat.priority] = parseInt(stat.count);
                return acc;
            }, {}),
        };
    }
};
exports.QualityService = QualityService;
exports.QualityService = QualityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.QualityCase)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.QualityCaseNote)),
    __param(2, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], QualityService);
//# sourceMappingURL=quality.service.js.map