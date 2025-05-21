import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLessonDto {
  id: number;
  courseId: number;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  details?: string;
}
