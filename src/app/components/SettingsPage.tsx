import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Sun,
  Moon,
  Bell,
  Lock,
  Globe,
  Palette,
  Smartphone,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
  Eye,
  Download,
  Trash2,
} from "lucide-react";
import { glass } from "./LiquidBackground";

interface SettingsPageProps {
  onBack: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function SettingsPage({ onBack, isDark, onToggleTheme }: SettingsPageProps) {
  const [notifications, setNotifications] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);

  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  const iconColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";

  const glassItem = isDark ? glass.panelLight(0.05, 30) : {
    background: "rgba(255,255,255,0.5)",
    backdropFilter: "blur(30px) saturate(160%)",
    WebkitBackdropFilter: "blur(30px) saturate(160%)",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
  };

  const sections = [
    {
      title: "Общие",
      items: [
        { id: "notifications", icon: Bell, label: "Уведомления", toggle: true, value: notifications, onChange: () => setNotifications(!notifications) },
        { id: "language", icon: Globe, label: "Язык", detail: "Русский" },
        { id: "appearance", icon: Palette, label: "Внешний вид", detail: "Авто" },
      ],
    },
    {
      title: "Конфиденциальность",
      items: [
        { id: "private", icon: Lock, label: "Закрытый аккаунт", toggle: true, value: privateAccount, onChange: () => setPrivateAccount(!privateAccount) },
        { id: "activity", icon: Eye, label: "Статус активности" },
        { id: "security", icon: Shield, label: "Безопасность" },
      ],
    },
    {
      title: "Данные",
      items: [
        { id: "download", icon: Download, label: "Скачать данные" },
        { id: "device", icon: Smartphone, label: "Устройства" },
      ],
    },
    {
      title: "Поддержка",
      items: [
        { id: "help", icon: HelpCircle, label: "Помощь" },
        { id: "delete", icon: Trash2, label: "Удалить аккаунт", danger: true },
        { id: "logout", icon: LogOut, label: "Выйти", danger: true },
      ],
    },
  ];

  // Custom glass toggle
  const GlassToggle = ({
    value,
    onChange,
    isThemeToggle = false,
  }: {
    value: boolean;
    onChange: () => void;
    isThemeToggle?: boolean;
  }) => (
    <motion.button
      onClick={onChange}
      className="relative rounded-full overflow-hidden flex-shrink-0"
      style={{
        width: isThemeToggle ? 72 : 52,
        height: isThemeToggle ? 36 : 28,
        ...(isDark
          ? {
              background: value
                ? "linear-gradient(135deg, rgba(255,107,53,0.4), rgba(255,143,94,0.3))"
                : "rgba(255,255,255,0.06)",
              border: value
                ? "1px solid rgba(255,107,53,0.4)"
                : "1px solid rgba(255,255,255,0.1)",
              boxShadow: value
                ? "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px rgba(255,107,53,0.15)"
                : "inset 0 1px 0 rgba(255,255,255,0.05)",
            }
          : {
              background: value
                ? "linear-gradient(135deg, rgba(255,107,53,0.5), rgba(255,143,94,0.4))"
                : "rgba(0,0,0,0.08)",
              border: value
                ? "1px solid rgba(255,107,53,0.3)"
                : "1px solid rgba(0,0,0,0.06)",
              boxShadow: value
                ? "inset 0 1px 0 rgba(255,255,255,0.3), 0 0 20px rgba(255,107,53,0.1)"
                : "inset 0 1px 0 rgba(255,255,255,0.5)",
            }),
      }}
      whileTap={{ scale: 0.92 }}
    >
      <motion.div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          width: isThemeToggle ? 30 : 22,
          height: isThemeToggle ? 30 : 22,
          top: isThemeToggle ? 2 : 2,
          ...(isDark
            ? {
                background: "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.15))",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              }
            : {
                background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))",
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)",
              }),
        }}
        animate={{
          left: value
            ? isThemeToggle ? 38 : 26
            : isThemeToggle ? 2 : 2,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isThemeToggle && (
          value ? (
            <Moon size={14} color={isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.6)"} strokeWidth={2} />
          ) : (
            <Sun size={14} color={isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.6)"} strokeWidth={2} />
          )
        )}
      </motion.div>
    </motion.button>
  );

  return (
    <div className="h-full overflow-y-auto pb-28 relative" style={{ scrollbarWidth: "none" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-4 pt-12 pb-4 relative overflow-hidden"
        style={
          isDark
            ? {
                ...glass.panel(0.04, 50),
                border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 0,
              }
            : {
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(50px) saturate(180%)",
                WebkitBackdropFilter: "blur(50px) saturate(180%)",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
              }
        }
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: isDark
              ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
          }}
        />
        <div className="flex items-center gap-4">
          <motion.button onClick={onBack} whileTap={{ scale: 0.8 }}>
            <ArrowLeft size={24} color={textPrimary} />
          </motion.button>
          <h1 style={{ color: textPrimary }}>Настройки</h1>
        </div>
      </div>

      <div className="px-4 pt-6">
        {/* ===== THEME TOGGLE — HERO CARD ===== */}
        <motion.div
          className="rounded-3xl p-6 mb-8 relative overflow-hidden"
          style={{
            ...(isDark ? glass.panel(0.07, 50) : {
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(50px) saturate(180%)",
              WebkitBackdropFilter: "blur(50px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.65)",
              boxShadow: "0 12px 48px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }),
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Top gloss */}
          <div
            className="absolute top-0 left-[10%] right-[10%] h-px"
            style={{
              background: isDark
                ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"
                : "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
            }}
          />

          {/* Gradient glow behind toggle area */}
          <div
            className="absolute -top-20 -right-20 w-48 h-48 rounded-full"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.15))"
                    : "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(251,146,60,0.1))",
                  border: isDark
                    ? "1px solid rgba(139,92,246,0.2)"
                    : "1px solid rgba(255,107,53,0.15)",
                  boxShadow: isDark
                    ? "0 0 20px rgba(139,92,246,0.1)"
                    : "0 0 20px rgba(255,107,53,0.08)",
                }}
              >
                {isDark ? (
                  <Moon size={22} color="#A78BFA" strokeWidth={1.8} />
                ) : (
                  <Sun size={22} color="#FF8F5E" strokeWidth={1.8} />
                )}
              </div>
              <div>
                <p style={{ color: textPrimary, fontSize: 16 }}>
                  {isDark ? "Тёмная тема" : "Светлая тема"}
                </p>
                <p style={{ color: textSecondary, fontSize: 13, marginTop: 2 }}>
                  {isDark ? "Сберегает ваши глаза" : "Яркий и чистый"}
                </p>
              </div>
            </div>

            <GlassToggle value={isDark} onChange={onToggleTheme} isThemeToggle />
          </div>

          {/* Preview dots */}
          <div className="flex items-center gap-2 mt-5 relative z-10">
            <div
              className="flex-1 h-1.5 rounded-full"
              style={{
                background: isDark
                  ? "linear-gradient(90deg, rgba(139,92,246,0.4), rgba(59,130,246,0.3))"
                  : "linear-gradient(90deg, rgba(255,107,53,0.4), rgba(251,146,60,0.3))",
              }}
            />
            <div
              className="flex-1 h-1.5 rounded-full"
              style={{
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              }}
            />
          </div>
        </motion.div>

        {/* ===== SETTINGS SECTIONS ===== */}
        {sections.map((section, si) => (
          <motion.div
            key={section.title}
            className="mb-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + si * 0.06 }}
          >
            <p
              className="px-2 mb-2"
              style={{
                fontSize: 12,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: textSecondary,
              }}
            >
              {section.title}
            </p>

            <div
              className="rounded-2xl overflow-hidden relative"
              style={glassItem}
            >
              {/* Top gloss */}
              <div
                className="absolute top-0 left-[5%] right-[5%] h-px"
                style={{
                  background: isDark
                    ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                }}
              />

              {section.items.map((item, ii) => {
                const Icon = item.icon;
                const isLast = ii === section.items.length - 1;

                return (
                  <motion.div
                    key={item.id}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-4 px-4 py-3.5 cursor-pointer"
                    style={{
                      borderBottom: isLast ? "none" : `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: item.danger
                          ? "rgba(239,68,68,0.08)"
                          : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                        border: item.danger
                          ? "1px solid rgba(239,68,68,0.12)"
                          : isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.04)",
                      }}
                    >
                      <Icon
                        size={17}
                        color={item.danger ? "#EF4444" : iconColor}
                        strokeWidth={1.8}
                      />
                    </div>
                    <span
                      className="flex-1 text-left"
                      style={{
                        fontSize: 15,
                        color: item.danger ? "#EF4444" : textPrimary,
                      }}
                    >
                      {item.label}
                    </span>

                    {item.toggle ? (
                      <GlassToggle value={item.value!} onChange={item.onChange!} />
                    ) : item.detail ? (
                      <span style={{ fontSize: 14, color: textSecondary }}>{item.detail}</span>
                    ) : (
                      <ChevronRight size={18} color={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"} />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Version */}
        <p className="text-center pb-8" style={{ fontSize: 12, color: textSecondary }}>
          Горизонты v2.1.0
        </p>
      </div>
    </div>
  );
}