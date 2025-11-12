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
exports.PropertyListingRequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
const upload_config_1 = require("../../common/upload.config");
let PropertyListingRequestsService = class PropertyListingRequestsService {
    constructor(propertyListingRequestsRepository, attachmentsRepository, usersRepository, propertyTypesRepository) {
        this.propertyListingRequestsRepository = propertyListingRequestsRepository;
        this.attachmentsRepository = attachmentsRepository;
        this.usersRepository = usersRepository;
        this.propertyTypesRepository = propertyTypesRepository;
    }
    async create(dto, attachmentsFiles = []) {
        const owner = await this.usersRepository.findOne({ where: { id: dto.ownerId } });
        if (!owner)
            throw new common_1.NotFoundException('Owner not found');
        const propertyType = await this.propertyTypesRepository.findOne({ where: { id: dto.propertyTypeId } });
        if (!propertyType)
            throw new common_1.NotFoundException('Property type not found');
        let specifications = dto.specifications;
        if (typeof specifications === 'string') {
            try {
                specifications = JSON.parse(specifications);
            }
            catch {
                throw new common_1.BadRequestException('Invalid specifications JSON');
            }
        }
        const request = this.propertyListingRequestsRepository.create({
            owner,
            relationshipType: dto.relationshipType,
            propertyType,
            location: dto.location,
            specifications,
            askingPrice: dto.askingPrice ?? null,
            authorizationDocUrl: dto.authorizationDocUrl ?? null,
            ownershipDocUrl: dto.ownershipDocUrl ?? null,
        });
        const savedRequest = await this.propertyListingRequestsRepository.save(request);
        if (attachmentsFiles.length > 0) {
            const attachmentsRows = attachmentsFiles.map(file => this.attachmentsRepository.create({
                request: savedRequest,
                attachmentUrl: (0, upload_config_1.toWebPathFiles)(file.filename),
            }));
            await this.attachmentsRepository.save(attachmentsRows);
        }
        return this.findOne(savedRequest.id);
    }
    async findOne(id) {
        const request = await this.propertyListingRequestsRepository.findOne({
            where: { id },
            relations: ['owner', 'propertyType', 'attachments', 'updatedBy'],
        });
        if (!request) {
            throw new common_1.NotFoundException('Property listing request not found');
        }
        return request;
    }
    async update(id, updateDto) {
        const request = await this.findOne(id);
        if (!request)
            throw new common_1.NotFoundException('Property listing request not found');
        const { attachments, ...mainFields } = updateDto;
        Object.assign(request, mainFields);
        const savedRequest = await this.propertyListingRequestsRepository.save(request);
        if (attachments && attachments.length > 0) {
            const rows = attachments.map(attachmentUrl => this.attachmentsRepository.create({
                request: savedRequest,
                attachmentUrl,
            }));
            await this.attachmentsRepository.save(rows);
        }
        return this.findOne(savedRequest.id);
    }
    async remove(id) {
        const request = await this.findOne(id);
        await this.propertyListingRequestsRepository.remove(request);
    }
    async addAttachment(requestId, addAttachmentDto) {
        const request = await this.findOne(requestId);
        const attachment = this.attachmentsRepository.create({
            ...addAttachmentDto,
            request,
        });
        return this.attachmentsRepository.save(attachment);
    }
    async approve(id) {
        const request = await this.findOne(id);
        request.status = global_entity_1.ListingRequestStatus.INSPECTED;
        return this.propertyListingRequestsRepository.save(request);
    }
    async reject(id, reason) {
        const request = await this.findOne(id);
        request.status = global_entity_1.ListingRequestStatus.REJECTED;
        return this.propertyListingRequestsRepository.save(request);
    }
    async publish(id) {
        const request = await this.findOne(id);
        request.status = global_entity_1.ListingRequestStatus.PUBLISHED;
        await this.createPropertyFromRequest(request);
        return this.propertyListingRequestsRepository.save(request);
    }
    async findByOwner(ownerId) {
        return this.propertyListingRequestsRepository.find({
            where: { owner: { id: ownerId } },
            relations: ['propertyType', 'attachments'],
            order: { createdAt: 'DESC' },
        });
    }
    async createPropertyFromRequest(request) {
        console.log('Creating property from request:', request.id);
    }
};
exports.PropertyListingRequestsService = PropertyListingRequestsService;
exports.PropertyListingRequestsService = PropertyListingRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.PropertyListingRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.PropertyListingRequestAttachment)),
    __param(2, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(global_entity_1.PropertyType)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PropertyListingRequestsService);
//# sourceMappingURL=property-listing-requests.service.js.map