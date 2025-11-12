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
exports.AgentAvailabilityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
let AgentAvailabilityService = class AgentAvailabilityService {
    constructor(agentAvailabilityRepository, preferredPropertyRepository, usersRepository, propertiesRepository) {
        this.agentAvailabilityRepository = agentAvailabilityRepository;
        this.preferredPropertyRepository = preferredPropertyRepository;
        this.usersRepository = usersRepository;
        this.propertiesRepository = propertiesRepository;
    }
    async createAvailability(createAgentAvailabilityDto) {
        const agent = await this.usersRepository.findOne({
            where: { id: createAgentAvailabilityDto.agentId }
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const existingAvailability = await this.agentAvailabilityRepository.findOne({
            where: {
                agent: { id: createAgentAvailabilityDto.agentId },
                dayOfWeek: createAgentAvailabilityDto.dayOfWeek,
            }
        });
        if (existingAvailability) {
            throw new common_1.ConflictException('Availability already exists for this day');
        }
        const availability = this.agentAvailabilityRepository.create({
            ...createAgentAvailabilityDto,
            agent,
        });
        return this.agentAvailabilityRepository.save(availability);
    }
    async getAvailabilityById(id) {
        const availability = await this.agentAvailabilityRepository.findOne({
            where: { id },
            relations: ['agent']
        });
        if (!availability) {
            throw new common_1.NotFoundException('Availability not found');
        }
        return availability;
    }
    async updateAvailability(id, updateAgentAvailabilityDto) {
        const availability = await this.getAvailabilityById(id);
        Object.assign(availability, updateAgentAvailabilityDto);
        return this.agentAvailabilityRepository.save(availability);
    }
    async deleteAvailability(id) {
        const availability = await this.getAvailabilityById(id);
        await this.agentAvailabilityRepository.remove(availability);
    }
    async addPreferredProperty(createAgentPreferredPropertyDto) {
        const agent = await this.usersRepository.findOne({
            where: { id: createAgentPreferredPropertyDto.agentId }
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const property = await this.propertiesRepository.findOne({
            where: { id: createAgentPreferredPropertyDto.propertyId }
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        const existingPreference = await this.preferredPropertyRepository.findOne({
            where: {
                agent: { id: createAgentPreferredPropertyDto.agentId },
                property: { id: createAgentPreferredPropertyDto.propertyId },
            }
        });
        if (existingPreference) {
            throw new common_1.ConflictException('Property already in preferred list');
        }
        const preferredProperty = this.preferredPropertyRepository.create({
            agent,
            property,
            addedBy: { id: 1 },
        });
        return this.preferredPropertyRepository.save(preferredProperty);
    }
    async removePreferredProperty(id) {
        const preferredProperty = await this.preferredPropertyRepository.findOne({
            where: { id }
        });
        if (!preferredProperty) {
            throw new common_1.NotFoundException('Preferred property not found');
        }
        await this.preferredPropertyRepository.remove(preferredProperty);
    }
    async getAvailableAgents(date, time) {
        const appointmentDate = new Date(date);
        const dayOfWeek = appointmentDate.getDay();
        const availableSlots = await this.agentAvailabilityRepository.find({
            where: { dayOfWeek },
            relations: ['agent'],
        });
        const availableAgents = availableSlots.filter(slot => {
            return time >= slot.startTime && time <= slot.endTime;
        });
        return availableAgents.map(slot => ({
            agent: slot.agent,
            availability: {
                startTime: slot.startTime,
                endTime: slot.endTime,
            }
        }));
    }
};
exports.AgentAvailabilityService = AgentAvailabilityService;
exports.AgentAvailabilityService = AgentAvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.AgentAvailability)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.AgentPreferredProperty)),
    __param(2, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(global_entity_1.Property)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AgentAvailabilityService);
//# sourceMappingURL=agent-availability.service.js.map