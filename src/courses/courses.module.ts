import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { QaModule } from 'src/qa/qa.module';

@Module({
  providers: [CoursesService, JwtService, PrismaService],
  controllers: [CoursesController],
})
export class CoursesModule {}
