import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { UsersService } from './../users/users.service';
import { User } from './../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User])],
  providers: [TasksService, UsersService],
  controllers: [TasksController],
})
export class TasksModule {}
