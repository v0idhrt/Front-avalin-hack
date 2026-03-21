import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, ArrowRight, Mountain } from "lucide-react";

interface AuthPageProps {
  onLogin: (role: "user" | "organizer", organizerId?: string) => void;
  isDark?: boolean;
}

export function AuthPage({ onLogin, isDark = true }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"user" | "organizer">("user");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const bg = isDark ? "#0A0A0F" : "#f8f8fc";
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const textMuted = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)";
  const inputBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";

  const handleSubmit = () => {
    if (!login.trim() || !password.trim()) {
      setError("Заполните все поля");
      return;
    }
    if (password.length < 4) {
      setError("Пароль минимум 4 символа");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // For organizer login, map to org3 (Кубань-Тур) as demo
      onLogin(role, role === "organizer" ? "org3" : undefined);
    }, 800);
  };

  return (
    <div className="h-full relative flex flex-col" style={{ background: bg }}>
      {/* Top decorative gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-72 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% -20%, rgba(255,107,53,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
        {/* Logo */}
        <motion.div
          className="flex flex-col items-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ color: textPrimary, fontSize: 28 }}>Горизонты</h1>
          <p style={{ color: textSecondary, fontSize: 14 }} className="mt-1">
            {mode === "login" ? "Войдите в аккаунт" : "Создайте аккаунт"}
          </p>
        </motion.div>

        {/* Role toggle */}
        <motion.div
          className="flex gap-2 mb-6 p-1 rounded-2xl"
          style={{ background: cardBg, border: cardBorder }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setRole("user")}
            className="flex-1 py-3 rounded-xl transition-all"
            style={{
              background: role === "user" ? "linear-gradient(135deg, #FF6B35, #FF8F5E)" : "transparent",
              color: role === "user" ? "#fff" : textSecondary,
              fontSize: 14,
            }}
          >
            Путешественник
          </button>
          <button
            onClick={() => setRole("organizer")}
            className="flex-1 py-3 rounded-xl transition-all"
            style={{
              background: role === "organizer" ? "linear-gradient(135deg, #FF6B35, #FF8F5E)" : "transparent",
              color: role === "organizer" ? "#fff" : textSecondary,
              fontSize: 14,
            }}
          >
            Организатор
          </button>
        </motion.div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Login field */}
            <div className="mb-4">
              <label className="block mb-2" style={{ fontSize: 13, color: textMuted }}>
                Логин
              </label>
              <input
                type="text"
                value={login}
                onChange={(e) => { setLogin(e.target.value); setError(""); }}
                placeholder="Введите логин"
                className="w-full px-4 py-3.5 rounded-2xl outline-none transition-all"
                style={{
                  background: inputBg,
                  border: `1px solid ${error && !login ? "#ff4444" : inputBorder}`,
                  color: isDark ? "#fff" : "#222",
                  fontSize: 15,
                }}
              />
            </div>

            {/* Password field */}
            <div className="mb-4">
              <label className="block mb-2" style={{ fontSize: 13, color: textMuted }}>
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Введите пароль"
                  className="w-full px-4 py-3.5 rounded-2xl outline-none pr-12 transition-all"
                  style={{
                    background: inputBg,
                    border: `1px solid ${error && !password ? "#ff4444" : inputBorder}`,
                    color: isDark ? "#fff" : "#222",
                    fontSize: 15,
                  }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                >
                  {showPassword ? (
                    <EyeOff size={18} color={textMuted} />
                  ) : (
                    <Eye size={18} color={textMuted} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ color: "#FF6B35", fontSize: 13 }}
                  className="mb-4"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-2"
              style={{
                background: loading
                  ? "rgba(255,107,53,0.5)"
                  : "linear-gradient(135deg, #FF6B35, #FF8F5E)",
                boxShadow: "0 8px 30px rgba(255,107,53,0.3)",
              }}
            >
              {loading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <span>{mode === "login" ? "Войти" : "Зарегистрироваться"}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </motion.div>
        </AnimatePresence>

        {/* Switch mode */}
        <div className="flex items-center justify-center gap-1 mt-6">
          <span style={{ fontSize: 14, color: textSecondary }}>
            {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}
          </span>
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            style={{ fontSize: 14, color: "#FF6B35" }}
          >
            {mode === "login" ? "Регистрация" : "Войти"}
          </button>
        </div>

        {/* Demo hint */}
        <p className="text-center mt-8" style={{ fontSize: 12, color: textMuted }}>
          Демо: введите любой логин и пароль (4+ символов)
        </p>
      </div>
    </div>
  );
}