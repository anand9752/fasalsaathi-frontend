import { motion } from "motion/react";
import { Lock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNavbar } from "../components/public/PublicNavbar";
import { PublicFooter } from "../components/public/PublicFooter";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect the following types of information when you use FasalSaathi:

Account Information: Name, email address, phone number, and password (stored as a secure hash).

Farm Data: Farm location, size, soil type, crop history, and seasonal records you provide.

Usage Data: Pages visited, features used, time spent on the app, and error logs for improving the service.

Device Information: Device type, operating system, browser type, and IP address (for security and localised content).

Location Data: Your GPS coordinates or manually entered village/tehsil for weather and market localisation. We never track your real-time movements.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use your information to:
- Provide personalised weather forecasts, crop recommendations, and market prices
- Improve AI models for crop disease detection and yield prediction
- Send service alerts, price notifications, and important updates
- Ensure platform security and prevent fraudulent activity
- Comply with applicable Indian laws and regulations
- Conduct anonymised research to improve agricultural outcomes for Indian farmers

We do NOT use your data for advertising targeting or sell it to third-party marketers.`,
  },
  {
    title: "3. Data Sharing",
    content: `We share your information only in the following limited circumstances:

Service Providers: Third-party vendors who help us operate the Platform (e.g., OpenWeatherMap for weather data, cloud hosting providers). These vendors are contractually bound to protect your data.

Legal Requirements: When required by Indian law, court order, or government authority.

Business Transfers: If FasalSaathi is acquired or merges with another entity, user data may be transferred. We will notify you of such events.

Aggregated Data: We may share anonymised, aggregated statistics (e.g., "60% of farmers in MP grow wheat") that cannot identify any individual.

We never sell your personal data to data brokers or advertisers.`,
  },
  {
    title: "4. Data Security",
    content: `We implement industry-standard technical and organisational measures to protect your data:
- All data transmitted between your device and our servers is encrypted using TLS 1.3
- Passwords are hashed using bcrypt (never stored in plain text)
- Farm data is stored on AWS servers located in India (Asia-Pacific region)
- Access to your data is limited to authorised FasalSaathi personnel on a need-to-know basis
- We conduct regular security audits and vulnerability assessments

Despite these measures, no system is 100% secure. If you suspect your account has been compromised, change your password immediately and contact support.`,
  },
  {
    title: "5. Data Retention",
    content: `We retain your personal data for as long as your account is active or as needed to provide services. Specifically:

Account data is retained for 3 years after your last login.

Farm records and crop history are retained for 5 seasons by default. You can delete individual records anytime.

Weather and market data is anonymised after 90 days.

If you delete your account, all personal data is permanently erased within 30 days, except for records required by law.`,
  },
  {
    title: "6. Your Rights",
    content: `Under applicable Indian data protection law, you have the right to:

Access: Request a copy of all personal data we hold about you.

Correction: Request correction of inaccurate or incomplete data.

Deletion: Request erasure of your personal data ("right to be forgotten").

Portability: Request your farm data in a machine-readable format (CSV/JSON).

Objection: Object to processing of your data for purposes you haven't consented to.

To exercise any of these rights, email us at privacy@fasalsaathi.in with the subject "Data Rights Request".`,
  },
  {
    title: "7. Cookies",
    content: `FasalSaathi uses the following types of cookies:

Essential Cookies: Required for login sessions and platform security. Cannot be disabled.

Preference Cookies: Remember your language preference and dashboard settings.

Analytics Cookies: Anonymised usage data to improve the platform (can be opted out in Settings).

We do not use advertising or tracking cookies.`,
  },
  {
    title: "8. Children's Privacy",
    content: `FasalSaathi is designed for adults (18+). We do not knowingly collect personal information from children under 18. If we discover that a child under 18 has provided personal data, we will delete it immediately. If you are a parent or guardian who believes your child has provided data, contact us at privacy@fasalsaathi.in.`,
  },
  {
    title: "9. Third-Party Links",
    content: `The Platform may contain links to external websites (e.g., government agriculture portals, KVK websites). We are not responsible for the privacy practices of those external sites. We encourage you to read the privacy policy of every website you visit.`,
  },
  {
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of material changes via email or in-app notification at least 14 days before changes take effect. The date of the most recent revision is displayed at the top of this page. Your continued use of the Platform after changes constitutes acceptance.`,
  },
  {
    title: "11. Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy, contact our Data Protection Officer:

Email: privacy@fasalsaathi.in
Address: FasalSaathi, Data Privacy Team, Itarsi, Madhya Pradesh – 461111, India
Response Time: We respond to all privacy enquiries within 72 hours.`,
  },
];

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
      <PublicNavbar />

      {/* Header */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-gray-900 to-gray-700 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-gray-300 text-sm">Last updated: April 2025 · We take your privacy seriously</p>
        </motion.div>
      </section>

      {/* TL;DR summary */}
      <div className="max-w-4xl mx-auto px-4 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-10"
        >
          <h2 className="font-bold text-green-800 mb-3">🌿 The Short Version</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-green-700">
            <div className="flex items-start gap-2"><span className="text-xl">🔒</span><span>Your farm data belongs to you. We never sell it.</span></div>
            <div className="flex items-start gap-2"><span className="text-xl">🚫</span><span>Zero advertising or tracking cookies on FasalSaathi.</span></div>
            <div className="flex items-start gap-2"><span className="text-xl">🇮🇳</span><span>All data stored on servers in India (AWS Asia-Pacific).</span></div>
          </div>
        </motion.div>

        {/* TOC */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-12"
        >
          <h2 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wider">Table of Contents</h2>
          <div className="grid sm:grid-cols-2 gap-1.5">
            {sections.map(({ title }) => (
              <div key={title} className="flex items-start gap-1.5 text-sm text-gray-600 hover:text-green-600 cursor-pointer transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                {title}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-10 pb-16">
          {sections.map(({ title, content }, i) => (
            <motion.section
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 * (i % 6) }}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
              <div className="text-gray-600 text-sm leading-7 whitespace-pre-line">{content}</div>
            </motion.section>
          ))}
        </div>

        {/* Footer links */}
        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm pb-12">
          <p className="text-gray-400">© {new Date().getFullYear()} FasalSaathi. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/terms" className="text-green-600 hover:underline">Terms & Conditions</Link>
            <Link to="/contact" className="text-green-600 hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
