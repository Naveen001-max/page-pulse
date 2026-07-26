// Developed by Naveen Choudhary
// Project: Page Pulse
// Built for Digital Heroes Training Task

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Zap, Shield, BarChart3, Eye, Globe, Lock } from "lucide-react";
import SplitText from "./SplitText";
import Reveal from "./Reveal";

const features = [
  {
    num: "01",
    Icon: Zap,
    title: "Instant Analysis",
    desc: "Full SEO and performance data in seconds. No account, no waiting, no noise.",
  },
  {
    num: "02",
    Icon: Shield,
    title: "Health Scoring",
    desc: "Intelligent scoring from Excellent to Poor based on real weighted SEO signals.",
  },
  {
    num: "03",
    Icon: Eye,
    title: "Accessibility Checks",
    desc: "Catch missing ALT tags and structural issues that hurt screen reader users.",
  },
  {
    num: "04",
    Icon: BarChart3,
    title: "Rich Metrics",
    desc: "HTTP status, response time, metadata quality, heading structure and word count.",
  },
  {
    num: "05",
    Icon: Globe,
    title: "Any Public URL",
    desc: "Audit blogs, apps, landing pages — anything publicly accessible on the web.",
  },
  {
    num: "06",
    Icon: Lock,
    title: "Privacy First",
    desc: "We never store your URLs. Every audit is ephemeral and completely anonymous.",
  },
];

function FeatureRow({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -30 : 30, 0]);
  const { Icon } = feature;

  return (
    <motion.div
      ref={ref}
      style={{ x }}
      className="group flex items-start gap-6 py-8 border-b border-[var(--border)] hover:border-[var(--border-hover)] transition-colors duration-300"
    >
      {/* Number */}
      <span className="text-xs font-mono text-[var(--text-muted)] mt-1 w-6 flex-shrink-0 select-none">
        {feature.num}
      </span>

      {/* Icon */}
      <div className="w-9 h-9 rounded-xl bg-white/3 border border-[var(--border)] flex items-center justify-center flex-shrink-0 group-hover:border-[var(--accent)]/40 group-hover:bg-[var(--accent)]/8 transition-all duration-300">
        <Icon size={15} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-300" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1 group-hover:text-white transition-colors">
          {feature.title}
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{feature.desc}</p>
      </div>

      {/* Arrow that slides in on hover */}
      <motion.span
        className="text-[var(--accent)] text-sm mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-2 group-hover:translate-x-0"
        style={{ transition: "opacity 0.2s, transform 0.2s" }}
      >
        →
      </motion.span>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section className="py-32 px-6" aria-label="Features">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left — sticky heading */}
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <p className="text-xs font-mono text-[var(--accent)] uppercase tracking-widest mb-6">
                What you get
              </p>
            </Reveal>

            <h2 className="text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight mb-8">
              <SplitText text="Everything to diagnose" className="text-[var(--text-primary)]" delay={0.1} />
              <br />
              <SplitText text="a page." className="gradient-text" delay={0.4} />
            </h2>

            <Reveal delay={0.3}>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
                Page Pulse surfaces the signals that actually move rankings and
                conversions — without the noise of bloated audit tools.
              </p>
            </Reveal>

            {/* Decorative large number */}
            <div
              aria-hidden="true"
              className="mt-16 text-[10rem] font-black leading-none select-none"
              style={{
                color: "transparent",
                WebkitTextStroke: "1px rgba(91,94,244,0.1)",
                lineHeight: 1,
              }}
            >
              06
            </div>
          </div>

          {/* Right — feature rows */}
          <div>
            {features.map((f, i) => (
              <FeatureRow key={f.num} feature={f} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
