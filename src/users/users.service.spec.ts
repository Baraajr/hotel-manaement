import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            // mock methods you expect to call in your controller
            find: jest.fn().mockReturnValue([]),
            findOne: jest.fn().mockReturnValue({ id: 1, name: 'Test User' }),
            create: jest.fn().mockReturnValue({ id: 1, name: 'New User' }),
            update: jest.fn().mockResolvedValue({ id: 1, name: 'New User' }),
            remove: jest.fn().mockResolvedValue({ id: 1, name: 'New User' }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
