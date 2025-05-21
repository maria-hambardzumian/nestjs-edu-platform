import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  @Post()
  @Roles(UserRole.INSTRUCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @Request() req: AuthRequest,
  ) {
    const instructorId = req.user.userId;
    return this.coursesService.create(createCourseDto, instructorId);
  }

  @Post(':id/lessons')
  @Roles(UserRole.INSTRUCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  addLessonToCourse(
    @Param('id', ParseIntPipe) courseId: number,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return this.coursesService.addLesson(courseId, createLessonDto);
  }

  @Post(':id/enroll')
  @Roles(UserRole.STUDENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  enrollInCourse(
    @Param('id', ParseIntPipe) courseId: number,
    @Request() req: AuthRequest,
  ) {
    const studentId = req.user.userId;
    return this.coursesService.enrollInCourse(courseId, studentId);
  }

  @Get(':id/lessons')
  @Roles(UserRole.STUDENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getLessons(
    @Param('id', ParseIntPipe) courseId: number,
    @Request() req: AuthRequest,
  ) {
    const studentId = req.user.userId;
    return this.coursesService.getLessons(courseId, studentId);
  }
}
