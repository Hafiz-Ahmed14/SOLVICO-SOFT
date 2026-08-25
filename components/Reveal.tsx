"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
};

/**
 * One-shot reveal on first scroll into view. Deliberately restrained: the
 * page has a single orchestrated load sequence in the hero, and everything
 * below just settles in once. Reduced motion is handled in globals.css.
 */
export default function Reveal({ children, className, delay = 0, as = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = ["reveal", shown ? "reveal-in" : "", className].filter(Boolean).join(" ");
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;
  const Tag = as as "div";

  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={cls} style={style}>
      {children}
    </Tag>
  );
}
