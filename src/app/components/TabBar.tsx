import { Home, Compass, User, Map } from "lucide-react";
import { motion } from "motion/react";
import { glass } from "./LiquidBackground";

interface TabBarProps {
  active: "home" | "discovery" | "routes" | "profile";
  onNavigate: (tab: "home" | "discovery" | "routes" | "profile") => void;
  visible: boolean;
  isDark?: boolean;
}

export function TabBar({ active, onNavigate, visible, isDark = true }: TabBarProps) {
  const tabs = [
    { id: "home" as const, icon: Home },
    { id: "discovery" as const, icon: Compass },
    { id: "routes" as const, icon: Map },
    { id: "profile" as const, icon: User },
  ];

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 z-50"
      style={{ x: "-50%" }}
      animate={{ y: visible ? 0 : 120, opacity: visible ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-[28px] relative overflow-hidden"
        style={
          isDark
            ? {
                ...glass.panel(0.06, 50),
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: `
                  0 12px 48px rgba(0,0,0,0.5),
                  0 4px 16px rgba(0,0,0,0.3),
                  inset 0 1px 0 rgba(255,255,255,0.1),
                  inset 0 -0.5px 0 rgba(255,255,255,0.03)
                `,
              }
            : {
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(50px) saturate(180%)",
                WebkitBackdropFilter: "blur(50px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.7)",
                boxShadow: `
                  0 12px 48px rgba(0,0,0,0.1),
                  0 4px 16px rgba(0,0,0,0.06),
                  inset 0 1px 0 rgba(255,255,255,0.9),
                  inset 0 -0.5px 0 rgba(255,255,255,0.4)
                `,
              }
        }
      >
        {/* Glossy top highlight */}
        <div
          className="absolute top-0 left-[10%] right-[10%] h-[1px]"
          style={{
            background: isDark
              ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
          }}
        />

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="relative p-3.5 rounded-full"
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-1 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,107,53,0.9), rgba(255,143,94,0.8))",
                    boxShadow: "0 0 24px rgba(255,107,53,0.5), 0 0 60px rgba(255,107,53,0.2)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              )}
              <Icon
                size={21}
                className="relative z-10"
                color={
                  isActive
                    ? "#fff"
                    : isDark
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(0,0,0,0.35)"
                }
                strokeWidth={isActive ? 2.5 : 1.8}
              />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}