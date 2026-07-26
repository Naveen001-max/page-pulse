// Developed by Naveen Choudhary
// Project: Page Pulse
// Built for Digital Heroes Training Task

import type { AuditResult } from "../types";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function analyzeUrl(url: string): Promise<AuditResult> {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    throw new Error(`API error ${response.status}: ${text}`);
  }

  return response.json();
}

export function validateUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return "Please enter a URL";
  try {
    const u = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    new URL(u);
    return null;
  } catch {
    return "Please enter a valid URL (e.g. example.com)";
  }
}
