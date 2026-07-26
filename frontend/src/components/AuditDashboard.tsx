// Developed by Naveen Choudhary
// Project: Page Pulse
// Built for Digital Heroes Training Task

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  Type,
  FileText,
  AlignLeft,
  Heading1,
  ImageOff,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import type { AuditResult } from "../types";
import HealthBadge from "./HealthBadge";
import AnimatedNumber from "./AnimatedNumber";

interface Props {
  result: AuditResult;
  onReset: () => void;
}

type CardStatus = "good" | "warn" | "bad" | "neutral";

interface MetricCard {
  label: string;
  value: React.ReactNode;
  detail?: string;
  Icon: typeof Activity;
  status: CardStatus;
}

function statusColor(s: CardStatus): string {
  switch (s) {
    case "good": return "text-emerald-400";
    case "warn": return "text-amber-400";
    case "bad": return "text-red-400";
    default: return "text-indigo-400";
  }
}

function statusDot(s: CardStatus): string {
  switch (s) {
    case "good": return "bg-emerald-400";
    case "warn": return "bg-amber-400";
    case "bad": return "bg-red-400";
    default: return "bg-indigo-400";
  }
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AuditDashboard({ result, onReset }: Props) {
  const [copied, setCopied] = useState(false);

  const httpStatus = result.http_status;
  const statusOk = httpStatus >= 200 && httpStatus < 300;
  const statusWarn = httpStatus >= 300 && httpStatus < 400;

  const cards: MetricCard[] = [
    {
      label: "HTTP Status",
      value: httpStatus === 0 ? "N/A" : <AnimatedNumber value={httpStatus} duration={600} />,
      detail: httpStatus === 0 ? "Connection failed" : statusOk ? "OK" : statusWarn ? "Redirect" : "Error",
      Icon: Activity,
      status: httpStatus === 0 ? "bad" : statusOk ? "good" : statusWarn ? "warn" : "bad",
    },
    {
      label: "Response Time",
      value: (
        <span>
          <AnimatedNumber value={Math.round(result.response_time_ms)} duration={800} />
          <span className="text-sm ml-1 text-[var(--text-muted)]">ms</span>
        </span>
      ),
      detail:
        result.response_time_ms < 300
          ? "Very fast"
          : result.response_time_ms < 800
          ? "Good"
          : result.response_time_ms < 2000
          ? "Moderate"
          : "Slow",
      Icon: Clock,
      status:
        result.response_time_ms < 300
          ? "good"
          : result.response_time_ms < 800
          ? "good"
          : result.response_time_ms < 2000
          ? "warn"
          : "bad",
    },
    {
      label: "Page Title",
      value: result.title ? (
        <span className="text-base leading-tight">{result.title.slice(0, 40)}{result.title.length > 40 ? "…" : ""}</span>
      ) : (
        <span className="text-[var(--text-muted)] text-sm">Not found</span>
      ),
      detail: result.title ? `${result.title.length} chars` : "Missing title tag",
      Icon: Type,
      status: result.title ? "good" : "bad",
    },
    {
      label: "Meta Description",
      value: result.meta_description ? (
        <span className="text-sm leading-snug">
          {result.meta_description.slice(0, 60)}
          {result.meta_description.length > 60 ? "…" : ""}
        </span>
      ) : (
        <span className="text-[var(--text-muted)] text-sm">Not found</span>
      ),
      detail: result.meta_description
        ? `${result.meta_description.length} chars`
        : "Missing meta description",
      Icon: FileText,
      status: result.meta_description
        ? result.meta_description.length > 50 && result.meta_description.length < 160
          ? "good"
          : "warn"
        : "bad",
    },
    {
      label: "Word Count",
      value: <AnimatedNumber value={result.word_count} duration={1000} />,
      detail:
        result.word_count >= 300
          ? "Good length"
          : result.word_count >= 100
          ? "Short"
          : "Very thin content",
      Icon: AlignLeft,
      status:
        result.word_count >= 300 ? "good" : result.word_count >= 100 ? "warn" : "bad",
    },
    {
      label: "H1 Count",
      value: <AnimatedNumber value={result.h1_count} duration={600} />,
      detail:
        result.h1_count === 1
          ? "Ideal"
          : result.h1_count === 0
          ? "No H1 found"
          : "Multiple H1s",
      Icon: Heading1,
      status:
        result.h1_count === 1 ? "good" : result.h1_count === 0 ? "bad" : "warn",
    },
    {
      label: "Images Missing ALT",
      value: <AnimatedNumber value={result.images_missing_alt} duration={700} />,
      detail:
        result.images_missing_alt === 0
          ? "All images have ALT"
          : `${result.images_missing_alt} image${result.images_missing_alt > 1 ? "s" : ""} need ALT text`,
      Icon: ImageOff,
      status:
        result.images_missing_alt === 0
          ? "good"
          : result.images_missing_alt <= 3
          ? "warn"
          : "bad",
    },
  ];

  const copyJson = async () => {
    const json = JSON.stringify(
      {
        url: result.url,
        http_status: result.http_status,
        response_time_ms: result.response_time_ms,
        title: result.title,
        meta_description: result.meta_description,
        h1_count: result.h1_count,
        images_missing_alt: result.images_missing_alt,
        word_count: result.word_count,
        health: result.health,
      },
      null,
      2
    );
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <HealthBadge health={result.health} />
          </div>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors truncate"
          >
            <ExternalLink size={12} className="flex-shrink-0" />
            <span className="truncate">{result.url}</span>
          </a>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.button
            onClick={copyJson}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl glass glass-hover text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            aria-label="Copy audit result as JSON"
          >
            {copied ? (
              <><Check size={12} className="text-emerald-400" /> Copied</>
            ) : (
              <><Copy size={12} /> Copy JSON</>
            )}
          </motion.button>

          <motion.button
            onClick={onReset}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs text-white transition-colors cursor-pointer"
            aria-label="Analyze another website"
          >
            <RotateCcw size={12} />
            New Audit
          </motion.button>
        </div>
      </div>

      {/* Error notice */}
      {result.error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 ring-1 ring-red-500/30 text-sm text-red-400"
          role="alert"
        >
          ⚠️ {result.error}
        </motion.div>
      )}

      {/* Metric cards grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {cards.map((card) => {
          const { Icon } = card;
          return (
            <motion.div
              key={card.label}
              variants={item}
              className="glass glass-hover gradient-border rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white/5">
                    <Icon size={14} className="text-[var(--text-muted)]" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                    {card.label}
                  </span>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot(card.status)} flex-shrink-0`} />
              </div>

              <div className={`text-2xl font-bold tracking-tight ${statusColor(card.status)}`}>
                {card.value}
              </div>

              {card.detail && (
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {card.detail}
                </p>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
