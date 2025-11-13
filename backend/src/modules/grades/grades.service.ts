import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';
import { CreateGradeDto, UpdateGradeDto } from './dto/create-grade.dto';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private gradesRepository: Repository<Grade>,
  ) {}

  async create(createGradeDto: CreateGradeDto, userId: number): Promise<Grade> {
    const grade = this.gradesRepository.create({
      ...createGradeDto,
      userId,
    });

    return await this.gradesRepository.save(grade);
  }

  async findAll(userId: number): Promise<Grade[]> {
    return await this.gradesRepository.find({
      where: { userId },
      relations: ['course'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCourse(courseId: number, userId: number): Promise<Grade[]> {
    return await this.gradesRepository.find({
      where: { courseId, userId },
      relations: ['course'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Grade> {
    const grade = await this.gradesRepository.findOne({
      where: { id, userId },
      relations: ['course'],
    });

    if (!grade) {
      throw new NotFoundException('Calificación no encontrada');
    }

    return grade;
  }

  async update(id: number, updateGradeDto: UpdateGradeDto, userId: number): Promise<Grade> {
    const grade = await this.findOne(id, userId);
    Object.assign(grade, updateGradeDto);
    return await this.gradesRepository.save(grade);
  }

  async remove(id: number, userId: number): Promise<void> {
    const grade = await this.findOne(id, userId);
    await this.gradesRepository.remove(grade);
  }

  async findByType(type: string, userId: number): Promise<Grade[]> {
    return await this.gradesRepository.find({
      where: { type, userId },
      relations: ['course'],
      order: { date: 'DESC' },
    });
  }

  async getCourseAverage(courseId: number, userId: number): Promise<{ average: number; totalGrades: number; weightedAverage: number }> {
    const grades = await this.findByCourse(courseId, userId);
    
    if (grades.length === 0) {
      return { average: 0, totalGrades: 0, weightedAverage: 0 };
    }

    const totalScore = grades.reduce((sum, grade) => sum + grade.score, 0);
    const average = totalScore / grades.length;

    // Calcular promedio ponderado si hay pesos definidos
    const gradesWithWeight = grades.filter(grade => grade.weight && grade.weight > 0);
    let weightedSum = 0;
    let totalWeight = 0;

    if (gradesWithWeight.length > 0) {
      for (const grade of gradesWithWeight) {
        weightedSum += grade.score * (grade.weight / 100);
        totalWeight += grade.weight / 100;
      }
    }

    const weightedAverage = totalWeight > 0 ? weightedSum / totalWeight : average;

    return {
      average: Math.round(average * 100) / 100,
      totalGrades: grades.length,
      weightedAverage: Math.round(weightedAverage * 100) / 100,
    };
  }

  async getRecentGrades(userId: number, limit: number = 10): Promise<Grade[]> {
    return await this.gradesRepository.find({
      where: { userId },
      relations: ['course'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getGradesByDateRange(startDate: string, endDate: string, userId: number): Promise<Grade[]> {
    return await this.gradesRepository
      .createQueryBuilder('grade')
      .leftJoinAndSelect('grade.course', 'course')
      .where('grade.userId = :userId', { userId })
      .andWhere('grade.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('grade.date', 'DESC')
      .getMany();
  }
}
