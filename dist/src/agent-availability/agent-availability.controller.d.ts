import { AgentAvailabilityService } from './agent-availability.service';
import { CreateAgentAvailabilityDto, UpdateAgentAvailabilityDto, CreateAgentPreferredPropertyDto } from '../dto/agent-availability.dto';
export declare class AgentAvailabilityController {
    private readonly agentAvailabilityService;
    constructor(agentAvailabilityService: AgentAvailabilityService);
    createAvailability(createAgentAvailabilityDto: CreateAgentAvailabilityDto): Promise<import("src/entities/global.entity").AgentAvailability>;
    getAvailability(query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").AgentAvailability>>;
    getAvailabilityById(id: string): Promise<import("src/entities/global.entity").AgentAvailability>;
    updateAvailability(id: string, updateAgentAvailabilityDto: UpdateAgentAvailabilityDto): Promise<import("src/entities/global.entity").AgentAvailability>;
    deleteAvailability(id: string): Promise<void>;
    addPreferredProperty(createAgentPreferredPropertyDto: CreateAgentPreferredPropertyDto): Promise<import("src/entities/global.entity").AgentPreferredProperty>;
    getPreferredProperties(agentId: string, query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").AgentPreferredProperty>>;
    removePreferredProperty(id: string): Promise<void>;
    getAvailableAgents(date: string, time: string): Promise<any[]>;
}
