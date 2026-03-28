import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import { QRReport } from "./components/QRReport";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Analyzers } from "./pages/Analyzers";
import { Chatbot } from "./pages/Chatbot";
import { Dashboard } from "./pages/Dashboard";
import { DietPlanner } from "./pages/DietPlanner";
import { DoctorConnect } from "./pages/DoctorConnect";
import { PatientLookup } from "./pages/PatientLookup";
import { Settings } from "./pages/Settings";
import { Sunlight } from "./pages/Sunlight";
import { Timeline } from "./pages/Timeline";
import type { Lang } from "./translations";

function AppContent() {
  const { t, setLang } = useLanguage();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [profileName, setProfileName] = useState("Priya Sharma");
  const [healthScore] = useState(74);

  const pageTitles: Record<string, string> = {
    dashboard: t("dashboard"),
    analyzers: t("analyzers"),
    diet: t("dietPlanner"),
    timeline: t("timeline"),
    sunlight: t("sunlight"),
    chatbot: t("chatbot"),
    doctors: t("doctorConnect"),
    lookup: t("patientLookup"),
    settings: t("settings"),
  };

  const handleLangChange = (lang: Lang) => {
    setLang(lang);
  };

  return (
    <div className="min-h-screen" style={{ background: "#07121D" }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLangChange={handleLangChange}
      />
      <TopBar
        title={pageTitles[currentPage] ?? "NutriScan"}
        profileName={profileName}
      />

      <main className="ml-60 pt-16 min-h-screen">
        <div className="px-6 py-6 max-w-6xl">
          {currentPage === "dashboard" && (
            <Dashboard onNavigate={setCurrentPage} profileName={profileName} />
          )}
          {currentPage === "analyzers" && <Analyzers />}
          {currentPage === "diet" && <DietPlanner />}
          {currentPage === "timeline" && <Timeline />}
          {currentPage === "sunlight" && <Sunlight />}
          {currentPage === "chatbot" && <Chatbot />}
          {currentPage === "doctors" && <DoctorConnect />}
          {currentPage === "lookup" && <PatientLookup />}
          {currentPage === "settings" && (
            <Settings onProfileSave={(name) => setProfileName(name)} />
          )}
        </div>
      </main>

      <QRReport healthScore={healthScore} profileName={profileName} />

      {/* Footer */}
      <footer className="ml-60 px-6 py-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
