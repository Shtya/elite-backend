import { ReportsService } from './reports.service';
import { GenerateReportDto, ReportQueryDto, AgentPerformanceQueryDto, MarketingPerformanceQueryDto } from '../dto/reports.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    generateReport(generateReportDto: GenerateReportDto): Promise<import("src/entities/global.entity").ReportSnapshot>;
    getReportSnapshots(query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").ReportSnapshot>>;
    getReportSnapshot(id: string): Promise<import("src/entities/global.entity").ReportSnapshot>;
    getAdminDashboard(): Promise<any>;
    getAgentPerformance(query: AgentPerformanceQueryDto): Promise<any>;
    getMarketingPerformance(query: MarketingPerformanceQueryDto): Promise<any>;
    getFinancialOverview(query: ReportQueryDto): Promise<any>;
    getAgentSummary(agentId: string, query: AgentPerformanceQueryDto): Promise<any>;
}
