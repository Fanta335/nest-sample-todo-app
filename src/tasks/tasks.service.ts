import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
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
    const taskAuthor = await this.usersService.findById(authorId);
    if (!taskAuthor) {
      throw new NotFoundException("specified user doesn't exists.");
    }
    const newTask = new Task();
    newTask.name = name;
    newTask.author = taskAuthor;
    console.log('new task: ', newTask);
    return this.tasksRepository.save(newTask);
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: { author: true } });
  }

  async findById(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
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
    return this.tasksRepository.findOneBy({ id });
  }

  async deleteTask(id: number): Promise<void> {
    const res = await this.tasksRepository.delete({ id });
    if (res.affected === 0) {
      throw new NotFoundException("specified task doesn't exists.");
    }
  }
}
