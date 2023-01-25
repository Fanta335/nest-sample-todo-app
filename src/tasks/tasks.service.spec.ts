import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepo: Repository<Task>;
  let userRepo: Repository<User>;
  const testTask = {
    id: 1,
    name: 'Test task 1',
  };
  const testUser = {
    id: 1,
    name: 'Test user 1',
  };
  const testTaskArray = [
    {
      id: 1,
      name: 'Test task 1',
    },
    {
      id: 2,
      name: 'Test task 2',
    },
    {
      id: 3,
      name: 'Test task 3',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        UsersService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            find: jest.fn().mockResolvedValue(testTaskArray),
            findOne: jest.fn().mockResolvedValue(testTask),
            create: jest.fn().mockReturnValue(testTask),
            save: jest
              .fn()
              .mockResolvedValue({ ...testTask, author: testUser }),
            update: jest
              .fn()
              .mockResolvedValue({ raw: 1, affected: 1, generatedMaps: [] }),
            delete: jest
              .fn()
              .mockResolvedValue({ raw: 1, affected: 1, generatedMaps: [] }),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(testUser),
          },
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepo = module.get<Repository<Task>>(getRepositoryToken(Task));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  describe('createTask', () => {
    it('should successfully save a task', () => {
      const dto = {
        name: 'Test task 1',
        authorId: 1,
      };
      expect(tasksService.createTask(dto)).resolves.toEqual({
        ...testTask,
        author: testUser,
      });
      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(taskRepo.create).toHaveBeenCalledWith({
        name: testTask.name,
      });
    });
  });

  describe('findAll', () => {
    it('should get task array', () => {
      expect(tasksService.findAll()).resolves.toEqual(testTaskArray);
    });
  });

  describe('findById', () => {
    it('should get the target task', () => {
      expect(tasksService.findById(1)).resolves.toEqual(testTask);
    });
  });

  describe('udpateTask', () => {
    it('should updated the target task', () => {
      const dto = {
        name: 'Updated task',
      };
      jest
        .spyOn(taskRepo, 'findOne')
        .mockImplementationOnce(() =>
          Promise.resolve({ ...testTask, author: testUser, name: dto.name }),
        );
      jest
        .spyOn(taskRepo, 'update')
        .mockImplementation((id, dto) =>
          Promise.resolve({ raw: id, affected: 1, generatedMaps: [dto] }),
        );
      expect(tasksService.updateTask(1, dto)).resolves.toEqual({
        ...testTask,
        name: dto.name,
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete the target task', () => {
      expect(tasksService.deleteTask(1)).resolves.toBe(undefined);
    });
  });
});
