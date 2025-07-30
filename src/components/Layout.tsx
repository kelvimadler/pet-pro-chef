import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useStockMonitor } from "@/hooks/useStockMonitor";
import { useSanitaryNotifications } from "@/hooks/useSanitaryNotifications";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useStockMonitor();
  useSanitaryNotifications();
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
                <ThemeToggle />
                <NotificationDropdown />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-6">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                Feito com
                <span className="text-green-500 animate-pulse">♥</span>
                pela
                <a
                  href="https://wodev.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Wodev Digital
                </a>
              </div>
              <div className="text-xs">
                Versão 1.2.1 - Sistema de Gestão Industrial
              </div>
            </div>
          </footer>

        </div>
      </div>
    </SidebarProvider>
  );
}