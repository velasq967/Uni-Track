import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, StickyNote, Archive, Plus, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { courseService, Course, gradeService } from "@/services/courseService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"];

const Subject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddGradeDialogOpen, setIsAddGradeDialogOpen] = useState(false);
  const [deleteGradeId, setDeleteGradeId] = useState<number | null>(null);
  const [newGrade, setNewGrade] = useState({
    score: "0",
    weight: "0",
    type: "examen",
    description: "",
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      if (!id) {
        setError("ID de curso no válido");
        return;
      }

      const courseData = await courseService.getCourseById(parseInt(id));
      setCourse(courseData);
      setError(null);
    } catch (err: any) {
      const message = err.response?.data?.message || "Materia no encontrada";
      setError(message);
      console.error("Load course error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();

    const score = parseFloat(newGrade.score);
    const weight = parseFloat(newGrade.weight);

    if (isNaN(score) || score < 0 || score > 5) {
      toast.error("La calificación debe estar entre 0.0 y 5.0");
      return;
    }

    if (isNaN(weight) || weight < 0) {
      toast.error("El porcentaje debe ser mayor a 0");
      return;
    }

    if (course?.grades) {
      const currentTotal = course.grades.reduce((sum, g) => sum + (g.weight || 0), 0);
      if (currentTotal + weight > 100) {
        toast.error(`La suma de porcentajes no puede exceder 100% (actual: ${currentTotal}%)`);
        return;
      }
    }

    try {
      const createdGrade = await gradeService.createGrade(parseInt(id || "0"), {
        score,
        weight: weight > 0 ? weight : undefined,
        type: newGrade.type,
        description: newGrade.description || undefined,
      });

      if (course) {
        setCourse({
          ...course,
          grades: [...(course.grades || []), createdGrade],
        });
      }

      setNewGrade({
        score: "0",
        weight: "0",
        type: "examen",
        description: "",
        date: new Date().toISOString().split('T')[0],
      });
      setIsAddGradeDialogOpen(false);
      toast.success("Calificación agregada correctamente");
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al agregar calificación";
      toast.error(message);
      console.error("Add grade error:", error);
    }
  };

  const handleDeleteGrade = async (gradeId: number) => {
    try {
      await gradeService.deleteGrade(gradeId);
      if (course) {
        setCourse({
          ...course,
          grades: (course.grades || []).filter((g) => g.id !== gradeId),
        });
      }
      setDeleteGradeId(null);
      toast.success("Calificación eliminada");
    } catch (error: any) {
      toast.error("Error al eliminar calificación");
      console.error("Delete grade error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando materia...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <Card className="p-6">
            <p className="text-destructive">{error || "Materia no encontrada"}</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>
              Volver al Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const colorIndex = course.id % colors.length;
  const color = colors[colorIndex];

  const gradesWithWeight = (course.grades || []).filter(g => g.weight && g.weight > 0);
  const totalWeight = gradesWithWeight.reduce((sum, g) => sum + (g.weight || 0), 0);
  
  const averageGrade = gradesWithWeight.length > 0
    ? Math.round((gradesWithWeight.reduce((sum, g) => sum + (g.score * (g.weight || 0)), 0) / totalWeight) * 100) / 100
    : (course.grades && course.grades.length > 0
      ? Math.round((course.grades.reduce((sum, g) => sum + g.score, 0) / course.grades.length) * 100) / 100
      : 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{course.name}</h1>
            <p className="text-muted-foreground">
              {course.code} • {course.credits} créditos
              {course.professor && ` • Prof. ${course.professor}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calificaciones */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Calificaciones</h3>
              <Dialog open={isAddGradeDialogOpen} onOpenChange={setIsAddGradeDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Calificación</DialogTitle>
                    <DialogDescription>
                      Agrega una nueva calificación con su porcentaje. La suma debe ser 100%.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddGrade} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="score">Calificación (0.0-5.0) *</Label>
                        <Input
                          id="score"
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={newGrade.score}
                          onChange={(e) => setNewGrade({ ...newGrade, score: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Porcentaje (%)</Label>
                        <Input
                          id="weight"
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={newGrade.weight}
                          onChange={(e) => setNewGrade({ ...newGrade, weight: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Total: {course.grades ? course.grades.reduce((sum, g) => sum + (g.weight || 0), 0) : 0}% + {newGrade.weight}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo *</Label>
                      <Select value={newGrade.type} onValueChange={(value) => setNewGrade({ ...newGrade, type: value })}>
                        <SelectTrigger id="type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="examen">Examen</SelectItem>
                          <SelectItem value="tarea">Tarea</SelectItem>
                          <SelectItem value="proyecto">Proyecto</SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
                          <SelectItem value="participacion">Participación</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Input
                        id="description"
                        placeholder="Ej: Examen Final, Tarea 1, etc."
                        value={newGrade.description}
                        onChange={(e) => setNewGrade({ ...newGrade, description: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddGradeDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">Agregar</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {course.grades && course.grades.length > 0 ? (
              <div className="space-y-3">
                {course.grades.map((grade: any) => (
                  <div key={grade.id} className="flex justify-between items-center py-2 border-b last:border-0 group">
                    <div className="flex-1">
                      <p className="font-medium">{grade.description || `${grade.type || 'Calificación'}`}</p>
                      {grade.weight && (
                        <p className="text-xs text-muted-foreground">{grade.weight}% del total</p>
                      )}
                      {grade.date && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(grade.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-primary">{grade.score}/5.0</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setDeleteGradeId(grade.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-lg">Promedio</p>
                    <p className="text-3xl font-bold text-primary">{averageGrade.toFixed(2)}</p>
                  </div>
                  {gradesWithWeight.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Promedio ponderado ({totalWeight}%)
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Sin calificaciones registradas</p>
            )}
          </Card>

          {/* Información del curso */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Información</h3>
            <div className="space-y-3">
              {course.semester && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Semestre:</span>
                  <span className="font-medium">{course.semester}</span>
                </div>
              )}
              {course.year && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Año:</span>
                  <span className="font-medium">{course.year}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Créditos:</span>
                <span className="font-medium">{course.credits}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Estado:</span>
                <span className="font-medium">{course.isActive ? "Activo" : "Inactivo"}</span>
              </div>
              {course.description && (
                <div className="border-t pt-3">
                  <p className="text-sm text-muted-foreground">{course.description}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Archivos */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Archivos
            </h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled>
                <FileText className="h-4 w-4 mr-2" />
                Temario
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                <FileText className="h-4 w-4 mr-2" />
                Tareas
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                <FileText className="h-4 w-4 mr-2" />
                Exámenes
              </Button>
            </div>
          </Card>

          {/* Bloc de notas */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <StickyNote className="h-5 w-5" />
              Bloc de notas
            </h3>
            <Button 
              className="w-full"
              onClick={() => navigate(`/notes/${id}`)}
            >
              Ver notas
            </Button>
          </Card>
        </div>
      </div>

      <AlertDialog open={deleteGradeId !== null} onOpenChange={(open) => !open && setDeleteGradeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Calificación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta calificación? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteGradeId !== null && handleDeleteGrade(deleteGradeId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Subject;
