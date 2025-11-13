import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courseId: number;

  @Column()
  dayOfWeek: string; // Lunes, Martes, etc.

  @Column()
  startTime: string; // HH:MM

  @Column()
  endTime: string;

  @Column({ nullable: true })
  location?: string;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'courseId' })
  course: Course;
}
