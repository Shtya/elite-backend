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
exports.MessageTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
let MessageTemplatesService = class MessageTemplatesService {
    constructor(messageTemplatesRepository) {
        this.messageTemplatesRepository = messageTemplatesRepository;
    }
    async create(createMessageTemplateDto) {
        const existingTemplate = await this.messageTemplatesRepository.findOne({
            where: {
                name: createMessageTemplateDto.name,
                channel: createMessageTemplateDto.channel,
            }
        });
        if (existingTemplate) {
            throw new common_1.ConflictException('Message template with this name and channel already exists');
        }
        const template = this.messageTemplatesRepository.create(createMessageTemplateDto);
        return this.messageTemplatesRepository.save(template);
    }
    async findOne(id) {
        const template = await this.messageTemplatesRepository.findOne({ where: { id } });
        if (!template) {
            throw new common_1.NotFoundException('Message template not found');
        }
        return template;
    }
    async update(id, updateMessageTemplateDto) {
        const template = await this.findOne(id);
        if (updateMessageTemplateDto.name && updateMessageTemplateDto.name !== template.name) {
            const existingTemplate = await this.messageTemplatesRepository.findOne({
                where: {
                    name: updateMessageTemplateDto.name,
                    channel: updateMessageTemplateDto.channel || template.channel,
                }
            });
            if (existingTemplate && existingTemplate.id !== id) {
                throw new common_1.ConflictException('Message template with this name and channel already exists');
            }
        }
        Object.assign(template, updateMessageTemplateDto);
        return this.messageTemplatesRepository.save(template);
    }
    async remove(id) {
        const template = await this.findOne(id);
        await this.messageTemplatesRepository.remove(template);
    }
    async approve(id) {
        const template = await this.findOne(id);
        template.approved = true;
        return this.messageTemplatesRepository.save(template);
    }
    async disapprove(id) {
        const template = await this.findOne(id);
        template.approved = false;
        return this.messageTemplatesRepository.save(template);
    }
    async findByChannel(channel, locale) {
        const where = { channel, approved: true };
        if (locale)
            where.locale = locale;
        return this.messageTemplatesRepository.find({
            where,
            order: { name: 'ASC' }
        });
    }
    async previewTemplate(id, variables) {
        const template = await this.findOne(id);
        let preview = template.body;
        Object.keys(variables).forEach(key => {
            const placeholder = `{{${key}}}`;
            preview = preview.replace(new RegExp(placeholder, 'g'), variables[key] || '');
        });
        return { preview };
    }
    async getTemplateByName(name, channel, locale = 'ar') {
        const template = await this.messageTemplatesRepository.findOne({
            where: {
                name,
                channel,
                locale,
                approved: true,
            }
        });
        if (!template) {
            throw new common_1.NotFoundException(`Message template '${name}' not found for channel ${channel} and locale ${locale}`);
        }
        return template;
    }
    async renderTemplate(name, channel, variables, locale = 'ar') {
        const template = await this.getTemplateByName(name, channel, locale);
        let rendered = template.body;
        Object.keys(variables).forEach(key => {
            const placeholder = `{{${key}}}`;
            rendered = rendered.replace(new RegExp(placeholder, 'g'), variables[key] || '');
        });
        return rendered;
    }
};
exports.MessageTemplatesService = MessageTemplatesService;
exports.MessageTemplatesService = MessageTemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.MessageTemplate)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MessageTemplatesService);
//# sourceMappingURL=message-templates.service.js.map