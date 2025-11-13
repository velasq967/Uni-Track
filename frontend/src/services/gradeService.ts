import api from '@/lib/api';

export interface Grade {
  id: number;
  score: number;
  weight?: number; // porcentaje
  description?: string;
  type?: string; // examen, tarea, proyecto, quiz
  date?: Date;
  comments?: string;
  courseId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGradeInput {
  score: number;
  weight?: number;
  description?: string;
  type?: string;
  date?: string;
  comments?: string;
  courseId: number;
}

export interface UpdateGradeInput {
  score?: number;
  weight?: number;
  description?: string;
  type?: string;
  date?: string;
  comments?: string;
}

export const gradeService = {
  async getGradesByCourse(courseId: number): Promise<Grade[]> {
    const response = await api.get<Grade[]>(`/grades/course/${courseId}`);
    return response.data;
  },

  async getGradeById(id: number): Promise<Grade> {
    const response = await api.get<Grade>(`/grades/${id}`);
    return response.data;
  },

  async createGrade(data: CreateGradeInput): Promise<Grade> {
    const response = await api.post<Grade>('/grades', data);
    return response.data;
  },

  async updateGrade(id: number, data: UpdateGradeInput): Promise<Grade> {
    const response = await api.patch<Grade>(`/grades/${id}`, data);
    return response.data;
  },

  async deleteGrade(id: number): Promise<void> {
    await api.delete(`/grades/${id}`);
  },

  calculateWeightedAverage(grades: Grade[]): number {
    if (grades.length === 0) return 0;
    
    const gradesWithWeight = grades.filter(g => g.weight && g.weight > 0);
    if (gradesWithWeight.length === 0) {
      return Math.round((grades.reduce((sum, g) => sum + g.score, 0) / grades.length) * 100) / 100;
    }

    const totalWeight = gradesWithWeight.reduce((sum, g) => sum + (g.weight || 0), 0);
    const weightedSum = gradesWithWeight.reduce((sum, g) => sum + (g.score * (g.weight || 0)), 0);
    return Math.round((weightedSum / totalWeight) * 100) / 100;
  },
};
