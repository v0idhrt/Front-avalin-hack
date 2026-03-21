import { motion } from "motion/react";

interface LiquidBackgroundProps {
  variant?: "default" | "warm" | "cool" | "aurora";
}

export function LiquidBackground({ variant = "default" }: LiquidBackgroundProps) {
  const gradients = {
    default: [
      { color: "rgba(139, 92, 246, 0.35)", x: "20%", y: "15%", size: 320 },
      { color: "rgba(255, 107, 53, 0.25)", x: "75%", y: "25%", size: 280 },
      { color: "rgba(59, 130, 246, 0.3)", x: "50%", y: "70%", size: 350 },
      { color: "rgba(236, 72, 153, 0.2)", x: "85%", y: "80%", size: 260 },
    ],
    warm: [
      { color: "rgba(255, 107, 53, 0.35)", x: "25%", y: "20%", size: 340 },
      { color: "rgba(251, 146, 60, 0.25)", x: "70%", y: "35%", size: 280 },
      { color: "rgba(239, 68, 68, 0.2)", x: "40%", y: "75%", size: 300 },
      { color: "rgba(168, 85, 247, 0.18)", x: "80%", y: "85%", size: 250 },
    ],
    cool: [
      { color: "rgba(59, 130, 246, 0.35)", x: "30%", y: "20%", size: 320 },
      { color: "rgba(139, 92, 246, 0.28)", x: "65%", y: "30%", size: 300 },
      { color: "rgba(6, 182, 212, 0.25)", x: "45%", y: "70%", size: 280 },
      { color: "rgba(34, 211, 238, 0.2)", x: "85%", y: "80%", size: 240 },
    ],
    aurora: [
      { color: "rgba(52, 211, 153, 0.3)", x: "20%", y: "10%", size: 340 },
      { color: "rgba(59, 130, 246, 0.25)", x: "60%", y: "25%", size: 300 },
      { color: "rgba(168, 85, 247, 0.3)", x: "80%", y: "55%", size: 280 },
      { color: "rgba(255, 107, 53, 0.2)", x: "35%", y: "80%", size: 320 },
    ],
  };

  const blobs = gradients[variant];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ background: "#06060C" }}>
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.x,
            top: blob.y,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            filter: "blur(80px)",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -25, 15, -10, 0],
            scale: [1, 1.15, 0.9, 1.05, 1],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          opacity: 0.5,
        }}
      />
    </div>
  );
}

// Reusable glass panel style generator
export const glass = {
  panel: (opacity = 0.08, blur = 40) => ({
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
    border: "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      inset 0 -1px 0 rgba(255, 255, 255, 0.02)
    `,
  }),
  panelLight: (opacity = 0.06, blur = 40) => ({
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px) saturate(160%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(160%)`,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: `
      0 4px 16px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.06)
    `,
  }),
  glow: (color: string, intensity = 0.3) => ({
    boxShadow: `0 0 40px rgba(${color}, ${intensity}), 0 0 80px rgba(${color}, ${intensity * 0.5})`,
  }),
};

// Light theme glass
export const glassLight = {
  panel: (opacity = 0.5, blur = 40) => ({
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
    border: "1px solid rgba(255, 255, 255, 0.6)",
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9),
      inset 0 -1px 0 rgba(255, 255, 255, 0.3)
    `,
  }),
};
