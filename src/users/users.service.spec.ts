import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const usersList = [
    {
      id: 'be77525e-b979-4660-a206-7a829b1e7394',
      email: 'test1@test.com',
      password: 'test1234',
      isEmailVerified: false,
      emailVerificationToken: 'abc123',
      customerProfile: {
        fullName: 'test user',
      },
    },
    {
      id: 'be77525e-b979-4660-a206-7a829b1e7327',
      email: 'ahmed@test.com',
      password: 'test1234',
      isEmailVerified: false,
      emailVerificationToken: 'def456',
      customerProfile: {
        fullName: 'test user',
      },
    },
    {
      id: 'be77525e-c979-4660-a206-7a829b1e7388',
      email: '3@test.com',
      password: 'test1234',
      isEmailVerified: false,
      emailVerificationToken: 'ghi789',
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
            find: jest
              .fn()
              .mockImplementation(({ skip = 0, take = 10 } = {}) => {
                return Promise.resolve(usersList.slice(skip, skip + take));
              }),
            findOne: jest
              .fn()
              .mockImplementation(
                ({ where: { id, emailVerificationToken } }) => {
                  if (id) {
                    return Promise.resolve(
                      usersList.find((user) => user.id === id) || null,
                    );
                  }
                  if (emailVerificationToken) {
                    return Promise.resolve(
                      usersList.find(
                        (user) =>
                          user.emailVerificationToken ===
                          emailVerificationToken,
                      ) || null,
                    );
                  }
                  return null;
                },
              ),
            create: jest.fn().mockReturnValue({
              id: 'new-user-id',
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
            save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns a list of users (paginated)', async () => {
    const users = await service.getAllUsers(0, 2);

    expect(users).toHaveLength(2);
    expect(users[0]).toMatchObject({
      id: 'be77525e-b979-4660-a206-7a829b1e7394',
      email: 'test1@test.com',
    });
  });

  it('returns a user by id', async () => {
    const user = await service.getUserById(
      'be77525e-b979-4660-a206-7a829b1e7394',
    );

    expect(user.id).toEqual('be77525e-b979-4660-a206-7a829b1e7394');
  });

  it('returns null if user not found', async () => {
    const user = await service.getUserById('non-existing-id');
    expect(user).toBeNull();
  });

  it('creates a user', async () => {
    const user = await service.createUser({
      email: 'asdasd@asd.test',
      password: 'sadas',
      customerProfile: {
        fullName: 'sadasd',
      },
    });
    expect(user.email).toEqual('test@test.com');
    expect(user.customerProfile.fullName).toEqual('test user');
  });
});
