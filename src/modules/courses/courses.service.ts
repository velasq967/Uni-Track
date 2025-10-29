import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto, UpdateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto, userId: number): Promise<Course> {
    const course = this.coursesRepository.create({
      ...createCourseDto,
      userId,
    });

    return await this.coursesRepository.save(course);
  }

  async findAll(userId: number): Promise<Course[]> {
    return await this.coursesRepository.find({
      where: { userId },
      relations: ['grades'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id, userId },
      relations: ['grades'],
    });

    if (!course) {
      throw new NotFoundException('Materia no encontrada');
    }

    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto, userId: number): Promise<Course> {
    const course = await this.findOne(id, userId);
    Object.assign(course, updateCourseDto);
    return await this.coursesRepository.save(course);
  }

  async remove(id: number, userId: number): Promise<void> {
    const course = await this.findOne(id, userId);
    await this.coursesRepository.remove(course);
  }

  async findBySemester(semester: string, userId: number): Promise<Course[]> {
    return await this.coursesRepository.find({
      where: { semester, userId },
      relations: ['grades'],
      order: { name: 'ASC' },
    });
  }

  async findByYear(year: string, userId: number): Promise<Course[]> {
    return await this.coursesRepository.find({
      where: { year, userId },
      relations: ['grades'],
      order: { name: 'ASC' },
    });
  }

  async getActiveCourses(userId: number): Promise<Course[]> {
    return await this.coursesRepository.find({
      where: { isActive: true, userId },
      relations: ['grades'],
      order: { name: 'ASC' },
    });
  }

  async calculateGPA(userId: number): Promise<{ gpa: number; totalCredits: number; weightedSum: number }> {
    const courses = await this.coursesRepository.find({
      where: { userId },
      relations: ['grades'],
    });

    let totalCredits = 0;
    let weightedSum = 0;

    for (const course of courses) {
      if (course.grades && course.grades.length > 0) {
        const courseAverage = course.grades.reduce((sum, grade) => sum + grade.score, 0) / course.grades.length;
        const credits = course.credits || 0;
        
        totalCredits += credits;
        weightedSum += courseAverage * credits;
      }
    }

    const gpa = totalCredits > 0 ? weightedSum / totalCredits : 0;

    return {
      gpa: Math.round(gpa * 100) / 100, // Redondear a 2 decimales
      totalCredits,
      weightedSum,
    };
  }
}
