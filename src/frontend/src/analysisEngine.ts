export interface AnalysisOutput {
  findings: string[];
  deficiencies: string[];
  confidence: number;
  explanation: string;
}

export interface BloodParam {
  parameter: string;
  value: string;
  normalRange: string;
  status: "normal" | "low" | "high";
}

const nailFindings = [
  {
    finding: "Pale nail beds detected",
    deficiency: "Iron deficiency",
    explanation:
      "Pale nail beds indicate reduced hemoglobin, a classic sign of Iron deficiency anemia.",
  },
  {
    finding: "White spots (leukonychia) observed",
    deficiency: "Zinc deficiency",
    explanation:
      "White spots on nails are associated with Zinc deficiency and minor trauma to the nail matrix.",
  },
  {
    finding: "Brittle and ridged nails",
    deficiency: "Biotin (Vitamin B7) deficiency",
    explanation:
      "Brittle nails with longitudinal ridges can indicate Biotin or Iron deficiency.",
  },
  {
    finding: "Spoon-shaped nails (koilonychia)",
    deficiency: "Iron deficiency",
    explanation:
      "Koilonychia - upward-curving nails - is a hallmark sign of severe Iron deficiency anemia.",
  },
  {
    finding: "Yellow discoloration of nails",
    deficiency: "Vitamin E deficiency",
    explanation:
      "Yellowish nails may indicate Vitamin E deficiency or fungal infection.",
  },
];

const eyeFindings = [
  {
    finding: "Yellowing of the sclera (icterus)",
    deficiency: "Vitamin A or liver concern",
    explanation:
      "Yellow sclera can indicate elevated bilirubin. Vitamin A deficiency may also affect eye health.",
  },
  {
    finding: "Pale conjunctiva observed",
    deficiency: "Iron deficiency / Anemia",
    explanation:
      "Pale inner eyelids (conjunctival pallor) strongly correlate with low hemoglobin levels.",
  },
  {
    finding: "Dryness and roughness of cornea",
    deficiency: "Vitamin A deficiency",
    explanation:
      "Xerophthalmia - dry, rough cornea - is a direct result of Vitamin A deficiency.",
  },
  {
    finding: "Bitot's spots detected",
    deficiency: "Severe Vitamin A deficiency",
    explanation:
      "Bitot's spots are foamy patches on the conjunctiva, a classic sign of Vitamin A deficiency.",
  },
  {
    finding: "Redness and fatigue in eyes",
    deficiency: "Vitamin B2 (Riboflavin) deficiency",
    explanation:
      "Bloodshot or strained eyes may indicate Riboflavin deficiency affecting corneal vascularization.",
  },
];

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function analyzeNails(): AnalysisOutput {
  const count = Math.floor(Math.random() * 2) + 1;
  const picked = pickRandom(nailFindings, count);
  return {
    findings: picked.map((p) => p.finding),
    deficiencies: [...new Set(picked.map((p) => p.deficiency))],
    confidence: Math.floor(Math.random() * 20) + 70,
    explanation: picked.map((p) => p.explanation).join(" "),
  };
}

export function analyzeEyes(): AnalysisOutput {
  const count = Math.floor(Math.random() * 2) + 1;
  const picked = pickRandom(eyeFindings, count);
  return {
    findings: picked.map((p) => p.finding),
    deficiencies: [...new Set(picked.map((p) => p.deficiency))],
    confidence: Math.floor(Math.random() * 20) + 68,
    explanation: picked.map((p) => p.explanation).join(" "),
  };
}

export function analyzeVoice(amplitude: number): AnalysisOutput {
  const isWeak = amplitude < 0.4;
  const isFatigued = amplitude < 0.6;
  const findings: string[] = [];
  const deficiencies: string[] = [];
  const explanations: string[] = [];

  if (isWeak) {
    findings.push("Low voice amplitude detected");
    deficiencies.push("Vitamin B12 deficiency");
    explanations.push(
      "A consistently weak voice may indicate Vitamin B12 deficiency, which affects nerve and muscle function.",
    );
  }
  if (isFatigued) {
    findings.push("Fatigue-indicative vocal patterns");
    deficiencies.push("General energy deficiency (Iron / B-complex)");
    explanations.push(
      "Fatigue-tone in voice correlates with low energy levels, often linked to Iron or B-complex vitamin deficiency.",
    );
  }
  if (!isWeak && !isFatigued) {
    findings.push("Voice amplitude within normal range");
  }

  return {
    findings,
    deficiencies,
    confidence: Math.floor(Math.random() * 15) + 65,
    explanation:
      explanations.join(" ") ||
      "Voice patterns appear normal. No significant deficiency indicators detected.",
  };
}

export function analyzePosture(): AnalysisOutput {
  const postureIssues = [
    {
      finding: "Forward head posture detected",
      deficiency: "Vitamin D / Calcium deficiency",
      explanation:
        "Forward head posture and muscle weakness can be linked to Vitamin D and Calcium deficiency affecting bone and muscle health.",
    },
    {
      finding: "Rounded shoulders observed",
      deficiency: "Magnesium deficiency",
      explanation:
        "Rounded shoulders and muscle tension can indicate Magnesium deficiency, which regulates muscle relaxation.",
    },
    {
      finding: "Lateral spinal deviation noted",
      deficiency: "Vitamin D deficiency",
      explanation:
        "Postural imbalances can result from weakened bones and muscles due to Vitamin D deficiency.",
    },
  ];
  const count = Math.floor(Math.random() * 2) + 1;
  const picked = pickRandom(postureIssues, count);
  return {
    findings: picked.map((p) => p.finding),
    deficiencies: [...new Set(picked.map((p) => p.deficiency))],
    confidence: Math.floor(Math.random() * 20) + 60,
    explanation: picked.map((p) => p.explanation).join(" "),
  };
}

export function getBloodReportSimulation(): BloodParam[] {
  return [
    {
      parameter: "Hemoglobin",
      value: "10.2 g/dL",
      normalRange: "12-17 g/dL",
      status: "low",
    },
    {
      parameter: "Serum Iron",
      value: "45 ug/dL",
      normalRange: "60-170 ug/dL",
      status: "low",
    },
    {
      parameter: "Vitamin B12",
      value: "180 pg/mL",
      normalRange: "200-900 pg/mL",
      status: "low",
    },
    {
      parameter: "Vitamin D",
      value: "22 ng/mL",
      normalRange: "20-50 ng/mL",
      status: "normal",
    },
    {
      parameter: "Calcium",
      value: "9.1 mg/dL",
      normalRange: "8.5-10.5 mg/dL",
      status: "normal",
    },
    {
      parameter: "Zinc",
      value: "62 ug/dL",
      normalRange: "70-120 ug/dL",
      status: "low",
    },
    {
      parameter: "Vitamin C",
      value: "1.2 mg/dL",
      normalRange: "0.4-2.0 mg/dL",
      status: "normal",
    },
    {
      parameter: "Ferritin",
      value: "8 ng/mL",
      normalRange: "15-150 ng/mL",
      status: "low",
    },
    {
      parameter: "WBC Count",
      value: "6,800 /uL",
      normalRange: "4,000-11,000 /uL",
      status: "normal",
    },
    {
      parameter: "Platelets",
      value: "280,000 /uL",
      normalRange: "150,000-400,000 /uL",
      status: "normal",
    },
  ];
}

const chatRules: Array<{
  keywords: string[];
  responses: Record<string, string>;
}> = [
  {
    keywords: [
      "tired",
      "fatigue",
      "exhausted",
      "thaka",
      "thakan",
      "danida",
      "ayasa",
    ],
    responses: {
      en: "I hear you. Constant fatigue can be a sign of Iron, B12, or Vitamin D deficiency. Can you tell me - do you follow a vegetarian diet? And how many hours do you sleep?",
      hi: "Main samajhta hun. Thakan Iron, B12 ya Vitamin D ki kami ka sanket ho sakta hai. Kya aap shakahari hain? Aur aap kitne ghante sote hain?",
      kn: "Nanu arthamadikoluttene. Nirantar ayasa Iron, B12 athava Vitamin D koratey sanketavagirbahudu. Neevu sasyahariya?",
    },
  },
  {
    keywords: ["pale", "nails", "nail", "nakhun", "uguru"],
    responses: {
      en: "Pale or spotted nails can indicate Iron or Zinc deficiency. I recommend using the Nail Analysis tool for a detailed scan. Would you like to proceed?",
      hi: "Peele ya dabbedaar nakhun Iron ya Zinc ki kami ka sanket ho sakte hain. Main Nail Analysis tool upayog karne ki salah deta hun.",
      kn: "Bilichikonda ugurugalu Iron athava Zinc koratey sanket. Nail Analysis tool balisalu suchisuttene.",
    },
  },
  {
    keywords: ["eyes", "eye", "yellow", "aankh", "peela", "kannu", "haladi"],
    responses: {
      en: "Eye symptoms like yellowing or paleness are important signals. Please try the Eye Analysis tool for detailed insights. Yellow eyes may indicate Vitamin A issues or liver-related concerns.",
      hi: "Aankhon ki samasyayen jaise peelaapaen mahatvapurna sanket hain. Eye Analysis tool aazmaen. Peeli aankhein Vitamin A ki kami ka sanket ho sakti hain.",
      kn: "Kannina rogalakshanagalu mukya sanketagalu. Eye Analysis tool balisi. Haladi kannugalu Vitamin A koratey suchisabahudu.",
    },
  },
  {
    keywords: ["diet", "food", "eat", "khana", "ahaar", "aahara", "tinnu"],
    responses: {
      en: "Good nutrition is key! Based on your region, the Diet Planner can suggest personalized Indian meals rich in vitamins. Try the Diet Planner tab!",
      hi: "Accha poshan bahut zaroori hai! Diet Planner aapke kshetra ke anusar bharatiya khane ki yojana bana sakta hai.",
      kn: "Uttama poshane bahala mukhy! Diet Planner nimma pradeshakke takkante bharatiya uutada yojane suchisabahudu.",
    },
  },
  {
    keywords: ["vitamin d", "sun", "sunlight", "suraj", "surya"],
    responses: {
      en: "Vitamin D from sunlight is essential! The Sunlight Tracker can help you monitor your daily sun exposure. Aim for 20-30 minutes of morning sunlight.",
      hi: "Suraj ki roshni se Vitamin D milta hai! Sunlight Tracker aapke daily suryaprakash ko track karne mein madad kar sakta hai.",
      kn: "Suryabelakinda Vitamin D agatya! Sunlight Tracker nimma dainanadina suryabelakanu track maadalu sahaya maadubahudu.",
    },
  },
];

export function chatbotReply(message: string, lang: string): string {
  const lower = message.toLowerCase();
  const l = lang === "hi" || lang === "kn" ? (lang as "hi" | "kn") : "en";

  for (const rule of chatRules) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.responses[l] ?? rule.responses.en;
    }
  }

  const defaults: Record<string, string> = {
    en: "That's an important health question! I'd recommend tracking your symptoms consistently and using the Analyzer tools. Would you like me to suggest which analyzer to try first?",
    hi: "Yeh ek mahatvapurna swasthya prashna hai! Main aapko Analyzer tools upayog karne ki salah deta hun. Kya main bata sakta hun ki kaun sa analyzer pehle aazmaen?",
    kn: "Idu ondu mukhy arogya prashne! Analyzer toolsgalannu balisalu suchisuttene. Yava analyzer modalu prayatnisabeku endu helale?",
  };
  return defaults[l] ?? defaults.en;
}
