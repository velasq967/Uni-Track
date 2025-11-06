import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, StickyNote, Archive } from "lucide-react";

const subjectData: Record<string, any> = {
  calculo: {
    name: "Cálculo",
    color: "bg-blue-500",
    credits: 4,
    grades: [
      { type: "1st parcial", value: "20.3%", date: "20/03/2025" },
      { type: "2nd parcial", value: "25.2%", date: "15/04/2025" },
      { type: "3rd parcial", value: "39.5%", date: "20/05/2025" },
    ],
    average: "85%",
  },
  literatura: {
    name: "Literatura",
    color: "bg-green-500",
    credits: 3,
    grades: [
      { type: "1st parcial", value: "30.2%", date: "18/03/2025" },
      { type: "2nd parcial", value: "28.8%", date: "12/04/2025" },
      { type: "3rd parcial", value: "33.0%", date: "18/05/2025" },
    ],
    average: "92%",
  },
  quimica: {
    name: "Química",
    color: "bg-yellow-500",
    credits: 4,
    grades: [
      { type: "1st parcial", value: "25.5%", date: "22/03/2025" },
      { type: "2nd parcial", value: "22.3%", date: "18/04/2025" },
      { type: "3rd parcial", value: "30.2%", date: "22/05/2025" },
    ],
    average: "78%",
  },
  algebra: {
    name: "Álgebra",
    color: "bg-purple-500",
    credits: 4,
    grades: [
      { type: "1st parcial", value: "28.8%", date: "19/03/2025" },
      { type: "2nd parcial", value: "27.2%", date: "14/04/2025" },
      { type: "3rd parcial", value: "32.0%", date: "19/05/2025" },
    ],
    average: "88%",
  },
  ingles: {
    name: "Inglés",
    color: "bg-pink-500",
    credits: 3,
    grades: [
      { type: "1st parcial", value: "30.0%", date: "21/03/2025" },
      { type: "2nd parcial", value: "28.5%", date: "16/04/2025" },
      { type: "3rd parcial", value: "31.5%", date: "21/05/2025" },
    ],
    average: "90%",
  },
};

const Subject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const subject = id ? subjectData[id] : null;

  if (!subject) {
    return <div>Materia no encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{subject.name}</h1>
            <p className="text-muted-foreground">{subject.credits} créditos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cálculos promedio */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Cálculos promedio</h3>
            <div className="space-y-3">
              {subject.grades.map((grade: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{grade.type}</p>
                    <p className="text-sm text-muted-foreground">{grade.date}</p>
                  </div>
                  <p className="text-lg font-semibold text-primary">{grade.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">Promedio</p>
                <p className="text-3xl font-bold text-primary">{subject.average}</p>
              </div>
            </div>
          </Card>

          {/* Leyenda de cómputo */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Leyenda de cómputo</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">1st parcial:</span>
                <span className="font-medium">Promedio: 30%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">2nd parcial:</span>
                <span className="font-medium">Promedio: 30%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">3rd parcial:</span>
                <span className="font-medium">Promedio: 40%</span>
              </div>
            </div>
          </Card>

          {/* Archivos */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Archivos
            </h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Temario
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Tareas
              </Button>
              <Button variant="outline" className="w-full justify-start">
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
              variant="outline" 
              className="w-full"
              onClick={() => navigate(`/notes/${id}`)}
            >
              Ver notas
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Subject;
