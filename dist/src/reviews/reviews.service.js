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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let ReviewsService = class ReviewsService {
    constructor(customerReviewRepository, agentReviewRepository, customerReviewDimensionRepository, agentReviewDimensionRepository, appointmentRepository, usersRepository, notificationsService) {
        this.customerReviewRepository = customerReviewRepository;
        this.agentReviewRepository = agentReviewRepository;
        this.customerReviewDimensionRepository = customerReviewDimensionRepository;
        this.agentReviewDimensionRepository = agentReviewDimensionRepository;
        this.appointmentRepository = appointmentRepository;
        this.usersRepository = usersRepository;
        this.notificationsService = notificationsService;
    }
    async createCustomerReview(createDto) {
        const appointment = await this.appointmentRepository.findOne({
            where: { id: createDto.appointmentId },
            relations: ['customer', 'agent'],
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        const existingReview = await this.customerReviewRepository.findOne({
            where: { appointment: { id: createDto.appointmentId } },
        });
        if (existingReview) {
            throw new common_1.ConflictException('Review already exists for this appointment');
        }
        const agent = await this.usersRepository.findOne({
            where: { id: createDto.agentId },
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const review = this.customerReviewRepository.create({
            appointment,
            customer: appointment.customer,
            agentId: createDto.agentId,
            rating: createDto.rating,
            reviewText: createDto.reviewText,
        });
        const savedReview = await this.customerReviewRepository.save(review);
        if (createDto.dimensions && createDto.dimensions.length > 0) {
            const dimensions = createDto.dimensions.map(dim => this.customerReviewDimensionRepository.create({
                review: savedReview,
                dimension: dim.dimension,
                score: dim.score,
            }));
            await this.customerReviewDimensionRepository.save(dimensions);
        }
        await this.notificationsService.createNotification({
            userId: createDto.agentId,
            type: global_entity_1.NotificationType.RATING_REQUEST,
            title: 'New Review from a Client',
            message: `You have received a new review from the client ${appointment.customer.fullName}.`,
            relatedId: savedReview.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        await this.notificationsService.notifyUserType(global_entity_1.UserType.ADMIN, {
            type: global_entity_1.NotificationType.SYSTEM,
            title: 'New Agent Review',
            message: `A new review has been submitted for the agent by the client ${appointment.customer.fullName}.`,
            relatedId: savedReview.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        return this.findCustomerReview(savedReview.id);
    }
    async createAgentReview(createDto) {
        const appointment = await this.appointmentRepository.findOne({
            where: { id: createDto.appointmentId },
            relations: ['customer', 'agent'],
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        const existingReview = await this.agentReviewRepository.findOne({
            where: { appointment: { id: createDto.appointmentId } },
        });
        if (existingReview) {
            throw new common_1.ConflictException('Review already exists for this appointment');
        }
        const review = this.agentReviewRepository.create({
            appointment,
            agent: appointment.agent,
            customer: appointment.customer,
            rating: createDto.rating,
            reviewText: createDto.reviewText,
        });
        const savedReview = await this.agentReviewRepository.save(review);
        if (createDto.dimensions && createDto.dimensions.length > 0) {
            const dimensions = createDto.dimensions.map(dim => this.agentReviewDimensionRepository.create({
                review: savedReview,
                dimension: dim.dimension,
                score: dim.score,
            }));
            await this.agentReviewDimensionRepository.save(dimensions);
        }
        await this.notificationsService.createNotification({
            userId: appointment.customer.id,
            type: global_entity_1.NotificationType.RATING_REQUEST,
            title: 'Review from Agent',
            message: `Agent ${appointment.agent.fullName} has submitted a review about your interaction.`,
            relatedId: savedReview.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        return this.findAgentReview(savedReview.id);
    }
    async findCustomerReview(id) {
        const review = await this.customerReviewRepository.findOne({
            where: { id },
            relations: ['appointment', 'customer', 'dimensions'],
        });
        if (!review) {
            throw new common_1.NotFoundException('Customer review not found');
        }
        return review;
    }
    async findAgentReview(id) {
        const review = await this.agentReviewRepository.findOne({
            where: { id },
            relations: ['appointment', 'agent', 'customer', 'dimensions'],
        });
        if (!review) {
            throw new common_1.NotFoundException('Agent review not found');
        }
        return review;
    }
    async updateCustomerReview(id, updateDto) {
        const review = await this.findCustomerReview(id);
        Object.assign(review, updateDto);
        return this.customerReviewRepository.save(review);
    }
    async updateAgentReview(id, updateDto) {
        const review = await this.findAgentReview(id);
        Object.assign(review, updateDto);
        return this.agentReviewRepository.save(review);
    }
    async getAgentReviewSummary(agentId) {
        const reviews = await this.customerReviewRepository.find({
            where: { agentId, isApproved: true },
            relations: ['dimensions'],
        });
        if (reviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                dimensionAverages: {},
            };
        }
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        const dimensionSums = {
            [global_entity_1.RatingDimension.COOPERATION]: 0,
            [global_entity_1.RatingDimension.COMMUNICATION]: 0,
            [global_entity_1.RatingDimension.PROFESSIONALISM]: 0,
            [global_entity_1.RatingDimension.CLARITY]: 0,
        };
        const dimensionCounts = {
            [global_entity_1.RatingDimension.COOPERATION]: 0,
            [global_entity_1.RatingDimension.COMMUNICATION]: 0,
            [global_entity_1.RatingDimension.PROFESSIONALISM]: 0,
            [global_entity_1.RatingDimension.CLARITY]: 0,
        };
        reviews.forEach(review => {
            review.dimensions.forEach(dimension => {
                dimensionSums[dimension.dimension] += dimension.score;
                dimensionCounts[dimension.dimension]++;
            });
        });
        const dimensionAverages = {};
        Object.keys(global_entity_1.RatingDimension).forEach(dimension => {
            const count = dimensionCounts[dimension];
            dimensionAverages[dimension] = count > 0 ? dimensionSums[dimension] / count : 0;
        });
        return {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: reviews.length,
            dimensionAverages,
        };
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.CustomerReview)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.AgentReview)),
    __param(2, (0, typeorm_1.InjectRepository)(global_entity_1.CustomerReviewDimension)),
    __param(3, (0, typeorm_1.InjectRepository)(global_entity_1.AgentReviewDimension)),
    __param(4, (0, typeorm_1.InjectRepository)(global_entity_1.Appointment)),
    __param(5, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map