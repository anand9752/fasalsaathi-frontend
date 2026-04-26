import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageCircle } from "lucide-react";
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

const contactInfo = [
  {
    icon: Mail,
    label: "Email Support",
    value: "support@fasalsaathi.in",
    note: "We reply within 2 business hours",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Phone,
    label: "Toll-Free Helpline",
    value: "+91 1800-XXX-XXXX",
    note: "Monday – Saturday, 8 AM to 8 PM",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: MapPin,
    label: "Office Address",
    value: "FasalSaathi, Itarsi, Madhya Pradesh – 461111",
    note: "Visit by appointment only",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Mon – Sat: 8 AM – 8 PM IST",
    note: "Emergency: 24/7 via email",
    color: "bg-purple-50 text-purple-600",
  },
];

const faqs = [
  { q: "How do I reset my password?", a: "Go to the login page and click 'Forgot Password'. Enter your registered email and we'll send a reset link within a few minutes." },
  { q: "Can I use FasalSaathi in Marathi?", a: "Yes! Switch to Marathi from the language selector in the top navigation bar. All content, alerts, and recommendations will appear in Marathi." },
  { q: "Why are my market prices not updating?", a: "Market data refreshes every 30 minutes. If you see stale data, try pulling down to refresh or check your internet connection." },
  { q: "How do I report a bug or suggest a feature?", a: "Use the contact form on this page or email us at support@fasalsaathi.in. We read every message and respond within 24 hours." },
];

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
      <PublicNavbar />

      {/* Header */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-green-900 to-emerald-700 text-center relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="inline-block bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider border border-white/20">
              Get In Touch
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            We're Here to Help
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-green-100 text-lg leading-relaxed"
          >
            Have questions, feedback, or need support? Reach out and we'll respond in Hindi or English.
          </motion.p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {contactInfo.map(({ icon: Icon, label, value, note, color }, i) => (
            <FadeUp key={label} delay={i * 0.1}>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center justify-center w-11 h-11 ${color} rounded-xl mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                <p className="font-semibold text-gray-900 text-sm mb-1">{value}</p>
                <p className="text-xs text-gray-400">{note}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Form + FAQ split */}
        <div className="grid lg:grid-cols-2 gap-14">
          {/* Contact Form */}
          <FadeUp>
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Send Us a Message</h2>
                  <p className="text-gray-400 text-xs">We reply within 2 hours</p>
                </div>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm">We'll get back to you within 2 business hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Ramesh Kumar"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Email Address</label>
                      <input
                        required
                        type="email"
                        placeholder="farmer@example.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Subject</label>
                    <input
                      required
                      type="text"
                      placeholder="How can we help?"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your question or issue in detail..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-60 transition-all shadow-md"
                  >
                    {submitting ? "Sending…" : (<><Send className="w-4 h-4" /> Send Message</>)}
                  </motion.button>
                </form>
              )}
            </div>
          </FadeUp>

          {/* FAQ */}
          <FadeUp delay={0.1}>
            <div>
              <h2 className="font-bold text-gray-900 text-xl mb-6">Quick Answers</h2>
              <div className="space-y-4">
                {faqs.map(({ q, a }, i) => (
                  <motion.div
                    key={q}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gray-50 rounded-xl p-5 border border-gray-100"
                  >
                    <p className="font-semibold text-gray-900 text-sm mb-2">{q}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
