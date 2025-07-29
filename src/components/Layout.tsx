import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { useStockMonitor } from "@/hooks/useStockMonitor";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useStockMonitor();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="h-full flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-accent/60 transition-colors" />
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground">
                    {new Date().toLocaleDateString("pt-BR", { 
                      weekday: "long", 
                      year: "numeric", 
                      month: "long", 
                      day: "numeric" 
                    })}
                  </h2>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <NotificationDropdown />
                <Button variant="outline" size="icon">
                  <User className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}