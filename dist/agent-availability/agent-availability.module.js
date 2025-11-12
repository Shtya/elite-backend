"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentAvailabilityModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const agent_availability_service_1 = require("./agent-availability.service");
const agent_availability_controller_1 = require("./agent-availability.controller");
const global_entity_1 = require("../entities/global.entity");
let AgentAvailabilityModule = class AgentAvailabilityModule {
};
exports.AgentAvailabilityModule = AgentAvailabilityModule;
exports.AgentAvailabilityModule = AgentAvailabilityModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([global_entity_1.AgentAvailability, global_entity_1.AgentPreferredProperty, global_entity_1.User, global_entity_1.Property])],
        controllers: [agent_availability_controller_1.AgentAvailabilityController],
        providers: [agent_availability_service_1.AgentAvailabilityService],
        exports: [agent_availability_service_1.AgentAvailabilityService],
    })
], AgentAvailabilityModule);
//# sourceMappingURL=agent-availability.module.js.map