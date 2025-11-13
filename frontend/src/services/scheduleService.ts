import api from '@/lib/api';

export interface Schedule {
  id: number;
  courseId: number;
  courseName: string;
  dayOfWeek: string; // Lunes, Martes, etc.
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  location?: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateScheduleInput {
  courseId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location?: string;
}

export const scheduleService = {
  async getAllSchedules(): Promise<Schedule[]> {
    const response = await api.get<Schedule[]>('/schedules');
    return response.data;
  },

  async getScheduleById(id: number): Promise<Schedule> {
    const response = await api.get<Schedule>(`/schedules/${id}`);
    return response.data;
  },

  async createSchedule(data: CreateScheduleInput): Promise<Schedule> {
    const response = await api.post<Schedule>('/schedules', data);
    return response.data;
  },

  async updateSchedule(id: number, data: Partial<CreateScheduleInput>): Promise<Schedule> {
    const response = await api.patch<Schedule>(`/schedules/${id}`, data);
    return response.data;
  },

  async deleteSchedule(id: number): Promise<void> {
    await api.delete(`/schedules/${id}`);
  },
};
