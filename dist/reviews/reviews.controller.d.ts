import { ReviewsService } from './reviews.service';
import { CreateCustomerReviewDto, CreateAgentReviewDto, UpdateReviewDto } from '../dto/reviews.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    createCustomerReview(createCustomerReviewDto: CreateCustomerReviewDto): Promise<import("src/entities/global.entity").CustomerReview>;
    createAgentReview(createAgentReviewDto: CreateAgentReviewDto): Promise<import("src/entities/global.entity").AgentReview>;
    findAllCustomerReviews(query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").CustomerReview>>;
    findAllAgentReviews(query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").AgentReview>>;
    findCustomerReview(id: string): Promise<import("src/entities/global.entity").CustomerReview>;
    findAgentReview(id: string): Promise<import("src/entities/global.entity").AgentReview>;
    updateCustomerReview(id: string, updateReviewDto: UpdateReviewDto): Promise<import("src/entities/global.entity").CustomerReview>;
    updateAgentReview(id: string, updateReviewDto: UpdateReviewDto): Promise<import("src/entities/global.entity").AgentReview>;
    getAgentReviewSummary(agentId: string): Promise<any>;
}
