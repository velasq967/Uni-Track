import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { courseService } from "@/services/courseService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [coursesCount, setCoursesCount] = useState(0);
  const [averageGrade, setAverageGrade] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const courses = await courseService.getAllCourses();
        setCoursesCount(courses.length);

        if (courses.length > 0) {
          const gpaData = await courseService.calculateGPA();
          setAverageGrade(Math.round(gpaData.gpa * 100) / 100);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate("/login");
  };

  const handleConfirmLogout = () => {
    handleLogout();
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
              <h2 className="text-2xl font-bold">
                {user ? `${user.firstName} ${user.lastName}` : "Nombre Usuario"}
              </h2>
              <p className="text-muted-foreground">{user?.email || "usuario@ejemplo.com"}</p>
              {user?.studentId && (
                <p className="text-sm text-muted-foreground mt-2">ID: {user.studentId}</p>
              )}
              {user?.university && (
                <p className="text-sm text-muted-foreground">{user.university}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 text-center">
            <p className="text-4xl font-bold text-primary mb-2">{coursesCount}</p>
            <p className="text-base text-muted-foreground">
              {coursesCount === 1 ? "Materia" : "Materias"}
            </p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-4xl font-bold text-success mb-2">
              {isLoading ? "-" : `${averageGrade.toFixed(2)}`}
            </p>
            <p className="text-base text-muted-foreground">Promedio General</p>
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

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cerrar sesión</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cerrar sesión?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cerrar sesión
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
