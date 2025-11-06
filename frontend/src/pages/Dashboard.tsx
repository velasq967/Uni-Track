import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [subjects, setSubjects] = useState([
    { id: "calculo", name: "Cálculo", grade: "85%", color: "bg-blue-500", credits: 4 },
    { id: "literatura", name: "Literatura", grade: "92%", color: "bg-green-500", credits: 3 },
    { id: "quimica", name: "Química", grade: "78%", color: "bg-yellow-500", credits: 4 },
    { id: "algebra", name: "Álgebra", grade: "88%", color: "bg-purple-500", credits: 4 },
    { id: "ingles", name: "Inglés", grade: "90%", color: "bg-pink-500", credits: 3 },
  ]);
  
  const [newSubject, setNewSubject] = useState({
    name: "",
    credits: "",
  });

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"];
    const newId = `subject-${Date.now()}`;
    
    setSubjects([
      ...subjects,
      {
        id: newId,
        name: newSubject.name,
        grade: "0%",
        color: colors[Math.floor(Math.random() * colors.length)],
        credits: parseInt(newSubject.credits),
      },
    ]);
    
    setNewSubject({ name: "", credits: "" });
    setIsAddDialogOpen(false);
    toast.success("Materia agregada correctamente");
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
    toast.success("Materia eliminada");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">¿Qué veo hoy?</h2>
            <p className="text-muted-foreground text-lg">Tus materias</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Materia
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Materia</DialogTitle>
                <DialogDescription>
                  Completa la información de la nueva materia
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSubject} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-name">Nombre de la Materia</Label>
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
                  <Label htmlFor="subject-credits">Créditos</Label>
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
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setNewSubject({ name: "", credits: "" });
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-all relative group"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSubject(subject.id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="space-y-4" onClick={() => navigate(`/subject/${subject.id}`)}>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 ${subject.color} rounded-xl flex items-center justify-center`}>
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground">{subject.credits} créditos</p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-3xl font-bold text-primary text-center">{subject.grade}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
