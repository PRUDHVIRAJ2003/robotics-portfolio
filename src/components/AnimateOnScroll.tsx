import { useEffect, useRef, useState, ReactNode } from "react";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-left" | "fade-right" | "scale" | "fade";
  delay?: number;
  threshold?: number;
}

const AnimateOnScroll = ({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  threshold = 0.1,
}: AnimateOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const animationClasses = {
    "fade-up": isVisible
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-10",
    "fade-left": isVisible
      ? "opacity-100 translate-x-0"
      : "opacity-0 translate-x-10",
    "fade-right": isVisible
      ? "opacity-100 translate-x-0"
      : "opacity-0 -translate-x-10",
    scale: isVisible
      ? "opacity-100 scale-100"
      : "opacity-0 scale-95",
    fade: isVisible ? "opacity-100" : "opacity-0",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${animationClasses[animation]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimateOnScroll;
