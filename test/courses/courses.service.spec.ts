import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from '../../src/courses/courses.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCourseDto } from '../../src/courses/dto/create-course.dto';
import { CreateLessonDto } from '../../src/courses/dto/create-lesson.dto';

describe('CoursesService', () => {
  let service: CoursesService;
  let prisma: PrismaService;

  const mockPrisma = {
    course: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    lesson: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    enrollment: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create a course', async () => {
      const dto: CreateCourseDto = {
        title: 'NestJS Basics',
        description: 'hello',
      };
      const mockCourse = {
        title: dto.title,
        description: 'hello',
        instructorId: 1,
      };

      mockPrisma.course.create.mockResolvedValue(mockCourse);

      const result = await service.create(dto, 1);
      expect(result).toEqual(mockCourse);
      expect(mockPrisma.course.create).toHaveBeenCalledWith({
        data: {
          title: dto.title,
          description: 'hello',
          instructorId: 1,
        },
      });
    });
  });

  describe('addLesson()', () => {
    it('should add a lesson to an existing course', async () => {
      const courseId = 1;
      const dto: CreateLessonDto = { title: 'Intro to Modules', courseId };
      const mockLesson = { id: 1, title: dto.title, details: '', courseId };

      mockPrisma.course.findUnique.mockResolvedValue({ id: courseId });
      mockPrisma.lesson.create.mockResolvedValue(mockLesson);

      const result = await service.addLesson(courseId, dto);
      expect(result).toEqual(mockLesson);
    });

    it('should throw if course does not exist', async () => {
      mockPrisma.course.findUnique.mockResolvedValue(null);

      await expect(
        service.addLesson(99, { title: 'X', courseId: 99 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('enrollInCourse()', () => {
    it('should enroll a student', async () => {
      mockPrisma.course.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.enrollment.create.mockResolvedValue({ id: 1 });

      const result = await service.enrollInCourse(1, 1);
      expect(result).toContain('successfully enrolled');
    });

    it('should throw BadRequestException on duplicate enrollment', async () => {
      mockPrisma.course.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.enrollment.create.mockRejectedValue(new Error('Duplicate'));

      await expect(service.enrollInCourse(1, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getLessons()', () => {
    it('should return lessons if student is enrolled', async () => {
      mockPrisma.course.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.enrollment.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.lesson.findMany.mockResolvedValue([
        { id: 1, title: 'Lesson 1', courseId: 1 },
      ]);

      const result = await service.getLessons(1, 1);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should throw if not enrolled', async () => {
      mockPrisma.course.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.enrollment.findFirst.mockResolvedValue(null);

      await expect(service.getLessons(1, 2)).rejects.toThrow(NotFoundException);
    });
  });
});
