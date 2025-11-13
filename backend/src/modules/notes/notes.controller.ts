import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/create-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    return this.notesService.create(createNoteDto, req.user.id);
  }

  @Get()
  findAll(@Request() req, @Query('courseId') courseId?: string) {
    if (courseId) {
      return this.notesService.findByCourse(+courseId, req.user.id);
    }
    return this.notesService.findAll(req.user.id);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string, @Request() req) {
    return this.notesService.findByCourse(+courseId, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.notesService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto, @Request() req) {
    return this.notesService.update(+id, updateNoteDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.notesService.remove(+id, req.user.id);
  }
}
