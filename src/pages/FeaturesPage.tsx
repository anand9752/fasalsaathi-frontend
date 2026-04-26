import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Cloud, TrendingUp, Leaf, Shield, BarChart3, Smartphone,
  CheckCircle, Zap, Globe, Bell, Database, Lock,
} from "lucide-react";
import { PublicNavbar } from "../components/public/PublicNavbar";
import { PublicFooter } from "../components/public/PublicFooter";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

const featureSections = [
  {
    icon: Cloud,
    color: "blue",
    title: "Live Weather Intelligence",
    subtitle: "Always know what's coming",
    description:
      "Our hyperlocal weather system pulls real-time data from OpenWeatherMap and cross-references it with your GPS location. You get forecasts accurate to your field, not just your district.",
    bullets: [
      "Hourly and 10-day forecasts",
      "Rainfall probability alerts via push notification",
      "Wind speed and humidity for spray-timing decisions",
      "Frost warnings for horticulture crops",
    ],
    bgGradient: "from-blue-50 to-cyan-50",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    icon: TrendingUp,
    color: "orange",
    title: "Real-Time Mandi Prices",
    subtitle: "Sell at the right moment",
    description:
      "Track live prices for 200+ crops across 18 states. Set price alerts, compare mandis, and visualise historical trends so you never sell at a loss again.",
    bullets: [
      "Live prices refreshed every 30 minutes",
      "Price trend charts (7d / 30d / 90d)",
      "Custom price alert notifications",
      "Compare prices across nearby mandis",
    ],
    bgGradient: "from-orange-50 to-amber-50",
    iconBg: "bg-orange-100 text-orange-600",
  },
  {
    icon: Leaf,
    color: "green",
    title: "AI Crop Recommendations",
    subtitle: "Science-backed crop planning",
    description:
      "Our machine learning model analyses your soil type, local weather patterns, water availability, and historical yield data to suggest the most profitable and suitable crops for your land.",
    bullets: [
      "Top 3 recommended crops with confidence scores",
      "Seasonal planting calendars",
      "Variety selection guidance",
      "Expected yield & ROI estimates",
    ],
    bgGradient: "from-green-50 to-emerald-50",
    iconBg: "bg-green-100 text-green-600",
  },
  {
    icon: Shield,
    color: "red",
    title: "Plant Disease Detection",
    subtitle: "Diagnose instantly, act fast",
    description:
      "Upload a photo of any affected leaf, stem, or fruit. Our computer vision model identifies 50+ diseases in seconds and prescribes an exact treatment plan including approved pesticides and organic alternatives.",
    bullets: [
      "Identifies 50+ crop diseases",
      "Organic and chemical treatment options",
      "Dosage and application instructions",
      "Disease severity assessment",
    ],
    bgGradient: "from-red-50 to-rose-50",
    iconBg: "bg-red-100 text-red-600",
  },
  {
    icon: BarChart3,
    color: "purple",
    title: "Yield Prediction & Analytics",
    subtitle: "Plan your season in advance",
    description:
      "Using satellite imagery, local weather history, and soil data, our model predicts your harvest quantity months before it happens. Better planning means better logistics, storage, and profit.",
    bullets: [
      "Accuracy within ±8% of actual yield",
      "Season-over-season farm analytics",
      "Expense and income tracking",
      "Exportable reports for bank loans",
    ],
    bgGradient: "from-purple-50 to-violet-50",
    iconBg: "bg-purple-100 text-purple-600",
  },
  {
    icon: Smartphone,
    color: "teal",
    title: "Multilingual & Offline Ready",
    subtitle: "Works anywhere, in your language",
    description:
      "FasalSaathi works fully in Hindi, Marathi, and English. Key data is cached locally so you get guidance even without internet — critical in rural areas with patchy connectivity.",
    bullets: [
      "Full support for Hindi, Marathi, English",
      "Offline mode caches last 7 days of data",
      "Voice-friendly interface",
      "Low-bandwidth mode for 2G networks",
    ],
    bgGradient: "from-teal-50 to-cyan-50",
    iconBg: "bg-teal-100 text-teal-600",
  },
];

const additionalFeatures = [
  { icon: Bell, label: "Smart Alerts" },
  { icon: Database, label: "Farm Records" },
  { icon: Globe, label: "18 State Coverage" },
  { icon: Lock, label: "Secure & Private" },
  { icon: Zap, label: "Instant Insights" },
  { icon: CheckCircle, label: "Verified Data" },
];

export function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
      <PublicNavbar />

      {/* Header */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-green-900 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="inline-block bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider border border-white/20">
              Platform Features
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Everything a Farmer Needs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-green-100 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Six powerful platforms in one app — built specifically for the challenges Indian farmers face every day.
          </motion.p>
        </div>
      </section>

      {/* Feature sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        {featureSections.map(({ icon: Icon, title, subtitle, description, bullets, bgGradient, iconBg }, i) => (
          <FadeUp key={title} delay={0.1}>
            <div className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
              {/* Text */}
              <div>
                <div className={`inline-flex items-center justify-center w-14 h-14 ${iconBg} rounded-2xl mb-4`}>
                  <Icon className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-1">{subtitle}</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{title}</h2>
                <p className="text-gray-500 leading-relaxed mb-6">{description}</p>
                <ul className="space-y-2.5">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Visual */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`bg-gradient-to-br ${bgGradient} rounded-3xl p-10 flex items-center justify-center min-h-[280px] border border-gray-100`}
              >
                <Icon className="w-28 h-28 text-gray-200" strokeWidth={0.8} />
              </motion.div>
            </div>
          </FadeUp>
        ))}
      </div>

      {/* Additional features pills */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <FadeUp className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">…and Much More</h2>
          </FadeUp>
          <div className="flex flex-wrap justify-center gap-4">
            {additionalFeatures.map(({ icon: Icon, label }) => (
              <FadeUp key={label}>
                <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-full px-5 py-2.5 shadow-sm">
                  <Icon className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-700 text-center">
        <FadeUp>
          <h2 className="text-3xl font-bold text-white mb-4">Experience All Features for Free</h2>
          <p className="text-green-100 mb-6">No credit card needed. Get started in 2 minutes.</p>
          <motion.a
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            href="/app"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-green-700 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all"
          >
            Start Free Today →
          </motion.a>
        </FadeUp>
      </section>

      <PublicFooter />
    </div>
  );
}
