import type { QuestionnaireAnswers, Report } from "@/lib/types";

export const STORAGE_KEYS = {
  photoMeta: "physiquelens.photoMeta",
  questionnaire: "physiquelens.questionnaire",
  report: "physiquelens.report",
  billing: "physiquelens.billing",
  pendingAccess: "physiquelens.pendingAccess",
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

export type BillingState = {
  completedReports: number;
  paidCredits: number;
  totalPayments: number;
  lastPayment?: {
    amountLabel: "CNY 10" | "USD 5";
    timestamp: string;
  };
};

export type PendingAccess = {
  type: "free" | "paid";
  createdAt: string;
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
  window.localStorage.removeItem(STORAGE_KEYS.pendingAccess);
}

export function clearReportOnly() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEYS.report);
}

const defaultBillingState: BillingState = {
  completedReports: 0,
  paidCredits: 0,
  totalPayments: 0,
};

export function getBillingState() {
  return readJSON<BillingState>(STORAGE_KEYS.billing) ?? defaultBillingState;
}

export function saveBillingState(state: BillingState) {
  writeJSON(STORAGE_KEYS.billing, state);
}

export function getFreeReportRemaining() {
  const billing = getBillingState();
  return billing.completedReports === 0;
}

export function canStartNewAnalysis() {
  const billing = getBillingState();
  if (billing.completedReports === 0) return true;
  return billing.paidCredits > 0;
}

export function recordPayment(amountLabel: "CNY 10" | "USD 5") {
  const billing = getBillingState();
  const next: BillingState = {
    completedReports: billing.completedReports,
    paidCredits: billing.paidCredits + 1,
    totalPayments: billing.totalPayments + 1,
    lastPayment: {
      amountLabel,
      timestamp: new Date().toISOString(),
    },
  };
  saveBillingState(next);
  return next;
}

export function setPendingAccess(type: PendingAccess["type"]) {
  writeJSON<PendingAccess>(STORAGE_KEYS.pendingAccess, {
    type,
    createdAt: new Date().toISOString(),
  });
}

export function getPendingAccess() {
  return readJSON<PendingAccess>(STORAGE_KEYS.pendingAccess);
}

export function clearPendingAccess() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEYS.pendingAccess);
}

export function finalizeReportConsumption(accessType: PendingAccess["type"]) {
  const billing = getBillingState();
  const next: BillingState = {
    completedReports: billing.completedReports + 1,
    paidCredits: accessType === "paid" ? Math.max(0, billing.paidCredits - 1) : billing.paidCredits,
    totalPayments: billing.totalPayments,
    lastPayment: billing.lastPayment,
  };
  saveBillingState(next);
  return next;
}
