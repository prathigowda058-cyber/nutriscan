import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  Bot,
  Salad,
  ScanSearch,
  Stethoscope,
  Sun,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "../LanguageContext";
import { useActor } from "../hooks/useActor";

const vitaminData = [
  { name: "Iron", level: 62, fill: "oklch(75 0.18 170)" },
  { name: "B12", level: 45, fill: "oklch(70 0.17 195)" },
  { name: "Vit D", level: 78, fill: "oklch(72 0.2 130)" },
  { name: "Zinc", level: 55, fill: "oklch(68 0.19 50)" },
  { name: "Calcium", level: 85, fill: "oklch(65 0.19 260)" },
  { name: "Vit C", level: 90, fill: "oklch(75 0.18 170)" },
];

const moods = ["😴", "😐", "🙂", "😊", "🤩"];

interface DashboardProps {
  onNavigate: (page: string) => void;
  profileName: string;
}

export function Dashboard({ onNavigate, profileName }: DashboardProps) {
  const { t } = useLanguage();
  const { actor } = useActor();
  const [selectedMood, setSelectedMood] = useState(2);
  const [healthScore, setHealthScore] = useState(74);
  const [streak, setStreak] = useState(5);
  const [analysesDone, setAnalysesDone] = useState(12);

  const { data: gameStats } = useQuery({
    queryKey: ["gameStats"],
    queryFn: async () => (actor ? actor.getGameStats() : null),
    enabled: !!actor,
  });

  const { data: analysisHistory } = useQuery({
    queryKey: ["analysisHistory"],
    queryFn: async () => (actor ? actor.getAnalysisHistory() : []),
    enabled: !!actor,
  });

  useEffect(() => {
    if (gameStats) {
      setHealthScore(Number(gameStats.healthScore));
      setStreak(Number(gameStats.currentStreak));
    }
  }, [gameStats]);

  useEffect(() => {
    if (analysisHistory) setAnalysesDone(analysisHistory.length || 12);
  }, [analysisHistory]);

  const hour = new Date().getHours();
  const greetingEmoji = hour < 12 ? "🌅" : hour < 17 ? "☀️" : "🌙";

  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (healthScore / 100) * circumference;

  const quickActions = [
    {
      icon: <ScanSearch size={20} />,
      label: t("nailAnalysis"),
      page: "analyzers",
      color: "oklch(75 0.18 170)",
    },
    {
      icon: <Salad size={20} />,
      label: t("dietPlanner"),
      page: "diet",
      color: "oklch(70 0.17 195)",
    },
    {
      icon: <Sun size={20} />,
      label: t("sunlight"),
      page: "sunlight",
      color: "oklch(72 0.2 130)",
    },
    {
      icon: <TrendingUp size={20} />,
      label: t("timeline"),
      page: "timeline",
      color: "oklch(65 0.19 260)",
    },
    {
      icon: <Bot size={20} />,
      label: t("chatbot"),
      page: "chatbot",
      color: "oklch(68 0.19 50)",
    },
    {
      icon: <Stethoscope size={20} />,
      label: t("doctorConnect"),
      page: "doctors",
      color: "oklch(75 0.18 170)",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-foreground">
          {greetingEmoji} {t("greeting")}, {profileName || "Friend"}!
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Here's your health snapshot for today
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: t("healthScore"),
            value: healthScore,
            unit: "/100",
            color: "oklch(75 0.18 170)",
            id: "health_score",
          },
          {
            label: t("streak"),
            value: streak,
            unit: " days 🔥",
            color: "oklch(72 0.2 130)",
            id: "streak",
          },
          {
            label: t("analysesDone"),
            value: analysesDone,
            unit: " total",
            color: "oklch(65 0.19 260)",
            id: "analyses",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card teal-glow border-0">
              <CardContent className="pt-5 pb-4">
                <p className="text-xs text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                  <span className="text-sm font-normal text-muted-foreground">
                    {stat.unit}
                  </span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Health Score Donut + Vitamin Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-sm">{t("healthScore")}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-4">
            <div className="relative">
              <svg
                width="120"
                height="120"
                viewBox="0 0 100 100"
                aria-label={`Health score: ${healthScore} out of 100`}
              >
                <title>Health Score Donut Chart</title>
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="oklch(28 0.025 220)"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="oklch(75 0.18 170)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">
                  {healthScore}
                </span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>
            <div className="ml-6 space-y-1">
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-sm font-semibold text-primary">
                {healthScore >= 80
                  ? "Excellent 🌟"
                  : healthScore >= 60
                    ? "Good 👍"
                    : "Needs Attention ⚠️"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Streak: {streak} days 🔥
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-sm">{t("vitaminLevels")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={vitaminData}
                layout="vertical"
                margin={{ left: 10, right: 20 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "oklch(65 0.04 220)" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "oklch(65 0.04 220)" }}
                  width={45}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0A1929",
                    border: "1px solid oklch(28 0.025 220)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(v) => [`${v}%`, "Level"]}
                />
                <Bar dataKey="level" radius={[0, 4, 4, 0]}>
                  {vitaminData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-sm">{t("quickActions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.page}
                type="button"
                data-ocid={`dashboard.${action.page}.button`}
                onClick={() => onNavigate(action.page)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:scale-105 hover:bg-white/5"
                style={{ border: `1px solid ${action.color}33` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${action.color}20`,
                    color: action.color,
                  }}
                >
                  {action.icon}
                </div>
                <span className="text-xs text-center text-muted-foreground leading-tight">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Wellness */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-sm">{t("todayWellness")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">{t("mood")}</p>
          <div className="flex gap-3">
            {moods.map((m, i) => (
              <button
                key={m}
                type="button"
                data-ocid={`dashboard.mood.${i + 1}.toggle`}
                onClick={() => setSelectedMood(i)}
                className={`text-2xl p-2 rounded-xl transition-all ${
                  selectedMood === i
                    ? "scale-125 bg-primary/20 ring-1 ring-primary"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
