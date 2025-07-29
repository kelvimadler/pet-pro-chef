import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, Check, X } from "lucide-react";

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'expiry':
        return '⏰';
      case 'stock':
        return '📦';
      case 'production':
        return '🏭';
      default:
        return '📋';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'expiry':
        return 'text-red-600';
      case 'stock':
        return 'text-yellow-600';
      case 'production':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffHours = Math.floor((now.getTime() - notifDate.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Agora mesmo';
    if (diffHours < 24) return `${diffHours}h atrás`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d atrás`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Notificações</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} não lidas
              </Badge>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="space-y-0">
              {notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b last:border-b-0 hover:bg-accent/50 transition-colors ${
                    !notification.is_read ? 'bg-accent/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`text-lg ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-foreground">
                          {notification.title}
                        </h4>
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {notifications.length > 10 && (
          <div className="p-4 border-t">
            <Button variant="ghost" size="sm" className="w-full">
              Ver todas as notificações
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}