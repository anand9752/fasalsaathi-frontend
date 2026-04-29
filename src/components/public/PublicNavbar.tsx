import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, Menu, X, ChevronDown, Languages } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage"; // Adjust import path as needed

// ─── Navbar Translations ───
const navT = {
  en: { features: "Features", pricing: "Pricing", guidelines: "Guidelines", breedAnalysis: "Breed Analysis", yieldPrediction: "Yield Prediction", contact: "Contact", more: "More", terms: "Terms", privacy: "Privacy", signIn: "Sign In", getStarted: "Get Started Free" },
  hi: { features: "सुविधाएं", pricing: "मूल्य निर्धारण", guidelines: "दिशानिर्देश", breedAnalysis: "नस्ल की पहचान", yieldPrediction: "उत्पादन का अनुमान", contact: "संपर्क", more: "अधिक", terms: "शर्तें", privacy: "गोपनीयता", signIn: "साइन इन", getStarted: "मुफ्त शुरू करें" },
  mr: { features: "वैशिष्ट्ये", pricing: "किमत", guidelines: "मार्गदर्शक तत्त्वे", breedAnalysis: "जातीची ओळख", yieldPrediction: "उत्पादन अंदाज", contact: "संपर्क", more: "अधिक", terms: "अटी", privacy: "गोपनीयता", signIn: "साइन इन", getStarted: "मोफत सुरू करा" },
  pa: { features: "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ", pricing: "ਕੀਮਤ", guidelines: "ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼", breedAnalysis: "ਨਸਲ ਦੀ ਪਛਾਣ", yieldPrediction: "ਪੈਦਾਵਾਰ ਪੂਰਵ ਅਨੁਮਾਨ", contact: "ਸੰਪਰਕ", more: "ਹੋਰ", terms: "ਸ਼ਰਤਾਂ", privacy: "ਗੋਪਨੀਯਤਾ", signIn: "ਸਾਈਨ ਇਨ", getStarted: "ਮੁਫਤ ਸ਼ੁਰੂ ਕਰੋ" },
};

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, changeLanguage } = useLanguage();
  const t = navT[lang as keyof typeof navT] || navT.en; 

  const navLinks = [
    { label: t.features, href: "/features" },
    { label: t.pricing, href: "/pricing" },
    { label: t.guidelines, href: "/guidelines" },
    { label: t.contact, href: "/contact" },
  ];

  const moreLinks = [
    { label: t.terms, href: "/terms" },
    { label: t.privacy, href: "/privacy" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <style>{`
        .fs-nav-wrapper { --nav-font: 'Poppins', system-ui, sans-serif; --nav-primary: #16a34a; --nav-primary-dark: #15803d; }
        .fs-header { position: fixed; top: 0; left: 0; right: 0; z-index: 50; transition: all 0.3s ease; font-family: var(--nav-font); --hd-text: rgba(255, 255, 255, 0.85); --hd-text-hover: #ffffff; --hd-logo-bg: rgba(255, 255, 255, 0.15); --hd-logo-text: #ffffff; --hd-indicator: #ffffff; --hd-btn-out-border: rgba(255, 255, 255, 0.3); --hd-btn-out-text: #ffffff; --hd-btn-out-hover-bg: rgba(255, 255, 255, 0.1); --hd-btn-solid-bg: #ffffff; --hd-btn-solid-text: #064e3b; --hd-btn-solid-hover: #f1f5f9; --hd-hamburger: #ffffff; }
        .fs-header.scrolled { background-color: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); --hd-text: #4b5563; --hd-text-hover: var(--nav-primary); --hd-logo-bg: var(--nav-primary); --hd-logo-text: var(--nav-primary); --hd-indicator: var(--nav-primary); --hd-btn-out-border: #e2e8f0; --hd-btn-out-text: var(--nav-primary); --hd-btn-out-hover-bg: #f0fdf4; --hd-btn-solid-bg: var(--nav-primary); --hd-btn-solid-text: #ffffff; --hd-btn-solid-hover: var(--nav-primary-dark); --hd-hamburger: #4b5563; }
        .fs-container { max-width: 80rem; margin: 0 auto; padding: 0 1rem; display: flex; align-items: center; justify-content: space-between; height: 5rem; }
        @media (min-width: 640px) { .fs-container { padding: 0 1.5rem; } }
        @media (min-width: 1024px) { .fs-container { padding: 0 2rem; } }
        .fs-logo { display: flex; align-items: center; gap: 0.625rem; text-decoration: none; outline: none; }
        .fs-logo-icon { width: 2.5rem; height: 2.5rem; border-radius: 0.75rem; background-color: var(--hd-logo-bg); transition: background-color 0.3s ease; display: flex; align-items: center; justify-content: center; }
        .fs-logo-text { font-size: 1.5rem; font-weight: 700; color: var(--hd-logo-text); transition: color 0.3s ease; letter-spacing: -0.025em; }
        
        .fs-desktop-nav { display: none; align-items: center; gap: 0.5rem; }
        @media (min-width: 768px) { .fs-desktop-nav { display: flex; } }
        .fs-nav-link { position: relative; padding: 0.5rem 1rem; font-size: 0.9375rem; font-weight: 500; border-radius: 0.5rem; color: var(--hd-text); text-decoration: none; transition: color 0.3s ease, background-color 0.3s ease; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.25rem; }
        .fs-nav-link:hover, .fs-nav-link.active { color: var(--hd-text-hover); }
        .fs-header.scrolled .fs-nav-link:hover { background-color: var(--hd-btn-out-hover-bg); }
        .fs-indicator { position: absolute; bottom: 0.125rem; left: 50%; transform: translateX(-50%); width: 0.375rem; height: 0.375rem; border-radius: 50%; background-color: var(--hd-indicator); transition: background-color 0.3s ease; }
        
        .fs-dropdown-wrapper { position: relative; }
        .fs-dropdown-menu { position: absolute; top: 100%; right: 0; margin-top: 0.5rem; width: 13rem; background-color: #ffffff; border-radius: 1rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; padding: 0.5rem; z-index: 50; }
        .fs-dropdown-menu.fs-lang-menu { width: 10rem; right: auto; left: 50%; transform: translateX(-50%); }
        .fs-dropdown-item { display: block; width: 100%; text-align: left; padding: 0.625rem 1rem; border-radius: 0.5rem; font-size: 0.875rem; color: #4b5563; border: none; background: transparent; cursor: pointer; text-decoration: none; transition: all 0.2s ease; font-family: inherit; }
        .fs-dropdown-item:hover, .fs-dropdown-item.active { color: var(--nav-primary); background-color: #f0fdf4; font-weight: 600; }
        
        .fs-actions { display: none; align-items: center; gap: 0.75rem; }
        @media (min-width: 768px) { .fs-actions { display: flex; } }
        
        .fs-btn-outline { padding: 0.625rem 1.25rem; font-size: 0.875rem; font-weight: 600; color: var(--hd-btn-out-text); background: transparent; border: 1px solid var(--hd-btn-out-border); border-radius: 0.75rem; cursor: pointer; transition: all 0.3s ease; }
        .fs-btn-outline:hover { background-color: var(--hd-btn-out-hover-bg); }
        .fs-btn-solid { padding: 0.625rem 1.5rem; font-size: 0.875rem; font-weight: 600; color: var(--hd-btn-solid-text); background-color: var(--hd-btn-solid-bg); border: none; border-radius: 0.75rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .fs-btn-solid:hover { background-color: var(--hd-btn-solid-hover); transform: translateY(-1px); }
        
        /* Mobile specific header actions */
        .fs-mobile-header-actions { display: flex; align-items: center; gap: 0.5rem; }
        @media (min-width: 768px) { .fs-mobile-header-actions { display: none; } }
        
        .fs-mobile-signin-btn { padding: 0.4rem 0.75rem; font-size: 0.75rem; border-radius: 0.5rem; border-width: 1px; }
        
        .fs-mobile-toggle { padding: 0.5rem; border-radius: 0.5rem; color: var(--hd-hamburger); background: transparent; border: none; cursor: pointer; transition: color 0.3s ease, background-color 0.3s ease; }
        .fs-header.scrolled .fs-mobile-toggle:hover { background-color: #f1f5f9; color: var(--nav-primary); }
        
        .fs-mobile-drawer { position: fixed; top: 5rem; left: 0; right: 0; z-index: 40; background-color: rgba(255, 255, 255, 0.98); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); overflow: hidden; }
        .fs-mobile-content { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .fs-mobile-link { display: block; padding: 0.875rem 1rem; border-radius: 0.75rem; font-size: 1rem; font-weight: 500; color: #1f2937; text-decoration: none; transition: all 0.2s ease; }
        .fs-mobile-link:hover, .fs-mobile-link.active { color: var(--nav-primary); background-color: #f0fdf4; }
        .fs-mobile-actions { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0; }
        .fs-mobile-actions button { width: 100%; padding: 0.875rem; font-size: 1rem; font-weight: 600; border-radius: 0.75rem; cursor: pointer; border: none; }
        .fs-mobile-btn-outline { background: transparent; border: 1px solid #e2e8f0 !important; color: var(--nav-primary); }
        .fs-mobile-btn-outline:hover { background: #f8fafc; }
        .fs-mobile-btn-solid { background: var(--nav-primary); color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .fs-backdrop { position: fixed; inset: 0; z-index: 30; }

        .fs-mobile-lang-row { display: flex; gap: 0.5rem; padding: 0.5rem 1rem; margin-bottom: 0.5rem; background: #f9fafb; border-radius: 0.75rem; justify-content: space-between;}
        .fs-mobile-lang-btn { padding: 0.5rem; border-radius: 0.5rem; border: none; background: transparent; color: #6b7280; font-weight: 600; font-family: inherit; font-size: 0.875rem; cursor: pointer;}
        .fs-mobile-lang-btn.active { background: var(--nav-primary); color: white; }
      `}</style>

      <div className="fs-nav-wrapper">
        <header className={`fs-header ${scrolled ? "scrolled" : ""}`}>
          <div className="fs-container">
            
            <Link to="/" className="fs-logo">
              <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }} className="fs-logo-icon">
                <Leaf color="#ffffff" size={20} />
              </motion.div>
              <span className="fs-logo-text">FasalSaathi</span>
            </Link>

            <nav className="fs-desktop-nav">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} className={`fs-nav-link ${isActive(link.href) ? "active" : ""}`}>
                  {link.label}
                  {isActive(link.href) && <motion.div layoutId="nav-indicator" className="fs-indicator" />}
                </Link>
              ))}

              <div className="fs-dropdown-wrapper">
                <button onClick={() => setMoreOpen(!moreOpen)} className="fs-nav-link">
                  {t.more} <ChevronDown size={16} style={{ opacity: 0.8 }} />
                </button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }} className="fs-dropdown-menu">
                      {moreLinks.map((link) => (
                        <Link key={link.href} to={link.href} onClick={() => setMoreOpen(false)} className="fs-dropdown-item">{link.label}</Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            <div className="fs-actions">
              <div className="fs-dropdown-wrapper">
                <button onClick={() => setLangOpen(!langOpen)} className="fs-nav-link" style={{ padding: '0.5rem' }}>
                  <Languages size={20} />
                  <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700 }}>{lang}</span>
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }} className="fs-dropdown-menu fs-lang-menu">
                      <button onClick={() => { changeLanguage("en"); setLangOpen(false); }} className={`fs-dropdown-item ${lang === "en" ? "active" : ""}`}>English</button>
                      <button onClick={() => { changeLanguage("hi"); setLangOpen(false); }} className={`fs-dropdown-item ${lang === "hi" ? "active" : ""}`}>हिंदी (Hindi)</button>
                      <button onClick={() => { changeLanguage("mr"); setLangOpen(false); }} className={`fs-dropdown-item ${lang === "mr" ? "active" : ""}`}>मराठी (Marathi)</button>
                      <button onClick={() => { changeLanguage("pa"); setLangOpen(false); }} className={`fs-dropdown-item ${lang === "pa" ? "active" : ""}`}>ਪੰਜਾਬੀ (Punjabi)</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={() => navigate("/app?mode=login")} className="fs-btn-outline">{t.signIn}</button>
              <button onClick={() => navigate("/app?mode=register")} className="fs-btn-solid">{t.getStarted}</button>
            </div>

            {/* Mobile Actions: Sign In Button + Hamburger Toggle */}
            <div className="fs-mobile-header-actions">
              <button onClick={() => navigate("/app?mode=login")} className="fs-btn-outline fs-mobile-signin-btn">
                {t.signIn}
              </button>
              <button className="fs-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

          </div>
        </header>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="fs-mobile-drawer">
              <div className="fs-mobile-content">
                
                <div className="fs-mobile-lang-row">
                  <button onClick={() => changeLanguage("en")} className={`fs-mobile-lang-btn ${lang === "en" ? "active" : ""}`}>EN</button>
                  <button onClick={() => changeLanguage("hi")} className={`fs-mobile-lang-btn ${lang === "hi" ? "active" : ""}`}>हिंदी</button>
                  <button onClick={() => changeLanguage("mr")} className={`fs-mobile-lang-btn ${lang === "mr" ? "active" : ""}`}>मराठी</button>
                  <button onClick={() => changeLanguage("pa")} className={`fs-mobile-lang-btn ${lang === "pa" ? "active" : ""}`}>ਪੰਜਾਬੀ</button>
                </div>

                {[...navLinks, ...moreLinks].map((link, i) => (
                  <motion.div key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link to={link.href} className={`fs-mobile-link ${isActive(link.href) ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                
                <div className="fs-mobile-actions">
                  <button onClick={() => navigate("/app?mode=login")} className="fs-mobile-btn-outline">{t.signIn}</button>
                  <button onClick={() => navigate("/app?mode=register")} className="fs-mobile-btn-solid">{t.getStarted}</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click outside overlays */}
        {(moreOpen || langOpen) && <div className="fs-backdrop" onClick={() => { setMoreOpen(false); setLangOpen(false); }} />}
      </div>
    </>
  );
}