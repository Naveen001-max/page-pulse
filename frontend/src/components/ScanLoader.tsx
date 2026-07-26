// Developed by Naveen Choudhary
// Project: Page Pulse
// Built for Digital Heroes Training Task

import { motion } from "framer-motion";

const steps = [
  "Connecting to server…",
  "Fetching page content…",
  "Parsing HTML structure…",
  "Analyzing SEO metadata…",
  "Checking image accessibility…",
  "Calculating health score…",
];

export default function ScanLoader() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="glass rounded-2xl p-8 text-center">
        {/* Animated scanner graphic */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border border-indigo-500/30" />
          <div className="absolute inset-2 rounded-full border border-indigo-500/20" />
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className="scan-line absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
              style={{ top: "50%" }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-400 rounded-full"
            />
          </div>
        </div>

        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
          Auditing your site
        </h3>
        <p className="text-xs text-[var(--text-muted)] mb-6">
          This usually takes 2–5 seconds
        </p>

        {/* Skeleton cards */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-3 shimmer"
              style={{
                background: "rgba(255,255,255,0.03)",
                animationDelay: `${i * 0.15}s`,
              }}
            >
              <div className="h-2 bg-white/5 rounded mb-2 w-3/4" />
              <div className="h-4 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>

        {/* Step list */}
        <div className="mt-6 space-y-1">
          {steps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.35, duration: 0.3 }}
              className="flex items-center gap-2 text-xs text-[var(--text-muted)]"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.35 + 0.1 }}
                className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"
              />
              {step}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
