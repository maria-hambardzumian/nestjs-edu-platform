import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { QaModule } from './qa/qa.module';

@Module({
  imports: [UsersModule, AuthModule, CoursesModule, QaModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
