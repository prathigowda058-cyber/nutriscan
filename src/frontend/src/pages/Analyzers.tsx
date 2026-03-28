import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, FileText, Mic, Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../LanguageContext";
import {
  type AnalysisOutput,
  analyzeEyes,
  analyzeNails,
  analyzePosture,
  analyzeVoice,
  getBloodReportSimulation,
} from "../analysisEngine";
import { useCamera } from "../camera/useCamera";
import { useActor } from "../hooks/useActor";

function AnalysisResultCard({
  result,
  moduleName,
}: { result: AnalysisOutput; moduleName: string }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 mt-4"
    >
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-sm">
            {moduleName} — {t("findings")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">{t("confidence")}</span>
              <span className="text-primary font-semibold">
                {result.confidence}%
              </span>
            </div>
            <Progress value={result.confidence} className="h-2" />
          </div>
          <div className="space-y-1">
            {result.findings.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm">
                <span className="text-primary">•</span>
                <span className="text-foreground">{f}</span>
              </div>
            ))}
          </div>
          {result.deficiencies.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                {t("deficiencies")}
              </p>
              <div className="flex flex-wrap gap-2">
                {result.deficiencies.map((d) => (
                  <Badge
                    key={d}
                    variant="secondary"
                    className="text-xs bg-destructive/20 text-destructive border-destructive/30"
                  >
                    {d}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div
            className="rounded-lg p-3"
            style={{
              background: "oklch(75 0.18 170 / 0.08)",
              border: "1px solid oklch(75 0.18 170 / 0.2)",
            }}
          >
            <p className="text-xs font-medium text-primary mb-1">
              🔍 {t("explanation")}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {result.explanation}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CameraAnalyzer({
  onAnalyze,
  moduleName,
}: { onAnalyze: () => AnalysisOutput; moduleName: string }) {
  const { t } = useLanguage();
  const { actor } = useActor();
  const [result, setResult] = useState<AnalysisOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const {
    isActive,
    isLoading,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: "environment", width: 640, height: 480 });

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await capturePhoto();
    await new Promise((r) => setTimeout(r, 1500));
    const res = onAnalyze();
    setResult(res);
    setIsAnalyzing(false);
    if (actor) {
      try {
        await actor.saveAnalysisResult({
          moduleName,
          findings: res.findings,
          deficiencies: res.deficiencies,
          confidence: BigInt(res.confidence),
          explanation: res.explanation,
          timestamp: BigInt(Date.now()),
        });
        toast.success("Analysis saved!");
      } catch {
        // silent
      }
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="relative rounded-xl overflow-hidden"
        style={{ minHeight: "240px", background: "oklch(22 0.03 220)" }}
      >
        {isActive ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full"
            style={{ minHeight: "240px", objectFit: "cover" }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-60 gap-3 text-muted-foreground">
            <Camera size={40} className="opacity-30" />
            <p className="text-sm">Camera preview will appear here</p>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      {error && <p className="text-xs text-destructive">{error.message}</p>}
      <div className="flex gap-3">
        {!isActive ? (
          <Button
            data-ocid={`analyzers.${moduleName.toLowerCase()}.start_camera.button`}
            onClick={startCamera}
            disabled={isLoading}
            className="flex-1"
          >
            <Camera size={16} className="mr-2" />
            {t("startCamera")}
          </Button>
        ) : (
          <>
            <Button
              data-ocid={`analyzers.${moduleName.toLowerCase()}.capture.button`}
              onClick={handleAnalyze}
              disabled={isAnalyzing || isLoading}
              className="flex-1"
            >
              {isAnalyzing ? t("analyzing") : t("analyze")}
            </Button>
            <Button
              variant="outline"
              onClick={stopCamera}
              className="border-border"
            >
              Stop
            </Button>
          </>
        )}
      </div>
      {isAnalyzing && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <span className="animate-spin">⟳</span> {t("analyzing")}
        </div>
      )}
      {result && <AnalysisResultCard result={result} moduleName={moduleName} />}
    </div>
  );
}

function VoiceAnalyzer() {
  const { actor } = useActor();
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [result, setResult] = useState<AnalysisOutput | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleRecord = () => {
    setIsRecording(true);
    setCountdown(3);
    setResult(null);
    let c = 3;
    timerRef.current = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(timerRef.current!);
        setIsRecording(false);
        const amplitude = Math.random();
        const res = analyzeVoice(amplitude);
        setResult(res);
        if (actor) {
          actor
            .saveAnalysisResult({
              moduleName: "Voice",
              findings: res.findings,
              deficiencies: res.deficiencies,
              confidence: BigInt(res.confidence),
              explanation: res.explanation,
              timestamp: BigInt(Date.now()),
            })
            .catch(() => {});
        }
      }
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-6 py-8">
        <motion.button
          type="button"
          data-ocid="analyzers.voice.record.button"
          onClick={handleRecord}
          disabled={isRecording}
          whileTap={{ scale: 0.95 }}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? "bg-destructive/20 border-2 border-destructive"
              : "bg-primary/20 border-2 border-primary hover:bg-primary/30"
          }`}
        >
          {isRecording ? (
            <div className="text-2xl font-bold text-destructive">
              {countdown}
            </div>
          ) : (
            <Mic size={36} className="text-primary" />
          )}
        </motion.button>
        <p className="text-sm text-muted-foreground">
          {isRecording
            ? `Recording... ${countdown}s remaining`
            : "Tap the mic to record a 3-second voice sample"}
        </p>
        {isRecording && (
          <div className="flex gap-1 items-center">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-full bg-primary"
                animate={{ height: [8, 20 + Math.random() * 20, 8] }}
                transition={{
                  duration: 0.4,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>
        )}
      </div>
      {result && <AnalysisResultCard result={result} moduleName="Voice" />}
    </div>
  );
}

function BloodReportAnalyzer() {
  const { t } = useLanguage();
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsAnalyzing(false);
    setShowResults(true);
    toast.success("Report analyzed!");
  };

  const data = getBloodReportSimulation();

  return (
    <div className="space-y-4">
      <button
        type="button"
        data-ocid="analyzers.blood.dropzone"
        onClick={() => fileRef.current?.click()}
        className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
      >
        <Upload size={32} className="mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-medium">Upload Blood Report</p>
        <p className="text-xs text-muted-foreground mt-1">
          PDF, JPG, PNG supported
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFile}
        />
      </button>

      {isAnalyzing && (
        <div
          data-ocid="analyzers.blood.loading_state"
          className="flex items-center gap-2 text-primary text-sm"
        >
          <span className="animate-spin">⟳</span> Extracting values via OCR...
        </div>
      )}

      <AnimatePresence>
        {showResults && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-sm">Extracted Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Your Value</TableHead>
                      <TableHead>Normal Range</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row) => (
                      <TableRow key={row.parameter}>
                        <TableCell className="font-medium">
                          {row.parameter}
                        </TableCell>
                        <TableCell>{row.value}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {row.normalRange}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs ${
                              row.status === "low"
                                ? "bg-destructive/20 text-destructive border-destructive/30"
                                : row.status === "high"
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  : "bg-primary/20 text-primary border-primary/30"
                            }`}
                            variant="outline"
                          >
                            {row.status === "low"
                              ? "↓ Low"
                              : row.status === "high"
                                ? "↑ High"
                                : "✓ Normal"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!showResults && !isAnalyzing && (
        <Button
          data-ocid="analyzers.blood.simulate.button"
          variant="outline"
          className="w-full border-border"
          onClick={() => setShowResults(true)}
        >
          <FileText size={16} className="mr-2" />
          Run Simulation
        </Button>
      )}
      {t("loading") && null}
    </div>
  );
}

export function Analyzers() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <Tabs defaultValue="nail">
        <TabsList className="bg-white/5 border border-border h-auto flex-wrap gap-1 p-1">
          <TabsTrigger
            data-ocid="analyzers.nail.tab"
            value="nail"
            className="text-xs"
          >
            💅 {t("nailAnalysis")}
          </TabsTrigger>
          <TabsTrigger
            data-ocid="analyzers.eye.tab"
            value="eye"
            className="text-xs"
          >
            👁 {t("eyeAnalysis")}
          </TabsTrigger>
          <TabsTrigger
            data-ocid="analyzers.voice.tab"
            value="voice"
            className="text-xs"
          >
            🎙 {t("voiceAnalysis")}
          </TabsTrigger>
          <TabsTrigger
            data-ocid="analyzers.posture.tab"
            value="posture"
            className="text-xs"
          >
            🧍 {t("postureAnalysis")}
          </TabsTrigger>
          <TabsTrigger
            data-ocid="analyzers.blood.tab"
            value="blood"
            className="text-xs"
          >
            🩸 {t("bloodReport")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nail" className="mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Scan your nails to detect Iron, Zinc, or Biotin deficiencies.
          </p>
          <CameraAnalyzer onAnalyze={analyzeNails} moduleName="Nail" />
        </TabsContent>

        <TabsContent value="eye" className="mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Scan your eyes for signs of Vitamin A, Iron, or B2 deficiency.
          </p>
          <CameraAnalyzer onAnalyze={analyzeEyes} moduleName="Eye" />
        </TabsContent>

        <TabsContent value="voice" className="mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Record your voice to detect energy level and B12 deficiency
            patterns.
          </p>
          <VoiceAnalyzer />
        </TabsContent>

        <TabsContent value="posture" className="mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Capture your posture to detect Vitamin D, Calcium, or Magnesium
            deficiencies.
          </p>
          <CameraAnalyzer onAnalyze={analyzePosture} moduleName="Posture" />
        </TabsContent>

        <TabsContent value="blood" className="mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Upload your blood report for automatic extraction and analysis.
          </p>
          <BloodReportAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
