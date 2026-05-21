const FLOW_KEYS = {
  submissionId: "physiquelens.flow.submissionId",
  latestReportId: "physiquelens.flow.latestReportSubmissionId",
} as const;

function browser() {
  return typeof window !== "undefined";
}

export function setFlowSubmission(submissionId: string) {
  if (!browser()) return;
  window.localStorage.setItem(FLOW_KEYS.submissionId, submissionId);
}

export function getFlowSubmission() {
  if (!browser()) return null;
  const submissionId = window.localStorage.getItem(FLOW_KEYS.submissionId);
  if (!submissionId) {
    return null;
  }
  return { submissionId };
}

export function clearFlowSubmission() {
  if (!browser()) return;
  window.localStorage.removeItem(FLOW_KEYS.submissionId);
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
