import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const subjectNames: Record<string, string> = {
  calculo: "Cálculo",
  literatura: "Literatura",
  quimica: "Química",
  algebra: "Álgebra",
  ingles: "Inglés",
};

const Notes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    toast.success("Notas guardadas");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/subject/${id}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Notas</h1>
            <p className="text-muted-foreground">{id && subjectNames[id]}</p>
          </div>
        </div>

        <Card className="p-6">
          <Textarea
            placeholder="Escribe tus notas aquí..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[400px] resize-none text-base"
          />
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSave} className="flex-1">
              Guardar
            </Button>
            <Button variant="outline" onClick={() => setNotes("")}>
              Limpiar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Notes;
