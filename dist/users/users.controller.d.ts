import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, VerifyUserDto } from 'src/dto/users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, files?: {
        profilePhotoUrl?: Express.Multer.File[];
        nationalIdUrl?: Express.Multer.File[];
        residencyIdUrl?: Express.Multer.File[];
    }): Promise<import("src/entities/global.entity").User>;
    findAll(query: any): Promise<import("common/crud.service").CustomPaginatedResponse<import("src/entities/global.entity").User>>;
    findOne(id: string): Promise<import("src/entities/global.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto, files?: {
        profilePhotoUrl?: Express.Multer.File[];
        nationalIdUrl?: Express.Multer.File[];
        residencyIdUrl?: Express.Multer.File[];
    }): Promise<import("src/entities/global.entity").User>;
    remove(id: string): Promise<void>;
    verifyUser(id: string, verifyUserDto: VerifyUserDto): Promise<import("src/entities/global.entity").User>;
    deactivate(id: string): Promise<import("src/entities/global.entity").User>;
    activate(id: string): Promise<import("src/entities/global.entity").User>;
}
