import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { UpdateUserDTO } from './dto/UpdateUser.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const { name } = createUserDTO;
    const newUser = this.usersRepository.create({ name });
    return this.usersRepository.save(newUser);
  }

  findAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async updateUser(id: number, updateUserDTO: UpdateUserDTO): Promise<User> {
    const { name } = updateUserDTO;
    const userToUpdate = await this.usersRepository.findOneBy({ id });
    userToUpdate.name = name;
    return this.usersRepository.save(userToUpdate);
  }
}
