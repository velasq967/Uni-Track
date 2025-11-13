import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      toast.success("¡Inicio de sesión exitoso!");
      setUser(response.user);
      navigate("/dashboard");
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al iniciar sesión";
      toast.error(message);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center space-y-8 max-w-md w-full">
        <Logo size="md" />
        
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Iniciar sesión</h1>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
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
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => navigate("/register")}
          >
            ¿No tienes cuenta? Regístrate
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
