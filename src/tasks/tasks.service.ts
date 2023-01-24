import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from './../users/users.service';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private usersService: UsersService,
  ) {}

  async createTask(dto: CreateTaskDTO): Promise<Task> {
    const { name, authorId } = dto;
    const newTask = this.tasksRepository.create({ name });
    const taskAuthor = await this.usersService.findById(authorId);
    if (!taskAuthor) {
      throw new NotFoundException("specified user doesn't exists.");
    }
    newTask.author = taskAuthor;
    return this.tasksRepository.save(newTask);
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async findById(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: { author: true },
    });
    if (!task) {
      throw new NotFoundException("specified task doesn't exists.");
    }
    return task;
  }

  async updateTask(id: number, dto: UpdateTaskDTO): Promise<Task> {
    const res = await this.tasksRepository.update({ id }, dto);
    if (res.affected === 0) {
      throw new NotFoundException("specified task doesn't exists.");
    }
    return this.findById(id);
  }

  async deleteTask(id: number): Promise<void> {
    const res = await this.tasksRepository.delete({ id });
    if (res.affected === 0) {
      throw new NotFoundException("specified task doesn't exists.");
    }
  }
}
