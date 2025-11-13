import api from '@/lib/api';

export interface Note {
  id: number;
  title: string;
  content: string;
  courseId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  courseId: number;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
}

export const noteService = {
  async getAllNotes(): Promise<Note[]> {
    const response = await api.get<Note[]>('/notes');
    return response.data;
  },

  async getNoteById(id: number): Promise<Note> {
    const response = await api.get<Note>(`/notes/${id}`);
    return response.data;
  },

  async getNotesByCourse(courseId: number): Promise<Note[]> {
    const response = await api.get<Note[]>(`/notes/course/${courseId}`);
    return response.data;
  },

  async createNote(data: CreateNoteInput): Promise<Note> {
    const response = await api.post<Note>('/notes', data);
    return response.data;
  },

  async updateNote(id: number, data: UpdateNoteInput): Promise<Note> {
    const response = await api.patch<Note>(`/notes/${id}`, data);
    return response.data;
  },

  async deleteNote(id: number): Promise<void> {
    await api.delete(`/notes/${id}`);
  },
};
