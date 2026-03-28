import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { useLanguage } from "../LanguageContext";
import { useActor } from "../hooks/useActor";

const weeklyMock = [
  { day: "Mon", mins: 15 },
  { day: "Tue", mins: 25 },
  { day: "Wed", mins: 10 },
  { day: "Thu", mins: 30 },
  { day: "Fri", mins: 20 },
  { day: "Sat", mins: 40 },
  { day: "Sun", mins: 35 },
];

const locationUV: Record<string, number> = {
  Karnataka: 7,
  Maharashtra: 6,
  "Tamil Nadu": 8,
  Delhi: 6,
  Other: 5,
};

function getRecommendation(mins: number, uv: number): string {
  if (mins < 10)
    return `⚠️ Very low sun exposure! You need at least 20-30 minutes daily for Vitamin D synthesis. UV index is ${uv} — ideal for safe sun exposure.`;
  if (mins < 20)
    return `🌤 You need ${20 - mins} more minutes of sunlight today. Morning sun (7-10 AM) is best with UV index around ${uv}.`;
  if (mins >= 20 && mins <= 40)
    return `✅ Great! ${mins} minutes of sunlight is within the ideal range. Your Vitamin D synthesis is likely adequate.`;
  return `🔆 ${mins} minutes is good, but avoid prolonged exposure during peak UV hours. UV index ${uv} — use sunscreen after 30 mins.`;
}

export function Sunlight() {
  const { t } = useLanguage();
  const { actor } = useActor();
  const [outdoorMins, setOutdoorMins] = useState(20);
  const [region, setRegion] = useState("Karnataka");
  const uvIndex = locationUV[region] ?? 6;
  const recommendation = getRecommendation(outdoorMins, uvIndex);

  const { data: history, refetch } = useQuery({
    queryKey: ["sunlightHistory"],
    queryFn: async () => (actor ? actor.getSunlightHistory() : []),
    enabled: !!actor,
  });

  const chartData =
    history && history.length > 0
      ? history.slice(-7).map((h, i) => ({
          day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7],
          mins: Number(h.outdoorMinutes),
        }))
      : weeklyMock;

  const handleLog = async () => {
    if (!actor) {
      toast.error("Please log in");
      return;
    }
    try {
      await actor.logSunlight({
        date: BigInt(Date.now()),
        outdoorMinutes: BigInt(outdoorMins),
        uvIndex: BigInt(uvIndex),
        recommendation,
      });
      toast.success("Sunlight logged!");
      refetch();
    } catch {
      toast.error("Failed to log");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-sm">☀️ Today's Sun Exposure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">{t("outdoorMins")}</span>
              <span className="text-primary font-bold">{outdoorMins} min</span>
            </div>
            <Slider
              data-ocid="sunlight.minutes.input"
              value={[outdoorMins]}
              onValueChange={(v) => setOutdoorMins(v[0])}
              min={0}
              max={120}
              step={5}
            />
          </div>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                {t("region")}
              </p>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger
                  data-ocid="sunlight.region.select"
                  className="w-40 bg-white/5 border-border"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(locationUV).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">
                {t("uvIndex")}
              </p>
              <p
                className="text-2xl font-bold"
                style={{
                  color:
                    uvIndex >= 7 ? "oklch(72 0.2 50)" : "oklch(75 0.18 170)",
                }}
              >
                {uvIndex}
              </p>
            </div>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{
              background: "oklch(75 0.18 170 / 0.08)",
              border: "1px solid oklch(75 0.18 170 / 0.2)",
            }}
          >
            <p className="text-sm leading-relaxed text-foreground">
              {recommendation}
            </p>
          </div>
          <Button
            data-ocid="sunlight.log.button"
            onClick={handleLog}
            className="w-full"
          >
            {t("logSunlight")}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-sm">Weekly Sunlight (minutes)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "oklch(65 0.04 220)" }}
              />
              <YAxis tick={{ fontSize: 11, fill: "oklch(65 0.04 220)" }} />
              <Tooltip
                contentStyle={{
                  background: "#0A1929",
                  border: "1px solid oklch(28 0.025 220)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="mins"
                fill="oklch(75 0.18 170)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
