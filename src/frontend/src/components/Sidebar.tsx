import { cn } from "@/lib/utils";
import {
  Bot,
  LayoutDashboard,
  Salad,
  ScanSearch,
  Search,
  Settings,
  Stethoscope,
  Sun,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "../LanguageContext";
import type { Lang } from "../translations";

interface NavItem {
  id: string;
  labelKey: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    labelKey: "dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  { id: "analyzers", labelKey: "analyzers", icon: <ScanSearch size={18} /> },
  { id: "diet", labelKey: "dietPlanner", icon: <Salad size={18} /> },
  { id: "timeline", labelKey: "timeline", icon: <TrendingUp size={18} /> },
  { id: "sunlight", labelKey: "sunlight", icon: <Sun size={18} /> },
  { id: "chatbot", labelKey: "chatbot", icon: <Bot size={18} /> },
  { id: "doctors", labelKey: "doctorConnect", icon: <Stethoscope size={18} /> },
  { id: "lookup", labelKey: "patientLookup", icon: <Search size={18} /> },
  { id: "settings", labelKey: "settings", icon: <Settings size={18} /> },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLangChange: (lang: Lang) => void;
}

export function Sidebar({
  currentPage,
  onNavigate,
  onLangChange,
}: SidebarProps) {
  const { lang, t } = useLanguage();

  return (
    <aside
      className="fixed left-0 top-0 h-full w-60 flex flex-col z-30"
      style={{
        background: "#0A1929",
        borderRight: "1px solid oklch(28 0.025 220)",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
            style={{
              background: "oklch(75 0.18 170 / 0.15)",
              border: "1px solid oklch(75 0.18 170 / 0.3)",
            }}
          >
            🩺
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-wide">
              NutriScan
            </h1>
            <p className="text-xs text-muted-foreground">AI Health Mirror</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            data-ocid={`nav.${item.id}.link`}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
              currentPage === item.id
                ? "text-primary bg-primary/10 border-l-2 border-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5",
            )}
          >
            <span
              className={
                currentPage === item.id
                  ? "text-primary"
                  : "text-muted-foreground"
              }
            >
              {item.icon}
            </span>
            {t(item.labelKey)}
          </button>
        ))}
      </nav>

      {/* Language Switcher */}
      <div className="px-4 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Language</p>
        <div className="flex gap-1.5">
          {(["en", "hi", "kn"] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              data-ocid={`settings.language.${l}.toggle`}
              onClick={() => onLangChange(l)}
              className={cn(
                "px-2.5 py-1 text-xs rounded-md transition-all",
                lang === l
                  ? "bg-primary text-primary-foreground font-medium"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10",
              )}
            >
              {l === "en" ? "EN" : l === "hi" ? "हिंदी" : "ಕನ್ನಡ"}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
