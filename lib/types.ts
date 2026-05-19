export type PrimaryGoal =
  | "Build a V-taper"
  | "Wider shoulders"
  | "Bigger arms"
  | "More balanced physique"
  | "Leaner / more definition"
  | "Better chest development"
  | "General aesthetic improvement";

export type TrainingExperience =
  | "Beginner"
  | "Less than 6 months"
  | "6–12 months"
  | "1–2 years"
  | "2+ years";

export type WeeklyTrainingFrequency = "0–2 days" | "3–4 days" | "5+ days";

export type EquipmentAccess =
  | "Full gym"
  | "Dumbbells only"
  | "Bodyweight only"
  | "Mixed / limited equipment";

export type InjuryOrPain = "No" | "Yes" | "Not sure";

export type FocusArea =
  | "Back"
  | "Shoulders"
  | "Arms"
  | "Chest"
  | "Legs"
  | "Core"
  | "Not sure";

export type QuestionnaireAnswers = {
  primaryGoal: PrimaryGoal;
  trainingExperience: TrainingExperience;
  weeklyFrequency: WeeklyTrainingFrequency;
  equipmentAccess: EquipmentAccess;
  injuryOrPain: InjuryOrPain;
  focusArea: FocusArea;
};

export type ReportConfidence = "Low" | "Medium" | "Medium-high" | "High";
export type PriorityLevel = "Low" | "Medium" | "Medium-high" | "High" | "Maintenance" | "Monitor";

export type Report = {
  overallScore: number;
  confidence: ReportConfidence;
  aiSummary: string;
  topPriorities: string[];
  bestArea: string;
  scores: {
    vTaper: number;
    shoulders: number;
    back: number;
    chest: number;
    arms: number;
    legs: number;
    symmetry: number;
    definition: number;
  };
  competitionCriteria: {
    shapeSymmetry: number;
    muscularityCondition: number;
    presentationPoise: number;
    totalPackage: number;
  };
  scoringModelNote: string;
  trainingPriority: {
    back: number;
    shoulders: number;
    arms: number;
    chest: number;
    legs: number;
  };
  strengths: string[];
  improvementAreas: {
    area: string;
    priority: PriorityLevel;
    reason: string;
    confidence: "Low" | "Medium" | "High";
  }[];
  diagnoses: {
    title: string;
    observation: string;
    likelyReasons: string[];
    improvementDirection: string[];
  }[];
  muscleRatings: {
    area: string;
    score: number;
    priority: PriorityLevel;
    confidence: "Low" | "Medium" | "Medium-high" | "High";
    explanation: string;
  }[];
  strategy812Weeks: {
    area: string;
    weeklyEmphasis: string;
    note: string;
  }[];
  limitations: string[];
  cautionNotes: string[];
  generatedAt: string;
  isSample?: boolean;
};
