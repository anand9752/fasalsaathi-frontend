import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageCircle, Cloud } from "lucide-react";
import emailjs from '@emailjs/browser';
import { PublicNavbar } from "../components/public/PublicNavbar";
import { PublicFooter } from "../components/public/PublicFooter";
import { useLanguage } from "../hooks/useLanguage";

// ─── Translations Dictionary ──────────────────────────────────────────────────
const t = {
  en: {
    heroBadge: "Get In Touch",
    heroTitle: "We're Here to Help",
    heroDesc: "Have questions, feedback, or need support? Reach out and we'll respond in your preferred language.",
    
    ci1Label: "Email Support", ci1Val: "support@fasalsaathi.in", ci1Note: "We reply within 2 business hours",
    ci2Label: "Toll-Free Helpline", ci2Val: "+91 1800-XXX-XXXX", ci2Note: "Monday – Saturday, 8 AM to 8 PM",
    ci3Label: "Office Address", ci3Val: "FasalSaathi, Itarsi, MP – 461111", ci3Note: "Visit by appointment only",
    ci4Label: "Support Hours", ci4Val: "Mon – Sat: 8 AM – 8 PM IST", ci4Note: "Emergency: 24/7 via email",

    formTitle: "Send Us a Message", formSub: "We reply within 2 hours",
    fName: "Full Name", fNamePh: "Ramesh Kumar",
    fEmail: "Email Address", fEmailPh: "farmer@example.com",
    fSubj: "Subject", fSubjPh: "How can we help?",
    fMsg: "Message", fMsgPh: "Describe your question or issue in detail...",
    btnSend: "Send Message", btnSending: "Sending...",
    succTitle: "Message Sent!", succDesc: "We'll get back to you within 2 business hours.",

    faqTitle: "Quick Answers",
    q1: "How do I reset my password?", a1: "Go to the login page and click 'Forgot Password'. Enter your registered email and we'll send a reset link within a few minutes.",
    q2: "Can I use FasalSaathi in Marathi?", a2: "Yes! Switch to Marathi from the language selector in the top navigation bar. All content, alerts, and recommendations will appear in Marathi.",
    q3: "Why are my market prices not updating?", a3: "Market data refreshes every 30 minutes. If you see stale data, try pulling down to refresh or check your internet connection.",
    q4: "How do I report a bug or suggest a feature?", a4: "Use the contact form on this page or email us at support@fasalsaathi.in. We read every message and respond within 24 hours."
  },
  hi: {
    heroBadge: "संपर्क करें",
    heroTitle: "हम यहाँ आपकी सहायता के लिए हैं",
    heroDesc: "क्या आपके कोई प्रश्न, प्रतिक्रिया या सहायता की आवश्यकता है? संपर्क करें और हम आपकी भाषा में उत्तर देंगे।",
    
    ci1Label: "ईमेल सपोर्ट", ci1Val: "support@fasalsaathi.in", ci1Note: "हम 2 व्यावसायिक घंटों में उत्तर देते हैं",
    ci2Label: "टोल-फ्री हेल्पलाइन", ci2Val: "+91 1800-XXX-XXXX", ci2Note: "सोमवार - शनिवार, सुबह 8 से रात 8 बजे तक",
    ci3Label: "कार्यालय का पता", ci3Val: "फसलसाथी, इटारसी, एमपी - 461111", ci3Note: "केवल अपॉइंटमेंट द्वारा मिलें",
    ci4Label: "सहायता के घंटे", ci4Val: "सोम - शनि: सुबह 8 - रात 8 बजे (IST)", ci4Note: "आपातकालीन: 24/7 ईमेल द्वारा",

    formTitle: "हमें संदेश भेजें", formSub: "हम 2 घंटे में उत्तर देते हैं",
    fName: "पूरा नाम", fNamePh: "रमेश कुमार",
    fEmail: "ईमेल पता", fEmailPh: "farmer@example.com",
    fSubj: "विषय", fSubjPh: "हम कैसे मदद कर सकते हैं?",
    fMsg: "संदेश", fMsgPh: "अपने प्रश्न या समस्या का विस्तार से वर्णन करें...",
    btnSend: "संदेश भेजें", btnSending: "भेजा जा रहा है...",
    succTitle: "संदेश भेजा गया!", succDesc: "हम 2 व्यावसायिक घंटों के भीतर आपसे संपर्क करेंगे।",

    faqTitle: "त्वरित उत्तर",
    q1: "मैं अपना पासवर्ड कैसे रीसेट करूं?", a1: "लॉगिन पेज पर जाएं और 'पासवर्ड भूल गए' पर क्लिक करें। अपना पंजीकृत ईमेल दर्ज करें और हम एक रीसेट लिंक भेजेंगे।",
    q2: "क्या मैं फसलसाथी का मराठी में उपयोग कर सकता हूँ?", a2: "हाँ! शीर्ष नेविगेशन बार में भाषा चयनकर्ता से मराठी पर स्विच करें।",
    q3: "मेरे मंडी भाव अपडेट क्यों नहीं हो रहे हैं?", a3: "बाजार का डेटा हर 30 मिनट में रीफ्रेश होता है। ताज़ा करने के लिए नीचे खींचें या अपना इंटरनेट जांचें।",
    q4: "मैं किसी बग की रिपोर्ट कैसे करूं या सुविधा का सुझाव कैसे दूं?", a4: "इस पृष्ठ पर संपर्क फ़ॉर्म का उपयोग करें या हमें ईमेल करें। हम 24 घंटों के भीतर जवाब देते हैं।"
  },
  mr: {
    heroBadge: "संपर्क साधा",
    heroTitle: "आम्ही मदतीसाठी येथे आहोत",
    heroDesc: "प्रश्न, अभिप्राय किंवा मदत हवी आहे? संपर्क साधा आणि आम्ही तुमच्या पसंतीच्या भाषेत उत्तर देऊ.",
    
    ci1Label: "ईमेल सपोर्ट", ci1Val: "support@fasalsaathi.in", ci1Note: "आम्ही २ व्यावसायिक तासांत उत्तर देतो",
    ci2Label: "टोल-फ्री हेल्पलाइन", ci2Val: "+91 1800-XXX-XXXX", ci2Note: "सोमवार - शनिवार, सकाळी ८ ते रात्री ८",
    ci3Label: "कार्यालयाचा पत्ता", ci3Val: "फसलसाथी, इटारसी, एमपी - 461111", ci3Note: "फक्त पूर्वपरवानगीने भेट द्या",
    ci4Label: "मदतीची वेळ", ci4Val: "सोम - शनी: सकाळी ८ - रात्री ८ (IST)", ci4Note: "आणीबाणी: २४/७ ईमेलद्वारे",

    formTitle: "आम्हाला संदेश पाठवा", formSub: "आम्ही २ तासांत उत्तर देतो",
    fName: "पूर्ण नाव", fNamePh: "रमेश कुमार",
    fEmail: "ईमेल पत्ता", fEmailPh: "farmer@example.com",
    fSubj: "विषय", fSubjPh: "आम्ही कशी मदत करू शकतो?",
    fMsg: "संदेश", fMsgPh: "तुमचा प्रश्न किंवा समस्येचे सविस्तर वर्णन करा...",
    btnSend: "संदेश पाठवा", btnSending: "पाठवत आहे...",
    succTitle: "संदेश पाठवला!", succDesc: "आम्ही २ व्यावसायिक तासांच्या आत तुमच्याशी संपर्क साधू.",

    faqTitle: "त्वरित उत्तरे",
    q1: "मी माझा पासवर्ड कसा रीसेट करू?", a1: "लॉगिन पेजवर जा आणि 'पासवर्ड विसरलात' वर क्लिक करा. तुमचा नोंदणीकृत ईमेल प्रविष्ट करा.",
    q2: "मी फसलसाथी मराठीत वापरू शकतो का?", a2: "होय! वरच्या नेव्हिगेशन बारमधून मराठी भाषा निवडा. सर्व माहिती मराठीत दिसेल.",
    q3: "माझे बाजारभाव अपडेट का होत नाहीत?", a3: "बाजारभाव दर ३० मिनिटांनी अपडेट होतात. इंटरनेट कनेक्शन तपासा.",
    q4: "मी तक्रार किंवा नवीन सूचनेबद्दल कसे सांगू?", a4: "या पृष्ठावरील संपर्क फॉर्म वापरा किंवा आम्हाला ईमेल करा."
  },
  pa: {
    heroBadge: "ਸੰਪਰਕ ਕਰੋ",
    heroTitle: "ਅਸੀਂ ਇੱਥੇ ਮਦਦ ਲਈ ਹਾਂ",
    heroDesc: "ਕੋਈ ਸਵਾਲ, ਸੁਝਾਅ ਜਾਂ ਮਦਦ ਚਾਹੀਦੀ ਹੈ? ਸੰਪਰਕ ਕਰੋ, ਅਸੀਂ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ ਜਵਾਬ ਦੇਵਾਂਗੇ।",
    
    ci1Label: "ਈਮੇਲ ਸਪੋਰਟ", ci1Val: "support@fasalsaathi.in", ci1Note: "ਅਸੀਂ 2 ਕੰਮਕਾਜੀ ਘੰਟਿਆਂ ਵਿੱਚ ਜਵਾਬ ਦਿੰਦੇ ਹਾਂ",
    ci2Label: "ਟੋਲ-ਫ੍ਰੀ ਹੈਲਪਲਾਈਨ", ci2Val: "+91 1800-XXX-XXXX", ci2Note: "ਸੋਮਵਾਰ - ਸ਼ਨੀਵਾਰ, ਸਵੇਰੇ 8 ਤੋਂ ਰਾਤ 8 ਵਜੇ",
    ci3Label: "ਦਫਤਰ ਦਾ ਪਤਾ", ci3Val: "ਫਸਲਸਾਥੀ, ਇਟਾਰਸੀ, ਐਮ.ਪੀ. - 461111", ci3Note: "ਸਿਰਫ ਅਪਾਇੰਟਮੈਂਟ ਦੁਆਰਾ ਮਿਲੋ",
    ci4Label: "ਸਹਾਇਤਾ ਦਾ ਸਮਾਂ", ci4Val: "ਸੋਮ - ਸ਼ਨੀ: ਸਵੇਰੇ 8 - ਰਾਤ 8 (IST)", ci4Note: "ਐਮਰਜੈਂਸੀ: 24/7 ਈਮੇਲ ਦੁਆਰਾ",

    formTitle: "ਸਾਨੂੰ ਸੁਨੇਹਾ ਭੇਜੋ", formSub: "ਅਸੀਂ 2 ਘੰਟਿਆਂ ਵਿੱਚ ਜਵਾਬ ਦਿੰਦੇ ਹਾਂ",
    fName: "ਪੂਰਾ ਨਾਮ", fNamePh: "ਰਮੇਸ਼ ਕੁਮਾਰ",
    fEmail: "ਈਮੇਲ ਪਤਾ", fEmailPh: "farmer@example.com",
    fSubj: "ਵਿਸ਼ਾ", fSubjPh: "ਅਸੀਂ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹਾਂ?",
    fMsg: "ਸੁਨੇਹਾ", fMsgPh: "ਆਪਣੇ ਸਵਾਲ ਜਾਂ ਸਮੱਸਿਆ ਦਾ ਵਿਸਥਾਰ ਵਿੱਚ ਵਰਣਨ ਕਰੋ...",
    btnSend: "ਸੁਨੇਹਾ ਭੇਜੋ", btnSending: "ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
    succTitle: "ਸੁਨੇਹਾ ਭੇਜਿਆ ਗਿਆ!", succDesc: "ਅਸੀਂ 2 ਕੰਮਕਾਜੀ ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰਾਂਗੇ।",

    faqTitle: "ਤੁਰੰਤ ਜਵਾਬ",
    q1: "ਮੈਂ ਆਪਣਾ ਪਾਸਵਰਡ ਕਿਵੇਂ ਰੀਸੈਟ ਕਰਾਂ?", a1: "ਲਾਗਇਨ ਪੇਜ 'ਤੇ ਜਾਓ ਅਤੇ 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ' 'ਤੇ ਕਲਿੱਕ ਕਰੋ।",
    q2: "ਕੀ ਮੈਂ ਫਸਲਸਾਥੀ ਦੀ ਪੰਜਾਬੀ ਵਿੱਚ ਵਰਤੋਂ ਕਰ ਸਕਦਾ ਹਾਂ?", a2: "ਹਾਂ! ਨੈਵੀਗੇਸ਼ਨ ਬਾਰ ਤੋਂ ਪੰਜਾਬੀ ਚੁਣੋ।",
    q3: "ਮੇਰੇ ਮੰਡੀ ਭਾਅ ਅੱਪਡੇਟ ਕਿਉਂ ਨਹੀਂ ਹੋ ਰਹੇ?", a3: "ਡਾਟਾ ਹਰ 30 ਮਿੰਟਾਂ ਵਿੱਚ ਤਾਜ਼ਾ ਹੁੰਦਾ ਹੈ। ਆਪਣਾ ਇੰਟਰਨੈੱਟ ਚੈੱਕ ਕਰੋ।",
    q4: "ਮੈਂ ਕਿਸੇ ਬਗ ਦੀ ਰਿਪੋਰਟ ਕਿਵੇਂ ਕਰਾਂ?", a4: "ਇਸ ਪੰਨੇ 'ਤੇ ਫਾਰਮ ਦੀ ਵਰਤੋਂ ਕਰੋ ਜਾਂ ਸਾਨੂੰ ਈਮੇਲ ਕਰੋ।"
  }
};

// ─── Animation Wrapper ────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Main Page Export ─────────────────────────────────────────────────────────
export function ContactPage() {
  const { lang } = useLanguage();
  const text = t[lang as keyof typeof t] || t.en;
  
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ─── EMAILJS SUBMISSION HANDLER ─────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS environment variables are missing!");
      alert("Configuration error: Email service is currently unavailable.");
      setSubmitting(false);
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        },
        publicKey
      );
      
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send the message. Please try again later or email us directly at support@fasalsaathi.in");
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: text.ci1Label, value: text.ci1Val, note: text.ci1Note, theme: "blue" },
    { icon: Phone, label: text.ci2Label, value: text.ci2Val, note: text.ci2Note, theme: "green" },
    { icon: MapPin, label: text.ci3Label, value: text.ci3Val, note: text.ci3Note, theme: "orange" },
    { icon: Clock, label: text.ci4Label, value: text.ci4Val, note: text.ci4Note, theme: "purple" },
  ];

  const faqs = [
    { q: text.q1, a: text.a1 },
    { q: text.q2, a: text.a2 },
    { q: text.q3, a: text.a3 },
    { q: text.q4, a: text.a4 },
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        .fs-cp-wrapper {
          --cp-font-body: 'Inter', system-ui, sans-serif;
          --cp-font-display: 'Poppins', system-ui, sans-serif;
          --cp-primary: #16a34a; --cp-primary-dark: #15803d; --cp-primary-light: #dcfce7;
          --cp-text-dark: #111827; --cp-text-muted: #4b5563; --cp-text-light: #ffffff;
          font-family: var(--cp-font-body); background-color: #ffffff; color: var(--cp-text-dark);
          display: flex; flex-direction: column; min-height: 100vh; overflow-x: hidden;
        }

        .fs-cp-container { max-width: 72rem; margin: 0 auto; padding: 0 1rem; width: 100%; box-sizing: border-box; }
        @media (min-width: 640px) { .fs-cp-container { padding: 0 1.5rem; } }

        /* -- ANIMATED HERO -- */
        .fs-cp-hero { position: relative; padding-top: 8rem; padding-bottom: 4rem; background: linear-gradient(180deg, #064e3b 0%, #022c22 100%); text-align: center; overflow: hidden; }
        @media (min-width: 768px) { .fs-cp-hero { padding-top: 10rem; } }
        
        .fs-cp-hero-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }

        @keyframes sunPulse { 0% { transform: scale(1); box-shadow: 0 0 50px 20px rgba(250, 204, 21, 0.2); } 100% { transform: scale(1.05); box-shadow: 0 0 80px 40px rgba(250, 204, 21, 0.4); } }
        .fs-cp-bg-sun { position: absolute; top: 15%; right: 20%; width: 120px; height: 120px; background: #facc15; border-radius: 50%; opacity: 0.6; animation: sunPulse 5s ease-in-out infinite alternate; filter: blur(20px); }

        @keyframes floatCloud { 0% { transform: translateX(-15vw); } 100% { transform: translateX(115vw); } }
        .fs-cp-bg-cloud { position: absolute; color: rgba(255, 255, 255, 0.08); animation: floatCloud linear infinite; }
        .fs-cp-bg-cloud-1 { top: 10%; left: -20%; animation-duration: 45s; animation-delay: -10s; }
        .fs-cp-bg-cloud-2 { top: 25%; left: -20%; animation-duration: 65s; animation-delay: -35s; transform: scale(1.5); color: rgba(255, 255, 255, 0.04); }

        @keyframes waveHills { 0% { transform: translateX(0) scaleY(1); } 50% { transform: translateX(-2%) scaleY(1.05); } 100% { transform: translateX(0) scaleY(1); } }
        .fs-cp-bg-hill { position: absolute; bottom: -5%; width: 120%; border-radius: 50% 50% 0 0 / 100% 100% 0 0; animation: waveHills 10s ease-in-out infinite; }
        .fs-cp-bg-hill-1 { left: -5%; background: rgba(20, 83, 45, 0.5); z-index: 1; height: 35%; animation-duration: 12s; }
        .fs-cp-bg-hill-2 { left: -10%; background: rgba(6, 95, 70, 0.7); z-index: 2; height: 25%; animation-delay: -5s; }

        .fs-cp-noise { position: absolute; inset: 0; background-image: url('https://grainy-gradients.vercel.app/noise.svg'); opacity: 0.2; mix-blend-mode: overlay; z-index: 3;}

        .fs-cp-hero-content { position: relative; z-index: 10; }
        
        /* -- SCALED UP HERO TYPOGRAPHY -- */
        .fs-cp-hero-badge { display: inline-block; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #ffffff; font-size: 0.875rem; font-weight: 600; padding: 0.375rem 1rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
        .fs-cp-h1 { font-family: var(--cp-font-display); font-size: 2.5rem; font-weight: 700; line-height: 1.2; margin-bottom: 1rem; color: var(--cp-text-light); }
        @media (min-width: 640px) { .fs-cp-h1 { font-size: 3.5rem; } }
        .fs-cp-hero-p { color: #d1fae5; font-size: 1.25rem; max-width: 48rem; margin: 0 auto; line-height: 1.625; font-weight: 300; }

        /* -- CONTACT INFO CARDS -- */
        .fs-cp-info-section { padding: 4rem 0; }
        .fs-cp-info-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 5rem; }
        @media (min-width: 640px) { .fs-cp-info-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .fs-cp-info-grid { grid-template-columns: repeat(4, 1fr); } }
        
        .fs-cp-info-card { background: #ffffff; border: 1px solid #f3f4f6; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); transition: box-shadow 0.2s ease; }
        .fs-cp-info-card:hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        
        /* SCALED UP ICON & CARD TEXT */
        .fs-cp-icon-box { width: 3.5rem; height: 3.5rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
        .fs-cp-icon-box svg { width: 24px; height: 24px; }
        .fs-cp-icon-blue { background-color: #eff6ff; color: #2563eb; } .fs-cp-icon-green { background-color: #f0fdf4; color: #16a34a; } .fs-cp-icon-orange { background-color: #fff7ed; color: #ea580c; } .fs-cp-icon-purple { background-color: #faf5ff; color: #9333ea; }
        
        .fs-cp-info-label { font-size: 0.875rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 0.5rem 0; }
        .fs-cp-info-value { font-size: 1.125rem; font-weight: 600; color: var(--cp-text-dark); margin: 0 0 0.5rem 0; }
        .fs-cp-info-note { font-size: 0.875rem; color: #6b7280; margin: 0; }

        /* -- SPLIT SECTION (FORM & FAQ) -- */
        .fs-cp-split-grid { display: grid; grid-template-columns: 1fr; gap: 3.5rem; }
        @media (min-width: 1024px) { .fs-cp-split-grid { grid-template-columns: 1fr 1fr; } }

        /* -- SCALED UP FORM -- */
        .fs-cp-form-wrap { background: #f9fafb; border-radius: 1.5rem; padding: 2.5rem; border: 1px solid #f3f4f6; }
        .fs-cp-form-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .fs-cp-form-title { font-family: var(--cp-font-display); font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--cp-text-dark); }
        .fs-cp-form-subtitle { font-size: 1rem; color: var(--cp-text-muted); margin: 0; }
        
        .fs-cp-field-group { display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 1.5rem; }
        .fs-cp-field-row { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
        @media (min-width: 640px) { .fs-cp-field-row { grid-template-columns: 1fr 1fr; } }
        
        .fs-cp-label { display: block; font-size: 0.95rem; font-weight: 500; color: var(--cp-text-muted); margin-bottom: 0.5rem; }
        .fs-cp-input, .fs-cp-textarea { width: 100%; box-sizing: border-box; padding: 0.875rem 1.25rem; font-size: 1rem; font-family: inherit; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; color: var(--cp-text-dark); transition: all 0.2s ease; outline: none; }
        .fs-cp-input::placeholder, .fs-cp-textarea::placeholder { color: #9ca3af; }
        .fs-cp-input:focus, .fs-cp-textarea:focus { border-color: var(--cp-primary); box-shadow: 0 0 0 3px var(--cp-primary-light); }
        .fs-cp-textarea { resize: none; }
        
        .fs-cp-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; font-size: 1.125rem; font-weight: 600; color: #ffffff; background: var(--cp-primary); border: none; border-radius: 0.75rem; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); font-family: inherit; margin-top: 0.5rem; }
        .fs-cp-btn:hover:not(:disabled) { background: var(--cp-primary-dark); transform: translateY(-1px); }
        .fs-cp-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .fs-cp-success { text-align: center; padding: 3rem 0; }
        .fs-cp-success-title { font-family: var(--cp-font-display); font-size: 1.5rem; font-weight: 700; margin: 1.5rem 0 0.5rem; color: var(--cp-text-dark); }
        .fs-cp-success-desc { font-size: 1rem; color: var(--cp-text-muted); margin: 0; }

        /* -- SCALED UP FAQ -- */
        .fs-cp-faq-title { font-family: var(--cp-font-display); font-size: 1.75rem; font-weight: 700; color: var(--cp-text-dark); margin: 0 0 2rem 0; }
        .fs-cp-faq-list { display: flex; flex-direction: column; gap: 1.25rem; }
        .fs-cp-faq-item { background: #f9fafb; border-radius: 0.75rem; padding: 1.5rem; border: 1px solid #f3f4f6; }
        .fs-cp-faq-q { font-weight: 600; font-size: 1.125rem; color: var(--cp-text-dark); margin: 0 0 0.75rem 0; }
        .fs-cp-faq-a { font-size: 1rem; color: var(--cp-text-muted); line-height: 1.625; margin: 0; }
      `}</style>

      <div className="fs-cp-wrapper">
        <PublicNavbar />

        <main style={{ flex: 1 }}>
          <section className="fs-cp-hero">
            <div className="fs-cp-hero-bg">
              <div className="fs-cp-bg-sun" />
              <Cloud className="fs-cp-bg-cloud fs-cp-bg-cloud-1" size={160} />
              <Cloud className="fs-cp-bg-cloud fs-cp-bg-cloud-2" size={240} />
              <div className="fs-cp-bg-hill fs-cp-bg-hill-1" />
              <div className="fs-cp-bg-hill fs-cp-bg-hill-2" />
              <div className="fs-cp-bg-leaf fs-cp-l-1" />
              <div className="fs-cp-bg-leaf fs-cp-l-2" />
              <div className="fs-cp-bg-leaf fs-cp-l-3" />
              <div className="fs-cp-noise" />
            </div>

            <div className="fs-cp-container fs-cp-hero-content">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <span className="fs-cp-hero-badge">{text.heroBadge}</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="fs-cp-h1">
                {text.heroTitle}
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="fs-cp-hero-p">
                {text.heroDesc}
              </motion.p>
            </div>
          </section>

          <section className="fs-cp-info-section">
            <div className="fs-cp-container">
              
              <div className="fs-cp-info-grid">
                {contactInfo.map(({ icon: Icon, label, value, note, theme }, i) => (
                  <FadeUp key={label} delay={i * 0.1}>
                    <div className="fs-cp-info-card">
                      <div className={`fs-cp-icon-box fs-cp-icon-${theme}`}>
                        <Icon />
                      </div>
                      <p className="fs-cp-info-label">{label}</p>
                      <p className="fs-cp-info-value">{value}</p>
                      <p className="fs-cp-info-note">{note}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>

              <div className="fs-cp-split-grid">
                
                <FadeUp>
                  <div className="fs-cp-form-wrap">
                    <div className="fs-cp-form-header">
                      <div className="fs-cp-icon-box fs-cp-icon-green" style={{ marginBottom: 0 }}>
                        <MessageCircle />
                      </div>
                      <div>
                        <h2 className="fs-cp-form-title">{text.formTitle}</h2>
                        <p className="fs-cp-form-subtitle">{text.formSub}</p>
                      </div>
                    </div>

                    {submitted ? (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="fs-cp-success">
                        <CheckCircle size={80} color="var(--cp-primary)" style={{ margin: '0 auto' }} />
                        <h3 className="fs-cp-success-title">{text.succTitle}</h3>
                        <p className="fs-cp-success-desc">{text.succDesc}</p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        <div className="fs-cp-field-group">
                          <div className="fs-cp-field-row">
                            <div>
                              <label className="fs-cp-label">{text.fName}</label>
                              <input
                                required type="text" placeholder={text.fNamePh}
                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                className="fs-cp-input"
                              />
                            </div>
                            <div>
                              <label className="fs-cp-label">{text.fEmail}</label>
                              <input
                                required type="email" placeholder={text.fEmailPh}
                                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                className="fs-cp-input"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="fs-cp-label">{text.fSubj}</label>
                            <input
                              required type="text" placeholder={text.fSubjPh}
                              value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                              className="fs-cp-input"
                            />
                          </div>
                          <div>
                            <label className="fs-cp-label">{text.fMsg}</label>
                            <textarea
                              required rows={5} placeholder={text.fMsgPh}
                              value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                              className="fs-cp-textarea"
                            />
                          </div>
                        </div>
                        <button type="submit" disabled={submitting} className="fs-cp-btn">
                          {submitting ? text.btnSending : (<><Send size={20} /> {text.btnSend}</>)}
                        </button>
                      </form>
                    )}
                  </div>
                </FadeUp>

                <FadeUp delay={0.1}>
                  <div>
                    <h2 className="fs-cp-faq-title">{text.faqTitle}</h2>
                    <div className="fs-cp-faq-list">
                      {faqs.map(({ q, a }, i) => (
                        <motion.div
                          key={q}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="fs-cp-faq-item"
                        >
                          <p className="fs-cp-faq-q">{q}</p>
                          <p className="fs-cp-faq-a">{a}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </FadeUp>
              </div>
            </div>
          </section>
        </main>

        <PublicFooter />
      </div>
    </>
  );
}