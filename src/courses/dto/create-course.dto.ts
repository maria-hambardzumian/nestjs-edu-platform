import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCourseDto {
  id: number;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;
}
