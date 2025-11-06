import { Card } from "@/components/ui/card";

const scheduleData = [
  { day: "Lun", time: "8:00", subject: "Cálculo", color: "bg-blue-500" },
  { day: "Lun", time: "10:00", subject: "Literatura", color: "bg-green-500" },
  { day: "Mar", time: "8:00", subject: "Química", color: "bg-yellow-500" },
  { day: "Mar", time: "10:00", subject: "Álgebra", color: "bg-purple-500" },
  { day: "Mie", time: "8:00", subject: "Inglés", color: "bg-pink-500" },
  { day: "Jue", time: "8:00", subject: "Cálculo", color: "bg-blue-500" },
  { day: "Vie", time: "10:00", subject: "Literatura", color: "bg-green-500" },
];

const Schedule = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Horario</h2>
          <p className="text-muted-foreground text-lg">Tus clases semanales</p>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          {["Lun", "Mar", "Mie", "Jue", "Vie"].map((day) => (
            <div key={day} className="text-center font-semibold text-base bg-card p-2 rounded-lg border">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scheduleData.map((item, idx) => (
            <Card key={idx} className="p-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-16 ${item.color} rounded`}></div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{item.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.day} - {item.time}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
