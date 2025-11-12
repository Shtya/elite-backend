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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const users_dto_1 = require("../dto/users.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
const crud_service_1 = require("../../common/crud.service");
const platform_express_1 = require("@nestjs/platform-express");
const upload_config_1 = require("../../common/upload.config");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(createUserDto, files) {
        if (files?.profilePhotoUrl?.[0]) {
            createUserDto.profilePhotoUrl = `/uploads/images/${files.profilePhotoUrl[0].filename}`;
        }
        if (files?.nationalIdUrl?.[0]) {
            createUserDto.nationalIdUrl = `/uploads/images/${files.nationalIdUrl[0].filename}`;
        }
        if (files?.residencyIdUrl?.[0]) {
            createUserDto.residencyIdUrl = `/uploads/images/${files.residencyIdUrl[0].filename}`;
        }
        return this.usersService.create(createUserDto);
    }
    findAll(query) {
        const filters = {};
        if (query.userType)
            filters.userType = query.userType;
        return crud_service_1.CRUD.findAll(this.usersService.usersRepository, 'usr', query.search, query.page, query.limit, query.sortBy, query.sortOrder, [], ['fullName', 'email', 'phoneNumber'], filters);
    }
    findOne(id) {
        return this.usersService.findOne(+id);
    }
    update(id, updateUserDto, files) {
        if (files?.profilePhotoUrl?.[0]) {
            updateUserDto.profilePhotoUrl = `/uploads/images/${files.profilePhotoUrl[0].filename}`;
        }
        if (files?.nationalIdUrl?.[0]) {
            updateUserDto.nationalIdUrl = `/uploads/images/${files.nationalIdUrl[0].filename}`;
        }
        if (files?.residencyIdUrl?.[0]) {
            updateUserDto.residencyIdUrl = `/uploads/images/${files.residencyIdUrl[0].filename}`;
        }
        return this.usersService.update(+id, updateUserDto);
    }
    remove(id) {
        return this.usersService.remove(+id);
    }
    verifyUser(id, verifyUserDto) {
        return this.usersService.verifyUser(+id, verifyUserDto);
    }
    deactivate(id) {
        return this.usersService.deactivate(+id);
    }
    activate(id) {
        return this.usersService.activate(+id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'profilePhotoUrl', maxCount: 1 },
        { name: 'nationalIdUrl', maxCount: 1 },
        { name: 'residencyIdUrl', maxCount: 1 },
    ], upload_config_1.imageUploadOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.AGENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'profilePhotoUrl', maxCount: 1 },
        { name: 'nationalIdUrl', maxCount: 1 },
        { name: 'residencyIdUrl', maxCount: 1 },
    ], upload_config_1.imageUploadOptions)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/verify'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_dto_1.VerifyUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "verifyUser", null);
__decorate([
    (0, common_1.Post)(':id/deactivate'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Post)(':id/activate'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "activate", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map