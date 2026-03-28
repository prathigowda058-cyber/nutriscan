import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";

interface TopBarProps {
  title: string;
  profileName: string;
}

export function TopBar({ title, profileName }: TopBarProps) {
  const initials = profileName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      className="fixed top-0 left-60 right-0 h-16 flex items-center justify-between px-6 z-20 border-b border-border"
      style={{ background: "#07121D" }}
    >
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            data-ocid="topbar.search_input"
            placeholder="Search..."
            className="pl-9 w-48 h-8 text-xs bg-white/5 border-border"
          />
        </div>
        <button
          type="button"
          className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Bell size={18} className="text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground"
          style={{ background: "oklch(75 0.18 170)" }}
        >
          {initials || "U"}
        </div>
      </div>
    </header>
  );
}
