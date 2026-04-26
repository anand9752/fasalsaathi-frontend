import { motion } from "motion/react";
import { FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNavbar } from "../components/public/PublicNavbar";
import { PublicFooter } from "../components/public/PublicFooter";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using FasalSaathi ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to all terms herein, you may not access or use the Platform. These terms apply to all visitors, users, and farmers who access or use the Platform.`,
  },
  {
    title: "2. Description of Service",
    content: `FasalSaathi is an AI-powered agricultural advisory platform that provides farmers with weather forecasts, market prices, crop recommendations, plant disease detection, and yield predictions. The Platform is designed to assist — not replace — professional agricultural advice from qualified agronomists or government agricultural officers.`,
  },
  {
    title: "3. User Accounts",
    content: `You must register an account to access full Platform features. You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information during registration. You must be at least 18 years of age to create an account. FasalSaathi reserves the right to terminate accounts that violate these terms.`,
  },
  {
    title: "4. Acceptable Use",
    content: `You agree not to: (a) use the Platform for any unlawful purpose or in violation of any regulations; (b) impersonate any person or entity; (c) upload false or misleading information; (d) attempt to gain unauthorised access to any part of the Platform; (e) scrape or harvest data from the Platform; (f) use the Platform to transmit spam, malware, or harmful content.`,
  },
  {
    title: "5. Accuracy of Information",
    content: `While FasalSaathi strives to provide accurate weather, market, and crop information, all data is provided "as is" without warranty of any kind. Weather forecasts are probabilistic and may not accurately reflect actual conditions. Market prices are indicative and may differ from actual mandi prices. Crop recommendations are AI-generated suggestions and should be verified with local agricultural experts before acting upon them.`,
  },
  {
    title: "6. Limitation of Liability",
    content: `FasalSaathi and its operators shall not be liable for any losses or damages arising from: (a) reliance on weather forecasts, market data, or crop recommendations; (b) crop failure, financial loss, or yield shortfall; (c) interruption or unavailability of the Platform services; (d) any decisions made based on Platform data without consulting a qualified agricultural officer. Users accept full responsibility for all farming decisions made using Platform data.`,
  },
  {
    title: "7. Intellectual Property",
    content: `All content, algorithms, designs, logos, and text on the Platform are the exclusive property of FasalSaathi. You may not copy, reproduce, distribute, or create derivative works from any Platform content without written permission. The FasalSaathi name and logo are trademarks and may not be used without express written consent.`,
  },
  {
    title: "8. Privacy",
    content: `Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices regarding the collection, use, and disclosure of your personal information.`,
  },
  {
    title: "9. Subscription & Payments",
    content: `Paid features (Kisan Pro) are billed monthly or annually as selected. Subscriptions automatically renew unless cancelled before the renewal date. No refunds are issued for partial months, except as required under applicable Indian consumer protection law. We reserve a 30-day money-back guarantee for first-time Pro subscribers.`,
  },
  {
    title: "10. Modifications to Terms",
    content: `FasalSaathi reserves the right to modify these Terms at any time. We will notify registered users of material changes via email or in-app notification at least 14 days before changes take effect. Continued use of the Platform after changes take effect constitutes acceptance of the revised Terms.`,
  },
  {
    title: "11. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from or relating to these Terms or use of the Platform shall be subject to the exclusive jurisdiction of the courts of Madhya Pradesh, India.`,
  },
  {
    title: "12. Contact",
    content: `If you have any questions about these Terms and Conditions, please contact us at: legal@fasalsaathi.in or write to FasalSaathi, Itarsi, Madhya Pradesh – 461111, India.`,
  },
];

export function TermsPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
      <PublicNavbar />

      {/* Header */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-gray-900 to-gray-700 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Terms & Conditions</h1>
          <p className="text-gray-300 text-sm">Last updated: April 2025 · Effective immediately</p>
        </motion.div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* TOC */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-12"
        >
          <h2 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wider">Table of Contents</h2>
          <div className="grid sm:grid-cols-2 gap-1.5">
            {sections.map(({ title }) => (
              <div key={title} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-green-600 cursor-pointer transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-green-500 shrink-0" />
                {title}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sections */}
        <div className="prose prose-gray max-w-none space-y-8">
          {sections.map(({ title, content }, i) => (
            <motion.section
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * (i % 5) }}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
              <p className="text-gray-600 text-sm leading-7">{content}</p>
            </motion.section>
          ))}
        </div>

        {/* Footer links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
        >
          <p className="text-gray-400">© {new Date().getFullYear()} FasalSaathi. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
            <Link to="/contact" className="text-green-600 hover:underline">Contact Us</Link>
          </div>
        </motion.div>
      </div>

      <PublicFooter />
    </div>
  );
}
