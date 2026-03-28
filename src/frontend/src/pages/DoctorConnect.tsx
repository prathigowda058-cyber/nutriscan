import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Share2, Video } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useLanguage } from "../LanguageContext";
import type { DoctorSuggestion } from "../backend";
import { useActor } from "../hooks/useActor";

const seedDoctors: DoctorSuggestion[] = [
  {
    name: "Dr. Ananya Krishnan",
    specialty: "General Physician",
    location: "Bangalore, Karnataka",
    phone: "+91 98765 43210",
    available: true,
  },
  {
    name: "Dr. Rajesh Mehta",
    specialty: "Nutritionist",
    location: "Mumbai, Maharashtra",
    phone: "+91 98765 43211",
    available: true,
  },
  {
    name: "Dr. Priya Subramaniam",
    specialty: "Hematologist",
    location: "Chennai, Tamil Nadu",
    phone: "+91 98765 43212",
    available: false,
  },
  {
    name: "Dr. Vikram Sharma",
    specialty: "Endocrinologist",
    location: "Delhi",
    phone: "+91 98765 43213",
    available: true,
  },
  {
    name: "Dr. Meena Patil",
    specialty: "Ophthalmologist",
    location: "Pune, Maharashtra",
    phone: "+91 98765 43214",
    available: true,
  },
  {
    name: "Dr. Suresh Nair",
    specialty: "Dermatologist",
    location: "Kochi, Kerala",
    phone: "+91 98765 43215",
    available: false,
  },
];

const specialtyEmoji: Record<string, string> = {
  "General Physician": "🩺",
  Nutritionist: "🥗",
  Hematologist: "🩸",
  Endocrinologist: "⚕️",
  Ophthalmologist: "👁️",
  Dermatologist: "✨",
};

export function DoctorConnect() {
  const { t } = useLanguage();
  const { actor } = useActor();

  const { data: doctors, refetch } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => (actor ? actor.getDoctorSuggestions() : []),
    enabled: !!actor,
  });

  useEffect(() => {
    if (actor && doctors !== undefined && doctors.length === 0) {
      actor
        .addDoctorSuggestions(seedDoctors)
        .then(() => refetch())
        .catch(() => {});
    }
  }, [actor, doctors, refetch]);

  const displayDoctors = doctors && doctors.length > 0 ? doctors : seedDoctors;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Connect with specialists based on your health analysis results.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayDoctors.map((doc, i) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              className="glass-card border-0 h-full"
              data-ocid={`doctors.item.${i + 1}`}
            >
              <CardContent className="pt-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{ background: "oklch(75 0.18 170 / 0.15)" }}
                    >
                      {specialtyEmoji[doc.specialty] ?? "👨‍⚕️"}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {doc.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {doc.specialty}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      doc.available
                        ? "border-primary/30 text-primary bg-primary/10"
                        : "border-muted text-muted-foreground"
                    }`}
                  >
                    {doc.available ? t("available") : t("unavailable")}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} /> {doc.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} /> {doc.phone}
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    data-ocid={`doctors.share.${i + 1}.button`}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-border text-xs"
                    onClick={() => toast.success("Report shared!")}
                  >
                    <Share2 size={12} className="mr-1" />
                    {t("shareReport")}
                  </Button>
                  <Button
                    data-ocid={`doctors.book.${i + 1}.button`}
                    size="sm"
                    className="flex-1 text-xs"
                    disabled={!doc.available}
                    onClick={() => toast.success("Consultation booked!")}
                  >
                    <Video size={12} className="mr-1" />
                    {t("bookConsultation")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
