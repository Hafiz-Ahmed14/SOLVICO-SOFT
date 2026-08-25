"use client";

import { useEffect, useState } from "react";

export type RotatingItem = {
  text: string;
  subtext?: string;
};

type Props = {
  items: RotatingItem[];
  interval?: number;
  className?: string;
};

export default function RotatingText({
  items,
  interval = 4000,
  className = "",
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fadeInterval = setInterval(() => {
      // Fade out
      setIsVisible(false);

      // Change text after fade out, then fade in
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setIsVisible(true);
      }, 500);
    }, interval);

    return () => clearInterval(fadeInterval);
  }, [items.length, interval]);

  const currentItem = items[currentIndex];

  return (
    <div className={`rotating-text ${className}`}>
      <div
        className={`rotating-text-content ${isVisible ? "fade-in" : "fade-out"}`}
      >
        <h1>{currentItem.text}</h1>
        {currentItem.subtext && <p>{currentItem.subtext}</p>}
      </div>
    </div>
  );
}