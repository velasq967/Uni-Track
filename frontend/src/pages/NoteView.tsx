import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Trash2, Edit2, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { noteService, Note } from "@/services/noteService";

const NoteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: "", content: "" });

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    setIsLoading(true);
    try {
      if (!id) {
        toast.error("ID de nota inválido");
        return;
      }

      const noteData = await noteService.getNoteById(parseInt(id));
      setNote(noteData);
      setEditData({ title: noteData.title, content: noteData.content });
    } catch (error: any) {
      const message = error.response?.data?.message || "Nota no encontrada";
      toast.error(message);
      console.error("Load note error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editData.title.trim()) {
      toast.error("El título es requerido");
      return;
    }

    if (!editData.content.trim()) {
      toast.error("El contenido es requerido");
      return;
    }

    try {
      const updatedNote = await noteService.updateNote(parseInt(id || "0"), {
        title: editData.title,
        content: editData.content,
      });
      setNote(updatedNote);
      setIsEditing(false);
      toast.success("Nota actualizada");
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al actualizar nota";
      toast.error(message);
      console.error("Update note error:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta nota?")) return;

    try {
      await noteService.deleteNote(parseInt(id || "0"));
      toast.success("Nota eliminada");
      navigate(`/notes/${note?.courseId}`);
    } catch (error: any) {
      toast.error("Error al eliminar nota");
      console.error("Delete note error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando nota...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Card className="p-6">
            <p className="text-destructive">Nota no encontrada</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/notes/${note.courseId}`)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Nota</h1>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <>
                <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          </div>
        </div>

        <Card className="p-6 space-y-6">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="text-xl font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenido</Label>
                <Textarea
                  id="content"
                  value={editData.content}
                  onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                  className="min-h-[400px] resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({ title: note.title, content: note.content });
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-3xl font-bold mb-2">{note.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date(note.createdAt).toLocaleDateString()} a las{" "}
                  {new Date(note.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-base leading-relaxed">{note.content}</p>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default NoteView;
