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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let PaymentsService = class PaymentsService {
    constructor(paymentsRepository, balanceRepository, appointmentRepository, usersRepository, notificationsService) {
        this.paymentsRepository = paymentsRepository;
        this.balanceRepository = balanceRepository;
        this.appointmentRepository = appointmentRepository;
        this.usersRepository = usersRepository;
        this.notificationsService = notificationsService;
    }
    async create(createPaymentDto) {
        const appointment = await this.appointmentRepository.findOne({
            where: { id: createPaymentDto.appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        const agent = await this.usersRepository.findOne({
            where: { id: createPaymentDto.agentId },
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const existingPayment = await this.paymentsRepository.findOne({
            where: { appointment: { id: createPaymentDto.appointmentId } },
        });
        if (existingPayment) {
            throw new common_1.BadRequestException('Payment already exists for this appointment');
        }
        const payment = await this.paymentsRepository.create({
            ...createPaymentDto,
            appointment,
            agent,
            updatedBy: { id: 1 },
        });
        await this.notificationsService.createNotification({
            userId: payment.agent.id,
            type: global_entity_1.NotificationType.SYSTEM,
            title: 'New Payment',
            message: `A new payment has been created for you with an amount of ${payment.amount} ${payment.currency}.`,
            relatedId: payment.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        await this.notificationsService.notifyUserType(global_entity_1.UserType.ADMIN, {
            type: global_entity_1.NotificationType.SYSTEM,
            title: 'New Payment Added',
            message: `A new payment has been added for the agent ${payment.agent.fullName} with an amount of ${payment.amount} ${payment.currency}.`,
            relatedId: payment.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        return this.paymentsRepository.save(payment);
    }
    async findAll(query) {
        const { agentId, status, gateway, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (agentId)
            where.agent = { id: agentId };
        if (status)
            where.status = status;
        if (gateway)
            where.gateway = gateway;
        const [data, total] = await this.paymentsRepository.findAndCount({
            where,
            relations: ['appointment', 'agent', 'updatedBy'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { data, total };
    }
    async findOne(id) {
        const payment = await this.paymentsRepository.findOne({
            where: { id },
            relations: ['appointment', 'agent', 'updatedBy'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async update(id, updatePaymentDto) {
        const payment = await this.findOne(id);
        Object.assign(payment, updatePaymentDto);
        return this.paymentsRepository.save(payment);
    }
    async processPayment(id, processPaymentDto) {
        const payment = await this.findOne(id);
        if (payment.status !== global_entity_1.PaymentStatus.PENDING) {
            throw new common_1.BadRequestException('Payment can only be processed when in pending status');
        }
        payment.status = global_entity_1.PaymentStatus.PROCESSING;
        payment.gateway = processPaymentDto.gateway;
        if (processPaymentDto.transactionId) {
            payment.transactionId = processPaymentDto.transactionId;
        }
        return this.paymentsRepository.save(payment);
    }
    async completePayment(id) {
        const payment = await this.findOne(id);
        if (payment.status !== global_entity_1.PaymentStatus.PROCESSING) {
            throw new common_1.BadRequestException('Payment must be in processing status to complete');
        }
        payment.status = global_entity_1.PaymentStatus.COMPLETED;
        payment.paidAt = new Date();
        const savedPayment = await this.paymentsRepository.save(payment);
        await this.updateAgentBalance(payment.agent.id, parseFloat(payment.amount.toString()));
        await this.notificationsService.createNotification({
            userId: payment.agent.id,
            type: global_entity_1.NotificationType.SYSTEM,
            title: 'Payment Received',
            message: `Congratulations! Your payment of ${payment.amount} ${payment.currency} has been received successfully.`,
            relatedId: payment.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        return savedPayment;
    }
    async updateAgentBalance(agentId, amount) {
        let balance = await this.balanceRepository.findOne({
            where: { agent: { id: agentId } },
        });
        if (!balance) {
            balance = this.balanceRepository.create({
                agent: { id: agentId },
                totalEarnings: amount.toString(),
                pendingBalance: '0',
            });
        }
        else {
            const totalEarnings = parseFloat(balance.totalEarnings) + amount;
            const pendingBalance = parseFloat(balance.pendingBalance) - amount;
            balance.totalEarnings = totalEarnings.toString();
            balance.pendingBalance = Math.max(0, pendingBalance).toString();
        }
        await this.balanceRepository.save(balance);
    }
    async getAgentBalance(agentId) {
        let balance = await this.balanceRepository.findOne({
            where: { agent: { id: agentId } },
            relations: ['agent'],
        });
        if (!balance) {
            balance = this.balanceRepository.create({
                agent: { id: agentId },
                totalEarnings: '0',
                pendingBalance: '0',
            });
            await this.balanceRepository.save(balance);
        }
        return balance;
    }
    async getAgentPayments(agentId, query) {
        const { status, gateway, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const where = { agent: { id: agentId } };
        if (status)
            where.status = status;
        if (gateway)
            where.gateway = gateway;
        const [data, total] = await this.paymentsRepository.findAndCount({
            where,
            relations: ['appointment', 'updatedBy'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { data, total };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.AgentPayment)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.AgentBalance)),
    __param(2, (0, typeorm_1.InjectRepository)(global_entity_1.Appointment)),
    __param(3, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map