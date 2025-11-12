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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
let ReportsService = class ReportsService {
    constructor(reportSnapshotsRepository, appointmentsRepository, paymentsRepository, usersRepository, conversionsRepository, visitorTrackingRepository, propertyRepository) {
        this.reportSnapshotsRepository = reportSnapshotsRepository;
        this.appointmentsRepository = appointmentsRepository;
        this.paymentsRepository = paymentsRepository;
        this.usersRepository = usersRepository;
        this.conversionsRepository = conversionsRepository;
        this.visitorTrackingRepository = visitorTrackingRepository;
        this.propertyRepository = propertyRepository;
    }
    async generateReport(generateReportDto) {
        const { type, periodStart, periodEnd } = generateReportDto;
        let payload = {};
        switch (type) {
            case global_entity_1.ReportSnapshotType.ADMIN_DASHBOARD:
                payload = await this.generateAdminDashboardData(periodStart, periodEnd);
                break;
            case global_entity_1.ReportSnapshotType.AGENT_PERFORMANCE:
                payload = await this.generateAgentPerformanceData(periodStart, periodEnd);
                break;
            case global_entity_1.ReportSnapshotType.MARKETING_PERFORMANCE:
                payload = await this.generateMarketingPerformanceData(periodStart, periodEnd);
                break;
            case global_entity_1.ReportSnapshotType.FINANCIAL:
                payload = await this.generateFinancialData(periodStart, periodEnd);
                break;
        }
        const snapshot = this.reportSnapshotsRepository.create({
            type,
            periodStart,
            periodEnd,
            payload,
            generatedAt: new Date(),
        });
        return this.reportSnapshotsRepository.save(snapshot);
    }
    async getReportSnapshot(id) {
        const snapshot = await this.reportSnapshotsRepository.findOne({ where: { id } });
        if (!snapshot) {
            throw new common_1.NotFoundException('Report snapshot not found');
        }
        return snapshot;
    }
    async getAdminDashboard() {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        return {
            overview: await this.generateAdminDashboardData(startOfMonth.toISOString(), today.toISOString()),
            comparison: await this.generateAdminDashboardData(startOfLastMonth.toISOString(), endOfLastMonth.toISOString()),
        };
    }
    async getAgentPerformance(query) {
        const { agentId, startDate, endDate } = query;
        return this.generateAgentPerformanceData(startDate, endDate, agentId);
    }
    async getMarketingPerformance(query) {
        const { marketerId, startDate, endDate } = query;
        return this.generateMarketingPerformanceData(startDate, endDate, marketerId);
    }
    async getFinancialOverview(query) {
        const { startDate, endDate } = query;
        return this.generateFinancialData(startDate, endDate);
    }
    async getAgentSummary(agentId, query) {
        const { startDate, endDate } = query;
        const agent = await this.usersRepository.findOne({ where: { id: agentId } });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const appointments = await this.appointmentsRepository.find({
            where: {
                agent: { id: agentId },
                appointmentDate: (0, typeorm_2.Between)(new Date(startDate), new Date(endDate)),
            },
        });
        const payments = await this.paymentsRepository.find({
            where: {
                agent: { id: agentId },
                status: 'completed',
                paidAt: (0, typeorm_2.Between)(new Date(startDate), new Date(endDate)),
            },
        });
        const totalEarnings = payments.reduce((sum, payment) => sum + parseFloat(payment.amount.toString()), 0);
        const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
        return {
            agent: {
                id: agent.id,
                name: agent.fullName,
            },
            period: { startDate, endDate },
            appointments: {
                total: appointments.length,
                completed: completedAppointments,
                completionRate: appointments.length > 0 ? (completedAppointments / appointments.length * 100).toFixed(2) + '%' : '0%',
            },
            earnings: {
                total: totalEarnings,
                averagePerAppointment: completedAppointments > 0 ? (totalEarnings / completedAppointments).toFixed(2) : 0,
            },
        };
    }
    async generateAdminDashboardData(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const [totalUsers, totalAgents, totalAppointments, completedAppointments, totalProperties, totalRevenue, visitorStats,] = await Promise.all([
            this.usersRepository.count({ where: { createdAt: (0, typeorm_2.Between)(start, end) } }),
            this.usersRepository.count({ where: { userType: 'agent', createdAt: (0, typeorm_2.Between)(start, end) } }),
            this.appointmentsRepository.count({ where: { createdAt: (0, typeorm_2.Between)(start, end) } }),
            this.appointmentsRepository.count({ where: { status: 'completed', createdAt: (0, typeorm_2.Between)(start, end) } }),
            this.propertyRepository.count({ where: { createdAt: (0, typeorm_2.Between)(start, end) } }),
            this.getTotalRevenue(start, end),
            this.getVisitorStats(start, end),
        ]);
        return {
            period: { startDate, endDate },
            userStats: { totalUsers, totalAgents },
            appointmentStats: { totalAppointments, completedAppointments },
            propertyStats: { totalProperties },
            financialStats: { totalRevenue },
            marketingStats: visitorStats,
        };
    }
    async generateAgentPerformanceData(startDate, endDate, agentId) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const where = {
            appointmentDate: (0, typeorm_2.Between)(start, end),
        };
        if (agentId) {
            where.agent = { id: agentId };
        }
        const appointments = await this.appointmentsRepository.find({
            where,
            relations: ['agent'],
        });
        const agentPerformance = appointments.reduce((acc, appointment) => {
            if (!appointment.agent)
                return acc;
            const agentId = appointment.agent.id;
            if (!acc[agentId]) {
                acc[agentId] = {
                    agent: appointment.agent,
                    totalAppointments: 0,
                    completedAppointments: 0,
                    cancelledAppointments: 0,
                };
            }
            acc[agentId].totalAppointments++;
            if (appointment.status === 'completed') {
                acc[agentId].completedAppointments++;
            }
            else if (appointment.status === 'cancelled') {
                acc[agentId].cancelledAppointments++;
            }
            return acc;
        }, {});
        return {
            period: { startDate, endDate },
            agentPerformance: Object.values(agentPerformance),
        };
    }
    async generateMarketingPerformanceData(startDate, endDate, marketerId) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const where = { createdAt: (0, typeorm_2.Between)(start, end) };
        if (marketerId) {
            where.marketer = { id: marketerId };
        }
        const [visitors, conversions] = await Promise.all([
            this.visitorTrackingRepository.find({ where, relations: ['marketer'] }),
            this.conversionsRepository.find({ where, relations: ['marketer', 'visitor'] }),
        ]);
        const conversionRate = visitors.length > 0 ? (conversions.length / visitors.length * 100).toFixed(2) + '%' : '0%';
        return {
            period: { startDate, endDate },
            visitors: visitors.length,
            conversions: conversions.length,
            conversionRate,
            sources: this.analyzeTrafficSources(visitors),
        };
    }
    async generateFinancialData(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const payments = await this.paymentsRepository.find({
            where: {
                paidAt: (0, typeorm_2.Between)(start, end),
                status: 'completed',
            },
        });
        const totalRevenue = payments.reduce((sum, payment) => sum + parseFloat(payment.amount.toString()), 0);
        const revenueByGateway = this.analyzeRevenueByGateway(payments);
        return {
            period: { startDate, endDate },
            totalRevenue,
            revenueByGateway,
            paymentCount: payments.length,
            averagePayment: payments.length > 0 ? (totalRevenue / payments.length).toFixed(2) : 0,
        };
    }
    async getTotalRevenue(start, end) {
        const payments = await this.paymentsRepository.find({
            where: {
                paidAt: (0, typeorm_2.Between)(start, end),
                status: 'completed',
            },
        });
        return payments.reduce((sum, payment) => sum + parseFloat(payment.amount.toString()), 0);
    }
    async getVisitorStats(start, end) {
        const visitors = await this.visitorTrackingRepository.find({
            where: { createdAt: (0, typeorm_2.Between)(start, end) },
        });
        const conversions = await this.conversionsRepository.find({
            where: { convertedAt: (0, typeorm_2.Between)(start, end) },
        });
        return {
            totalVisitors: visitors.length,
            totalConversions: conversions.length,
            conversionRate: visitors.length > 0 ? (conversions.length / visitors.length * 100).toFixed(2) + '%' : '0%',
        };
    }
    analyzeTrafficSources(visitors) {
        const sources = visitors.reduce((acc, visitor) => {
            const source = visitor.source;
            acc[source] = (acc[source] || 0) + 1;
            return acc;
        }, {});
        return sources;
    }
    analyzeRevenueByGateway(payments) {
        const byGateway = payments.reduce((acc, payment) => {
            const gateway = payment.gateway;
            acc[gateway] = (acc[gateway] || 0) + parseFloat(payment.amount.toString());
            return acc;
        }, {});
        return byGateway;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.ReportSnapshot)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.Appointment)),
    __param(2, (0, typeorm_1.InjectRepository)(global_entity_1.AgentPayment)),
    __param(3, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(global_entity_1.Conversion)),
    __param(5, (0, typeorm_1.InjectRepository)(global_entity_1.VisitorTracking)),
    __param(6, (0, typeorm_1.InjectRepository)(global_entity_1.Property)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map