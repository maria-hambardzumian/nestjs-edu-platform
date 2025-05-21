import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Question } from '@prisma/client';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class QaService {
  constructor(
    private prisma: PrismaService,
    private courses: CoursesService,
  ) {}

  async askQuestion(
    lessonId: number,
    studentId: number,
    question: string,
  ): Promise<Question> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const existingQuestion = await this.prisma.question.findFirst({
      where: { content: question, lessonId },
    });

    if (existingQuestion) {
      return existingQuestion;
    }

    return this.prisma.question.create({
      data: {
        content: question,
        lessonId,
        studentId,
      },
    });
  }

  async answerQuestion(
    questionId: number,
    instructorId: number,
    answer: string,
  ) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { lesson: true },
    });

    if (!question) throw new NotFoundException('Question not found');

    const course = await this.prisma.course.findUnique({
      where: { id: question.lesson.courseId },
    });

    if (!course || course.instructorId !== instructorId) {
      throw new ForbiddenException(
        'You are not allowed to answer this question',
      );
    }

    return this.prisma.question.update({
      where: { id: questionId },
      data: { answer },
    });
  }

  async getQuestionsForCourse(
    courseId: number,
    studentId: number,
    checkEnrollment: boolean,
  ) {
    if (checkEnrollment) {
      await this.courses.assertEnrollmentExists(courseId, studentId);
    }
    return this.prisma.question.findMany({
      where: { lesson: { courseId } },
      select: {
        id: true,
        content: true,
        answer: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
