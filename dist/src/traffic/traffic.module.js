"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const traffic_service_1 = require("./traffic.service");
const traffic_controller_1 = require("./traffic.controller");
const global_entity_1 = require("../entities/global.entity");
let TrafficModule = class TrafficModule {
};
exports.TrafficModule = TrafficModule;
exports.TrafficModule = TrafficModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([global_entity_1.Campaign, global_entity_1.ReferralPartner, global_entity_1.VisitorTracking, global_entity_1.Conversion, global_entity_1.User])],
        controllers: [traffic_controller_1.TrafficController],
        providers: [traffic_service_1.TrafficService],
        exports: [traffic_service_1.TrafficService],
    })
], TrafficModule);
//# sourceMappingURL=traffic.module.js.map