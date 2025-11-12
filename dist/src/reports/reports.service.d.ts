import { Repository } from 'typeorm';
import { ReportSnapshot, Appointment, AgentPayment, User, Conversion, VisitorTracking, Property } from 'src/entities/global.entity';
import { GenerateReportDto, ReportQueryDto, AgentPerformanceQueryDto, MarketingPerformanceQueryDto } from '../dto/reports.dto';
export declare class ReportsService {
    readonly reportSnapshotsRepository: Repository<ReportSnapshot>;
    private appointmentsRepository;
    private paymentsRepository;
    private usersRepository;
    private conversionsRepository;
    private visitorTrackingRepository;
    private propertyRepository;
    constructor(reportSnapshotsRepository: Repository<ReportSnapshot>, appointmentsRepository: Repository<Appointment>, paymentsRepository: Repository<AgentPayment>, usersRepository: Repository<User>, conversionsRepository: Repository<Conversion>, visitorTrackingRepository: Repository<VisitorTracking>, propertyRepository: Repository<Property>);
    generateReport(generateReportDto: GenerateReportDto): Promise<ReportSnapshot>;
    getReportSnapshot(id: number): Promise<ReportSnapshot>;
    getAdminDashboard(): Promise<any>;
    getAgentPerformance(query: AgentPerformanceQueryDto): Promise<any>;
    getMarketingPerformance(query: MarketingPerformanceQueryDto): Promise<any>;
    getFinancialOverview(query: ReportQueryDto): Promise<any>;
    getAgentSummary(agentId: number, query: AgentPerformanceQueryDto): Promise<any>;
    private generateAdminDashboardData;
    private generateAgentPerformanceData;
    private generateMarketingPerformanceData;
    private generateFinancialData;
    private getTotalRevenue;
    private getVisitorStats;
    private analyzeTrafficSources;
    private analyzeRevenueByGateway;
}
