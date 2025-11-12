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
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let AgentsService = class AgentsService {
    constructor(agentsRepository, usersRepository, appointmentRepo, paymentRepo, reviewRepo, balanceRepo, notificationsService) {
        this.agentsRepository = agentsRepository;
        this.usersRepository = usersRepository;
        this.appointmentRepo = appointmentRepo;
        this.paymentRepo = paymentRepo;
        this.reviewRepo = reviewRepo;
        this.balanceRepo = balanceRepo;
        this.notificationsService = notificationsService;
    }
    async create(createAgentDto, userId) {
        const existingAgent = await this.usersRepository.findOne({
            where: { id: userId },
        });
        if (!existingAgent) {
            throw new common_1.NotFoundException('User not found');
        }
        if (existingAgent.userType == global_entity_1.UserType.AGENT) {
            throw new common_1.ConflictException('Agent already exists for this user');
        }
        const agent = this.agentsRepository.create({
            user: existingAgent,
            city: { id: createAgentDto.cityId },
            identityProofUrl: createAgentDto.identityProof,
            residencyDocumentUrl: createAgentDto.residencyDocument,
        });
        await this.notificationsService.notifyUserType(global_entity_1.UserType.ADMIN, {
            type: global_entity_1.NotificationType.SYSTEM,
            title: 'New Agent Application',
            message: `Agent ${existingAgent.fullName} has submitted a new application and requires approval.`,
            relatedId: agent.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        return this.agentsRepository.save(agent);
    }
    async findAll(query) {
        const { status, cityId, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (cityId)
            where.city = { id: cityId };
        const [data, total] = await this.agentsRepository.findAndCount({
            where,
            relations: ['user', 'city'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { data, total };
    }
    async findOne(id) {
        const agent = await this.agentsRepository.findOne({
            where: { id },
            relations: ['user', 'city', 'updatedBy'],
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        return agent;
    }
    async update(id, updateAgentDto) {
        const agent = await this.findOne(id);
        if (updateAgentDto.cityId) {
            agent.city = { id: updateAgentDto.cityId };
        }
        Object.assign(agent, updateAgentDto);
        return this.agentsRepository.save(agent);
    }
    async remove(id) {
        const agent = await this.findOne(id);
        await this.agentsRepository.remove(agent);
    }
    async approve(id, approveAgentDto) {
        const agent = await this.findOne(id);
        agent.status = approveAgentDto.status;
        if (approveAgentDto.kycNotes) {
            agent.kycNotes = approveAgentDto.kycNotes;
        }
        if (approveAgentDto.status === global_entity_1.AgentApprovalStatus.APPROVED) {
            agent.user.userType = global_entity_1.UserType.AGENT;
            await this.usersRepository.save(agent.user);
        }
        await this.notificationsService.createNotification({
            userId: agent.user.id,
            type: global_entity_1.NotificationType.SYSTEM,
            title: 'Agent Registration Decision',
            message: `Your agent registration request has been ${approveAgentDto.status === 'approved' ? 'approved' : 'rejected'}`,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        return this.agentsRepository.save(agent);
    }
    async findByUserId(userId) {
        const agent = await this.agentsRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user', 'city'],
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found for this user');
        }
        return agent;
    }
    async getDashboard(agentId) {
        const agent = await this.agentsRepository.findOne({ where: { user: { id: agentId } } });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found for this user');
        }
        const totalAppointments = await this.appointmentRepo.count({
            where: { agent: { id: agent.id } },
        });
        const balance = await this.balanceRepo.findOne({ where: { agent: { id: agent.id } } });
        const recentPayments = await this.paymentRepo.find({
            where: { agent: { id: agent.id } },
            order: { createdAt: 'DESC' },
            take: 5,
        });
        const reviews = await this.reviewRepo.find({
            where: { agentId: agent.id },
            order: { createdAt: 'DESC' },
            take: 5,
        });
        const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        const recentAppointments = await this.appointmentRepo.find({
            where: { agent: { id: agent.id } },
            order: { appointmentDate: 'DESC' },
            take: 5,
            relations: ['customer', 'property'],
        });
        return {
            stats: {
                totalAppointments,
                totalEarnings: balance?.totalEarnings || 0,
                pendingBalance: balance?.pendingBalance || 0,
                averageRating,
            },
            recentPayments,
            recentReviews: reviews,
            recentAppointments,
        };
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.Agent)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(global_entity_1.Appointment)),
    __param(3, (0, typeorm_1.InjectRepository)(global_entity_1.AgentPayment)),
    __param(4, (0, typeorm_1.InjectRepository)(global_entity_1.CustomerReview)),
    __param(5, (0, typeorm_1.InjectRepository)(global_entity_1.AgentBalance)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], AgentsService);
//# sourceMappingURL=agents.service.js.map