import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto, UpdateGradeDto } from './dto/create-grade.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('grades')
@UseGuards(JwtAuthGuard)
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  create(@Body() createGradeDto: CreateGradeDto, @Request() req) {
    return this.gradesService.create(createGradeDto, req.user.id);
  }

  @Get()
  findAll(@Request() req, @Query('courseId') courseId?: string, @Query('type') type?: string) {
    if (courseId) {
      return this.gradesService.findByCourse(+courseId, req.user.id);
    }
    if (type) {
      return this.gradesService.findByType(type, req.user.id);
    }
    return this.gradesService.findAll(req.user.id);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string, @Request() req) {
    return this.gradesService.findByCourse(+courseId, req.user.id);
  }

  @Get('recent')
  getRecentGrades(@Request() req, @Query('limit') limit?: string) {
    return this.gradesService.getRecentGrades(req.user.id, limit ? +limit : 10);
  }

  @Get('date-range')
  getGradesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
  ) {
    return this.gradesService.getGradesByDateRange(startDate, endDate, req.user.id);
  }

  @Get('course/:courseId/average')
  getCourseAverage(@Param('courseId') courseId: string, @Request() req) {
    return this.gradesService.getCourseAverage(+courseId, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.gradesService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGradeDto: UpdateGradeDto, @Request() req) {
    return this.gradesService.update(+id, updateGradeDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.gradesService.remove(+id, req.user.id);
  }
}
