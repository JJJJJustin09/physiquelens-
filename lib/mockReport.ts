import type {
  PriorityLevel,
  QuestionnaireAnswers,
  Report,
  ReportConfidence,
  TrainingExperience,
} from "@/lib/types";

const BASE_SCORES: Report["scores"] = {
  vTaper: 52,
  shoulders: 49,
  back: 46,
  chest: 57,
  arms: 50,
  legs: 60,
  symmetry: 62,
  definition: 53,
};

const BASE_TRAINING_PRIORITY: Report["trainingPriority"] = {
  back: 30,
  shoulders: 25,
  arms: 20,
  chest: 15,
  legs: 10,
};

const BASE_LIMITATIONS: string[] = [
  "Photo angle affects visual proportions.",
  "Lighting affects definition impression.",
  "Clothing affects muscle visibility.",
  "Pose affects shoulder width and waist impression.",
  "Visual analysis should be combined with real measurements and training history.",
  "This report does not diagnose medical conditions or precisely measure body composition.",
  "This MVP uses simulated analysis and does not perform real AI image recognition.",
];

const BASE_DIAGNOSES: Report["diagnoses"] = [
  {
    title: "V-Taper is not visually dominant yet",
    observation:
      "Your upper body does not yet create a strong wide-shoulder-to-narrow-waist impression.",
    likelyReasons: [
      "Back width is not fully developed",
      "Side delts do not create enough lateral width",
      "Waist-to-shoulder contrast is moderate",
    ],
    improvementDirection: [
      "Prioritize lat-focused pulling movements",
      "Add lateral-delt isolation work",
      "Maintain chest and leg volume instead of over-prioritizing them",
    ],
  },
  {
    title: "Arm fullness is slightly behind torso proportion",
    observation:
      "Your arms appear slightly less developed compared with your torso.",
    likelyReasons: [
      "Upper arm mass is not visually dominant",
      "Triceps and brachialis may need more direct work",
      "Long arms can visually appear slimmer if muscle volume is not enough",
    ],
    improvementDirection: [
      "Train arms directly 1–2 times per week",
      "Include triceps, biceps, brachialis, and forearms",
      "Avoid only doing biceps curls",
    ],
  },
  {
    title: "Shoulder width impression can improve",
    observation:
      "Your shoulder outline could look broader with better side-delt development.",
    likelyReasons: [
      "Lateral deltoids are not visually prominent enough",
      "Upper body width depends heavily on delts and lats",
      "Rear delt development may also improve shoulder shape",
    ],
    improvementDirection: [
      "Increase lateral raise variations",
      "Add rear-delt work for a 3D shoulder appearance",
      "Keep shoulder training controlled to avoid joint stress",
    ],
  },
];

const GOAL_PRIORITY_SHIFT: Record<
  QuestionnaireAnswers["primaryGoal"],
  Partial<Record<keyof Report["trainingPriority"], number>>
> = {
  "Build a V-taper": { back: 8, shoulders: 7, arms: 2, chest: -8, legs: -9 },
  "Wider shoulders": { shoulders: 10, back: 6, arms: 1, chest: -7, legs: -10 },
  "Bigger arms": { arms: 12, shoulders: 5, back: 4, chest: -8, legs: -13 },
  "More balanced physique": { shoulders: 2, back: 2, arms: 1, chest: -2, legs: -3 },
  "Leaner / more definition": { back: -2, shoulders: -2, arms: -3, chest: 3, legs: 4 },
  "Better chest development": { chest: 10, shoulders: 4, back: 3, arms: -5, legs: -12 },
  "General aesthetic improvement": { back: 2, shoulders: 2, arms: 1, chest: -1, legs: -4 },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function deepCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizePriority(priority: Report["trainingPriority"]) {
  const entries = Object.entries(priority) as Array<[
    keyof Report["trainingPriority"],
    number,
  ]>;

  const safeEntries = entries.map(([key, val]) => [key, Math.max(4, val)] as const);
  const total = safeEntries.reduce((sum, [, val]) => sum + val, 0);

  const scaled = safeEntries.map(([key, val]) => ({
    key,
    value: Math.floor((val / total) * 100),
    remainder: (val / total) * 100 - Math.floor((val / total) * 100),
  }));

  let missing = 100 - scaled.reduce((sum, item) => sum + item.value, 0);
  scaled
    .sort((a, b) => b.remainder - a.remainder)
    .forEach((item) => {
      if (missing > 0) {
        item.value += 1;
        missing -= 1;
      }
    });

  return scaled.reduce(
    (acc, item) => {
      acc[item.key] = item.value;
      return acc;
    },
    { back: 0, shoulders: 0, arms: 0, chest: 0, legs: 0 } as Report["trainingPriority"],
  );
}

function confidenceFromContext(answers: QuestionnaireAnswers): ReportConfidence {
  if (answers.injuryOrPain === "Yes") return "Medium";
  if (answers.trainingExperience === "Beginner" && answers.weeklyFrequency === "0–2 days") {
    return "Medium";
  }
  if (
    answers.trainingExperience === "2+ years" &&
    answers.weeklyFrequency === "5+ days" &&
    answers.equipmentAccess === "Full gym"
  ) {
    return "High";
  }
  return "Medium-high";
}

function computeCompetitionCriteria(scores: Report["scores"]) {
  const shapeSymmetry = Math.round(
    scores.vTaper * 0.34 + scores.shoulders * 0.24 + scores.back * 0.18 + scores.symmetry * 0.24,
  );
  const muscularityCondition = Math.round(
    scores.back * 0.24 +
      scores.chest * 0.22 +
      scores.arms * 0.22 +
      scores.legs * 0.16 +
      scores.definition * 0.16,
  );
  const presentationPoise = clamp(
    Math.round(scores.symmetry * 0.5 + scores.definition * 0.28 + scores.vTaper * 0.22),
    40,
    84,
  );
  const totalPackage = Math.round(
    shapeSymmetry * 0.4 + muscularityCondition * 0.4 + presentationPoise * 0.2,
  );

  return {
    shapeSymmetry: clamp(shapeSymmetry, 35, 85),
    muscularityCondition: clamp(muscularityCondition, 35, 85),
    presentationPoise,
    totalPackage: clamp(totalPackage, 35, 85),
  };
}

function goalScoreShift(answers: QuestionnaireAnswers, scores: Report["scores"]) {
  switch (answers.primaryGoal) {
    case "Build a V-taper":
      scores.vTaper += 3;
      scores.back += 2;
      scores.shoulders += 2;
      scores.chest -= 1;
      break;
    case "Wider shoulders":
      scores.shoulders += 4;
      scores.vTaper += 2;
      scores.back += 2;
      break;
    case "Bigger arms":
      scores.arms += 4;
      scores.shoulders += 2;
      break;
    case "More balanced physique":
      scores.symmetry += 2;
      scores.back += 1;
      scores.shoulders += 1;
      break;
    case "Leaner / more definition":
      scores.definition += 4;
      scores.vTaper += 1;
      break;
    case "Better chest development":
      scores.chest += 4;
      scores.shoulders += 2;
      break;
    case "General aesthetic improvement":
      scores.definition += 2;
      scores.vTaper += 1;
      break;
  }

  if (answers.weeklyFrequency === "0–2 days") {
    scores.definition -= 2;
    scores.back -= 1;
  }

  if (answers.weeklyFrequency === "5+ days") {
    scores.definition += 1;
    scores.chest += 1;
  }

  if (answers.focusArea === "Back") scores.back += 1;
  if (answers.focusArea === "Shoulders") scores.shoulders += 1;
  if (answers.focusArea === "Arms") scores.arms += 1;
  if (answers.focusArea === "Chest") scores.chest += 1;
  if (answers.focusArea === "Legs") scores.legs += 1;
  if (answers.focusArea === "Core") scores.definition += 1;

  if (answers.equipmentAccess === "Bodyweight only") {
    scores.back -= 2;
    scores.arms -= 1;
  }

  if (answers.trainingExperience === "2+ years") {
    scores.symmetry += 1;
  }

  (Object.keys(scores) as Array<keyof Report["scores"]>).forEach((key) => {
    scores[key] = clamp(scores[key], 38, 84);
  });
}

function formatPriorityName(key: keyof Report["trainingPriority"]) {
  if (key === "back") return "Back width";
  if (key === "shoulders") return "Side delts";
  if (key === "arms") return "Arm fullness";
  if (key === "chest") return "Upper chest";
  return "Leg balance";
}

function toPriorityLabel(value: number, isLegs = false): PriorityLevel {
  if (isLegs && value <= 12) return "Maintenance";
  if (value >= 27) return "High";
  if (value >= 20) return "Medium-high";
  if (value >= 14) return "Medium";
  return "Low";
}

function areaExplanation(area: string, priority: PriorityLevel) {
  if (area === "Back") {
    return "Back width strongly influences the V-taper impression and upper-body silhouette.";
  }
  if (area === "Shoulders") {
    return "Lateral and rear deltoid development improves shoulder outline and width impression.";
  }
  if (area === "Arms") {
    return "Arm fullness supports better arm-to-torso visual balance from front and side angles.";
  }
  if (area === "Chest") {
    return "Upper chest can improve front-body fullness and overall upper-torso structure.";
  }
  if (area === "Legs") {
    return "Leg proportion appears solid and can be maintained while upper-body priorities are emphasized.";
  }
  if (area === "Core / Definition") {
    return "Definition impression improves when training consistency and nutrition alignment are steady.";
  }
  return `Current visual impression suggests a ${priority.toLowerCase()} monitoring focus for this area.`;
}

function trainingLanguageByExperience(experience: TrainingExperience) {
  if (experience === "Beginner" || experience === "Less than 6 months") {
    return "Keep movement selection simple and focus on technique quality before adding volume.";
  }
  if (experience === "2+ years") {
    return "Use progressive overload and controlled specialization blocks while managing fatigue.";
  }
  return "Use consistent weekly progression and track performance on key movements.";
}

export function getDefaultSampleReport(): Report {
  const competitionCriteria = computeCompetitionCriteria(BASE_SCORES);

  return {
    overallScore: 54,
    confidence: "Medium-high",
    aiSummary:
      "Your current physique shows a usable base, but by stricter physique-stage standards the upper-body shape contrast is still limited. Back width and side-delt development remain the main constraints reducing V-taper dominance, and arm fullness is somewhat behind torso proportion. Chest and lower body can be maintained while higher emphasis is placed on back, shoulders, and arms over the next 8–12 weeks.",
    topPriorities: ["Back width", "Side delts", "Arm fullness"],
    bestArea: "Lower body balance",
    scores: deepCopy(BASE_SCORES),
    competitionCriteria,
    scoringModelNote:
      "Scoring model is inspired by physique judging dimensions (shape/symmetry, muscularity/conditioning, presentation, and total package) and applies stricter grading for MVP realism.",
    trainingPriority: deepCopy(BASE_TRAINING_PRIORITY),
    strengths: [
      "Lower body proportion is relatively balanced",
      "Chest development appears moderate",
      "Overall left-right balance appears acceptable",
    ],
    improvementAreas: [
      {
        area: "Back width",
        priority: "High",
        reason: "Largest impact on V-taper and upper-body width impression.",
        confidence: "Medium",
      },
      {
        area: "Side delts",
        priority: "High",
        reason: "Improves shoulder width impression and silhouette shape.",
        confidence: "Medium",
      },
      {
        area: "Arm fullness",
        priority: "Medium-high",
        reason: "Improves arm-to-torso visual balance.",
        confidence: "Medium",
      },
      {
        area: "Upper chest",
        priority: "Medium",
        reason: "Supports front-body fullness.",
        confidence: "High",
      },
      {
        area: "Legs",
        priority: "Maintenance",
        reason: "Currently balanced and can be maintained while upper body catches up.",
        confidence: "High",
      },
    ],
    diagnoses: deepCopy(BASE_DIAGNOSES),
    muscleRatings: [
      {
        area: "Back",
        score: 46,
        priority: "High",
        confidence: "Medium",
        explanation: areaExplanation("Back", "High"),
      },
      {
        area: "Shoulders",
        score: 49,
        priority: "High",
        confidence: "Medium",
        explanation: areaExplanation("Shoulders", "High"),
      },
      {
        area: "Arms",
        score: 50,
        priority: "Medium-high",
        confidence: "Medium",
        explanation: areaExplanation("Arms", "Medium-high"),
      },
      {
        area: "Chest",
        score: 57,
        priority: "Medium",
        confidence: "Medium-high",
        explanation: areaExplanation("Chest", "Medium"),
      },
      {
        area: "Legs",
        score: 60,
        priority: "Maintenance",
        confidence: "Medium-high",
        explanation: areaExplanation("Legs", "Maintenance"),
      },
      {
        area: "Core / Definition",
        score: 53,
        priority: "Medium",
        confidence: "Medium",
        explanation: areaExplanation("Core / Definition", "Medium"),
      },
      {
        area: "Symmetry",
        score: 62,
        priority: "Monitor",
        confidence: "Medium",
        explanation: areaExplanation("Symmetry", "Monitor"),
      },
    ],
    strategy812Weeks: [
      {
        area: "Back",
        weeklyEmphasis: "2 sessions/week",
        note: "Prioritize lat-focused pulling and row patterns.",
      },
      {
        area: "Shoulders",
        weeklyEmphasis: "2 sessions/week",
        note: "Emphasize side and rear deltoid volume with controlled form.",
      },
      {
        area: "Arms",
        weeklyEmphasis: "1–2 sessions/week",
        note: "Include biceps, triceps, brachialis, and forearms.",
      },
      {
        area: "Chest",
        weeklyEmphasis: "1 session/week",
        note: "Maintenance to moderate volume with upper-chest focus.",
      },
      {
        area: "Legs",
        weeklyEmphasis: "1 session/week",
        note: "Maintenance focus while upper-body priorities increase.",
      },
      {
        area: "Re-scan",
        weeklyEmphasis: "After 4 weeks",
        note: "Compare progress with similar photo conditions.",
      },
    ],
    limitations: [...BASE_LIMITATIONS],
    cautionNotes: [
      "This is a strategic direction, not a medical or individualized coaching prescription.",
    ],
    generatedAt: new Date().toISOString(),
    isSample: true,
  };
}

export function generateMockReport(answers: QuestionnaireAnswers): Report {
  const report = getDefaultSampleReport();

  report.isSample = false;
  report.generatedAt = new Date().toISOString();
  report.confidence = confidenceFromContext(answers);

  const scores = deepCopy(BASE_SCORES);
  goalScoreShift(answers, scores);
  report.scores = scores;

  const priority = { ...BASE_TRAINING_PRIORITY };
  const shift = GOAL_PRIORITY_SHIFT[answers.primaryGoal];
  (Object.keys(shift) as Array<keyof Report["trainingPriority"]>).forEach((key) => {
    const delta = shift[key] ?? 0;
    priority[key] += delta;
  });

  if (answers.weeklyFrequency === "0–2 days") {
    priority.back -= 2;
    priority.shoulders -= 2;
    priority.chest += 2;
    priority.legs += 2;
  }

  if (answers.focusArea === "Back") priority.back += 2;
  if (answers.focusArea === "Shoulders") priority.shoulders += 2;
  if (answers.focusArea === "Arms") priority.arms += 2;
  if (answers.focusArea === "Chest") priority.chest += 2;
  if (answers.focusArea === "Legs") priority.legs += 2;

  report.trainingPriority = normalizePriority(priority);

  const sortedPriority = (Object.entries(report.trainingPriority) as Array<[
    keyof Report["trainingPriority"],
    number,
  ]>).sort((a, b) => b[1] - a[1]);

  report.topPriorities = sortedPriority.slice(0, 3).map(([key]) => formatPriorityName(key));

  report.bestArea =
    report.scores.legs >= report.scores.chest
      ? "Lower body balance"
      : report.scores.symmetry > report.scores.chest
        ? "Symmetry impression"
        : "Chest balance";

  report.competitionCriteria = computeCompetitionCriteria(report.scores);
  report.scoringModelNote =
    "Scoring model is inspired by physique judging dimensions (shape/symmetry, muscularity/conditioning, presentation, and total package) and applies stricter grading for MVP realism.";
  report.overallScore = clamp(report.competitionCriteria.totalPackage, 40, 82);

  if (answers.trainingExperience === "Beginner" || answers.trainingExperience === "Less than 6 months") {
    report.cautionNotes.push(
      "Because training experience is early-stage, keep exercise selection simple and focus on stable technique.",
    );
  }

  if (answers.injuryOrPain === "Yes") {
    report.cautionNotes.push(
      "You selected injury/pain concerns. Keep loads conservative and consider professional guidance before intensity increases.",
    );
    report.confidence = report.confidence === "High" ? "Medium-high" : "Medium";
  }

  if (answers.injuryOrPain === "Not sure") {
    report.cautionNotes.push(
      "If discomfort appears during training, reduce range/load and prioritize pain-free movement quality.",
    );
  }

  if (answers.equipmentAccess === "Bodyweight only") {
    report.cautionNotes.push(
      "Equipment setting is bodyweight-only. Priority directions should rely on pull-up, push-up, dip, tempo, and unilateral progression patterns.",
    );
  }

  if (answers.equipmentAccess === "Dumbbells only" || answers.equipmentAccess === "Mixed / limited equipment") {
    report.cautionNotes.push(
      "With limited equipment, use unilateral work, tempo control, and progressive overload through reps and proximity to failure.",
    );
  }

  report.cautionNotes.push(trainingLanguageByExperience(answers.trainingExperience));

  report.aiSummary =
    `Using a stricter physique-judging style lens, your current profile is functional but not yet highly competitive in shape contrast. The most visible opportunity remains around ${report.topPriorities[0].toLowerCase()} and ${report.topPriorities[1].toLowerCase()}, where improvements can materially raise V-taper impact and upper-body presence. ` +
    `Current stronger zones can be maintained while targeted specialization is directed to the top priorities. Over the next 8–12 weeks, keep execution consistent and bias training volume toward the highest-impact weak points.`;

  report.strengths = [
    `${report.bestArea} appears relatively steady in the current visual assessment.`,
    "Overall left-right balance appears acceptable under current photo conditions.",
    "Current physique foundation supports focused specialization without neglecting global balance.",
  ];

  report.improvementAreas = sortedPriority.map(([key, value], index) => {
    const area = formatPriorityName(key);
    const priorityLabel = toPriorityLabel(value, key === "legs");
    const reasonMap: Record<keyof Report["trainingPriority"], string> = {
      back: "Largest impact on V-taper and upper-body width.",
      shoulders: "Improves shoulder-width impression and silhouette shape.",
      arms: "Improves arm-to-torso visual balance.",
      chest: "Improves upper-body front fullness.",
      legs: "Currently balanced and suitable for maintenance volume.",
    };

    return {
      area,
      priority: index === 4 ? "Maintenance" : priorityLabel,
      reason: reasonMap[key],
      confidence: value >= 18 ? "Medium" : "High",
    };
  });

  report.muscleRatings = [
    {
      area: "Back",
      score: report.scores.back,
      priority: toPriorityLabel(report.trainingPriority.back),
      confidence: "Medium",
      explanation: areaExplanation("Back", toPriorityLabel(report.trainingPriority.back)),
    },
    {
      area: "Shoulders",
      score: report.scores.shoulders,
      priority: toPriorityLabel(report.trainingPriority.shoulders),
      confidence: "Medium",
      explanation: areaExplanation("Shoulders", toPriorityLabel(report.trainingPriority.shoulders)),
    },
    {
      area: "Arms",
      score: report.scores.arms,
      priority: toPriorityLabel(report.trainingPriority.arms),
      confidence: "Medium",
      explanation: areaExplanation("Arms", toPriorityLabel(report.trainingPriority.arms)),
    },
    {
      area: "Chest",
      score: report.scores.chest,
      priority: toPriorityLabel(report.trainingPriority.chest),
      confidence: "Medium-high",
      explanation: areaExplanation("Chest", toPriorityLabel(report.trainingPriority.chest)),
    },
    {
      area: "Legs",
      score: report.scores.legs,
      priority: toPriorityLabel(report.trainingPriority.legs, true),
      confidence: "Medium-high",
      explanation: areaExplanation("Legs", toPriorityLabel(report.trainingPriority.legs, true)),
    },
    {
      area: "Core / Definition",
      score: report.scores.definition,
      priority: answers.primaryGoal === "Leaner / more definition" ? "High" : "Medium",
      confidence: "Medium",
      explanation: areaExplanation(
        "Core / Definition",
        answers.primaryGoal === "Leaner / more definition" ? "High" : "Medium",
      ),
    },
    {
      area: "Symmetry",
      score: report.scores.symmetry,
      priority: "Monitor",
      confidence: "Medium",
      explanation: areaExplanation("Symmetry", "Monitor"),
    },
  ];

  const topPriorityMap: Record<string, string> = {
    "Back width": "2 sessions/week",
    "Side delts": "2 sessions/week",
    "Arm fullness": "1–2 sessions/week",
    "Upper chest": "1 session/week",
    "Leg balance": "1 session/week",
  };

  report.strategy812Weeks = [
    {
      area: report.topPriorities[0],
      weeklyEmphasis: topPriorityMap[report.topPriorities[0]] ?? "2 sessions/week",
      note: "Primary specialization block with measurable progression.",
    },
    {
      area: report.topPriorities[1],
      weeklyEmphasis: topPriorityMap[report.topPriorities[1]] ?? "2 sessions/week",
      note: "Secondary emphasis to reinforce upper-body visual contrast.",
    },
    {
      area: report.topPriorities[2],
      weeklyEmphasis: topPriorityMap[report.topPriorities[2]] ?? "1–2 sessions/week",
      note: "Complementary support for proportion balance.",
    },
    {
      area: "Chest",
      weeklyEmphasis: "1 session/week",
      note: "Maintenance to moderate emphasis unless chest is a top priority.",
    },
    {
      area: "Legs",
      weeklyEmphasis: "1 session/week",
      note: "Maintenance focus while preserving structural balance.",
    },
    {
      area: "Re-scan",
      weeklyEmphasis: "After 4 weeks",
      note: "Retake photos under similar conditions to compare progress direction.",
    },
  ];

  report.diagnoses = deepCopy(BASE_DIAGNOSES);

  if (answers.primaryGoal === "Leaner / more definition") {
    report.diagnoses.push({
      title: "Definition impression is a key current focus",
      observation:
        "Your selected goal suggests a stronger emphasis on visual definition and consistency rather than only muscle-specific specialization.",
      likelyReasons: [
        "Definition perception changes with lighting and pose",
        "Consistency in training and nutrition drives visual sharpness",
        "Sleep and recovery affect fullness and clarity",
      ],
      improvementDirection: [
        "Keep weekly training frequency stable",
        "Track waist, bodyweight trend, and performance together",
        "Use progress photos under repeatable lighting and distance",
      ],
    });
  }

  if (answers.equipmentAccess === "Bodyweight only") {
    report.diagnoses = report.diagnoses.map((diagnosis) => ({
      ...diagnosis,
      improvementDirection: diagnosis.improvementDirection.map((line) =>
        line.includes("machine")
          ? "Use bodyweight progression variations with tempo and range control"
          : line,
      ),
    }));
  }

  return report;
}
