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
exports.MessageTemplatesController = void 0;
const common_1 = require("@nestjs/common");
const message_templates_service_1 = require("./message-templates.service");
const message_templates_dto_1 = require("../dto/message-templates.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const global_entity_1 = require("../entities/global.entity");
const crud_service_1 = require("../../common/crud.service");
let MessageTemplatesController = class MessageTemplatesController {
    constructor(messageTemplatesService) {
        this.messageTemplatesService = messageTemplatesService;
    }
    create(createMessageTemplateDto) {
        return this.messageTemplatesService.create(createMessageTemplateDto);
    }
    findAll(query) {
        const filters = {};
        if (typeof query.approved !== 'undefined') {
            filters.approved = query.approved === 'true' ? true : query.approved === 'false' ? false : query.approved;
        }
        if (query.channel)
            filters.channel = query.channel;
        if (query.locale)
            filters.locale = query.locale;
        return crud_service_1.CRUD.findAll(this.messageTemplatesService.messageTemplatesRepository, 'message_template', query.q || query.search, query.page, query.limit, query.sortBy ?? 'name', query.sortOrder ?? 'ASC', [], ['name', 'subject', 'body', 'locale'], filters);
    }
    findOne(id) {
        return this.messageTemplatesService.findOne(+id);
    }
    update(id, updateMessageTemplateDto) {
        return this.messageTemplatesService.update(+id, updateMessageTemplateDto);
    }
    remove(id) {
        return this.messageTemplatesService.remove(+id);
    }
    approve(id) {
        return this.messageTemplatesService.approve(+id);
    }
    disapprove(id) {
        return this.messageTemplatesService.disapprove(+id);
    }
    findByChannel(channel, locale) {
        return this.messageTemplatesService.findByChannel(channel, locale);
    }
    previewTemplate(id, variables) {
        return this.messageTemplatesService.previewTemplate(+id, variables);
    }
};
exports.MessageTemplatesController = MessageTemplatesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_templates_dto_1.CreateMessageTemplateDto]),
    __metadata("design:returntype", void 0)
], MessageTemplatesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.MARKETER),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MessageTemplatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.MARKETER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MessageTemplatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, message_templates_dto_1.UpdateMessageTemplateDto]),
    __metadata("design:returntype", void 0)
], MessageTemplatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MessageTemplatesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MessageTemplatesController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/disapprove'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MessageTemplatesController.prototype, "disapprove", null);
__decorate([
    (0, common_1.Get)('channel/:channel'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.MARKETER),
    __param(0, (0, common_1.Param)('channel')),
    __param(1, (0, common_1.Query)('locale')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MessageTemplatesController.prototype, "findByChannel", null);
__decorate([
    (0, common_1.Post)(':id/preview'),
    (0, roles_decorator_1.Roles)(global_entity_1.UserType.ADMIN, global_entity_1.UserType.MARKETER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MessageTemplatesController.prototype, "previewTemplate", null);
exports.MessageTemplatesController = MessageTemplatesController = __decorate([
    (0, common_1.Controller)('message-templates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [message_templates_service_1.MessageTemplatesService])
], MessageTemplatesController);
//# sourceMappingURL=message-templates.controller.js.map