import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courseService, Course } from "@/services/courseService";
import { scheduleService, type Schedule } from "@/services/scheduleService";

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"];

const Schedule = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);
  const [editSchedule, setEditSchedule] = useState({
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    location: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [coursesData, schedulesData] = await Promise.all([
        courseService.getAllCourses(),
        scheduleService.getAllSchedules().catch(() => []),
      ]);
      setCourses(coursesData);
      setSchedules(schedulesData);
    } catch (error: any) {
      console.error("Load error:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    try {
      await scheduleService.deleteSchedule(id);
      setSchedules(schedules.filter((s) => s.id !== id));
      toast.success("Horario eliminado correctamente");
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al eliminar horario";
      toast.error(message);
      console.error("Delete schedule error:", error);
    }
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingScheduleId(schedule.id);
    setEditSchedule({
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      location: schedule.location || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editSchedule.dayOfWeek || !editSchedule.startTime || !editSchedule.endTime) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    if (!editingScheduleId) {
      toast.error("Error: horario no identificado");
      return;
    }

    try {
      const updatedSchedule = await scheduleService.updateSchedule(editingScheduleId, {
        dayOfWeek: editSchedule.dayOfWeek,
        startTime: editSchedule.startTime,
        endTime: editSchedule.endTime,
        location: editSchedule.location || undefined,
      });

      setSchedules(
        schedules.map((s) => (s.id === editingScheduleId ? updatedSchedule : s))
      );
      setIsEditDialogOpen(false);
      setEditingScheduleId(null);
      toast.success("Horario actualizado correctamente");
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al actualizar horario";
      toast.error(message);
      console.error("Update schedule error:", error);
    }
  };

  const getSchedulesByDay = (day: string) => {
    return schedules.filter((s) => s.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Horario</h2>
            <p className="text-muted-foreground text-lg">
              {schedules.length === 0 ? "Sin clases programadas" : `${schedules.length} clase${schedules.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Cargando horario...</p>
          </div>
        ) : schedules.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No tienes clases programadas</p>
            <p className="text-sm text-muted-foreground mb-6">Agrega tus horarios para mantener un seguimiento de tus clases</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {daysOfWeek.map((day) => {
              const daySchedules = getSchedulesByDay(day);
              return (
                <div key={day}>
                  <h3 className="font-semibold text-lg mb-3">{day}</h3>
                  {daySchedules.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Sin clases</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {daySchedules.map((schedule) => {
                        const course = courses.find((c) => c.id === schedule.courseId);
                        const color = colors[schedule.courseId % colors.length];
                        return (
                          <Card key={schedule.id} className="p-4 hover:shadow-md transition-all relative group">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEditSchedule(schedule)}
                              >
                                ✏️
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDeleteSchedule(schedule.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-20 ${color} rounded flex-shrink-0`}></div>
                              <div className="flex-1">
                                <p className="font-semibold text-base">{course?.name || "Materia"}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {schedule.startTime} - {schedule.endTime}
                                </p>
                                {schedule.location && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    📍 {schedule.location}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Horario</DialogTitle>
              <DialogDescription>
                Actualiza los datos del horario
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateSchedule} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-day">Día de la Semana *</Label>
                <Select
                  value={editSchedule.dayOfWeek}
                  onValueChange={(value) =>
                    setEditSchedule({ ...editSchedule, dayOfWeek: value })
                  }
                >
                  <SelectTrigger id="edit-day">
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
                  <Label htmlFor="edit-start">Hora Inicio *</Label>
                  <Input
                    id="edit-start"
                    type="time"
                    value={editSchedule.startTime}
                    onChange={(e) =>
                      setEditSchedule({
                        ...editSchedule,
                        startTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-end">Hora Fin *</Label>
                  <Input
                    id="edit-end"
                    type="time"
                    value={editSchedule.endTime}
                    onChange={(e) =>
                      setEditSchedule({
                        ...editSchedule,
                        endTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Ubicación (Opcional)</Label>
                <Input
                  id="edit-location"
                  value={editSchedule.location}
                  onChange={(e) =>
                    setEditSchedule({
                      ...editSchedule,
                      location: e.target.value,
                    })
                  }
                  placeholder="Ej: Aula 101"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingScheduleId(null);
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
    </div>
  );
};

export default Schedule;
