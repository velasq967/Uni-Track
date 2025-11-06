import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center space-y-8 max-w-md w-full">
        <Logo size="lg" />
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">UniTrack</h1>
          <p className="text-muted-foreground">
            Lleva control de tus clases de una manera más eficaz
          </p>
        </div>

        <div className="w-full space-y-3 pt-8">
          <Button 
            className="w-full h-12 text-base font-medium"
            onClick={() => navigate("/login")}
          >
            Iniciar
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-12 text-base font-medium"
            onClick={() => navigate("/register")}
          >
            Registrarse
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
