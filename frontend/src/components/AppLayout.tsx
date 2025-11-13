import { Logo } from "@/components/Logo";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { BookOpen, Calendar, User, Settings as SettingsIcon, CalendarDays, Clock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const menuItems = [
  { title: "Materias", url: "/dashboard", icon: BookOpen },
  { title: "Horario", url: "/schedule", icon: Clock },
  { title: "Calendario", url: "/calendar", icon: CalendarDays },
  { title: "Perfil", url: "/profile", icon: User },
  { title: "Configuración", url: "/settings", icon: SettingsIcon },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate("/login");
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <h1 className="text-xl font-bold group-data-[collapsible=icon]:hidden">UniTrack</h1>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <NavLink 
                          to={item.url} 
                          end={item.url === "/dashboard"}
                          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setIsLogoutDialogOpen(true)}
                      tooltip="Cerrar sesión"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Cerrar sesión</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col w-full">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-4 h-14 md:h-16">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
            {user && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{user.firstName} {user.lastName}</span>
              </div>
            )}
          </header>
          
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
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
    </SidebarProvider>
  );
}
