"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  GraduationCap, LayoutDashboard, Presentation, User,
  ChevronLeft, ChevronRight, Plus, LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/presentations", icon: Presentation, label: "Presentations" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col bg-card border-r transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-2 p-4 h-16 border-b", collapsed && "justify-center")}>
        <GraduationCap className="w-7 h-7 text-primary flex-shrink-0" />
        {!collapsed && (
          <span className="font-bold text-lg">
            EduSlide <span className="text-primary">AI</span>
          </span>
        )}
      </div>

      {/* New presentation button */}
      <div className="p-3">
        <Button
          asChild
          variant="gradient"
          size="sm"
          className={cn("w-full", collapsed && "px-0 justify-center")}
        >
          <Link href="/dashboard">
            <Plus className="w-4 h-4" />
            {!collapsed && <span>New Presentation</span>}
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className="p-3 border-t">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-card border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}
