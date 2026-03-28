import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Loader2,
  MapPin,
  Search,
  User,
  Utensils,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

function seed(str: string, mod: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash % mod;
}

function seedRange(
  str: string,
  salt: string,
  min: number,
  max: number,
): number {
  return min + seed(str + salt, max - min + 1);
}

const REGIONS = [
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
  "Delhi",
  "Kerala",
  "Rajasthan",
];
const DIET_TYPES = ["Vegetarian", "Vegan", "Omnivore", "Pescatarian"];
const VITAMINS = [
  { label: "Iron", key: "iron" },
  { label: "B12", key: "b12" },
  { label: "Vitamin D", key: "vitd" },
  { label: "Zinc", key: "zinc" },
  { label: "Calcium", key: "calcium" },
  { label: "Vitamin C", key: "vitc" },
];
const ALL_DEFICIENCIES = [
  "Iron Deficiency",
  "Vitamin B12",
  "Vitamin D",
  "Zinc",
  "Calcium",
  "Folate",
];
const ALL_RECOMMENDATIONS = [
  "Increase leafy greens (spinach, methi) in daily meals",
  "Consider Vitamin D supplementation — 1000 IU/day",
  "Add fermented foods like curd or idli to improve B12 absorption",
  "Get 15–20 minutes of morning sunlight daily",
  "Incorporate ragi and sesame seeds for calcium",
  "Eat more citrus fruits and amla for Vitamin C",
  "Reduce tea/coffee intake around mealtimes to improve iron absorption",
  "Include pumpkin seeds and lentils for zinc",
];

const ANALYSIS_DATES = [
  "Jan 15, 2026",
  "Feb 3, 2026",
  "Feb 22, 2026",
  "Mar 1, 2026",
  "Mar 10, 2026",
  "Mar 18, 2026",
  "Mar 25, 2026",
];

function generatePatientData(query: string) {
  const q = query.trim();
  const healthScore = seedRange(q, "score", 42, 91);
  const age = seedRange(q, "age", 18, 72);
  const region = REGIONS[seed(`${q}region`, REGIONS.length)];
  const diet = DIET_TYPES[seed(`${q}diet`, DIET_TYPES.length)];
  const lastAnalysis = ANALYSIS_DATES[seed(`${q}date`, ANALYSIS_DATES.length)];

  const vitaminLevels: Record<string, number> = {};
  for (const v of VITAMINS) {
    vitaminLevels[v.key] = seedRange(q, v.key, 20, 98);
  }

  const deficiencyCount = seed(`${q}defc`, 3) + 1;
  const shuffledDefs = [...ALL_DEFICIENCIES].sort(
    (a, b) => seed(q + a, 100) - seed(q + b, 100),
  );
  const deficiencies = shuffledDefs.slice(0, deficiencyCount);

  const recCount = seed(`${q}rec`, 2) + 2;
  const shuffledRecs = [...ALL_RECOMMENDATIONS].sort(
    (a, b) => seed(q + a, 100) - seed(q + b, 100),
  );
  const recommendations = shuffledRecs.slice(0, recCount);

  return {
    healthScore,
    age,
    region,
    diet,
    lastAnalysis,
    vitaminLevels,
    deficiencies,
    recommendations,
  };
}

function getScoreColor(score: number): string {
  if (score >= 75) return "oklch(75 0.18 145)";
  if (score >= 55) return "oklch(75 0.18 80)";
  return "oklch(65 0.2 25)";
}

function getVitaminColor(level: number): string {
  if (level >= 70) return "oklch(75 0.18 170)";
  if (level >= 45) return "oklch(75 0.18 80)";
  return "oklch(65 0.2 25)";
}

export function PatientLookup() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLookup = () => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setSubmitted(query.trim());
      setLoading(false);
    }, 800);
  };

  const patient = submitted ? generatePatientData(submitted) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Patient Lookup
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Search any patient by name or ID to view their health profile
        </p>
      </div>

      {/* Search Bar */}
      <Card
        className="glass-card border-0"
        style={{
          background: "oklch(14 0.03 220 / 0.85)",
          border: "1px solid oklch(28 0.025 220)",
        }}
      >
        <CardContent className="pt-5 pb-5">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                data-ocid="lookup.search_input"
                className="pl-9 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary"
                placeholder="Enter patient name or ID (e.g. Ravi Kumar, PT-1042)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              />
            </div>
            <Button
              data-ocid="lookup.primary_button"
              onClick={handleLookup}
              disabled={loading || !query.trim()}
              style={{ background: "oklch(75 0.18 170)", color: "#07121D" }}
              className="font-semibold px-5"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              <span className="ml-2">
                {loading ? "Looking up..." : "Lookup"}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            data-ocid="lookup.loading_state"
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-16"
          >
            <div className="text-center space-y-3">
              <Loader2
                size={36}
                className="animate-spin mx-auto"
                style={{ color: "oklch(75 0.18 170)" }}
              />
              <p className="text-muted-foreground text-sm">
                Fetching health profile...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!loading && !submitted && (
        <motion.div
          data-ocid="lookup.empty_state"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 space-y-4"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "oklch(75 0.18 170 / 0.1)",
              border: "1px solid oklch(75 0.18 170 / 0.25)",
            }}
          >
            <User size={28} style={{ color: "oklch(75 0.18 170)" }} />
          </div>
          <div className="text-center">
            <p className="text-foreground font-medium">No patient selected</p>
            <p className="text-muted-foreground text-sm mt-1">
              Enter a patient name or ID to look up their health profile
            </p>
          </div>
        </motion.div>
      )}

      {/* Result Card */}
      <AnimatePresence>
        {!loading && patient && submitted && (
          <motion.div
            key={submitted}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-4"
          >
            {/* Patient Header */}
            <Card
              className="border-0"
              style={{
                background: "oklch(14 0.03 220 / 0.9)",
                border: "1px solid oklch(28 0.025 220)",
              }}
            >
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold"
                      style={{
                        background: "oklch(75 0.18 170 / 0.15)",
                        border: "1px solid oklch(75 0.18 170 / 0.3)",
                        color: "oklch(75 0.18 170)",
                      }}
                    >
                      {submitted[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {submitted}
                      </h3>
                      <div className="flex flex-wrap gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User size={12} /> Age {patient.age}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin size={12} /> {patient.region}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Utensils size={12} /> {patient.diet}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={12} /> Last analyzed:{" "}
                          {patient.lastAnalysis}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Health Score */}
                  <div className="text-center shrink-0">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-4"
                      style={{
                        borderColor: getScoreColor(patient.healthScore),
                        color: getScoreColor(patient.healthScore),
                        background: getScoreColor(patient.healthScore).replace(
                          ")",
                          " / 0.1)",
                        ),
                      }}
                    >
                      {patient.healthScore}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Health Score
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vitamin Levels */}
              <Card
                className="border-0"
                style={{
                  background: "oklch(14 0.03 220 / 0.9)",
                  border: "1px solid oklch(28 0.025 220)",
                }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-foreground">
                    Vitamin & Mineral Levels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {VITAMINS.map((v) => {
                    const level = patient.vitaminLevels[v.key];
                    return (
                      <div key={v.key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">
                            {v.label}
                          </span>
                          <span style={{ color: getVitaminColor(level) }}>
                            {level}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${level.toString()}%`,
                              background: getVitaminColor(level),
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <div className="space-y-4">
                {/* Deficiencies */}
                <Card
                  className="border-0"
                  style={{
                    background: "oklch(14 0.03 220 / 0.9)",
                    border: "1px solid oklch(28 0.025 220)",
                  }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <AlertTriangle
                        size={14}
                        style={{ color: "oklch(75 0.18 55)" }}
                      />
                      Deficiencies Detected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {patient.deficiencies.map((def) => (
                        <Badge
                          key={def}
                          className="text-xs px-2.5 py-1 border-0 font-medium"
                          style={{
                            background: "oklch(65 0.2 25 / 0.18)",
                            color: "oklch(75 0.18 25)",
                            border: "1px solid oklch(65 0.2 25 / 0.35)",
                          }}
                        >
                          {def}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card
                  className="border-0"
                  style={{
                    background: "oklch(14 0.03 220 / 0.9)",
                    border: "1px solid oklch(28 0.025 220)",
                  }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <CheckCircle
                        size={14}
                        style={{ color: "oklch(75 0.18 170)" }}
                      />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {patient.recommendations.map((rec, i) => (
                        <li
                          key={rec}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <span
                            className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              background: "oklch(75 0.18 170 / 0.15)",
                              color: "oklch(75 0.18 170)",
                            }}
                          >
                            {i + 1}
                          </span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
