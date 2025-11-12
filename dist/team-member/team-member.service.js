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
exports.TeamService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fs_1 = require("fs");
const team_member_entity_1 = require("./entities/team-member.entity");
const upload_config_1 = require("../../common/upload.config");
let TeamService = class TeamService {
    constructor(repo) {
        this.repo = repo;
    }
    async findAll() {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }
    async findOne(id) {
        const m = await this.repo.findOne({ where: { id } });
        if (!m)
            throw new common_1.NotFoundException('Team member not found.');
        return m;
    }
    deletePhysicalImageByWebPath(webPath) {
        if (!webPath)
            return;
        const filename = webPath.split('/').pop();
        if (!filename)
            return;
        try {
            (0, fs_1.unlinkSync)((0, upload_config_1.toAbsPathImages)(filename));
        }
        catch { }
    }
    async create(dto) {
        const created = this.repo.create({
            name: dto.name,
            position: dto.position,
            imageUrl: dto.imageUrl ?? null,
        });
        return this.repo.save(created);
    }
    async update(id, dto, _ctx) {
        const member = await this.findOne(id);
        if (dto.imageUrl && dto.imageUrl !== member.imageUrl) {
            this.deletePhysicalImageByWebPath(member.imageUrl);
            member.imageUrl = dto.imageUrl;
        }
        if (dto.imageUrl === null) {
            this.deletePhysicalImageByWebPath(member.imageUrl);
            member.imageUrl = null;
        }
        if (typeof dto.name === 'string')
            member.name = dto.name;
        if (typeof dto.position === 'string')
            member.position = dto.position;
        return this.repo.save(member);
    }
    async remove(id) {
        const member = await this.findOne(id);
        await this.repo.softRemove(member);
        return { success: true };
    }
    async hardDelete(id) {
        const member = await this.findOne(id);
        this.deletePhysicalImageByWebPath(member.imageUrl);
        await this.repo.remove(member);
        return { success: true };
    }
};
exports.TeamService = TeamService;
exports.TeamService = TeamService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(team_member_entity_1.TeamMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TeamService);
//# sourceMappingURL=team-member.service.js.map