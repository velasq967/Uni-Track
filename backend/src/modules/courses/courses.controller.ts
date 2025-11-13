import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @Request() req) {
    return this.coursesService.create(createCourseDto, req.user.id);
  }

  @Get()
  findAll(@Request() req, @Query('semester') semester?: string, @Query('year') year?: string) {
    if (semester) {
      return this.coursesService.findBySemester(semester, req.user.id);
    }
    if (year) {
      return this.coursesService.findByYear(year, req.user.id);
    }
    return this.coursesService.findAll(req.user.id);
  }

  @Get('active')
  getActiveCourses(@Request() req) {
    return this.coursesService.getActiveCourses(req.user.id);
  }

  @Get('gpa')
  calculateGPA(@Request() req) {
    return this.coursesService.calculateGPA(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.coursesService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto, @Request() req) {
    return this.coursesService.update(+id, updateCourseDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.coursesService.remove(+id, req.user.id);
  }
}
