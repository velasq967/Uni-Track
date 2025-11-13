import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';

export class CreateCourseDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de la materia es requerido' })
  name: string;

  @IsOptional()
  @IsString({ message: 'El código debe ser una cadena de texto' })
  code?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string;

  @IsOptional()
  @IsInt({ message: 'Los créditos deben ser un número entero' })
  @Min(0, { message: 'Los créditos deben ser mayor o igual a 0' })
  credits?: number;

  @IsOptional()
  @IsString({ message: 'El profesor debe ser una cadena de texto' })
  professor?: string;

  @IsOptional()
  @IsString({ message: 'El semestre debe ser una cadena de texto' })
  semester?: string;

  @IsOptional()
  @IsString({ message: 'El año debe ser una cadena de texto' })
  year?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  isActive?: boolean;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'El código debe ser una cadena de texto' })
  code?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string;

  @IsOptional()
  @IsInt({ message: 'Los créditos deben ser un número entero' })
  @Min(0, { message: 'Los créditos deben ser mayor o igual a 0' })
  credits?: number;

  @IsOptional()
  @IsString({ message: 'El profesor debe ser una cadena de texto' })
  professor?: string;

  @IsOptional()
  @IsString({ message: 'El semestre debe ser una cadena de texto' })
  semester?: string;

  @IsOptional()
  @IsString({ message: 'El año debe ser una cadena de texto' })
  year?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  isActive?: boolean;
}
