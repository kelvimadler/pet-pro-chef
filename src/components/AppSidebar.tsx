import { useState } from "react";
import { 
  LayoutDashboard, 
  PackageSearch, 
  Utensils, 
  Package, 
  QrCode, 
  Users, 
  BarChart3, 
  Settings,
  ChefHat,
  LogOut,
  Bell,
  Thermometer
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, UserPlus } from "lucide-react";
import { AddAccountDialog } from "@/components/AddAccountDialog";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Produções", url: "/productions", icon: ChefHat },
  { title: "Produtos", url: "/products", icon: PackageSearch },
  { title: "Cardápios", url: "/menus", icon: Utensils },
  { title: "Estoque", url: "/inventory", icon: Package },
  { title: "Etiquetas Sanitárias", url: "/sanitary-labels", icon: Thermometer },
  { title: "Clientes", url: "/clients", icon: Users },
  { title: "Relatórios", url: "/reports", icon: BarChart3 },
  { title: "Configurações", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const [showAddAccountDialog, setShowAddAccountDialog] = useState(false);
  
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-primary text-primary-foreground shadow-md font-medium" 
      : "hover:bg-accent/60 transition-all duration-200 hover:shadow-sm";

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar
      className={`border-r-0 shadow-elegant transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
            <PackageSearch className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-foreground">PetFactory</h1>
              <p className="text-sm text-muted-foreground">Gestão Natural</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={!collapsed ? "text-muted-foreground mb-2" : "sr-only"}>
            Menu Principal
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => getNavClass({ isActive })}
                    >
                      <item.icon className={`${collapsed ? "w-5 h-5" : "w-5 h-5 mr-3"} transition-all`} />
                      {!collapsed && (
                        <span className="text-sm font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-2 space-y-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size={collapsed ? "icon" : "default"}
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <User className={`w-4 h-4 ${!collapsed ? "mr-2" : ""}`} />
              {!collapsed && "Perfil"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <User className="w-4 h-4 mr-2" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowAddAccountDialog(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar Nova Conta
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      
      <AddAccountDialog 
        open={showAddAccountDialog} 
        onOpenChange={setShowAddAccountDialog} 
      />
    </Sidebar>
  );
}