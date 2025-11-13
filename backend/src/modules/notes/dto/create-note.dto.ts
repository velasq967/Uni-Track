import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateNoteDto {
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título es requerido' })
  title: string;

  @IsString({ message: 'El contenido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El contenido es requerido' })
  content: string;

  @IsNumber({}, { message: 'El ID del curso debe ser un número' })
  @IsNotEmpty({ message: 'El ID del curso es requerido' })
  courseId: number;
}

export class UpdateNoteDto {
  @IsOptional()
  @IsString({ message: 'El título debe ser una cadena de texto' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'El contenido debe ser una cadena de texto' })
  content?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El ID del curso debe ser un número' })
  courseId?: number;
}
