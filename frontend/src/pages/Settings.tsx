import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Moon, Bell } from "lucide-react";
import { useState, useEffect } from "react";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true" || document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Configuraciones</h2>
          <p className="text-muted-foreground text-lg">Personaliza tu experiencia</p>
        </div>

        {/* Apariencia */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Apariencia</h3>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <Moon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-lg">Tema Oscuro</p>
                  <p className="text-sm text-muted-foreground">Cambiar a modo oscuro</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </Card>
        </div>

        {/* General */}
        <div>
          <h3 className="text-xl font-semibold mb-4">General</h3>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-lg">Notificaciones</p>
                  <p className="text-sm text-muted-foreground">Recibir alertas y recordatorios</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
