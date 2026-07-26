// Developed by Naveen Choudhary
// Project: Page Pulse
// Built for Digital Heroes Training Task

interface MarqueeProps {
  items: string[];
  speed?: number;
  separator?: string;
}

export default function Marquee({ items, separator = "·" }: MarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden w-full py-5 border-y border-[var(--border)]">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-6 px-6 text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-muted)] whitespace-nowrap select-none"
          >
            {item}
            <span className="text-[var(--accent)] opacity-60">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
