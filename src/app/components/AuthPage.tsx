import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useLogin, useRegister, getApiErrorMessage } from "@/app/hooks/useAuth";

interface AuthPageProps {
  onLogin: (role: "user" | "organizer", organizerId?: string) => void;
  isDark?: boolean;
}

export function AuthPage({ onLogin, isDark = true }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"tourist" | "vendor">("tourist");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const loading = loginMutation.isPending || registerMutation.isPending;

  const handleSubmit = async () => {
    setError("");
    
    if (!email.trim() || !password.trim()) {
      setError("Заполните все поля");
      return;
    }

    try {
      if (mode === "login") {
        const result = await loginMutation.mutateAsync({ 
          email, 
          password 
        });
        // Map backend role back to UI expectations
        const uiRole = result.user.role === "vendor" ? "organizer" : "user";
        onLogin(uiRole, result.user.organizerId);
      } else {
        const result = await registerMutation.mutateAsync({
          email,
          password,
          role
        });
        const uiRole = result.user.role === "vendor" ? "organizer" : "user";
        onLogin(uiRole, result.user.organizerId);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const bg = isDark ? "#0A0A0F" : "#f8f8fc";
  const textPrimary = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const textMuted = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)";
  const inputBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";

  return (
    <div className="flex-1 relative flex flex-col" style={{ background: bg }}>
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
        <div className="relative mb-6 p-1 rounded-2xl" style={{ 
          background: cardBg, 
          border: cardBorder,
        }}>
          <div className="relative h-[40px] p-1">
            {/* Main Liquid Pill */}
            <motion.div
              className="absolute top-0 left-0 bottom-0 z-0"
              initial={false}
              animate={{
                x: role === "tourist" ? "0%" : "100%",
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 35,
                mass: 0.8,
              }}
              style={{
                width: "50%",
              }}
            >
              <div className="p-1 h-full w-full">
                {/* Internal stretch container */}
                <motion.div 
                  className="w-full h-full rounded-xl overflow-hidden relative"
                  style={{
                    background: "linear-gradient(135deg, #FF6B35, #FF8F5E)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                  animate={{
                    scaleX: [1, 1.15, 1],
                    scaleY: [1, 0.9, 1],
                  }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                  key={role}
                >
                  <motion.div 
                    className="absolute inset-0 w-1/2 h-full bg-white/20 blur-xl -skew-x-12"
                    animate={{ left: ["-100%", "200%"] }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    key={`sweep-${role}`}
                  />
                </motion.div>
              </div>
            </motion.div>

            <div className="relative z-10 flex h-full items-center">
              <button
                onClick={() => setRole("tourist")}
                className="flex-1 h-full flex items-center justify-center transition-colors duration-300"
                style={{
                  color: role === "tourist" ? "#fff" : textSecondary,
                  fontSize: 14,
                  fontWeight: role === "tourist" ? 600 : 400,
                }}
              >
                Путешественник
              </button>
              <button
                onClick={() => setRole("vendor")}
                className="flex-1 h-full flex items-center justify-center transition-colors duration-300"
                style={{
                  color: role === "vendor" ? "#fff" : textSecondary,
                  fontSize: 14,
                  fontWeight: role === "vendor" ? 600 : 400,
                }}
              >
                Организатор
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Email field */}
            <div className="mb-4">
              <label className="block mb-2" style={{ fontSize: 13, color: textMuted }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="Введите email"
                disabled={loading}
                className="w-full px-4 py-3.5 rounded-2xl outline-none transition-all"
                style={{
                  background: inputBg,
                  border: `1px solid ${error && !email ? "#ff4444" : inputBorder}`,
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
                  disabled={loading}
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
            disabled={loading}
          >
            {mode === "login" ? "Регистрация" : "Войти"}
          </button>
        </div>
      </div>
    </div>
  );
}
