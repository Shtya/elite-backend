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
exports.ContactUsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let ContactUsService = class ContactUsService {
    constructor(contactUsRepository, notificationsService) {
        this.contactUsRepository = contactUsRepository;
        this.notificationsService = notificationsService;
    }
    async create(createContactUsDto) {
        const contact = this.contactUsRepository.create(createContactUsDto);
        const savedContact = await this.contactUsRepository.save(contact);
        await this.notificationsService.notifyUserType(global_entity_1.UserType.ADMIN, {
            type: global_entity_1.NotificationType.SYSTEM,
            title: 'New Contact Message Received',
            message: `A new contact message has been submitted by ${savedContact.name} (${savedContact.email}).`,
            relatedId: savedContact.id,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        return savedContact;
    }
    async findOne(id) {
        const contact = await this.contactUsRepository.findOne({ where: { id } });
        if (!contact)
            throw new common_1.NotFoundException('Contact not found');
        return contact;
    }
    async remove(id) {
        const contact = await this.findOne(id);
        if (!contact)
            throw new common_1.NotFoundException('Contact not found');
        return await this.contactUsRepository.softRemove(contact);
    }
};
exports.ContactUsService = ContactUsService;
exports.ContactUsService = ContactUsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.ContactUs)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], ContactUsService);
//# sourceMappingURL=contactUs.service.js.map