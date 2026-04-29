import { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Leaf, 
  Mail,
  Lock,
  User,
  Cloud
} from "lucide-react";

import { authApi } from "../services/api";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useLanguage } from "../hooks/useLanguage";

// ─── Translations Dictionary ───────────────────────────────────────────────
const translations = {
  en: {
    welcome: "Welcome Back!",
    subText: "Sign in to access your farm dashboard.",
    lblE: "Email Address", phE: "farmer@example.com",
    lblP: "Password", phP: "Enter your password",
    btnSignIn: "Sign In", btnSigningIn: "Signing in...",
    errMissing: "Please enter both email and password.",
    errInvalid: "Invalid email or password.",
    noAccount: "Don't have an account?",
    signUp: "Create one"
  },
  hi: {
    welcome: "वापसी पर स्वागत है!",
    subText: "अपने फार्म डैशबोर्ड तक पहुंचने के लिए साइन इन करें।",
    lblE: "ईमेल पता", phE: "farmer@example.com",
    lblP: "पासवर्ड", phP: "अपना पासवर्ड दर्ज करें",
    btnSignIn: "साइन इन करें", btnSigningIn: "साइन इन हो रहा है...",
    errMissing: "कृपया ईमेल और पासवर्ड दोनों दर्ज करें।",
    errInvalid: "अमान्य ईमेल या पासवर्ड।",
    noAccount: "क्या आपके पास खाता नहीं है?",
    signUp: "नया बनाएं"
  },
  mr: {
    welcome: "परत स्वागत आहे!",
    subText: "तुमच्या शेत डॅशबोर्डवर प्रवेश करण्यासाठी साइन इन करा.",
    lblE: "ईमेल पत्ता", phE: "farmer@example.com",
    lblP: "पासवर्ड", phP: "तुमचा पासवर्ड प्रविष्ट करा",
    btnSignIn: "साइन इन करा", btnSigningIn: "साइन इन करत आहे...",
    errMissing: "कृपया ईमेल आणि पासवर्ड दोन्ही प्रविष्ट करा.",
    errInvalid: "अवैध ईमेल किंवा पासवर्ड.",
    noAccount: "खाते नाही?",
    signUp: "नवीन तयार करा"
  },
  pa: {
    welcome: "ਜੀ ਆਇਆਂ ਨੂੰ!",
    subText: "ਆਪਣੇ ਫਾਰਮ ਡੈਸ਼ਬੋਰਡ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ।",
    lblE: "ਈਮੇਲ ਪਤਾ", phE: "farmer@example.com",
    lblP: "ਪਾਸਵਰਡ", phP: "ਆਪਣਾ ਪਾਸਵਰਡ ਦਾਖਲ ਕਰੋ",
    btnSignIn: "ਸਾਈਨ ਇਨ ਕਰੋ", btnSigningIn: "ਸਾਈਨ ਇਨ ਹੋ ਰਿਹਾ ਹੈ...",
    errMissing: "ਕਿਰਪਾ ਕਰਕੇ ਈਮੇਲ ਅਤੇ ਪਾਸਵਰਡ ਦੋਵੇਂ ਦਾਖਲ ਕਰੋ।",
    errInvalid: "ਗਲਤ ਈਮੇਲ ਜਾਂ ਪਾਸਵਰਡ।",
    noAccount: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਖਾਤਾ ਨਹੀਂ ਹੈ?",
    signUp: "ਨਵਾਂ ਬਣਾਓ"
  }
};

interface LoginPageProps {
  onLogin: () => void;
  onNavigateToRegister: () => void;
}

export function LoginPage({ onLogin, onNavigateToRegister }: LoginPageProps) {
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations] || translations.en;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Prevents native form submission refresh
    
    if (!email || !password) {
      setError(t.errMissing);
      return;
    }

    setIsSubmitting(true);
    setError("");

    // ─── STRICT REAL BACKEND AUTHENTICATION ───
    try {
      const token = await authApi.login(email, password);
      
      // Save the token to local storage securely
      localStorage.setItem("accessToken", token.access_token);
      
      // Successfully directs to dashboard!
      onLogin(); 
    } catch (submitError: any) {
      // Backend rejected the credentials: show error and stay on page
      console.error("Login failed:", submitError);
      setError(submitError?.response?.data?.detail || t.errInvalid);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardTransition = {
    initial: { opacity: 0, x: -100, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        /* Standard card style with frosted glass and rounded-3xl */
        .fs-onb-card { 
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 1.5rem;
        }

        /* Full page background structure */
        .fs-onb-bg-wrapper {
          position: fixed; inset: 0;
          background: linear-gradient(180deg, #064e3b 0%, #022c22 100%);
          z-index: -1; overflow: hidden;
        }
        @keyframes sunPulse { 0% { transform: scale(1); box-shadow: 0 0 50px 20px rgba(250, 204, 21, 0.2); } 100% { transform: scale(1.05); box-shadow: 0 0 80px 40px rgba(250, 204, 21, 0.4); } }
        .fs-onb-bg-sun { 
          position: absolute; top: 10%; right: 15%; width: 120px; height: 120px; 
          background: #facc15; border-radius: 50%; opacity: 0.85; 
          animation: sunPulse 5s ease-in-out infinite alternate; 
        }
        @keyframes floatCloud { 0% { transform: translateX(-15vw); } 100% { transform: translateX(115vw); } }
        .fs-onb-bg-cloud { position: absolute; color: rgba(255, 255, 255, 0.08); animation: floatCloud linear infinite; }
        .fs-onb-bg-cloud-1 { top: 10%; left: -20%; animation-duration: 45s; animation-delay: -10s; width: 200px; height: 200px; }
        .fs-onb-bg-cloud-2 { top: 25%; left: -20%; animation-duration: 65s; animation-delay: -35s; transform: scale(1.5); color: rgba(255, 255, 255, 0.04); width: 300px; height: 300px; }
        
        @keyframes waveHills { 0% { transform: translateX(0) scaleY(1); } 50% { transform: translateX(-2%) scaleY(1.05); } 100% { transform: translateX(0) scaleY(1); } }
        .fs-onb-bg-hill { position: absolute; bottom: -5%; width: 120%; border-radius: 50% 50% 0 0 / 100% 100% 0 0; animation: waveHills 10s ease-in-out infinite; }
        .fs-onb-bg-hill-1 { left: -5%; background: rgba(20, 83, 45, 0.5); z-index: 1; height: 35%; animation-duration: 12s; }
        .fs-onb-bg-hill-2 { left: -10%; background: rgba(6, 95, 70, 0.7); z-index: 2; height: 25%; animation-delay: -5s; }
        
        @keyframes leafFall { 0% { transform: translate(0, -50px) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translate(-150px, 100vh) rotate(720deg); opacity: 0; } }
        .fs-onb-bg-leaf { position: absolute; top: -10%; background: linear-gradient(135deg, #4ade80, #16a34a); border-radius: 50% 0 50% 0; opacity: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); animation: leafFall linear infinite; }
        
        .fs-onb-noise { position: absolute; inset: 0; z-index: 3; background-image: url('/noise.svg'); opacity: 0.15; mix-blend-mode: overlay; pointer-events: none; }

        /* Modern input styling */
        .fs-onb-input { 
          border-radius: 0.75rem; 
          background-color: rgba(243, 244, 246, 0.5); 
          border-color: #e5e7eb;
          font-size: 1rem;
          transition: background-color 0.2s, border-color 0.2s;
        }
        .fs-onb-input:focus { background-color: #ffffff; border-color: #16a34a; }
        
        /* Submit button styling */
        .fs-onb-btn-submit { 
          height: 3.5rem;
          border-radius: 0.75rem; 
          background-color: #16a34a;
          color: #ffffff;
          font-size: 1.125rem;
          font-weight: 600;
          box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.3);
          transition: transform 0.2s, background-color 0.2s;
        }
        .fs-onb-btn-submit:hover { transform: translateY(-1px); background-color: #15803d; }

        .fs-onb-form-group { margin-bottom: 1.5rem; }
        .fs-onb-label { color: #374151; font-weight: 500; font-size: 0.875rem; margin-bottom: 0.5rem; display: block; padding-left: 0.1rem; }
      `}</style>

      <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
        
        {/* Animated Background */}
        <div className="fs-onb-bg-wrapper">
          <div className="fs-onb-bg-sun" />
          <Cloud className="fs-onb-bg-cloud fs-onb-bg-cloud-1" />
          <Cloud className="fs-onb-bg-cloud fs-onb-bg-cloud-2" />
          <div className="fs-onb-bg-hill fs-onb-bg-hill-1" />
          <div className="fs-onb-bg-hill fs-onb-bg-hill-2" />
          <div className="fs-onb-bg-leaf" style={{ left: '15%', width: '14px', height: '14px', animationDuration: '12s', animationDelay: '0s' }} />
          <div className="fs-onb-bg-leaf" style={{ left: '40%', width: '10px', height: '10px', animationDuration: '16s', animationDelay: '3s' }} />
          <div className="fs-onb-bg-leaf" style={{ left: '65%', width: '18px', height: '18px', animationDuration: '14s', animationDelay: '1s', background: 'linear-gradient(135deg, #facc15, #ca8a04)' }} />
          <div className="fs-onb-bg-leaf" style={{ left: '85%', width: '12px', height: '12px', animationDuration: '18s', animationDelay: '5s' }} />
          <div className="fs-onb-noise" />
        </div>

        {/* Login Card */}
        <motion.div {...cardTransition} className="w-full max-w-md mx-auto">
          <Card className="fs-onb-card p-2 shadow-2xl">
            <CardHeader className="text-center pt-8 pb-2">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <div className="relative">
                  <User className="w-8 h-8" />
                  <Leaf className="absolute -top-1 -right-1 w-4 h-4 text-green-300" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {t.welcome}
              </CardTitle>
              <p className="text-gray-500 mt-2">{t.subText}</p>
            </CardHeader>
            
            <CardContent className="px-3 sm:px-8 pb-8 pt-2">
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Form Error */}
                {error && (
                  <Alert className="border-red-200 bg-red-50 rounded-2xl">
                    <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Email Input */}
                <div className="fs-onb-form-group">
                  <Label htmlFor="login-email" className="fs-onb-label">{t.lblE}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      id="login-email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder={t.phE} 
                      className="fs-onb-input pl-10 h-14" 
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="fs-onb-form-group mb-6">
                  <div className="flex justify-between items-center ml-1 mb-2">
                    <Label htmlFor="login-password" className="fs-onb-label !mb-0">{t.lblP}</Label>
                    <span className="text-xs font-bold text-green-600 hover:text-green-700 cursor-pointer">Forgot Password?</span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      id="login-password" 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder={t.phP} 
                      className="fs-onb-input pl-10 h-14" 
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button type="submit" className="w-full h-12 text-lg font-semibold rounded-2xl fs-onb-btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t.btnSigningIn}
                      </div>
                    ) : (
                      <>
                        {t.btnSignIn}
                        <ArrowRight className="w-6 h-6 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Footer Switch */}
                <div className="pt-5 text-center">
                  <p className="text-sm font-medium text-gray-500">
                    {t.noAccount} 
                    <button type="button" onClick={onNavigateToRegister} className="text-green-600 font-bold hover:text-green-700 ml-1">
                      {t.signUp}
                    </button>
                  </p>
                </div>

              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}