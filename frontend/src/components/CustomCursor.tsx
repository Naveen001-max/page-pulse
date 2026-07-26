// Developed by Naveen Choudhary
// Project: Page Pulse
// Built for Digital Heroes Training Task

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 200, damping: 28, mass: 0.5 });
  const springY = useSpring(cursorY, { stiffness: 200, damping: 28, mass: 0.5 });

  const isHovering = useRef(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const enter = () => {
      isHovering.current = true;
      cursorRef.current?.setAttribute("data-hover", "true");
    };
    const leave = () => {
      isHovering.current = false;
      cursorRef.current?.removeAttribute("data-hover");
    };

    document.addEventListener("mousemove", move);

    const interactables = document.querySelectorAll("a, button, input, [role='button'], .clickable");
    interactables.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    return () => {
      document.removeEventListener("mousemove", move);
      interactables.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, [cursorX, cursorY, dotX, dotY]);

  return (
    <>
      {/* Outer ring — follows with spring lag */}
      <motion.div
        ref={cursorRef}
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
      >
        <motion.div
          className="w-8 h-8 rounded-full border border-[var(--accent)] opacity-60"
          whileHover={{ scale: 2 }}
          data-cursor-ring
        />
      </motion.div>

      {/* Inner dot — instant */}
      <motion.div
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
      </motion.div>
    </>
  );
}
