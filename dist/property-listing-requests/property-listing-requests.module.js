"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyListingRequestsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const property_listing_requests_service_1 = require("./property-listing-requests.service");
const property_listing_requests_controller_1 = require("./property-listing-requests.controller");
const global_entity_1 = require("../entities/global.entity");
let PropertyListingRequestsModule = class PropertyListingRequestsModule {
};
exports.PropertyListingRequestsModule = PropertyListingRequestsModule;
exports.PropertyListingRequestsModule = PropertyListingRequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([global_entity_1.PropertyListingRequest, global_entity_1.PropertyListingRequestAttachment, global_entity_1.User, global_entity_1.PropertyType])],
        controllers: [property_listing_requests_controller_1.PropertyListingRequestsController],
        providers: [property_listing_requests_service_1.PropertyListingRequestsService],
        exports: [property_listing_requests_service_1.PropertyListingRequestsService],
    })
], PropertyListingRequestsModule);
//# sourceMappingURL=property-listing-requests.module.js.map