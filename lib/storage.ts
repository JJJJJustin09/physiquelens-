import type { QuestionnaireAnswers, Report } from "@/lib/types";

export const STORAGE_KEYS = {
  photoMeta: "physiquelens.photoMeta",
  questionnaire: "physiquelens.questionnaire",
  report: "physiquelens.report",
} as const;

export type PhotoMeta = {
  frontSelected: boolean;
  sideSelected: boolean;
  backSelected: boolean;
  frontFileName?: string;
  sideFileName?: string;
  backFileName?: string;
  updatedAt: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function readJSON<T>(key: string): T | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getPhotoMeta() {
  return readJSON<PhotoMeta>(STORAGE_KEYS.photoMeta);
}

export function savePhotoMeta(meta: PhotoMeta) {
  writeJSON(STORAGE_KEYS.photoMeta, meta);
}

export function getQuestionnaireAnswers() {
  return readJSON<QuestionnaireAnswers>(STORAGE_KEYS.questionnaire);
}

export function saveQuestionnaireAnswers(answers: QuestionnaireAnswers) {
  writeJSON(STORAGE_KEYS.questionnaire, answers);
}

export function getStoredReport() {
  return readJSON<Report>(STORAGE_KEYS.report);
}

export function saveStoredReport(report: Report) {
  writeJSON(STORAGE_KEYS.report, report);
}

export function clearAnalysisState() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEYS.photoMeta);
  window.localStorage.removeItem(STORAGE_KEYS.questionnaire);
  window.localStorage.removeItem(STORAGE_KEYS.report);
}

export function clearReportOnly() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEYS.report);
}
