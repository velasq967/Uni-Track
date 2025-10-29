import { IsNumber, IsNotEmpty, IsOptional, IsString, IsDateString, Min, Max } from 'class-validator';

export class CreateGradeDto {
  @IsNumber({}, { message: 'La calificación debe ser un número' })
  @Min(0, { message: 'La calificación no puede ser menor a 0' })
  @Max(100, { message: 'La calificación no puede ser mayor a 100' })
  @IsNotEmpty({ message: 'La calificación es requerida' })
  score: number;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'El tipo debe ser una cadena de texto' })
  type?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El peso debe ser un número' })
  @Min(0, { message: 'El peso no puede ser menor a 0' })
  @Max(100, { message: 'El peso no puede ser mayor a 100' })
  weight?: number;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener un formato válido' })
  date?: string;

  @IsOptional()
  @IsString({ message: 'Los comentarios deben ser una cadena de texto' })
  comments?: string;

  @IsNumber({}, { message: 'El ID del curso debe ser un número' })
  @IsNotEmpty({ message: 'El ID del curso es requerido' })
  courseId: number;
}

export class UpdateGradeDto {
  @IsOptional()
  @IsNumber({}, { message: 'La calificación debe ser un número' })
  @Min(0, { message: 'La calificación no puede ser menor a 0' })
  @Max(100, { message: 'La calificación no puede ser mayor a 100' })
  score?: number;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'El tipo debe ser una cadena de texto' })
  type?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El peso debe ser un número' })
  @Min(0, { message: 'El peso no puede ser menor a 0' })
  @Max(100, { message: 'El peso no puede ser mayor a 100' })
  weight?: number;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener un formato válido' })
  date?: string;

  @IsOptional()
  @IsString({ message: 'Los comentarios deben ser una cadena de texto' })
  comments?: string;
}
