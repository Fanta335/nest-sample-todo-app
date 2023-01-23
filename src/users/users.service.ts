import { Injectable, NotFoundException } from '@nestjs/common';
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

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const { name } = createUserDTO;
    const newUser = this.usersRepository.create({ name });
    return this.usersRepository.save(newUser);
  }

  findAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { tasks: true },
    });
    if (!user) {
      throw new NotFoundException("specified user doesn't exists.");
    }
    return user;
  }

  async updateUser(id: number, updateUserDTO: UpdateUserDTO): Promise<User> {
    const res = await this.usersRepository.update(id, updateUserDTO);
    if (res.affected === 0) {
      throw new NotFoundException("specified user doesn't exists.");
    }
    return this.usersRepository.findOne({ where: { id } });
  }

  async deleteUser(id: number): Promise<void> {
    const res = await this.usersRepository.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException("specified user doesn't exists.");
    }
  }
}
