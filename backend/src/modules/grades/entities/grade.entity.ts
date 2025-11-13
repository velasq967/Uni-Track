import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  type: string; // examen, tarea, proyecto, quiz, etc.

  @Column({ nullable: true })
  weight: number; // peso de la calificación (porcentaje)

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ nullable: true })
  comments: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.grades)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Course, course => course.grades)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: number;
}
