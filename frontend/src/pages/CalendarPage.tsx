import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Plus, Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  color: string;
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    time: "",
  });

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time || !selectedDate) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: selectedDate,
      time: newEvent.time,
      color: "bg-primary"
    };

    setEvents([...events, event]);
    setNewEvent({ title: "", description: "", time: "" });
    setIsOpen(false);
    toast.success("Evento agregado");
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    toast.success("Evento eliminado");
  };

  const eventsForSelectedDate = selectedDate
    ? events.filter(
        event =>
          format(event.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      )
    : [];

  const eventDates = events.map(e => e.date);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Calendario</h2>
            <p className="text-muted-foreground text-lg">Gestiona tus eventos</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Evento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Evento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Nombre del evento"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Detalles del evento"
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Hora</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, time: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha seleccionada</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedDate
                      ? format(selectedDate, "PPP", { locale: es })
                      : "Selecciona una fecha"}
                  </p>
                </div>
                <Button onClick={handleAddEvent} className="w-full">
                  Agregar Evento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <Card className="p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={es}
              className="rounded-md border-0"
              modifiers={{
                hasEvent: eventDates,
              }}
              modifiersStyles={{
                hasEvent: {
                  fontWeight: "bold",
                  textDecoration: "underline",
                },
              }}
            />
          </Card>

          {/* Selected Date Events */}
          <div className="space-y-4">
            {selectedDate && (
              <>
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    {format(selectedDate, "PPP", { locale: es })}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {eventsForSelectedDate.length} evento(s)
                  </p>
                </div>

                {eventsForSelectedDate.length === 0 ? (
                  <Card className="p-8 text-center">
                    <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">
                      No hay eventos para esta fecha
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {eventsForSelectedDate.map((event) => (
                      <Card key={event.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-3 h-3 ${event.color} rounded-full`}></div>
                              <h4 className="font-semibold">{event.title}</h4>
                            </div>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {event.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{event.time}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* All Events */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Próximos Eventos</h3>
          {events.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No hay eventos programados
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((event) => (
                  <Card key={event.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-2 h-12 ${event.color} rounded`}></div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(event.date, "PPP", { locale: es })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {event.time}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;

