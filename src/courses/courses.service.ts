import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Inject PrismaService
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Course, Lesson } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCourseDto: CreateCourseDto,
    instructorId: number,
  ): Promise<Course> {
    return this.prisma.course.create({
      data: {
        title: createCourseDto.title,
        description: createCourseDto.description || '',
        instructorId,
      },
    });
  }
  async assertCourseExists(courseId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
  }

  async addLesson(
    courseId: number,
    createLessonDto: CreateLessonDto,
  ): Promise<Lesson> {
    await this.assertCourseExists(courseId);

    return this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        details: createLessonDto.details || '',
        courseId,
      },
    });
  }

  async enrollInCourse(courseId: number, studentId: number) {
    await this.assertCourseExists(courseId);
    try {
      await this.prisma.enrollment.create({
        data: {
          studentId,
          courseId,
        },
      });
      return `You have successfully enrolled course with ID ${courseId}`;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async assertEnrollmentExists(courseId: number, studentId: number) {
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId,
        courseId,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('You are not enrolled in this course');
    }
  }

  async getLessons(courseId: number, studentId: number) {
    await this.assertCourseExists(courseId);
    await this.assertEnrollmentExists(courseId, studentId);
    return this.prisma.lesson.findMany({
      where: {
        courseId,
      },
    });
  }
}
