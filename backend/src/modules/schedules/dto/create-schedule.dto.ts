import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateScheduleDto {
  @IsNumber({}, { message: 'El ID del curso debe ser un número' })
  @IsNotEmpty({ message: 'El ID del curso es requerido' })
  courseId: number;

  @IsString({ message: 'El día debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El día es requerido' })
  dayOfWeek: string;

  @IsString({ message: 'La hora de inicio debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La hora de inicio es requerida' })
  startTime: string;

  @IsString({ message: 'La hora de fin debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La hora de fin es requerida' })
  endTime: string;

  @IsOptional()
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  location?: string;
}

export class UpdateScheduleDto {
  @IsOptional()
  @IsNumber({}, { message: 'El ID del curso debe ser un número' })
  courseId?: number;

  @IsOptional()
  @IsString({ message: 'El día debe ser una cadena de texto' })
  dayOfWeek?: string;

  @IsOptional()
  @IsString({ message: 'La hora de inicio debe ser una cadena de texto' })
  startTime?: string;

  @IsOptional()
  @IsString({ message: 'La hora de fin debe ser una cadena de texto' })
  endTime?: string;

  @IsOptional()
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  location?: string;
}
