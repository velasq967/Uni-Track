import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/create-schedule.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('schedules')
@UseGuards(JwtAuthGuard)
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto, @Request() req) {
    return this.schedulesService.create(createScheduleDto, req.user.id);
  }

  @Get()
  findAll(@Request() req, @Query('day') day?: string) {
    if (day) {
      return this.schedulesService.findByDay(day, req.user.id);
    }
    return this.schedulesService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.schedulesService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto, @Request() req) {
    return this.schedulesService.update(+id, updateScheduleDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.schedulesService.remove(+id, req.user.id);
  }
}
