import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BookOpen, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { courseService, Course } from "@/services/courseService";
import { scheduleService } from "@/services/scheduleService";

interface SubjectDisplay extends Course {
  color: string;
  grade: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<SubjectDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newSubject, setNewSubject] = useState({
    name: "",
    description: "",
    credits: "",
    professor: "",
    semester: "",
  });

  const [editSubject, setEditSubject] = useState({
    name: "",
    description: "",
    credits: "",
    professor: "",
    semester: "",
  });

  const [schedulesList, setSchedulesList] = useState<Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    location: string;
  }>>([
    {
      dayOfWeek: "Lunes",
      startTime: "08:00",
      endTime: "10:00",
      location: "",
    }
  ]);

  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"];

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const courses = await courseService.getAllCourses();
      const displaySubjects: SubjectDisplay[] = courses.map((course, index) => {
        const avgGrade = course.grades && course.grades.length > 0
          ? Math.round(course.grades.reduce((sum, g) => sum + g.score, 0) / course.grades.length)
          : 0;
        
        return {
          ...course,
          color: colors[index % colors.length],
          grade: avgGrade > 0 ? `${avgGrade}%` : "-",
        };
      });
      setSubjects(displaySubjects);
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al cargar las materias";
      toast.error(message);
      console.error("Load courses error:", error);
      setSubjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddScheduleEntry = () => {
    setSchedulesList([
      ...schedulesList,
      {
        dayOfWeek: "Lunes",
        startTime: "08:00",
        endTime: "10:00",
        location: "",
      },
    ]);
  };

  const handleRemoveScheduleEntry = (index: number) => {
    if (schedulesList.length === 1) {
      toast.error("Debe haber al menos un horario");
      return;
    }
    setSchedulesList(schedulesList.filter((_, i) => i !== index));
  };

  const handleUpdateScheduleEntry = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...schedulesList];
    (updated[index] as any)[field] = value;
    setSchedulesList(updated);
  };

  const handleEditSubject = async (id: number) => {
    const subject = subjects.find(s => s.id === id);
    if (subject) {
      setEditingSubjectId(id);
      setEditSubject({
        name: subject.name,
        description: subject.description || "",
        credits: subject.credits.toString(),
        professor: subject.professor || "",
        semester: subject.semester || "",
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateSubject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editSubject.name || !editSubject.credits) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    if (!editingSubjectId) {
      toast.error("Error: materia no identificada");
      return;
    }

    try {
      const updatedCourse = await courseService.updateCourse(editingSubjectId, {
        name: editSubject.name,
        description: editSubject.description || undefined,
        credits: parseInt(editSubject.credits),
        professor: editSubject.professor || undefined,
        semester: editSubject.semester || undefined,
      });

      const updatedSubjects = subjects.map(s =>
        s.id === editingSubjectId
          ? {
              ...updatedCourse,
              color: s.color,
              grade: s.grade,
            }
          : s
      );

      setSubjects(updatedSubjects);
      setIsEditDialogOpen(false);
      setEditingSubjectId(null);
      toast.success("Materia actualizada correctamente");
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al actualizar la materia";
      toast.error(message);
      console.error("Update course error:", error);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSubject.name || !newSubject.credits) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    if (schedulesList.some(s => !s.dayOfWeek || !s.startTime || !s.endTime)) {
      toast.error("Por favor completa todos los horarios");
      return;
    }

    try {
      const newCourse = await courseService.createCourse({
        name: newSubject.name,
        description: newSubject.description || undefined,
        credits: parseInt(newSubject.credits),
        professor: newSubject.professor || undefined,
        semester: newSubject.semester || undefined,
      });

      // Crear horarios automáticamente
      await Promise.all(
        schedulesList.map(schedule =>
          scheduleService.createSchedule({
            courseId: newCourse.id,
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            location: schedule.location || undefined,
          })
        )
      );

      const displayCourse: SubjectDisplay = {
        ...newCourse,
        color: colors[subjects.length % colors.length],
        grade: "-",
      };

      setSubjects([...subjects, displayCourse]);
      setNewSubject({
        name: "",
        description: "",
        credits: "",
        professor: "",
        semester: "",
      });
      setSchedulesList([
        {
          dayOfWeek: "Lunes",
          startTime: "08:00",
          endTime: "10:00",
          location: "",
        }
      ]);
      setIsAddDialogOpen(false);
      toast.success("Materia y horarios agregados correctamente");
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al agregar la materia";
      toast.error(message);
      console.error("Add course error:", error);
    }
  };

  const handleDeleteSubject = async (id: number) => {
    try {
      await courseService.deleteCourse(id);
      setSubjects(subjects.filter(subject => subject.id !== id));
      toast.success("Materia eliminada");
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al eliminar la materia";
      toast.error(message);
      console.error("Delete course error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">¿Qué veo hoy?</h2>
            <p className="text-muted-foreground text-lg">
              {isLoading ? "Cargando materias..." : subjects.length === 0 ? "Sin materias agregadas" : `${subjects.length} materia${subjects.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Materia
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Materia</DialogTitle>
                <DialogDescription>
                  Completa la información de la nueva materia
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSubject} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-name">Nombre de la Materia *</Label>
                  <Input
                    id="subject-name"
                    value={newSubject.name}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, name: e.target.value })
                    }
                    placeholder="Ej: Cálculo Diferencial"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject-credits">Créditos *</Label>
                  <Input
                    id="subject-credits"
                    type="number"
                    min="1"
                    max="10"
                    value={newSubject.credits}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, credits: e.target.value })
                    }
                    placeholder="Ej: 4"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject-professor">Profesor</Label>
                  <Input
                    id="subject-professor"
                    value={newSubject.professor}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, professor: e.target.value })
                    }
                    placeholder="Nombre del profesor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject-semester">Semestre</Label>
                  <Input
                    id="subject-semester"
                    value={newSubject.semester}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, semester: e.target.value })
                    }
                    placeholder="Ej: 2024-1"
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Horarios de Clase</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddScheduleEntry}
                    >
                      + Agregar Otro Día
                    </Button>
                  </div>

                  {schedulesList.map((schedule, index) => (
                    <Card key={index} className="p-4 mb-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Horario {index + 1}</h4>
                        {schedulesList.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveScheduleEntry(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ✕
                          </Button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor={`day-${index}`}>Día de la Semana *</Label>
                          <Select
                            value={schedule.dayOfWeek}
                            onValueChange={(value) =>
                              handleUpdateScheduleEntry(index, "dayOfWeek", value)
                            }
                          >
                            <SelectTrigger id={`day-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {daysOfWeek.map((day) => (
                                <SelectItem key={day} value={day}>
                                  {day}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor={`start-${index}`}>Hora Inicio *</Label>
                            <Input
                              id={`start-${index}`}
                              type="time"
                              value={schedule.startTime}
                              onChange={(e) =>
                                handleUpdateScheduleEntry(
                                  index,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`end-${index}`}>Hora Fin *</Label>
                            <Input
                              id={`end-${index}`}
                              type="time"
                              value={schedule.endTime}
                              onChange={(e) =>
                                handleUpdateScheduleEntry(
                                  index,
                                  "endTime",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`location-${index}`}>
                            Ubicación (Opcional)
                          </Label>
                          <Input
                            id={`location-${index}`}
                            value={schedule.location}
                            onChange={(e) =>
                              handleUpdateScheduleEntry(
                                index,
                                "location",
                                e.target.value
                              )
                            }
                            placeholder="Ej: Aula 101"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject-description">Descripción</Label>
                  <Textarea
                    id="subject-description"
                    value={newSubject.description}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, description: e.target.value })
                    }
                    placeholder="Descripción de la materia"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setNewSubject({
                        name: "",
                        description: "",
                        credits: "",
                        professor: "",
                        semester: "",
                      });
                      setSchedulesList([
                        {
                          dayOfWeek: "Lunes",
                          startTime: "08:00",
                          endTime: "10:00",
                          location: "",
                        }
                      ]);
                      setIsAddDialogOpen(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Agregar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Materia</DialogTitle>
                <DialogDescription>
                  Actualiza la información de la materia
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateSubject} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-subject-name">Nombre de la Materia *</Label>
                  <Input
                    id="edit-subject-name"
                    value={editSubject.name}
                    onChange={(e) =>
                      setEditSubject({ ...editSubject, name: e.target.value })
                    }
                    placeholder="Ej: Cálculo Diferencial"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-subject-credits">Créditos *</Label>
                  <Input
                    id="edit-subject-credits"
                    type="number"
                    min="1"
                    max="10"
                    value={editSubject.credits}
                    onChange={(e) =>
                      setEditSubject({ ...editSubject, credits: e.target.value })
                    }
                    placeholder="Ej: 4"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-subject-professor">Profesor</Label>
                  <Input
                    id="edit-subject-professor"
                    value={editSubject.professor}
                    onChange={(e) =>
                      setEditSubject({ ...editSubject, professor: e.target.value })
                    }
                    placeholder="Nombre del profesor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-subject-semester">Semestre</Label>
                  <Input
                    id="edit-subject-semester"
                    value={editSubject.semester}
                    onChange={(e) =>
                      setEditSubject({ ...editSubject, semester: e.target.value })
                    }
                    placeholder="Ej: 2024-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-subject-description">Descripción</Label>
                  <Textarea
                    id="edit-subject-description"
                    value={editSubject.description}
                    onChange={(e) =>
                      setEditSubject({ ...editSubject, description: e.target.value })
                    }
                    placeholder="Descripción de la materia"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setEditingSubjectId(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar Cambios</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Cargando materias...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center space-y-4">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
              <p className="text-muted-foreground text-lg">No tienes materias agregadas aún</p>
              <p className="text-sm text-muted-foreground">Comienza agregando tu primera materia</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Card
                key={subject.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all relative group"
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSubject(subject.id);
                    }}
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSubject(subject.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4" onClick={() => navigate(`/subject/${subject.id}`)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 ${subject.color} rounded-xl flex items-center justify-center`}>
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">{subject.credits} créditos</p>
                      <p className="text-xs text-muted-foreground">{subject.code}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-3xl font-bold text-primary text-center">{subject.grade}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
