import { Test, TestingModule } from '@nestjs/testing';
import { Task } from './task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  const fakeTasks: Task[] = [
    { id: 1, name: 'Test task 1' },
    { id: 2, name: 'Test task 2' },
    { id: 3, name: 'Test task 3' },
  ];

  const mockTasksService = {
    createTask: jest.fn((dto) =>
      Promise.resolve({
        id: 1,
        name: dto.name,
      }),
    ),
    findAll: jest.fn(() => Promise.resolve(fakeTasks)),
    findById: jest.fn(() => Promise.resolve(fakeTasks[0])),
    updateTask: jest.fn((id, dto) =>
      Promise.resolve({ ...fakeTasks[0], ...dto }),
    ),
    deleteTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task', () => {
      const dto = { name: 'Test task', authorId: 1 };
      expect(controller.createTask(dto)).resolves.toEqual({
        id: expect.any(Number),
        name: dto.name,
      });
      expect(mockTasksService.createTask).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAll', () => {
    it('should get all tasks', () => {
      expect(controller.getAll()).resolves.toEqual(fakeTasks);
      expect(mockTasksService.findAll).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should get the target id task', () => {
      expect(controller.getById('1')).resolves.toEqual(fakeTasks[0]);
      expect(mockTasksService.findById).toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('should update the target task', () => {
      const dto = {
        name: 'Updated task',
      };
      expect(controller.updateTask('1', dto)).resolves.toEqual({
        ...fakeTasks[0],
        ...dto,
      });
      expect(mockTasksService.updateTask).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('deleteTask', () => {
    it('should delete the target task', () => {
      expect(controller.deleteTask('1')).toBe(undefined);
    });
  });
});
