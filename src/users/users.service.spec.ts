import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const fakeUsers: User[] = [
    {
      id: 1,
      name: 'Test user 1',
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Test user 2',
      createdAt: new Date(),
    },
    {
      id: 3,
      name: 'Test user 3',
      createdAt: new Date(),
    },
  ];

  const oneFakeUser = {
    id: 1,
    name: 'Test user 1',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user record and return that', async () => {
      jest.spyOn(repo, 'create').mockImplementationOnce(() => oneFakeUser);
      jest.spyOn(repo, 'save').mockImplementationOnce(async () => oneFakeUser);

      expect(await service.createUser({ name: oneFakeUser.name })).toEqual(
        oneFakeUser,
      );
      expect(repo.create).toHaveBeenCalledTimes(1);
      expect(repo.create).toHaveBeenCalledWith({ name: oneFakeUser.name });
      expect(repo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllUsers', () => {
    it('should find all users', () => {
      jest.spyOn(repo, 'find').mockImplementationOnce(async () => fakeUsers);
      expect(service.findAllUsers()).resolves.toEqual(fakeUsers);
    });
  });

  describe('findById', () => {
    it('should find one user', () => {
      jest
        .spyOn(repo, 'findOneBy')
        .mockImplementationOnce(async () => oneFakeUser);
      expect(service.findById(1)).resolves.toEqual(oneFakeUser);
      expect(repo.findOneBy).toBeCalledWith({ id: 1 });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      jest.spyOn(repo, 'update').mockImplementationOnce(async (id, dto) => ({
        raw: id,
        affected: 1,
        generatedMaps: [dto],
      }));
      jest
        .spyOn(repo, 'findOneBy')
        .mockImplementationOnce(async () => oneFakeUser);
      expect(await service.updateUser(1, { name: 'Updated name' })).toEqual(
        oneFakeUser,
      );
    });
  });
});
