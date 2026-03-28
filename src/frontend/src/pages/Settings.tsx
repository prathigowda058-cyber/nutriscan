import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../LanguageContext";
import { useActor } from "../hooks/useActor";
import type { Lang } from "../translations";

const badgeList = [
  { emoji: "🔥", label: "7-Day Streak" },
  { emoji: "🥗", label: "Healthy Eater" },
  { emoji: "☀️", label: "Sun Tracker" },
  { emoji: "🔬", label: "Analyzer Pro" },
  { emoji: "🏆", label: "Health Champion" },
  { emoji: "💪", label: "Iron Warrior" },
];

export function Settings({
  onProfileSave,
}: { onProfileSave: (name: string) => void }) {
  const { lang, setLang, t } = useLanguage();
  const { actor } = useActor();
  const [name, setName] = useState("Priya Sharma");
  const [age, setAge] = useState("28");
  const [weight, setWeight] = useState("58");
  const [height, setHeight] = useState("162");
  const [region, setRegion] = useState("Karnataka");
  const [dietType, setDietType] = useState("Vegetarian");

  useEffect(() => {
    if (actor) {
      actor
        .getCallerUserProfile()
        .then((p) => {
          if (p) {
            setName(p.name);
            setAge(String(p.age));
            setWeight(String(p.weight));
            setHeight(String(p.height));
            setRegion(p.region);
            setDietType(p.dietType);
          }
        })
        .catch(() => {});
    }
  }, [actor]);

  const handleSave = async () => {
    if (!actor) {
      toast.error("Please log in");
      return;
    }
    try {
      await actor.createOrUpdateProfile({
        name,
        age: BigInt(Number(age) || 25),
        weight: BigInt(Number(weight) || 60),
        height: BigInt(Number(height) || 165),
        region,
        language: lang,
        dietType,
      });
      onProfileSave(name);
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-sm">{t("profile")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Full Name
              </Label>
              <Input
                data-ocid="settings.name.input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-border"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Age
              </Label>
              <Input
                data-ocid="settings.age.input"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                type="number"
                className="bg-white/5 border-border"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Weight (kg)
              </Label>
              <Input
                data-ocid="settings.weight.input"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                type="number"
                className="bg-white/5 border-border"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Height (cm)
              </Label>
              <Input
                data-ocid="settings.height.input"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                type="number"
                className="bg-white/5 border-border"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                {t("region")}
              </Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger
                  data-ocid="settings.region.select"
                  className="bg-white/5 border-border"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Karnataka",
                    "Maharashtra",
                    "Tamil Nadu",
                    "Delhi",
                    "Other",
                  ].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Diet Type
              </Label>
              <Select value={dietType} onValueChange={setDietType}>
                <SelectTrigger
                  data-ocid="settings.diet.select"
                  className="bg-white/5 border-border"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Vegetarian", "Non-Vegetarian", "Vegan", "Eggetarian"].map(
                    (d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            data-ocid="settings.save.button"
            onClick={handleSave}
            className="w-full"
          >
            {t("saveProfile")}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-sm">{t("language")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {(["en", "hi", "kn"] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                data-ocid={`settings.language.${l}.toggle`}
                onClick={() => setLang(l)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  lang === l
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                {l === "en" ? "🇬🇧 English" : l === "hi" ? "🇮🇳 हिंदी" : "🇮🇳 ಕನ್ನಡ"}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-sm">{t("badges")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {badgeList.map((b) => (
              <div
                key={b.label}
                data-ocid={`settings.badge.${b.label.replace(/\s+/g, "_").toLowerCase()}.card`}
                className="flex flex-col items-center gap-1 p-3 rounded-xl"
                style={{
                  background: "oklch(75 0.18 170 / 0.08)",
                  border: "1px solid oklch(75 0.18 170 / 0.2)",
                }}
              >
                <span className="text-2xl">{b.emoji}</span>
                <span className="text-xs text-center text-muted-foreground leading-tight">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
