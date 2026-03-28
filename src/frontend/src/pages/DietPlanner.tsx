import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../LanguageContext";
import { type MealOption, mealsByRegion } from "../dietData";
import { useActor } from "../hooks/useActor";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const regions = Object.keys(mealsByRegion);

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function MealCard({ meal }: { meal: MealOption }) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg"
      style={{
        background: "oklch(22 0.03 220 / 0.6)",
        border: "1px solid oklch(28 0.025 220)",
      }}
    >
      <span className="text-2xl">{meal.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {meal.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {meal.nutrients}
        </p>
      </div>
      <Badge
        variant="outline"
        className="text-xs border-primary/30 text-primary shrink-0"
      >
        {meal.kcal} kcal
      </Badge>
    </div>
  );
}

interface MealSection {
  breakfast: MealOption[];
  lunch: MealOption[];
  dinner: MealOption[];
  snacks: MealOption[];
}

export function DietPlanner() {
  const { t } = useLanguage();
  const { actor } = useActor();
  const [selectedDay, setSelectedDay] = useState(0);
  const [region, setRegion] = useState("Karnataka");
  const [meals, setMeals] = useState<MealSection>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  const generateMeals = useCallback(() => {
    const data = mealsByRegion[region] || mealsByRegion.Other;
    setMeals({
      breakfast: shuffle(data.breakfast).slice(0, 1),
      lunch: shuffle(data.lunch).slice(0, 1),
      dinner: shuffle(data.dinner).slice(0, 1),
      snacks: shuffle(data.snacks).slice(0, 2),
    });
  }, [region]);

  useEffect(() => {
    generateMeals();
    // biome-ignore lint/correctness/useExhaustiveDependencies: selectedDay triggers regeneration intentionally
  }, [generateMeals]);

  const totalKcal = [
    ...meals.breakfast,
    ...meals.lunch,
    ...meals.dinner,
    ...meals.snacks,
  ].reduce((sum, m) => sum + m.kcal, 0);

  const handleSave = async () => {
    if (!actor) {
      toast.error("Please log in to save");
      return;
    }
    try {
      await actor.saveDietPlan({
        date: BigInt(Date.now()),
        breakfast: meals.breakfast.map((m) => ({
          name: m.name,
          kcal: BigInt(m.kcal),
          nutrients: m.nutrients,
        })),
        lunch: meals.lunch.map((m) => ({
          name: m.name,
          kcal: BigInt(m.kcal),
          nutrients: m.nutrients,
        })),
        dinner: meals.dinner.map((m) => ({
          name: m.name,
          kcal: BigInt(m.kcal),
          nutrients: m.nutrients,
        })),
        snacks: meals.snacks.map((m) => ({
          name: m.name,
          kcal: BigInt(m.kcal),
          nutrients: m.nutrients,
        })),
        totalKcal: BigInt(totalKcal),
      });
      toast.success("Diet plan saved!");
    } catch {
      toast.error("Failed to save");
    }
  };

  const sections: Array<{
    key: keyof MealSection;
    label: string;
    emoji: string;
  }> = [
    { key: "breakfast", label: t("breakfast"), emoji: "🌅" },
    { key: "lunch", label: t("lunch"), emoji: "☀️" },
    { key: "dinner", label: t("dinner"), emoji: "🌙" },
    { key: "snacks", label: t("snacks"), emoji: "🍎" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2 flex-wrap">
          {days.map((d, i) => (
            <button
              key={d}
              type="button"
              data-ocid={`diet.day.${i + 1}.toggle`}
              onClick={() => setSelectedDay(i)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedDay === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger
            data-ocid="diet.region.select"
            className="w-36 bg-white/5 border-border"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {regions.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <motion.div key={section.key} layout>
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  {section.emoji} {section.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {meals[section.key].map((meal) => (
                  <MealCard key={meal.name} meal={meal} />
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl glass-card">
        <div>
          <p className="text-xs text-muted-foreground">{t("totalCalories")}</p>
          <p className="text-2xl font-bold text-primary">
            {totalKcal}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              kcal
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            data-ocid="diet.regenerate.button"
            variant="outline"
            className="border-border"
            onClick={generateMeals}
          >
            <RefreshCw size={16} className="mr-2" />
            {t("regenerate")}
          </Button>
          <Button data-ocid="diet.save.button" onClick={handleSave}>
            {t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
