import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto, UpdateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: number): Promise<Note> {
    const note = this.notesRepository.create({
      ...createNoteDto,
      userId,
    });

    return await this.notesRepository.save(note);
  }

  async findAll(userId: number): Promise<Note[]> {
    return await this.notesRepository.find({
      where: { userId },
      relations: ['course'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id, userId },
      relations: ['course'],
    });

    if (!note) {
      throw new NotFoundException('Nota no encontrada');
    }

    return note;
  }

  async findByCourse(courseId: number, userId: number): Promise<Note[]> {
    return await this.notesRepository.find({
      where: { courseId, userId },
      relations: ['course'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, userId: number): Promise<Note> {
    const note = await this.findOne(id, userId);
    Object.assign(note, updateNoteDto);
    return await this.notesRepository.save(note);
  }

  async remove(id: number, userId: number): Promise<void> {
    const note = await this.findOne(id, userId);
    await this.notesRepository.remove(note);
  }
}
