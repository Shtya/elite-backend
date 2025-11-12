import { Repository } from 'typeorm';
import { AgentAvailability, AgentPreferredProperty, User, Property } from 'src/entities/global.entity';
import { CreateAgentAvailabilityDto, UpdateAgentAvailabilityDto, CreateAgentPreferredPropertyDto } from '../dto/agent-availability.dto';
export declare class AgentAvailabilityService {
    readonly agentAvailabilityRepository: Repository<AgentAvailability>;
    readonly preferredPropertyRepository: Repository<AgentPreferredProperty>;
    private usersRepository;
    private propertiesRepository;
    constructor(agentAvailabilityRepository: Repository<AgentAvailability>, preferredPropertyRepository: Repository<AgentPreferredProperty>, usersRepository: Repository<User>, propertiesRepository: Repository<Property>);
    createAvailability(createAgentAvailabilityDto: CreateAgentAvailabilityDto): Promise<AgentAvailability>;
    getAvailabilityById(id: number): Promise<AgentAvailability>;
    updateAvailability(id: number, updateAgentAvailabilityDto: UpdateAgentAvailabilityDto): Promise<AgentAvailability>;
    deleteAvailability(id: number): Promise<void>;
    addPreferredProperty(createAgentPreferredPropertyDto: CreateAgentPreferredPropertyDto): Promise<AgentPreferredProperty>;
    removePreferredProperty(id: number): Promise<void>;
    getAvailableAgents(date: string, time: string): Promise<any[]>;
}
