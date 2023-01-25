import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const fakeUsers: User[] = [
    {
      id: 1,
      name: 'Test user 1',
    },
    {
      id: 2,
      name: 'Test user 2',
    },
    {
      id: 3,
      name: 'Test user 3',
    },
  ];

  const mockUsersService = {
    createUser: jest.fn((dto) => ({
      id: Date.now(),
      ...dto,
    })),
    findAllUsers: jest.fn(() => {
      return fakeUsers;
    }),
    findById: jest.fn((id) => {
      return fakeUsers.find((user) => user.id === id);
    }),
    updateUser: jest.fn((id, dto) => ({
      id: id,
      ...dto,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    const dto = { name: 'Taro' };
    expect(controller.createUser(dto)).toEqual({
      id: expect.any(Number),
      name: dto.name,
    });
    expect(mockUsersService.createUser).toHaveBeenCalledWith(dto);
  });

  it('should get all users', () => {
    expect(controller.findAllUsers()).toEqual(fakeUsers);
    expect(mockUsersService.findAllUsers).toHaveBeenCalled();
  });

  it('should get the target id user', () => {
    const user = fakeUsers.find((user) => user.id === 1);
    expect(controller.findById('1')).toEqual(user);
  });

  it('should update a user', () => {
    const dto = { name: 'Taro' };

    expect(controller.updateUser('1', dto)).toEqual({
      id: 1,
      ...dto,
    });
    expect(mockUsersService.updateUser).toHaveBeenCalled();
  });
});
