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
exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const reviews_service_1 = require("./reviews.service");
const reviews_dto_1 = require("../dto/reviews.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
const crud_service_1 = require("../../common/crud.service");
let ReviewsController = class ReviewsController {
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    createCustomerReview(createCustomerReviewDto) {
        return this.reviewsService.createCustomerReview(createCustomerReviewDto);
    }
    createAgentReview(createAgentReviewDto) {
        return this.reviewsService.createAgentReview(createAgentReviewDto);
    }
    findAllCustomerReviews(query) {
        const filters = {};
        if (typeof query.agentId !== 'undefined') {
            filters.agentId = Number(query.agentId);
        }
        if (typeof query.isApproved !== 'undefined') {
            filters.isApproved = query.isApproved === 'true' ? true : query.isApproved === 'false' ? false : query.isApproved;
        }
        return crud_service_1.CRUD.findAll(this.reviewsService.customerReviewRepository, 'customer_review', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'DESC', ['appointment', 'customer', 'dimensions'], [], filters);
    }
    findAllAgentReviews(query) {
        const filters = {};
        if (typeof query.customerId !== 'undefined') {
            filters.customer = { id: Number(query.customerId) };
        }
        return crud_service_1.CRUD.findAll(this.reviewsService.agentReviewRepository, 'agent_review', query.q || query.search, query.page, query.limit, query.sortBy ?? 'createdAt', query.sortOrder ?? 'DESC', ['appointment', 'agent', 'customer', 'dimensions'], [], filters);
    }
    findCustomerReview(id) {
        return this.reviewsService.findCustomerReview(+id);
    }
    findAgentReview(id) {
        return this.reviewsService.findAgentReview(+id);
    }
    updateCustomerReview(id, updateReviewDto) {
        return this.reviewsService.updateCustomerReview(+id, updateReviewDto);
    }
    updateAgentReview(id, updateReviewDto) {
        return this.reviewsService.updateAgentReview(+id, updateReviewDto);
    }
    getAgentReviewSummary(agentId) {
        return this.reviewsService.getAgentReviewSummary(+agentId);
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Post)('customer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reviews_dto_1.CreateCustomerReviewDto]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "createCustomerReview", null);
__decorate([
    (0, common_1.Post)('agent'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reviews_dto_1.CreateAgentReviewDto]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "createAgentReview", null);
__decorate([
    (0, common_1.Get)('customer'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "findAllCustomerReviews", null);
__decorate([
    (0, common_1.Get)('agent'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.CUSTOMER, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "findAllAgentReviews", null);
__decorate([
    (0, common_1.Get)('customer/:id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT, global_entity_1.UserType.CUSTOMER, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "findCustomerReview", null);
__decorate([
    (0, common_1.Get)('agent/:id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT, global_entity_1.UserType.CUSTOMER, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "findAgentReview", null);
__decorate([
    (0, common_1.Patch)('customer/:id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reviews_dto_1.UpdateReviewDto]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "updateCustomerReview", null);
__decorate([
    (0, common_1.Patch)('agent/:id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.QUALITY),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reviews_dto_1.UpdateReviewDto]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "updateAgentReview", null);
__decorate([
    (0, common_1.Get)('agent/:agentId/summary'),
    __param(0, (0, common_1.Param)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "getAgentReviewSummary", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, common_1.Controller)('reviews'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], ReviewsController);
//# sourceMappingURL=reviews.controller.js.map