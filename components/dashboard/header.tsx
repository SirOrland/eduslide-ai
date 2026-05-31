"use client";
import { Bell, Moon, Sun, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Session } from "next-auth";

interface HeaderProps {
  user: Session["user"];
}

export function DashboardHeader({ user }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <Input
          placeholder="Search presentations..."
          className="border-0 bg-transparent focus-visible:ring-0 text-sm placeholder:text-muted-foreground h-8 p-0"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-muted-foreground"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 ml-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
