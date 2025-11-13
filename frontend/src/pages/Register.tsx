import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [university, setUniversity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !password) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.register({
        email,
        password,
        firstName,
        lastName,
        studentId: studentId || undefined,
        university: university || undefined,
      });
      toast.success("¡Registro exitoso!");
      setUser(response.user);
      navigate("/dashboard");
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al registrarse";
      toast.error(message);
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center space-y-8 max-w-md w-full">
        <Logo size="md" />
        
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Registrarse</h1>
        </div>

        <form onSubmit={handleRegister} className="w-full space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Tu nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Tu apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentId">ID Estudiante (Opcional)</Label>
            <Input
              id="studentId"
              type="text"
              placeholder="Tu ID de estudiante"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="university">Universidad (Opcional)</Label>
            <Input
              id="university"
              type="text"
              placeholder="Tu universidad"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="h-12"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => navigate("/login")}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
