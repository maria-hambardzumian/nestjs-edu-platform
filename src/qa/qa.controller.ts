import {
  Controller,
  Post,
  Param,
  Body,
  Request,
  UseGuards,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { QaService } from './qa.service';
import { MessageDto } from './dto/message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class QaController {
  constructor(private readonly qaService: QaService) {}

  @Post('lessons/:id/questions')
  @Roles(UserRole.STUDENT)
  askQuestion(
    @Param('id', ParseIntPipe) lessonId: number,
    @Body() question: MessageDto,
    @Request() req: AuthRequest,
  ) {
    const studentId = req.user.userId;
    const { content } = question;
    return this.qaService.askQuestion(lessonId, studentId, content);
  }

  @Post('questions/:id/answer')
  @Roles(UserRole.INSTRUCTOR)
  answerQuestion(
    @Param('id', ParseIntPipe) questionId: number,
    @Body() answer: MessageDto,
    @Request() req: AuthRequest,
  ) {
    const instructorId = req.user.userId;
    const { content } = answer;
    return this.qaService.answerQuestion(questionId, instructorId, content);
  }

  @Get('courses/:courseId/questions')
  @Roles(UserRole.STUDENT, UserRole.INSTRUCTOR)
  getQuestionsForCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Request() req: AuthRequest,
  ) {
    const userId = req.user.userId;
    const userRole = req.user.userRole;
    return this.qaService.getQuestionsForCourse(
      courseId,
      userId,
      userRole === UserRole.STUDENT,
    );
  }
}
