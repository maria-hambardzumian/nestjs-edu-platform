import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from '../../src/users/users.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { UserRole } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should return user profile if found', async () => {
    const mockUser = { name: 'Maria', email: 'mm@example.com' };
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const result = await service.getProfile(1);
    expect(result).toEqual(mockUser);
  });

  it('should throw if profile not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(service.getProfile(1)).rejects.toThrow(NotFoundException);
  });

  it('should find user by email', async () => {
    const mockUser = { id: 1, email: 'mm@example.com' };
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const result = await service.findByEmail('john@example.com');
    expect(result).toEqual(mockUser);
  });

  it('should create a user', async () => {
    const dto: UserDto = {
      name: 'John',
      email: 'john@mail.com',
      password: 'pass123',
      role: UserRole.INSTRUCTOR,
    };
    const mockCreatedUser = { id: 2, ...dto };
    prismaMock.user.create.mockResolvedValue(mockCreatedUser);

    const result = await service.createUser(dto);
    expect(result).toEqual(mockCreatedUser);
  });
});
