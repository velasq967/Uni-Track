import api from '@/lib/api';

export interface Course {
  id: number;
  name: string;
  code: string;
  description?: string;
  credits: number;
  professor?: string;
  semester?: string;
  year?: string;
  isActive: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  grades?: Grade[];
}

export interface Grade {
  id: number;
  score: number;
  weight?: number;
  description?: string;
  courseId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseInput {
  name: string;
  code?: string;
  description?: string;
  credits: number;
  professor?: string;
  semester?: string;
  year?: string;
}

export interface UpdateCourseInput {
  name?: string;
  code?: string;
  description?: string;
  credits?: number;
  professor?: string;
  semester?: string;
  year?: string;
  isActive?: boolean;
}

export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    const response = await api.get<Course[]>('/courses');
    return response.data;
  },

  async getActiveCourses(): Promise<Course[]> {
    const response = await api.get<Course[]>('/courses/active');
    return response.data;
  },

  async getCourseById(id: number): Promise<Course> {
    const response = await api.get<Course>(`/courses/${id}`);
    return response.data;
  },

  async createCourse(data: CreateCourseInput): Promise<Course> {
    const response = await api.post<Course>('/courses', data);
    return response.data;
  },

  async updateCourse(id: number, data: UpdateCourseInput): Promise<Course> {
    const response = await api.patch<Course>(`/courses/${id}`, data);
    return response.data;
  },

  async deleteCourse(id: number): Promise<void> {
    await api.delete(`/courses/${id}`);
  },

  async getCoursesByYear(year: string): Promise<Course[]> {
    const response = await api.get<Course[]>('/courses', { params: { year } });
    return response.data;
  },

  async getCourseBySemester(semester: string): Promise<Course[]> {
    const response = await api.get<Course[]>('/courses', { params: { semester } });
    return response.data;
  },

  async calculateGPA(): Promise<{ gpa: number; totalCredits: number; weightedSum: number }> {
    const response = await api.get<{ gpa: number; totalCredits: number; weightedSum: number }>('/courses/gpa');
    return response.data;
  },
};

export const gradeService = {
  async getGradesByCourse(courseId: number): Promise<Grade[]> {
    const response = await api.get<Grade[]>(`/grades/course/${courseId}`);
    return response.data;
  },

  async createGrade(courseId: number, data: { score: number; weight?: number; description?: string; type?: string; date?: string }): Promise<Grade> {
    const response = await api.post<Grade>('/grades', { ...data, courseId });
    return response.data;
  },

  async updateGrade(gradeId: number, data: { score?: number; weight?: number; description?: string; type?: string; date?: string }): Promise<Grade> {
    const response = await api.patch<Grade>(`/grades/${gradeId}`, data);
    return response.data;
  },

  async deleteGrade(gradeId: number): Promise<void> {
    await api.delete(`/grades/${gradeId}`);
  },
};
