import { Bell, User, Wifi } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export function DashboardHeader() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const i = setInterval(() => setOnline(Math.random() > 0.05), 10000);
    return () => clearInterval(i);
  }, []);

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <Wifi className={`w-3.5 h-3.5 ${online ? 'text-success' : 'text-destructive'}`} />
          <span className="text-xs text-muted-foreground">{online ? 'Sistema Online' : 'Offline'}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">3</span>
        </Button>
        <div className="flex items-center gap-2 ml-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium">Admin</p>
            <p className="text-[10px] text-muted-foreground">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
}
