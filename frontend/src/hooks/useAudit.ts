// Developed by Naveen Choudhary
// Project: Page Pulse
// Built for Digital Heroes Training Task

import { useState } from "react";
import type { AuditResult, AppState } from "../types";
import { analyzeUrl } from "../lib/api";

export function useAudit() {
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (url: string) => {
    setState("loading");
    setError(null);
    setResult(null);

    try {
      const data = await analyzeUrl(url);
      setResult(data);
      setState("result");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setState("error");
    }
  };

  const reset = () => {
    setState("idle");
    setResult(null);
    setError(null);
  };

  return { state, result, error, analyze, reset };
}
