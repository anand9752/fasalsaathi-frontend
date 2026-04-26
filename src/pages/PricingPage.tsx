import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { CheckCircle, X, Zap, Star } from "lucide-react";
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

const plans = [
  {
    name: "Kisan Basic",
    nameHindi: "(किसान बेसिक)",
    price: "₹0",
    period: "Forever Free",
    description: "Perfect for small farmers getting started with digital farming.",
    color: "border-gray-200",
    badge: null,
    badgeColor: "",
    ctaText: "Get Started Free",
    ctaStyle: "border border-green-600 text-green-600 hover:bg-green-50",
    features: [
      { label: "Real-time weather (current)", included: true },
      { label: "3-day weather forecast", included: true },
      { label: "Market prices (5 crops)", included: true },
      { label: "Basic crop recommendations", included: true },
      { label: "1 farm profile", included: true },
      { label: "Hindi & English language", included: true },
      { label: "Plant disease detection", included: false },
      { label: "10-day forecast", included: false },
      { label: "Unlimited market tracking", included: false },
      { label: "Yield prediction", included: false },
      { label: "Priority support", included: false },
    ],
  },
  {
    name: "Kisan Pro",
    nameHindi: "(किसान प्रो)",
    price: "₹99",
    period: "per month",
    description: "For serious farmers who want the full power of AI-driven farming.",
    color: "border-green-500 ring-2 ring-green-500",
    badge: "Most Popular",
    badgeColor: "bg-green-600 text-white",
    ctaText: "Start Pro — ₹99/mo",
    ctaStyle: "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200",
    features: [
      { label: "Real-time weather (current)", included: true },
      { label: "10-day detailed forecast", included: true },
      { label: "Unlimited market price tracking", included: true },
      { label: "AI crop recommendations", included: true },
      { label: "Up to 5 farm profiles", included: true },
      { label: "Hindi, Marathi & English", included: true },
      { label: "Plant disease detection (unlimited)", included: true },
      { label: "Price alerts & notifications", included: true },
      { label: "Yield prediction & analytics", included: true },
      { label: "Farm expense tracker", included: true },
      { label: "Priority email support", included: true },
    ],
  },
  {
    name: "Kisan Enterprise",
    nameHindi: "(किसान एंटरप्राइज)",
    price: "Custom",
    period: "contact us",
    description: "Tailored for FPOs, cooperatives, and agricultural NGOs.",
    color: "border-gray-200",
    badge: null,
    badgeColor: "",
    ctaText: "Contact Sales",
    ctaStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Unlimited farm profiles", included: true },
      { label: "Multi-user access", included: true },
      { label: "Custom crop database", included: true },
      { label: "API integration support", included: true },
      { label: "Custom reporting & exports", included: true },
      { label: "White-label option", included: true },
      { label: "Dedicated account manager", included: true },
      { label: "On-site training", included: true },
      { label: "SLA guarantee (99.9%)", included: true },
      { label: "Phone support (24/7)", included: true },
    ],
  },
];

const faqs = [
  {
    q: "Is the free plan really free forever?",
    a: "Yes! The Kisan Basic plan is completely free with no time limit. You get real-time weather, 3-day forecasts, and market prices for 5 crops at no cost.",
  },
  {
    q: "Can I switch plans anytime?",
    a: "Absolutely. You can upgrade to Pro or downgrade to Basic at any time. Downgrades take effect at the end of the billing cycle.",
  },
  {
    q: "Is my payment information secure?",
    a: "All payments are processed via Razorpay, a PCI-DSS compliant payment gateway. We never store your card details.",
  },
  {
    q: "Do you offer discounts for farmer groups?",
    a: "Yes! FPOs and cooperatives with 10+ members get special group pricing. Contact us for a custom quote.",
  },
];

export function PricingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
      <PublicNavbar />

      {/* Header */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-green-900 to-emerald-700 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="inline-block bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider border border-white/20">
              Simple Pricing
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Plans for Every Farm
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-green-100 text-lg leading-relaxed"
          >
            Start free. Upgrade when you're ready. No hidden fees.
          </motion.p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {plans.map(({ name, nameHindi, price, period, description, color, badge, badgeColor, ctaText, ctaStyle, features }, i) => (
              <FadeUp key={name} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`relative bg-white rounded-2xl border-2 ${color} p-7 shadow-sm`}
                >
                  {badge && (
                    <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 ${badgeColor} text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1`}>
                      <Star className="w-3 h-3" />
                      {badge}
                    </div>
                  )}
                  <div className="mb-5">
                    <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
                    <p className="text-gray-400 text-xs">{nameHindi}</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{price}</span>
                    <span className="text-gray-400 text-sm ml-1">/{period}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">{description}</p>

                  <motion.a
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    href="/app"
                    className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${ctaStyle} mb-7`}
                  >
                    {ctaText}
                  </motion.a>

                  <ul className="space-y-2.5">
                    {features.map(({ label, included }) => (
                      <li key={label} className="flex items-start gap-2.5 text-sm">
                        {included ? (
                          <CheckCircle className="w-4.5 h-4.5 text-green-500 shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4.5 h-4.5 text-gray-300 shrink-0 mt-0.5" />
                        )}
                        <span className={included ? "text-gray-700" : "text-gray-300"}>{label}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee strip */}
      <section className="py-10 bg-green-50 border-y border-green-100">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-center">
          {[
            { icon: "🔒", text: "Secure Payments via Razorpay" },
            { icon: "🔄", text: "Cancel Anytime, No Questions" },
            { icon: "💚", text: "30-Day Money-Back Guarantee" },
            { icon: "📞", text: "Friendly Support in Hindi & English" },
          ].map(({ icon, text }) => (
            <FadeUp key={text}>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span className="text-2xl">{icon}</span>
                {text}
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-3xl mx-auto px-4">
        <FadeUp className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-500">Can't find your answer? <a href="/contact" className="text-green-600 hover:underline">Contact us</a></p>
        </FadeUp>
        <div className="space-y-4">
          {faqs.map(({ q, a }, i) => (
            <FadeUp key={q} delay={i * 0.08}>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1.5">{q}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
