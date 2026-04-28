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
    <>
      {/* Self-contained CSS Variables & Styling */}
      <style>{`
        .fs-footer {
          /* Custom Variables mapped to Deep Emerald Theme */
          --ft-bg: #022c22; 
          --ft-text-main: #e2e8f0;
          --ft-text-muted: #94a3b8;
          --ft-text-light: #ffffff;
          --ft-text-darker: #64748b;
          --ft-primary: #34d399; 
          --ft-primary-hover: #6ee7b7;
          --ft-border: rgba(255, 255, 255, 0.1);
          --ft-social-bg: rgba(255, 255, 255, 0.05);
          --ft-font-body: 'Inter', system-ui, sans-serif;
          --ft-font-display: 'Poppins', system-ui, sans-serif;

          background-color: var(--ft-bg);
          color: var(--ft-text-main);
          font-family: var(--ft-font-body);
          position: relative;
          overflow: hidden;
        }

        .fs-ft-noise {
          position: absolute; inset: 0;
          background-image: url('https://grainy-gradients.vercel.app/noise.svg');
          opacity: 0.2; mix-blend-mode: overlay;
          pointer-events: none; z-index: 0;
        }

        .fs-ft-container {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1rem;
          position: relative;
          z-index: 10;
        }
        @media (min-width: 640px) { .fs-ft-container { padding: 0 1.5rem; } }
        @media (min-width: 1024px) { .fs-ft-container { padding: 0 2rem; } }

        /* Top Grid Section - UPDATED FOR MOBILE COMPRESSION */
        .fs-ft-grid {
          padding: 3rem 0; /* Tighter padding on mobile */
          display: grid;
          grid-template-columns: repeat(2, 1fr); /* 2 columns on mobile */
          gap: 2.5rem 1.5rem; /* Row gap, Column gap */
        }
        .fs-ft-brand-col {
          grid-column: span 2; /* Brand takes full width on mobile */
        }

        @media (min-width: 768px) {
          .fs-ft-grid { 
            grid-template-columns: repeat(4, 1fr); 
            gap: 3rem 2rem;
          }
          .fs-ft-brand-col { 
            grid-column: span 4; /* Brand full width, links 4 columns below */
          }
        }
        @media (min-width: 1024px) {
          .fs-ft-grid { 
            padding: 4rem 0; /* Restore spacious padding for desktop */
            grid-template-columns: repeat(6, 1fr); 
            gap: 3rem;
          }
          .fs-ft-brand-col { 
            grid-column: span 2; /* Desktop: Brand takes 2 cols, links take 1 col each */
          }
        }

        /* Brand Column */
        .fs-ft-logo {
          display: flex; align-items: center; gap: 0.5rem;
          text-decoration: none; outline: none; margin-bottom: 1rem;
        }
        .fs-ft-logo-icon {
          width: 2.25rem; height: 2.25rem;
          background-color: var(--ft-primary);
          border-radius: 0.75rem;
          display: flex; align-items: center; justify-content: center;
        }
        .fs-ft-logo-text {
          font-family: var(--ft-font-display);
          font-size: 1.25rem; font-weight: 700;
          color: var(--ft-text-light);
        }
        .fs-ft-desc {
          font-size: 0.875rem; line-height: 1.625;
          color: var(--ft-text-muted);
          max-width: 24rem; margin-bottom: 1.5rem;
        }

        /* Contact Info */
        .fs-ft-contact-list {
          display: flex; flex-direction: column; gap: 0.5rem; /* Tighter gap */
        }
        .fs-ft-contact-item {
          display: flex; align-items: center; gap: 0.625rem;
          font-size: 0.875rem; color: var(--ft-text-muted);
        }
        .fs-ft-contact-icon {
          color: var(--ft-primary);
          flex-shrink: 0;
        }

        /* Social Links */
        .fs-ft-socials {
          display: flex; gap: 0.5rem; margin-top: 1.5rem;
        }
        .fs-ft-social-link {
          width: 2.25rem; height: 2.25rem;
          background-color: var(--ft-social-bg);
          border-radius: 0.5rem;
          display: flex; align-items: center; justify-content: center;
          color: var(--ft-text-muted); border: 1px solid var(--ft-border);
          text-decoration: none; transition: all 0.2s ease;
        }
        .fs-ft-social-link:hover {
          background-color: var(--ft-primary);
          color: #022c22;
          border-color: var(--ft-primary);
        }

        /* Link Columns */
        .fs-ft-col-title {
          font-family: var(--ft-font-display);
          font-size: 0.875rem; font-weight: 600;
          color: var(--ft-text-light);
          text-transform: uppercase; letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        .fs-ft-links {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 0.625rem;
        }
        .fs-ft-link {
          font-size: 0.875rem; color: var(--ft-text-muted);
          text-decoration: none; transition: color 0.2s ease;
        }
        .fs-ft-link:hover {
          color: var(--ft-primary-hover);
        }

        /* Bottom Bar */
        .fs-ft-bottom {
          border-top: 1px solid var(--ft-border);
          position: relative; z-index: 10;
          background-color: rgba(0, 0, 0, 0.2);
        }
        .fs-ft-bottom-inner {
          padding: 1.25rem 0;
          display: flex; flex-direction: column; gap: 0.75rem;
          align-items: center; justify-content: space-between;
        }
        @media (min-width: 640px) {
          .fs-ft-bottom-inner { flex-direction: row; }
        }
        .fs-ft-copyright {
          font-size: 0.75rem; color: var(--ft-text-darker);
          margin: 0; text-align: center;
        }
        .fs-ft-legal {
          display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
        }
        .fs-ft-legal-link {
          font-size: 0.75rem; color: var(--ft-text-darker);
          text-decoration: none; transition: color 0.2s ease;
        }
        .fs-ft-legal-link:hover {
          color: var(--ft-text-main);
        }
      `}</style>

      <footer className="fs-footer">
        <div className="fs-ft-noise" />
        
        {/* Top section */}
        <div className="fs-ft-container">
          <div className="fs-ft-grid">
            {/* Brand column */}
            <div className="fs-ft-brand-col">
              <Link to="/" className="fs-ft-logo">
                <div className="fs-ft-logo-icon">
                  <Leaf size={20} color="#022c22" />
                </div>
                <span className="fs-ft-logo-text">FasalSaathi</span>
              </Link>
              <p className="fs-ft-desc">
                Your AI-powered farming companion. Real-time weather, market prices, crop recommendations, and expert guidance — all in one place.
              </p>

              {/* Contact info */}
              <div className="fs-ft-contact-list">
                <div className="fs-ft-contact-item">
                  <Mail size={16} className="fs-ft-contact-icon" />
                  support@fasalsaathi.in
                </div>
                <div className="fs-ft-contact-item">
                  <Phone size={16} className="fs-ft-contact-icon" />
                  +91 1800-XXX-XXXX (Toll Free)
                </div>
                <div className="fs-ft-contact-item">
                  <MapPin size={16} className="fs-ft-contact-icon" />
                  Itarsi, Madhya Pradesh, India
                </div>
              </div>

              {/* Social links */}
              <div className="fs-ft-socials">
                {[
                  { Icon: Twitter, label: "Twitter" },
                  { Icon: Instagram, label: "Instagram" },
                  { Icon: Youtube, label: "YouTube" },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="fs-ft-social-link"
                  >
                    <Icon size={16} />
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
                <h3 className="fs-ft-col-title">{title}</h3>
                <ul className="fs-ft-links">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link to={href} className="fs-ft-link">
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
        <div className="fs-ft-bottom">
          <div className="fs-ft-container fs-ft-bottom-inner">
            <p className="fs-ft-copyright">
              © {new Date().getFullYear()} FasalSaathi. All rights reserved. Made with ❤️ for Indian farmers.
            </p>
            <div className="fs-ft-legal">
              <Link to="/terms" className="fs-ft-legal-link">Terms</Link>
              <Link to="/privacy" className="fs-ft-legal-link">Privacy</Link>
              <Link to="/contact" className="fs-ft-legal-link">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}