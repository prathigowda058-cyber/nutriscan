import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { useLanguage } from "../LanguageContext";
import { useActor } from "../hooks/useActor";

const mockTimeline = [
  { date: "Mon", score: 68 },
  { date: "Tue", score: 72 },
  { date: "Wed", score: 70 },
  { date: "Thu", score: 75 },
  { date: "Fri", score: 73 },
  { date: "Sat", score: 78 },
  { date: "Sun", score: 74 },
];

const moods = ["😴", "😐", "🙂", "😊", "🤩"];
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function Timeline() {
  const { t } = useLanguage();
  const { actor } = useActor();
  const [selectedMood, setSelectedMood] = useState(2);
  const [score, setScore] = useState(70);
  const [notes, setNotes] = useState("");

  const { data: timeline, refetch } = useQuery({
    queryKey: ["timeline"],
    queryFn: async () => (actor ? actor.getHealthTimeline() : []),
    enabled: !!actor,
  });

  const chartData =
    timeline && timeline.length > 0
      ? timeline.slice(-7).map((e, i) => ({
          date: dayLabels[i % 7],
          score: Number(e.healthScore),
        }))
      : mockTimeline;

  const handleSubmit = async () => {
    if (!actor) {
      toast.error("Please log in");
      return;
    }
    try {
      await actor.addHealthEntry({
        mood: moods[selectedMood],
        notes,
        timestamp: BigInt(Date.now()),
        healthScore: BigInt(score),
        vitamins: {
          b12: BigInt(50),
          iron: BigInt(60),
          vitC: BigInt(80),
          vitD: BigInt(55),
          calcium: BigInt(75),
          zinc: BigInt(65),
        },
      });
      toast.success("Health entry saved!");
      setNotes("");
      refetch();
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-sm">Weekly Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(28 0.025 220)"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "oklch(65 0.04 220)" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "oklch(65 0.04 220)" }}
              />
              <Tooltip
                contentStyle={{
                  background: "#0A1929",
                  border: "1px solid oklch(28 0.025 220)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="oklch(75 0.18 170)"
                strokeWidth={2}
                dot={{ fill: "oklch(75 0.18 170)", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Prediction */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card
          className="border-0"
          style={{
            background: "oklch(75 0.18 170 / 0.08)",
            border: "1px solid oklch(75 0.18 170 / 0.2)",
          }}
        >
          <CardContent className="pt-4">
            <p className="text-sm font-medium text-primary mb-1">
              🤖 {t("prediction")}
            </p>
            <p className="text-xs text-muted-foreground">
              📉 Iron levels may decrease in 2 weeks based on current trend.
              Consider increasing spinach, lentils, and jaggery intake.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Entry */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-sm">{t("healthEntry")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">{t("mood")}</p>
            <div className="flex gap-3">
              {moods.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  data-ocid={`timeline.mood.${i + 1}.toggle`}
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
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">Health Score</span>
              <span className="text-primary font-bold">{score}</span>
            </div>
            <Slider
              data-ocid="timeline.score.input"
              value={[score]}
              onValueChange={(v) => setScore(v[0])}
              min={0}
              max={100}
              step={1}
            />
          </div>
          <Textarea
            data-ocid="timeline.notes.textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes about today's health..."
            className="bg-white/5 border-border text-sm"
            rows={3}
          />
          <Button
            data-ocid="timeline.save.button"
            onClick={handleSubmit}
            className="w-full"
          >
            {t("save")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
