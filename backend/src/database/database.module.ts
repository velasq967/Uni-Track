import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../modules/users/entities/user.entity';
import { Course } from '../modules/courses/entities/course.entity';
import { Grade } from '../modules/grades/entities/grade.entity';
import { Note } from '../modules/notes/entities/note.entity';
import { Schedule } from '../modules/schedules/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DB_DATABASE', 'unitrack.db'),
        entities: [User, Course, Grade, Note, Schedule],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
        logging: configService.get<boolean>('DB_LOGGING', true),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
