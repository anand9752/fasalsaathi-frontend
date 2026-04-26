import { Link } from "react-router-dom";
import { Leaf, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const productLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: "/app" },
  { label: "AI Assistant", href: "/app" },
];

const resourceLinks = [
  { label: "Guidelines", href: "/guidelines" },
  { label: "Blog", href: "/contact" },
  { label: "API Docs", href: "/contact" },
  { label: "Support", href: "/contact" },
];

const companyLinks = [
  { label: "About Us", href: "/contact" },
  { label: "Contact", href: "/contact" },
  { label: "Careers", href: "/contact" },
];

const legalLinks = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/privacy" },
];

export function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span
                className="text-xl font-bold text-white"
                style={{ fontFamily: "Poppins" }}
              >
                FasalSaathi
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Your AI-powered farming companion. Real-time weather, market prices, crop recommendations, and expert guidance — all in one place.
            </p>

            {/* Contact info */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-green-500 shrink-0" />
                support@fasalsaathi.in
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-green-500 shrink-0" />
                +91 1800-XXX-XXXX (Toll Free)
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-green-500 shrink-0" />
                Itarsi, Madhya Pradesh, India
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {[
                { Icon: Twitter, label: "Twitter" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { title: "Product", links: productLinks },
            { title: "Resources", links: resourceLinks },
            { title: "Company", links: companyLinks },
            { title: "Legal", links: legalLinks },
          ].map(({ title, links }) => (
            <div key={title}>
              <h3
                className="text-white font-semibold text-sm mb-4 uppercase tracking-wider"
                style={{ fontFamily: "Poppins" }}
              >
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} FasalSaathi. All rights reserved. Made with ❤️ for Indian farmers.
          </p>
          <div className="flex gap-4">
            <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Privacy
            </Link>
            <Link to="/contact" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
