import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExiting(true);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gradient-hero transition-opacity duration-700 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Circuit pattern overlay */}
      <div className="absolute inset-0 circuit-pattern opacity-30" />

      {/* Animated robot icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-4 border-primary/30 flex items-center justify-center animate-pulse-glow">
          <svg
            className="w-12 h-12 text-primary animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        {/* Orbiting elements */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
          <div className="absolute -top-2 left-1/2 w-3 h-3 bg-secondary rounded-full glow-secondary" />
        </div>
        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: "4s", animationDirection: "reverse" }}
        >
          <div className="absolute top-1/2 -right-2 w-2 h-2 bg-accent rounded-full glow-accent" />
        </div>
      </div>

      {/* Name */}
      <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2 tracking-wide">
        PRUDHVI RAJ CHALAPAKA
      </h1>
      <p className="text-muted-foreground mb-8 font-mono text-sm">
        Robotics & Automation Engineer
      </p>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-muted/20 rounded-full overflow-hidden">
        <div
          className="h-full gradient-primary transition-all duration-100 ease-out rounded-full shadow-glow"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 font-mono text-sm text-muted-foreground">
        Initializing... {progress}%
      </p>
    </div>
  );
};

export default LoadingScreen;
