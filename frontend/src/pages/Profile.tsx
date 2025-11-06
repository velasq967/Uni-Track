import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, LogOut, Edit } from "lucide-react";
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
import { Input } from "@/components/ui/input";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "Nombre Usuario",
    email: "usuario@ejemplo.com",
  });
  const [formData, setFormData] = useState(userData);

  const handleLogout = () => {
    toast.success("Sesión cerrada");
    navigate("/");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserData(formData);
    setIsEditOpen(false);
    toast.success("Perfil actualizado correctamente");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Mi Perfil</h2>
          <p className="text-muted-foreground text-lg">Información personal</p>
        </div>

        {/* User Info */}
        <Card className="p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
              <User className="h-12 w-12 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{userData.name}</h2>
              <p className="text-muted-foreground">{userData.email}</p>
            </div>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Perfil</DialogTitle>
                  <DialogDescription>
                    Actualiza tu información personal
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData(userData);
                        setIsEditOpen(false);
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
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 text-center">
            <p className="text-4xl font-bold text-primary mb-2">5</p>
            <p className="text-base text-muted-foreground">Materias</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-4xl font-bold text-success mb-2">86%</p>
            <p className="text-base text-muted-foreground">Promedio</p>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-center h-12 text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
