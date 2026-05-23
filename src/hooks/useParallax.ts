"use client";
import { useEffect, useRef, useState, RefObject } from "react";

export function useParallax(
  multiplier = 0.3,
  sectionRef?: RefObject<HTMLElement | null>
) {
  const [y, setY] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tick = () => {
      const sectionTop = sectionRef?.current?.offsetTop ?? 0;
      setY((window.scrollY - sectionTop) * multiplier);
      rafId.current = null;
    };

    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [multiplier, sectionRef]);

  return y;
}
