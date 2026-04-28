import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { 
  ArrowRight, Cloud, Leaf, MapPin, Smartphone, User, Mail, Lock 
} from "lucide-react";

import { authApi, cropApi, farmApi } from "../services/api";
import { Crop } from "../types/api";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useLanguage } from "../hooks/useLanguage";

// ─── Translations Dictionary ──────────────────────────────────────────────────
// Preserved exactly as requested for onboarding page
const onboardingT: Record<string, any> = {
  en: {
    splashTitle1: "Fasal", splashTitle2: "Saathi",
    splashSubtitle: "Your AI farming companion",
    splashDesc: "Create your account, set up your first farm, and start getting live weather, market, and crop guidance.",
    btnStart: "Get Started",
    regTitle: "Setup Farm Account",
    regDesc: "We’ll create your profile and first farm.",
    lblName: "Full name", lblEmail: "Email", lblPassword: "Password",
    lblPhone: "Mobile number", lblLocation: "Location",
    lblFarmSize: "Farm size", lblCrop: "Primary crop",
    plhName: "Ramesh Kumar", plhEmail: "ayushmanpatel13@gmail.com",
    plhPassword: "Enter your password", plhPhone: "+91 9876543210",
    plhLocation: "Itarsi, Madhya Pradesh", plhSize: "Choose a size", plhCrop: "Choose a crop",
    sizeSmall: "Small (1-5 acre)", sizeMedium: "Medium (5-20 acre)", sizeLarge: "Large (20+ acre)",
    btnCreating: "Creating account...", btnSubmit: "Start FasalSaathi",
    errFillAll: "Please fill in name, email, password, and location."
  },
  hi: {
    splashTitle1: "फ़सल", splashTitle2: "साथी",
    splashSubtitle: "आपका AI कृषि साथी",
    splashDesc: "अपना खाता बनाएं, अपना पहला खेत सेट करें, और लाइव मौसम, बाज़ार और फसल मार्गदर्शन प्राप्त करना शुरू करें।",
    btnStart: "शुरू करें",
    regTitle: "फार्म खाता सेट करें",
    regDesc: "हम आपकी प्रोफ़ाइल और पहला खेत बनाएंगे।",
    lblName: "पूरा नाम", lblEmail: "ईमेल", lblPassword: "पासवर्ड",
    lblPhone: "मोबाइल नंबर", lblLocation: "स्थान",
    lblFarmSize: "खेत का आकार", lblCrop: "मुख्य फसल",
    plhName: "रमेश कुमार", plhEmail: "ayushmanpatel13@gmail.com",
    plhPassword: "अपना पासवर्ड दर्ज करें", plhPhone: "+91 9876543210",
    plhLocation: "इटारसी, मध्य प्रदेश", plhSize: "आकार चुनें", plhCrop: "फसल चुनें",
    sizeSmall: "छोटा (1-5 एकड़)", sizeMedium: "मध्यम (5-20 एकड़)", sizeLarge: "बड़ा (20+ एकड़)",
    btnCreating: "खाता बनाया जा रहा है...", btnSubmit: "फ़सलसाथी शुरू करें",
    errFillAll: "कृपया नाम, ईमेल, पासवर्ड और स्थान भरें।"
  },
  mr: {
    splashTitle1: "फसल", splashTitle2: "साथी",
    splashSubtitle: "तुमचा AI शेती साथी",
    splashDesc: "तुमचे खाते तयार करा, तुमचे पहिले शेत सेट करा आणि थेट हवामान, बाजार आणि पीक मार्गदर्शन मिळवणे सुरू करा.",
    btnStart: "सुरू करा",
    regTitle: "फार्म खाते सेट करा",
    regDesc: "आम्ही तुमची प्रोफाइल आणि पहिले शेत तयार करू.",
    lblName: "पूर्ण नाव", lblEmail: "ईमेल", lblPassword: "पासवर्ड",
    lblPhone: "मोबाईल क्रमांक", lblLocation: "स्थान",
    lblFarmSize: "शेताचा आकार", lblCrop: "मुख्य पीक",
    plhName: "रमेश कुमार", plhEmail: "ayushmanpatel13@gmail.com",
    plhPassword: "पासवर्ड टाका", plhPhone: "+91 9876543210",
    plhLocation: "इटारसी, मध्य प्रदेश", plhSize: "आकार निवडा", plhCrop: "पीक निवडा",
    sizeSmall: "लहान (१-५ एकर)", sizeMedium: "मध्यम (५-२० एकर)", sizeLarge: "मोठे (२०+ एकर)",
    btnCreating: "खाते तयार करत आहे...", btnSubmit: "फसलसाथी सुरू करा",
    errFillAll: "कृपया नाव, ईमेल, पासवर्ड आणि स्थान भरा."
  },
  pa: {
    splashTitle1: "ਫਸਲ", splashTitle2: "ਸਾਥੀ",
    splashSubtitle: "ਤੁਹਾਡਾ AI ਖੇਤੀ ਸਾਥੀ",
    splashDesc: "ਆਪਣਾ ਖਾਤਾ ਬਣਾਓ, ਆਪਣਾ ਪਹਿਲਾ ਖੇਤ ਸੈਟ ਅਪ ਕਰੋ, ਅਤੇ ਲਾਈਵ ਮੌਸਮ, ਬਾਜ਼ਾਰ ਅਤੇ ਫਸਲ ਮਾਰਗਦਰਸ਼ਨ ਪ੍ਰਾਪਤ ਕਰਨਾ ਸ਼ੁਰੂ ਕਰੋ।",
    btnStart: "ਸ਼ੁਰੂ ਕਰੋ",
    regTitle: "ਫਾਰਮ ਖਾਤਾ ਸੈਟ ਕਰੋ",
    regDesc: "ਅਸੀਂ ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਪਹਿਲਾ ਖੇਤ ਬਣਾਵਾਂਗੇ।",
    lblName: "ਪੂਰਾ ਨਾਮ", lblEmail: "ਈਮੇਲ", lblPassword: "ਪਾਸਵਰਡ",
    lblPhone: "ਮੋਬਾਈਲ ਨੰਬਰ", lblLocation: "ਸਥਾਨ",
    lblFarmSize: "ਖੇਤ ਦਾ ਆਕਾਰ", lblCrop: "ਮੁੱਖ ਫਸਲ",
    plhName: "ਰਮੇਸ਼ ਕੁਮਾਰ", plhEmail: "ayushmanpatel13@gmail.com",
    plhPassword: "ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ", plhPhone: "+91 9876543210",
    plhLocation: "ਇਟਾਰਸੀ, ਮੱਧ ਪ੍ਰਦੇਸ਼", plhSize: "ਆਕਾਰ ਚੁਣੋ", plhCrop: "ਫਸਲ ਚੁਣੋ",
    sizeSmall: "ਛੋਟਾ (1-5 ਏਕੜ)", sizeMedium: "ਦਰਮਿਆਨਾ (5-20 ਏਕੜ)", sizeLarge: "ਵੱਡਾ (20+ ਏਕੜ)",
    btnCreating: "ਖਾਤਾ ਬਣਾਇਆ ਜਾ ਰਿਹਾ ਹੈ...", btnSubmit: "ਫਸਲਸਾਥੀ ਸ਼ੁਰੂ ਕਰੋ",
    errFillAll: "ਕਿਰਪਾ ਕਰਕੇ ਨਾਮ, ਈਮੇਲ, ਪਾਸਵਰਡ ਅਤੇ ਸਥਾਨ ਭਰੋ।"
  }
};

interface OnboardingProps {
  onComplete: () => void;
}

interface UserInfo {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  farmSize: string;
  primaryCrop: string;
}

// ─── Animation Definition (Framer Motion) ───────────────────────────────────
// Preserved exactly as requested
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1, 
    y: 0, 
    transition: { delay: custom * 0.05, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }
  })
};

const cardTransition = {
  initial: { opacity: 0, x: -100, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 100, scale: 0.98, transition: { duration: 0.3 } }
};

export function OnboardingFlow({ onComplete }: OnboardingProps) {
  const { lang } = useLanguage(); 
  const text = onboardingT[lang] || onboardingT["en"]; // Language from hook

  const [currentStep, setCurrentStep] = useState(0);
  const [availableCrops, setAvailableCrops] = useState<Crop[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    farmSize: "",
    primaryCrop: "",
  });

  useEffect(() => {
    cropApi.getAllCrops().then(setAvailableCrops).catch(() => setAvailableCrops([]));
  }, []);

  // Preserved functionality: preserved exactly, except language screen
  const steps = [
    { id: 0, component: SplashScreen },
    { id: 1, component: Registration },
  ];

  const completeOnboarding = async () => {
    if (!userInfo.name || !userInfo.email || !userInfo.password || !userInfo.location) {
      setError(text.errFillAll);
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await authApi.register({
        email: userInfo.email,
        password: userInfo.password,
        phone: userInfo.phone || undefined,
        full_name: userInfo.name,
        language_preference: lang,
      });

      const token = await authApi.login(userInfo.email, userInfo.password);
      localStorage.setItem("accessToken", token.access_token);

      const farmArea =
        userInfo.farmSize === "small" ? 5 : userInfo.farmSize === "medium" ? 12 : userInfo.farmSize === "large" ? 25 : 5;
      const selectedCrop = availableCrops.find((crop) => String(crop.id) === userInfo.primaryCrop);

      await farmApi.createFarm({
        name: `${userInfo.name.split(" ")[0] || "My"} Farm`,
        location: userInfo.location,
        area: farmArea,
        soil_type: "loamy",
        irrigation_type: "drip",
        initial_crop_id: selectedCrop?.id,
        initial_crop_season: selectedCrop?.season,
        initial_crop_year: new Date().getFullYear(),
      });

      onComplete();
    } catch (submitError: any) {
      setError(submitError?.response?.data?.detail || "Unable to complete onboarding right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
      return;
    }
    await completeOnboarding();
  };

  const CurrentStepComponent = steps[currentStep].component;

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
          border-radius: 1.5rem; /* ~ rounded-3xl */
          shadow-2xl;
        }

        /* Full page background structure with detailed landing page hero theme */
        .fs-onb-bg-wrapper {
          position: fixed; inset: 0;
          background: linear-gradient(180deg, #064e3b 0%, #022c22 100%);
          z-index: -1; overflow: hidden;
        }
        @ Sun Pulse animation
        @ sunPulse { 0% { transform: scale(1); box-shadow: 0 0 50px 20px rgba(250, 204, 21, 0.2); } 100% { transform: scale(1.05); box-shadow: 0 0 80px 40px rgba(250, 204, 21, 0.4); } }
        .fs-onb-bg-sun { 
          position: absolute; top: 10%; right: 15%; width: 120px; height: 120px; 
          background: #facc15; border-radius: 50%; opacity: 0.85; 
          animation: sunPulse 5s ease-in-out infinite alternate; 
        }
        @ Float cloud animation
        @ floatCloud { 0% { transform: translateX(-15vw); } 100% { transform: translateX(115vw); } }
        .fs-onb-bg-cloud { position: absolute; color: rgba(255, 255, 255, 0.08); animation: floatCloud linear infinite; }
        .fs-onb-bg-cloud-1 { top: 10%; left: -20%; animation-duration: 45s; animation-delay: -10s; width: 200px; height: 200px; }
        .fs-onb-bg-cloud-2 { top: 25%; left: -20%; animation-duration: 65s; animation-delay: -35s; transform: scale(1.5); color: rgba(255, 255, 255, 0.04); width: 300px; height: 300px; }
        
        @ Wave hills animation
        @ waveHills { 0% { transform: translateX(0) scaleY(1); } 50% { transform: translateX(-2%) scaleY(1.05); } 100% { transform: translateX(0) scaleY(1); } }
        .fs-onb-bg-hill { position: absolute; bottom: -5%; width: 120%; border-radius: 50% 50% 0 0 / 100% 100% 0 0; animation: waveHills 10s ease-in-out infinite; }
        .fs-onb-bg-hill-1 { left: -5%; background: rgba(20, 83, 45, 0.5); z-index: 1; height: 35%; animation-duration: 12s; }
        .fs-onb-bg-hill-2 { left: -10%; background: rgba(6, 95, 70, 0.7); z-index: 2; height: 25%; animation-delay: -5s; }
        
        @ Leaf Fall animation
        @ leafFall { 0% { transform: translate(0, -50px) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translate(-150px, 100vh) rotate(720deg); opacity: 0; } }
        .fs-onb-bg-leaf { position: absolute; top: -10%; background: linear-gradient(135deg, #4ade80, #16a34a); border-radius: 50% 0 50% 0; opacity: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); animation: leafFall linear infinite; }
        
        .fs-onb-noise { position: absolute; inset: 0; z-index: 3; background-image: url('https://grainy-gradients.vercel.app/noise.svg'); opacity: 0.15; mix-blend-mode: overlay; pointer-events: none; }

        /* Modern input styling with increased height, rounded-2xl, and correct spacing */
        .fs-onb-input, .fs-onb-select-trigger { 
          height: 2rem; /* ~ h-14 */
          border-radius: 0.75rem; /* ~ rounded-2xl */
          background-color: rgba(243, 244, 246, 0.5); /* ~ bg-gray-50/50 */
          border-color: #e5e7eb;
          font-size: 1rem;
          transition: background-color 0.2s, border-color 0.2s;
        }
        .fs-onb-input:focus, .fs-onb-select-trigger:focus { background-color: #fffuff; border-color: #16a34a; }
        
        /* Submit button: increased height, rounded-2xl, specific shadow */
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

        /* Modern form spacing */
        .fs-onb-form-group { margin-bottom: 1.5rem; }
        .fs-onb-label { color: #374151; font-weight: 500; font-size: 0.875rem; margin-bottom: 0.5rem; display: block; padding-left: 0.1rem; }
      `}</style>

      <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Animated Background from Landing Page */}
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

        {/* Multi-step Container */}
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <CurrentStepComponent
              key={currentStep}
              onNext={nextStep}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              crops={availableCrops}
              error={error}
              isSubmitting={isSubmitting}
              text={text} // Pass translation dictionary
            />
          </AnimatePresence>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {steps.map((step, idx) => (
              <div 
                key={step.id} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-8 bg-white' : 
                  idx < currentStep ? 'w-4 bg-white/70' : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── SplashScreen ───────────────────────────────────────────────────────────
// Preserved exactly: functionality, state
function SplashScreen({ onNext, text }: any) {
  return (
    <motion.div {...cardTransition} className="text-center max-w-md mx-auto">
      <Card className="fs-onb-card overflow-hidden p-2">
        <CardContent className="p-6">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30 rotate-3"
          >
            {/* User code icon combined with central user/leaf style from reference */}
            <div className="relative">
              <User className="w-12 h-12 text-green -rotate-3" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-900 mb-3 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {text.splashTitle1}<span className="text-green-600">{text.splashTitle2}</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-lg font-medium text-green-700 mb-6 bg-green-50 inline-block px-4 py-1.5 rounded-full"
          >
            {text.splashSubtitle}
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-gray-600 mb-4 leading-relaxed text-[1.05rem]"
          >
            {text.splashDesc}
          </motion.p>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
            <Button onClick={onNext} className="w-full h-14 text-lg rounded-2xl fs-onb-btn-submit">
              {text.btnStart}
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Registration ───────────────────────────────────────────────────────────
// Preserved exactly: functionality, state, API calls, props
function Registration({
  onNext, userInfo, setUserInfo, crops, error, isSubmitting, text
}: any) {
  
  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div {...cardTransition} className="w-full">
      <Card className="fs-onb-card p-2">
        <CardHeader className="text-center pt-8 pb-2">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            {/* User code icon combined with central user/leaf style from reference */}
            <div className="relative">
              <User className="w-8 h-8" />
              <Leaf className="absolute -top-1 -right-1 w-4 h-4 text-green-300" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {text.regTitle}
          </CardTitle>
          <p className="text-gray-500 mt-2">{text.regDesc}</p>
        </CardHeader>
        
        <CardContent className="px-3 sm:px-8 pb-8 space-y-3">
          {error && (
            <Alert className="border-red-200 bg-red-50 rounded-2xl">
              <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {/* Form groups with proper icons, placeholders, heights, and corner smoothing */}
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="fs-onb-form-group">
                <Label htmlFor="name" className="fs-onb-label">{text.lblName}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    value={userInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={text.plhName}
                    className="fs-onb-input pl-10 h-14"
                  />
                </div>
              </div>

              <div className="fs-onb-form-group">
                <Label htmlFor="email" className="fs-onb-label">{text.lblEmail}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder={text.plhEmail}
                    className="fs-onb-input pl-10 h-14"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="fs-onb-form-group">
                <Label htmlFor="password" className="fs-onb-label">{text.lblPassword}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={userInfo.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder={text.plhPassword}
                    className="fs-onb-input pl-10 h-14"
                  />
                </div>
              </div>

              <div className="fs-onb-form-group">
                <Label htmlFor="phone" className="fs-onb-label">{text.lblPhone}</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    value={userInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder={text.plhPhone}
                    className="fs-onb-input pl-10 h-14"
                  />
                </div>
              </div>
            </div>

            <div className="fs-onb-form-group">
              <Label htmlFor="location" className="fs-onb-label">{text.lblLocation}</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="location"
                  value={userInfo.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder={text.plhLocation}
                  className="fs-onb-input pl-10 h-14"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="fs-onb-form-group">
                <Label htmlFor="farmSize" className="fs-onb-label">{text.lblFarmSize}</Label>
                <Select onValueChange={(value) => handleInputChange("farmSize", value)}>
                  <SelectTrigger className="fs-onb-select-trigger h-14 px-4">
                    <SelectValue placeholder={text.plhSize} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-gray-200 shadow-xl max-h-60">
                    <SelectItem value="small" className="py-3">{text.sizeSmall}</SelectItem>
                    <SelectItem value="medium" className="py-3">{text.sizeMedium}</SelectItem>
                    <SelectItem value="large" className="py-3">{text.sizeLarge}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="fs-onb-form-group">
                <Label htmlFor="primaryCrop" className="fs-onb-label">{text.lblCrop}</Label>
                <Select onValueChange={(value) => handleInputChange("primaryCrop", value)}>
                  <SelectTrigger className="fs-onb-select-trigger h-14 px-4">
                    <SelectValue placeholder={text.plhCrop} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-gray-200 shadow-xl max-h-60">
                    {crops.map((crop: Crop) => (
                      <SelectItem key={crop.id} value={String(crop.id)} className="py-3">
                        {crop.name_hindi} ({crop.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <Button 
              onClick={onNext} 
              className="w-full h-12 text-lg font-semibold rounded-2xl fs-onb-btn-submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {text.btnCreating}
                </div>
              ) : (
                <>
                  {text.btnSubmit}
                  <ArrowRight className="w-6 h-6 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}