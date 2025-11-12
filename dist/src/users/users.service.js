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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
const bcrypt = require("bcryptjs");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: [{ email: createUserDto.email }, ...(createUserDto.phoneNumber ? [{ phoneNumber: createUserDto.phoneNumber }] : [])],
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email (or phone) already exists');
        }
        const passwordHash = await bcrypt.hash(createUserDto.password, 12);
        const user = this.usersRepository.create({
            email: createUserDto.email,
            fullName: createUserDto.fullName,
            userType: createUserDto.userType,
            phoneNumber: createUserDto.phoneNumber,
            profilePhotoUrl: createUserDto.profilePhotoUrl,
            residencyIdUrl: createUserDto.residencyIdUrl,
            nationalIdUrl: createUserDto.nationalIdUrl,
            passwordHash,
            verificationStatus: global_entity_1.VerificationStatus.VERIFIED,
            verifiedAt: new Date(),
            isActive: true,
        });
        return this.usersRepository.save(user);
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.findOne(id);
        if (updateUserDto.email) {
            const existingUserByEmail = await this.usersRepository.findOne({ where: { email: updateUserDto.email } });
            if (existingUserByEmail && existingUserByEmail.id !== id) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        if (updateUserDto.phoneNumber) {
            const existingUserByPhone = await this.usersRepository.findOne({ where: { phoneNumber: updateUserDto.phoneNumber } });
            if (existingUserByPhone && existingUserByPhone.id !== id) {
                throw new common_1.ConflictException('Phone number already in use');
            }
        }
        await this.usersRepository.update(id, updateUserDto);
        return this.usersRepository.findOne({ where: { id } });
    }
    async remove(id) {
        await this.findOne(id);
        await this.usersRepository.softDelete(id);
    }
    async verifyUser(id, verifyUserDto) {
        const user = await this.findOne(id);
        user.verificationStatus = verifyUserDto.status;
        if (verifyUserDto.status === global_entity_1.VerificationStatus.VERIFIED) {
            user.verifiedAt = new Date();
        }
        return this.usersRepository.save(user);
    }
    async deactivate(id) {
        const user = await this.findOne(id);
        user.isActive = false;
        return this.usersRepository.save(user);
    }
    async activate(id) {
        const user = await this.findOne(id);
        user.isActive = true;
        return this.usersRepository.save(user);
    }
    async findByPhone(phoneNumber) {
        return this.usersRepository.findOne({ where: { phoneNumber } });
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map