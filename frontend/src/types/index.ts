// Developed by Naveen Choudhary
// Project: Page Pulse
// Built for Digital Heroes Training Task

export interface AuditResult {
  url: string;
  http_status: number;
  response_time_ms: number;
  title: string;
  meta_description: string;
  h1_count: number;
  images_missing_alt: number;
  word_count: number;
  health: "Excellent" | "Good" | "Average" | "Poor";
  error: string | null;
}

export type AppState = "idle" | "loading" | "result" | "error";
