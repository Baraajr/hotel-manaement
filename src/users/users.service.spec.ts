import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  const usersList = [
    {
      id: 'be77525e-b979-4660-a206-7a829b1e7394',
      email: 'test1@test.com',
      password: 'test1234',
      customerProfile: {
        fullName: 'test user',
      },
    },
    {
      id: 'be77525e-b979-4660-a206-7a829b1e7327',
      email: 'ahmed@test.com',
      password: 'test1234',
      customerProfile: {
        fullName: 'test user',
      },
    },
    {
      id: 'be77525e-c979-4660-a206-7a829b1e7388',
      email: '3@test.com',
      password: 'test1234',
      customerProfile: {
        fullName: 'test user',
      },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            // mock methods you expect to call in your controller
            find: jest.fn().mockReturnValue(usersList),
            findOne: jest.fn().mockImplementation(({ where: { id } }) => {
              return Promise.resolve(
                usersList.find((user) => user.id === id) || null,
              );
            }),
            create: jest.fn().mockReturnValue({
              id: 'be77525e-b979-4660-a206-7a829b1e7394',
              email: 'test@test.com',
              password: 'test1234',
              customerProfile: {
                fullName: 'test user',
              },
            }),
            update: jest.fn().mockResolvedValue({
              id: 'be77525e-b979-4660-a206-7a829b1e7394',
              email: 'test@test.com',
              customerProfile: {
                fullName: 'test user',
              },
            }),
            save: () => {},
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns a list of users', async () => {
    const users = await service.getAllUsers(15, 10);

    expect(users).toBeDefined();
    expect(users[0]).toMatchObject({
      id: 'be77525e-b979-4660-a206-7a829b1e7394',
      email: 'test1@test.com',
      password: 'test1234',
      customerProfile: {
        fullName: 'test user',
      },
    });
  });

  it('returns a user', async () => {
    const user = await service.getUserById(
      'be77525e-b979-4660-a206-7a829b1e7394',
    );

    expect(user.id).toEqual('be77525e-b979-4660-a206-7a829b1e7394');
  });

  it('creates a user', async () => {
    const user = await service.createUser({
      email: 'test@test.com',
      password: 'test1234',
      fullName: 'test user',
    });

    expect(user.email).toEqual('test@test.com');
    expect(user.customerProfile.fullName).toEqual('test user');
  });
});
