// Developed by Naveen Choudhary
// Project: Page Pulse
// Built for Digital Heroes Training Task

import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Shield, ShieldOff } from "lucide-react";

type Health = "Excellent" | "Good" | "Average" | "Poor";

const config: Record<Health, { color: string; bg: string; ring: string; Icon: typeof ShieldCheck }> = {
  Excellent: {
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    ring: "ring-emerald-400/30",
    Icon: ShieldCheck,
  },
  Good: {
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    ring: "ring-blue-400/30",
    Icon: Shield,
  },
  Average: {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    ring: "ring-amber-400/30",
    Icon: ShieldAlert,
  },
  Poor: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    ring: "ring-red-400/30",
    Icon: ShieldOff,
  },
};

export default function HealthBadge({ health }: { health: Health }) {
  const { color, bg, ring, Icon } = config[health];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${bg} ring-1 ${ring}`}
      aria-label={`Site health: ${health}`}
    >
      <Icon size={14} className={color} aria-hidden="true" />
      <span className={`text-sm font-semibold ${color}`}>{health}</span>
    </motion.div>
  );
}
