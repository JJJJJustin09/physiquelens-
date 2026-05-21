type AccessType = "free" | "paid";

const FLOW_KEYS = {
  submissionId: "physiquelens.flow.submissionId",
  submissionAccessType: "physiquelens.flow.accessType",
  latestReportId: "physiquelens.flow.latestReportSubmissionId",
} as const;

function browser() {
  return typeof window !== "undefined";
}

export function setFlowSubmission(submissionId: string, accessType: AccessType) {
  if (!browser()) return;
  window.localStorage.setItem(FLOW_KEYS.submissionId, submissionId);
  window.localStorage.setItem(FLOW_KEYS.submissionAccessType, accessType);
}

export function getFlowSubmission() {
  if (!browser()) return null;
  const submissionId = window.localStorage.getItem(FLOW_KEYS.submissionId);
  const accessType = window.localStorage.getItem(FLOW_KEYS.submissionAccessType);
  if (!submissionId || (accessType !== "free" && accessType !== "paid")) {
    return null;
  }
  return { submissionId, accessType } as {
    submissionId: string;
    accessType: AccessType;
  };
}

export function clearFlowSubmission() {
  if (!browser()) return;
  window.localStorage.removeItem(FLOW_KEYS.submissionId);
  window.localStorage.removeItem(FLOW_KEYS.submissionAccessType);
}

export function setLatestReportSubmissionId(submissionId: string) {
  if (!browser()) return;
  window.localStorage.setItem(FLOW_KEYS.latestReportId, submissionId);
}

export function getLatestReportSubmissionId() {
  if (!browser()) return null;
  return window.localStorage.getItem(FLOW_KEYS.latestReportId);
}

export function clearLatestReportSubmissionId() {
  if (!browser()) return;
  window.localStorage.removeItem(FLOW_KEYS.latestReportId);
}
