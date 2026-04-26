import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "motion/react";
import {
  ArrowRight,
  Cloud,
  TrendingUp,
  Leaf,
  Smartphone,
  Shield,
  BarChart3,
  Zap,
  Star,
  CheckCircle,
  ChevronRight,
  Users,
  MapPin,
  Award,
} from "lucide-react";
import { PublicNavbar } from "../components/public/PublicNavbar";
import { PublicFooter } from "../components/public/PublicFooter";

// ─── Animation helpers ────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { value: "50,000+", label: "Farmers Served", icon: Users },
  { value: "18", label: "States Covered", icon: MapPin },
  { value: "200+", label: "Crop Varieties", icon: Leaf },
  { value: "99.5%", label: "Uptime Guarantee", icon: Award },
];

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Cloud,
    title: "Live Weather Intelligence",
    desc: "Hyperlocal forecasts powered by OpenWeatherMap. Know exactly when to sow, irrigate, or harvest.",
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Market Prices",
    desc: "Track mandi prices for 200+ crops across 18 states. Sell at the right time, maximise your returns.",
    color: "bg-orange-50 text-orange-600",
    border: "border-orange-100",
  },
  {
    icon: Leaf,
    title: "AI Crop Recommendations",
    desc: "AI analyses your soil type, location, and season to recommend the most profitable crop for your farm.",
    color: "bg-green-50 text-green-600",
    border: "border-green-100",
  },
  {
    icon: Shield,
    title: "Plant Disease Detection",
    desc: "Upload a photo of your crop and our AI instantly identifies the disease and suggests treatment.",
    color: "bg-red-50 text-red-600",
    border: "border-red-100",
  },
  {
    icon: BarChart3,
    title: "Yield Prediction",
    desc: "Data-driven yield forecasting so you can plan storage, logistics, and sales months in advance.",
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
  },
  {
    icon: Smartphone,
    title: "Multilingual & Offline Ready",
    desc: "Works in Hindi, Marathi, and English. Key data caches locally so you're never left without guidance.",
    color: "bg-teal-50 text-teal-600",
    border: "border-teal-100",
  },
];

// ─── How it works ─────────────────────────────────────────────────────────────
const steps = [
  {
    step: "01",
    title: "Create Your Farm",
    desc: "Register in under 2 minutes. Add your farm location, size, and primary crop. No paperwork needed.",
  },
  {
    step: "02",
    title: "Get Personalised Insights",
    desc: "Receive AI-powered recommendations tailored to your land, weather, and local market conditions.",
  },
  {
    step: "03",
    title: "Grow & Profit",
    desc: "Act on real-time alerts, sell at the best mandi price, and track your farm's progress over seasons.",
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Ramesh Patel",
    location: "Vidisha, Madhya Pradesh",
    crop: "Wheat & Soybean",
    text: "FasalSaathi warned me about unseasonal rain 3 days early. I harvested on time and saved my entire wheat crop. Never farming without it again.",
    rating: 5,
    initials: "RP",
  },
  {
    name: "Sunita Devi",
    location: "Nashik, Maharashtra",
    crop: "Onion & Grapes",
    text: "Market price alerts helped me sell onions at ₹38/kg instead of distress selling at ₹12. My income doubled this season.",
    rating: 5,
    initials: "SD",
  },
  {
    name: "Mohan Singh",
    location: "Ludhiana, Punjab",
    crop: "Rice & Maize",
    text: "The plant disease scanner is a lifesaver. Identified leaf blight on my paddy crop instantly and told me exactly what spray to use.",
    rating: 5,
    initials: "MS",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
      <PublicNavbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-green-950 via-green-800 to-emerald-700">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-600/10 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-medium text-white">AI-Powered Smart Farming Platform</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              >
                Grow Smarter.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-emerald-300">
                  Earn More.
                </span>{" "}
                Farm Confidently.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-green-100 mb-8 leading-relaxed max-w-lg"
              >
                FasalSaathi gives Indian farmers AI-powered crop advice, live weather alerts, real-time mandi prices, and plant disease detection — all in Hindi, Marathi, and English.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="flex flex-col sm:flex-row gap-4 mb-10"
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/app")}
                  className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-green-800 font-semibold rounded-xl shadow-xl hover:shadow-green-300/30 transition-all duration-200"
                >
                  Start for Free
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/features")}
                  className="flex items-center justify-center gap-2 px-7 py-3.5 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
                >
                  See Features
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap items-center gap-4"
              >
                {["Free to Start", "No Credit Card", "Works in Hindi"].map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5 text-sm text-green-200">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    {badge}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Floating cards illustration */}
            <div className="hidden lg:block relative h-[480px]">
              {/* Main card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-400/20 rounded-full flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-green-300" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Crop Recommendation</p>
                    <p className="text-green-200 text-xs">Based on your soil & weather</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {["🌾 Wheat — 94% match", "🌽 Maize — 87% match", "🫘 Soybean — 81% match"].map((item) => (
                    <div key={item} className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
                      <span className="text-white text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Floating weather card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                animate-y={[0, -8, 0]}
                className="absolute top-8 right-0 w-52 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="w-4 h-4 text-blue-300" />
                  <span className="text-white text-xs font-medium">Live Weather</span>
                </div>
                <p className="text-3xl font-bold text-white">29°C</p>
                <p className="text-green-200 text-xs">Partly Cloudy · Itarsi, MP</p>
                <p className="text-yellow-300 text-xs mt-1">⚠️ Rain expected in 48 hrs</p>
              </motion.div>

              {/* Floating market card */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="absolute bottom-8 left-0 w-52 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-300" />
                  <span className="text-white text-xs font-medium">Mandi Prices</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-200">Wheat</span>
                    <span className="text-white font-medium">₹2,340/q</span>
                    <span className="text-green-400">↑ 2.1%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-200">Soybean</span>
                    <span className="text-white font-medium">₹4,120/q</span>
                    <span className="text-red-400">↓ 0.8%</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 69.3C120 58.7 240 37.3 360 32C480 26.7 600 37.3 720 42.7C840 48 960 48 1080 42.7C1200 37.3 1320 26.7 1380 21.3L1440 16V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <FadeUp key={label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl mb-3">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Poppins" }}>{value}</p>
                  <p className="text-sm text-gray-500 mt-1">{label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              Everything You Need
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for the Modern Farmer
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              From soil to sale, FasalSaathi covers every stage of your farming journey with AI-powered tools made for Indian conditions.
            </p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color, border }, i) => (
              <FadeUp key={title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`bg-white p-6 rounded-2xl border ${border} hover:border-transparent transition-all duration-300 cursor-pointer h-full`}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${color} rounded-xl mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>

          <FadeUp className="text-center mt-10">
            <button
              onClick={() => window.location.href = "/features"}
              className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              View all features <ArrowRight className="w-4 h-4" />
            </button>
          </FadeUp>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Get Started in Minutes</h2>
            <p className="text-gray-500 max-w-md mx-auto">No technical knowledge needed. FasalSaathi is designed to be simple for every farmer.</p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-green-200 via-green-400 to-green-200" />

            {steps.map(({ step, title, desc }, i) => (
              <FadeUp key={step} delay={i * 0.15}>
                <div className="text-center relative">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 text-white text-3xl font-bold mb-5 shadow-lg shadow-green-200 mx-auto"
                  >
                    {step}
                  </motion.div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              Real Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Farmers Love FasalSaathi</h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, location, crop, text, rating, initials }, i) => (
              <FadeUp key={name} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 h-full flex flex-col"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-5 italic">"{text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{name}</p>
                      <p className="text-xs text-gray-400">{location} · {crop}</p>
                    </div>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 bg-gradient-to-r from-green-700 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full" />
        </div>
        <FadeUp className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-green-100 mb-8 text-lg">
            Join 50,000+ farmers already using FasalSaathi. Free forever for basic features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.location.href = "/app"}
              className="px-8 py-4 bg-white text-green-700 font-bold rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              Start Free Today →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.location.href = "/pricing"}
              className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl text-lg hover:bg-white/10 transition-all duration-200"
            >
              View Pricing
            </motion.button>
          </div>
        </FadeUp>
      </section>

      <PublicFooter />
    </div>
  );
}
