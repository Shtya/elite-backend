import { Repository } from 'typeorm';
import { User } from 'src/entities/global.entity';
import { CreateUserDto, UpdateUserDto, VerifyUserDto } from 'src/dto/users.dto';
export declare class UsersService {
    usersRepository: Repository<User>;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findOne(id: number): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<void>;
    verifyUser(id: number, verifyUserDto: VerifyUserDto): Promise<User>;
    deactivate(id: number): Promise<User>;
    activate(id: number): Promise<User>;
    findByPhone(phoneNumber: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
}
