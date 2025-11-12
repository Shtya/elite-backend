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
exports.MasterDataController = void 0;
const common_1 = require("@nestjs/common");
const master_data_service_1 = require("./master-data.service");
const master_data_dto_1 = require("../dto/master-data.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
const crud_service_1 = require("../../common/crud.service");
let MasterDataController = class MasterDataController {
    constructor(masterDataService) {
        this.masterDataService = masterDataService;
    }
    getCities(query) {
        const filters = {};
        if (typeof query.isActive !== "undefined") {
            filters.isActive =
                query.isActive === "true"
                    ? true
                    : query.isActive === "false"
                        ? false
                        : query.isActive;
        }
        return crud_service_1.CRUD.findAll(this.masterDataService.citiesRepository, "city", query.q || query.search, query.page, query.limit ?? 100, query.sortBy ?? "name", query.sortOrder ?? "ASC", [], ["name"], filters);
    }
    getCity(id) {
        return this.masterDataService.getCity(+id);
    }
    createCity(createCityDto) {
        return this.masterDataService.createCity(createCityDto);
    }
    updateCity(id, updateCityDto) {
        return this.masterDataService.updateCity(+id, updateCityDto);
    }
    getAreas(query) {
        const filters = {};
        if (typeof query.isActive !== "undefined") {
            filters.isActive =
                query.isActive === "true"
                    ? true
                    : query.isActive === "false"
                        ? false
                        : query.isActive;
        }
        if (query.cityId)
            filters.city = { id: Number(query.cityId) };
        return crud_service_1.CRUD.findAll(this.masterDataService.areasRepository, "area", query.q || query.search, query.page, query.limit ?? 100, query.sortBy ?? "name", query.sortOrder ?? "ASC", ["city"], ["name"], filters);
    }
    getAreasByCity(cityId, query) {
        const filters = {
            city: { id: Number(cityId) },
            isActive: true,
        };
        return crud_service_1.CRUD.findAll(this.masterDataService.areasRepository, "area", query?.q || query?.search, query?.page, query?.limit ?? 100, query?.sortBy ?? "name", query?.sortOrder ?? "ASC", ["city"], ["name"], filters);
    }
    getArea(id) {
        return this.masterDataService.getArea(+id);
    }
    createArea(createAreaDto) {
        return this.masterDataService.createArea(createAreaDto);
    }
    updateArea(id, updateAreaDto) {
        return this.masterDataService.updateArea(+id, updateAreaDto);
    }
    getPropertyTypes(query) {
        const filters = {};
        if (typeof query.isActive !== "undefined") {
            filters.isActive =
                query.isActive === "true"
                    ? true
                    : query.isActive === "false"
                        ? false
                        : query.isActive;
        }
        return crud_service_1.CRUD.findAll(this.masterDataService.propertyTypesRepository, "property_type", query.q || query.search, query.page, query.limit ?? 100, query.sortBy ?? "name", query.sortOrder ?? "ASC", [], ["name"], filters);
    }
    getPropertyType(id) {
        return this.masterDataService.getPropertyType(+id);
    }
    createPropertyType(createPropertyTypeDto) {
        return this.masterDataService.createPropertyType(createPropertyTypeDto);
    }
    updatePropertyType(id, updatePropertyTypeDto) {
        return this.masterDataService.updatePropertyType(+id, updatePropertyTypeDto);
    }
    removeCity(id) {
        return this.masterDataService.removeCity(+id);
    }
    removeArea(id) {
        return this.masterDataService.removeArea(+id);
    }
    removePropertyType(id) {
        return this.masterDataService.removePropertyType(+id);
    }
};
exports.MasterDataController = MasterDataController;
__decorate([
    (0, common_1.Get)("cities"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getCities", null);
__decorate([
    (0, common_1.Get)("cities/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getCity", null);
__decorate([
    (0, common_1.Post)("cities"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [master_data_dto_1.CreateCityDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "createCity", null);
__decorate([
    (0, common_1.Patch)("cities/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, master_data_dto_1.UpdateCityDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "updateCity", null);
__decorate([
    (0, common_1.Get)("areas"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getAreas", null);
__decorate([
    (0, common_1.Get)("areas/city/:cityId"),
    __param(0, (0, common_1.Param)("cityId")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getAreasByCity", null);
__decorate([
    (0, common_1.Get)("areas/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getArea", null);
__decorate([
    (0, common_1.Post)("areas"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [master_data_dto_1.CreateAreaDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "createArea", null);
__decorate([
    (0, common_1.Patch)("areas/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, master_data_dto_1.UpdateAreaDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "updateArea", null);
__decorate([
    (0, common_1.Get)("property-types"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getPropertyTypes", null);
__decorate([
    (0, common_1.Get)("property-types/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getPropertyType", null);
__decorate([
    (0, common_1.Post)("property-types"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [master_data_dto_1.CreatePropertyTypeDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "createPropertyType", null);
__decorate([
    (0, common_1.Patch)("property-types/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, master_data_dto_1.UpdatePropertyTypeDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "updatePropertyType", null);
__decorate([
    (0, common_1.Delete)("cities/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "removeCity", null);
__decorate([
    (0, common_1.Delete)("areas/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "removeArea", null);
__decorate([
    (0, common_1.Delete)("property-types/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "removePropertyType", null);
exports.MasterDataController = MasterDataController = __decorate([
    (0, common_1.Controller)("master-data"),
    __metadata("design:paramtypes", [master_data_service_1.MasterDataService])
], MasterDataController);
//# sourceMappingURL=master-data.controller.js.map