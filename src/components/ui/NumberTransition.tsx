
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface NumberTransitionProps {
  value: number;
  className?: string;
  formatter?: (value: number) => string;
}

export function NumberTransition({ value, className, formatter = formatCurrency }: NumberTransitionProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300); // Match animation duration
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <span
      className={cn(
        animate && "animate-[scale-in_0.2s_ease-out,fade-in_0.3s_ease-out]",
        className
      )}
    >
      {formatter(value)}
    </span>
  );
}
