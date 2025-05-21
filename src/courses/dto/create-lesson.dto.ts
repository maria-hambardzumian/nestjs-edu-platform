import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLessonDto {
  courseId: number;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  details?: string;
}
