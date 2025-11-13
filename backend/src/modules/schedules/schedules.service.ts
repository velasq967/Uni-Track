import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private schedulesRepository: Repository<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto, userId: number): Promise<Schedule> {
    const schedule = this.schedulesRepository.create({
      ...createScheduleDto,
      userId,
    });

    return await this.schedulesRepository.save(schedule);
  }

  async findAll(userId: number): Promise<Schedule[]> {
    return await this.schedulesRepository.find({
      where: { userId },
      relations: ['course'],
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Schedule> {
    const schedule = await this.schedulesRepository.findOne({
      where: { id, userId },
      relations: ['course'],
    });

    if (!schedule) {
      throw new NotFoundException('Horario no encontrado');
    }

    return schedule;
  }

  async findByDay(dayOfWeek: string, userId: number): Promise<Schedule[]> {
    return await this.schedulesRepository.find({
      where: { dayOfWeek, userId },
      relations: ['course'],
      order: { startTime: 'ASC' },
    });
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto, userId: number): Promise<Schedule> {
    const schedule = await this.findOne(id, userId);
    Object.assign(schedule, updateScheduleDto);
    return await this.schedulesRepository.save(schedule);
  }

  async remove(id: number, userId: number): Promise<void> {
    const schedule = await this.findOne(id, userId);
    await this.schedulesRepository.remove(schedule);
  }
}
