import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { noteService, Note } from "@/services/noteService";
import { courseService } from "@/services/courseService";

const Notes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (!id) {
        toast.error("ID de materia inválido");
        return;
      }

      const courseId = parseInt(id);
      const [coursesData, notesData] = await Promise.all([
        courseService.getCourseById(courseId).catch(() => null),
        noteService.getNotesByCourse(courseId).catch(() => []),
      ]);

      if (coursesData) {
        setCourseName(coursesData.name);
      }
      setNotes(notesData || []);
    } catch (error: any) {
      console.error("Load error:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newNote.title.trim()) {
      toast.error("El título es requerido");
      return;
    }

    if (!newNote.content.trim()) {
      toast.error("El contenido es requerido");
      return;
    }

    try {
      const createdNote = await noteService.createNote({
        title: newNote.title,
        content: newNote.content,
        courseId: parseInt(id || "0"),
      });

      setNotes([...notes, createdNote]);
      setNewNote({ title: "", content: "" });
      setIsAddDialogOpen(false);
      toast.success("Nota creada correctamente");
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al crear nota";
      toast.error(message);
      console.error("Add note error:", error);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      await noteService.deleteNote(noteId);
      setNotes(notes.filter((n) => n.id !== noteId));
      toast.success("Nota eliminada");
    } catch (error: any) {
      toast.error("Error al eliminar nota");
      console.error("Delete note error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/subject/${id}`)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Notas</h1>
              {courseName && <p className="text-muted-foreground">{courseName}</p>}
            </div>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Nota
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Nota</DialogTitle>
                <DialogDescription>
                  Agrega una nota con título y contenido
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddNote} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Tema 1 - Introducción"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Contenido *</Label>
                  <Textarea
                    id="content"
                    placeholder="Escribe el contenido de la nota..."
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    className="min-h-[200px] resize-none"
                    required
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Crear Nota</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Cargando notas...</p>
          </div>
        ) : notes.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No tienes notas para esta materia</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Nota
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <Card
                key={note.id}
                className="p-4 hover:shadow-md transition-all cursor-pointer group relative"
              >
                <div onClick={() => navigate(`/note/${note.id}`)} className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{note.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-4">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
