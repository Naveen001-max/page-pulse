// Developed by Naveen Choudhary
// Project: Page Pulse
// Built for Digital Heroes Training Task

import { lazy, Suspense, useRef, useState, useEffect } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useAudit } from "./hooks/useAudit";
import UrlInput from "./components/UrlInput";
import ScanLoader from "./components/ScanLoader";
import Features from "./components/Features";
import Marquee from "./components/Marquee";
import SplitText from "./components/SplitText";
import Reveal from "./components/Reveal";

const HeroScene = lazy(() => import("./components/HeroScene"));
const AuditDashboard = lazy(() => import("./components/AuditDashboard"));

const MARQUEE_ITEMS = [
  "SEO Analysis",
  "Response Time",
  "Accessibility Audit",
  "Health Scoring",
  "Meta Tags",
  "H1 Structure",
  "Image ALT Text",
  "Word Count",
  "HTTP Status",
  "Page Diagnostics",
];

// Custom cursor
function CustomCursor() {
  const cx = useMotionValue(-100);
  const cy = useMotionValue(-100);
  const sx = useSpring(cx, { stiffness: 180, damping: 22 });
  const sy = useSpring(cy, { stiffness: 180, damping: 22 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { cx.set(e.clientX); cy.set(e.clientY); };
    const over = (e: MouseEvent) => {
      const t = e.target as Element;
      setHovered(!!t.closest("a, button, input, .clickable"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [cx, cy]);

  return (
    <>
      <motion.div
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
      >
        <motion.div
          animate={{ width: hovered ? 48 : 28, height: hovered ? 48 : 28 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="rounded-full bg-white opacity-80"
        />
      </motion.div>
    </>
  );
}

// Sticky navbar
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 glass border-b border-[var(--border)]"
          : "py-5 bg-transparent"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[var(--accent)] flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-sm text-[var(--text-primary)] tracking-tight">
            Page Pulse
          </span>
        </div>

        <nav className="hidden sm:flex items-center gap-8">
          {[["Home", "#hero"], ["Features", "#features"], ["Audit", "#audit"]].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200 tracking-wide"
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 rounded-lg glass border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all duration-200"
        >
          Digital Heroes ↗
        </a>
      </div>
    </motion.header>
  );
}

// Hero section
function Hero({ onAnalyze, loading }: { onAnalyze: (url: string) => void; loading: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20"
      aria-label="Page Pulse — Website Audit Tool"
    >
      {/* 3D background */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      {/* Radial ambient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(91,94,244,0.14) 0%, transparent 70%)",
        }}
      />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center max-w-4xl mx-auto w-full">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-[var(--border)] text-xs text-[var(--text-muted)] mb-10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] pulse-ring" />
          Free · No signup · Instant results
        </motion.div>

        {/* Big heading */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-8">
          <div className="overflow-hidden">
            <SplitText
              text="Audit any"
              className="text-[var(--text-primary)]"
              delay={0.1}
              stagger={0.05}
            />
          </div>
          <div className="overflow-hidden">
            <SplitText
              text="website."
              className="gradient-text"
              delay={0.3}
              stagger={0.06}
            />
          </div>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-[var(--text-secondary)] text-base sm:text-lg max-w-lg mx-auto mb-12 leading-relaxed"
        >
          Enter any URL to instantly surface SEO metadata, accessibility issues,
          and a full health score — in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <UrlInput onAnalyze={onAnalyze} loading={loading} />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-20 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-[var(--text-muted)] to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Stats strip
function StatsStrip() {
  const stats = [
    { value: "7", label: "Audit metrics" },
    { value: "<3s", label: "Average scan time" },
    { value: "100%", label: "Privacy safe" },
    { value: "∞", label: "Free audits" },
  ];

  return (
    <Reveal>
      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {stats.map(({ value, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="text-3xl font-black gradient-text mb-1">{value}</div>
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest">{label}</div>
          </motion.div>
        ))}
      </div>
    </Reveal>
  );
}

export default function App() {
  const { state, result, error, analyze, reset } = useAudit();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async (url: string) => {
    await analyze(url);
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
      <CustomCursor />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <Hero onAnalyze={handleAnalyze} loading={state === "loading"} />

        {/* Marquee */}
        <Marquee items={MARQUEE_ITEMS} />

        {/* Stats */}
        <StatsStrip />

        {/* Divider line */}
        <div className="max-w-5xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
        </div>

        {/* Audit result / loader / error */}
        <div ref={dashboardRef} id="audit" className="scroll-mt-24">
          <AnimatePresence mode="wait">
            {state === "loading" && (
              <motion.section
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-6 py-20 flex justify-center"
                aria-live="polite"
                aria-label="Scanning website"
              >
                <ScanLoader />
              </motion.section>
            )}

            {state === "error" && (
              <motion.section
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="px-6 py-20 flex justify-center"
                role="alert"
              >
                <div className="max-w-md w-full glass rounded-2xl p-10 text-center">
                  <div className="text-5xl mb-5">⚠️</div>
                  <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">
                    Scan failed
                  </h2>
                  <p className="text-sm text-[var(--text-muted)] mb-8 leading-relaxed">{error}</p>
                  <button
                    onClick={reset}
                    className="px-6 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </motion.section>
            )}

            {state === "result" && result && (
              <motion.section
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="px-6 py-20 max-w-6xl mx-auto w-full"
                aria-live="polite"
                aria-label="Audit results"
              >
                <Suspense fallback={null}>
                  <AuditDashboard result={result} onReset={reset} />
                </Suspense>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Features */}
        <div id="features">
          <Features />
        </div>

        {/* Final CTA */}
        <section className="py-32 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <p className="text-xs font-mono text-[var(--accent)] uppercase tracking-widest mb-6">
                Ready?
              </p>
            </Reveal>
            <h2 className="text-5xl sm:text-6xl font-black tracking-tighter mb-8 leading-tight">
              <SplitText text="Start your first" className="text-[var(--text-primary)]" delay={0.05} />
              <br />
              <SplitText text="audit now." className="gradient-text" delay={0.3} />
            </h2>
            <Reveal delay={0.3}>
              <a
                href="#hero"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--accent)] hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[var(--accent-glow)] hover:-translate-y-0.5"
              >
                Analyze a website →
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">P</span>
            </div>
            <span>Page Pulse</span>
          </div>
          <p>
            Built by{" "}
            <span className="text-[var(--text-secondary)]">Naveen Choudhary</span>
            {" "}·{" "}
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:opacity-80 transition-opacity"
            >
              Digital Heroes Training Task
            </a>
          </p>
          <p>© 2026 Naveen Choudhary</p>
        </div>
      </footer>
    </div>
  );
}
