import { Module } from '@nestjs/common';
import { QaService } from './qa.service';
import { QaController } from './qa.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CoursesService } from '../courses/courses.service';

@Module({
  providers: [QaService, PrismaService, CoursesService, JwtService],
  controllers: [QaController],
})
export class QaModule {}
