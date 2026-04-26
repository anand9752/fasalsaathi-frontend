import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { BookOpen, CheckCircle, AlertTriangle, Info, Shield, Leaf, Cloud, TrendingUp } from "lucide-react";
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

const guidelines = [
  {
    icon: Leaf,
    title: "Setting Up Your Farm",
    color: "bg-green-50 text-green-600",
    steps: [
      "Create your account with your email and a secure password (minimum 6 characters).",
      "Select your preferred language — Hindi, Marathi, or English.",
      "Add your farm's name, location (tehsil or village), size in acres, and soil type.",
      "Select your primary crop from the dropdown. You can manage multiple crops later.",
      "Your dashboard is now personalised to your location, soil, and crop.",
    ],
  },
  {
    icon: Cloud,
    title: "Using Weather Forecasts",
    color: "bg-blue-50 text-blue-600",
    steps: [
      "The Weather section shows current conditions and a 10-day forecast for your farm location.",
      "Green indicators mean favourable conditions for your crop; yellow/red means caution.",
      "Rainfall alerts are sent as notifications — enable them in your browser settings.",
      "Check wind speed before applying pesticides or fertilisers (recommended: below 15 km/h).",
      "Use the humidity reading to gauge disease risk — high humidity favours fungal diseases.",
    ],
  },
  {
    icon: TrendingUp,
    title: "Reading Market Prices",
    color: "bg-orange-50 text-orange-600",
    steps: [
      "Navigate to 'Market Prices' from the sidebar or bottom navigation.",
      "By default, it shows nearby mandis based on your registered location.",
      "Use the trend chart to see if prices are rising or falling over the last 30 days.",
      "Set a price alert: tap the bell icon next to any crop to get notified when it hits your target price.",
      "Compare multiple mandis by using the 'Select Mandi' filter at the top.",
    ],
  },
  {
    icon: Shield,
    title: "Plant Disease Detection",
    color: "bg-red-50 text-red-600",
    steps: [
      "Go to 'Plant Analysis' from the navigation menu.",
      "Take a clear photo of the affected leaf, stem, or fruit in natural daylight.",
      "Upload the photo — the AI analyses it within 5–10 seconds.",
      "Read the diagnosis carefully. It will name the disease and its cause (fungal, bacterial, pest).",
      "Follow the treatment plan. Always follow the recommended dosage on pesticide labels.",
      "If symptoms persist after 5 days, consult your local KVK (Krishi Vigyan Kendra).",
    ],
  },
  {
    icon: BookOpen,
    title: "Data Privacy & Account Safety",
    color: "bg-purple-50 text-purple-600",
    steps: [
      "Never share your FasalSaathi password with anyone, including our support staff.",
      "Your farm data is private and is never sold to third parties.",
      "Log out of shared devices after use (Settings → Log Out).",
      "If you suspect unauthorised access, change your password immediately.",
      "Enable two-factor authentication once available (coming soon).",
    ],
  },
];

const tips = [
  { icon: "🌱", text: "Update your crop calendar at the start of each season for the most accurate recommendations." },
  { icon: "📍", text: "Your location determines your weather data. Make sure it's set to your actual village, not the nearest city." },
  { icon: "📸", text: "For best disease detection results, photograph only the affected part and keep the background plain." },
  { icon: "🔔", text: "Enable browser notifications so you don't miss critical weather alerts or price spikes." },
  { icon: "💾", text: "FasalSaathi caches 7 days of data locally — you can view recent weather and prices even without internet." },
  { icon: "🤝", text: "Share your experience with other farmers in your village — growing together makes everyone stronger." },
];

export function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
      <PublicNavbar />

      {/* Header */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-green-900 to-emerald-700 text-center relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider border border-white/20">
              User Guidelines
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            How to Use FasalSaathi
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="text-green-100 text-lg leading-relaxed"
          >
            Step-by-step guidance to get the most out of every feature. Available in Hindi on your dashboard.
          </motion.p>
        </div>
      </section>

      {/* Important notice */}
      <div className="max-w-4xl mx-auto px-4 pt-10">
        <FadeUp>
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 text-sm mb-1">Important Disclaimer</p>
              <p className="text-amber-700 text-sm leading-relaxed">
                FasalSaathi provides AI-powered guidance based on data. Always verify critical decisions (pesticide selection, major crop changes) with your local agricultural officer or KVK. We are a decision-support tool, not a replacement for expert agronomic advice.
              </p>
            </div>
          </div>
        </FadeUp>
      </div>

      {/* Guidelines sections */}
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        {guidelines.map(({ icon: Icon, title, color, steps }, i) => (
          <FadeUp key={title} delay={0.1}>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 bg-gray-50">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-gray-900">{title}</h2>
              </div>
              <ol className="p-6 space-y-3">
                {steps.map((step, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: j * 0.07 }}
                    className="flex items-start gap-3 text-sm text-gray-700"
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-700 rounded-full text-xs font-bold shrink-0 mt-0.5">
                      {j + 1}
                    </span>
                    {step}
                  </motion.li>
                ))}
              </ol>
            </div>
          </FadeUp>
        ))}
      </div>

      {/* Tips section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-4xl mx-auto px-4">
          <FadeUp className="flex items-center gap-3 mb-8">
            <Info className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Pro Tips</h2>
          </FadeUp>
          <div className="grid sm:grid-cols-2 gap-4">
            {tips.map(({ icon, text }, i) => (
              <FadeUp key={text} delay={i * 0.08}>
                <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-green-100">
                  <span className="text-2xl shrink-0">{icon}</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Help CTA */}
      <section className="py-12 text-center bg-white border-t border-gray-100">
        <FadeUp>
          <div className="flex items-center justify-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-gray-700 font-medium">Still have questions?</p>
          </div>
          <p className="text-gray-400 text-sm mb-5">Our support team replies in Hindi and English within 2 hours.</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-md"
          >
            Contact Support →
          </a>
        </FadeUp>
      </section>

      <PublicFooter />
    </div>
  );
}
