import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { 
  PhoneCall, ShieldAlert, Flame, AlertTriangle, 
  Info, CheckCircle, Cloud, Leaf, Stethoscope, 
  LifeBuoy, MessageCircle, Mail, HeadphonesIcon 
} from "lucide-react";
import { PublicNavbar } from "../components/public/PublicNavbar";
import { PublicFooter } from "../components/public/PublicFooter";
import { useLanguage } from "../hooks/useLanguage";

// ─── Translations Dictionary ──────────────────────────────────────────────────
const t = {
  en: {
    heroBadge: "24/7 Assistance",
    heroTitle: "Help & Support",
    heroDesc: "Your safety and farming success are our priority. Find immediate emergency contacts and FasalSaathi application support below.",
    alertTitle: "Emergency Disclaimer",
    alertDesc: "In case of immediate physical danger, severe medical emergencies, or fire, please dial the National Emergency Number (112) immediately before seeking app support.",
    
    emTitle: "National Emergency Helplines",
    emKisan: "Kisan Call Center",
    emKisanDesc: "Agricultural guidance and expert farming advice.",
    emAmb: "Ambulance",
    emAmbDesc: "Medical emergencies and immediate health assistance.",
    emFire: "Fire Brigade",
    emFireDesc: "Report fires, crop burning accidents, or rescues.",
    emPolice: "Police",
    emPoliceDesc: "Law enforcement and immediate security assistance.",
    emDisaster: "Disaster Management",
    emDisasterDesc: "Help during floods, droughts, or severe weather.",
    emEmergency: "National Emergency",
    emEmergencyDesc: "All-in-one emergency helpline for any crisis.",

    appTitle: "FasalSaathi App Support",
    appWa: "WhatsApp Support",
    appWaDesc: "Chat with our support bot or a live agent instantly.",
    appEmail: "Email Support",
    appEmailDesc: "Send us a detailed query with screenshots.",
    appCall: "Customer Care",
    appCallDesc: "Speak directly with our support executives.",

    tipsTitle: "Support Tips",
    t1: "Keep your registered mobile number handy when calling support.",
    t2: "For app errors, taking a screenshot helps us resolve the issue faster.",
    t3: "Kisan Call Center (1551) operates from 6:00 AM to 10:00 PM on all 365 days.",
    t4: "Our email support team typically responds within 2 to 4 working hours.",
    t5: "Make sure you have the latest version of the FasalSaathi app installed.",
    t6: "Check the Guidelines page first—your question might already be answered!",

    ctaQuestion: "Want to learn how to use the app?",
    ctaSub: "Read our step-by-step user guidelines to master FasalSaathi.",
    ctaBtn: "View Guidelines →"
  },
  hi: {
    heroBadge: "24/7 सहायता",
    heroTitle: "मदद और समर्थन",
    heroDesc: "आपकी सुरक्षा और कृषि सफलता हमारी प्राथमिकता है। तत्काल आपातकालीन संपर्क और फसलसाथी ऐप सपोर्ट नीचे खोजें।",
    alertTitle: "आपातकालीन अस्वीकरण",
    alertDesc: "तत्काल शारीरिक खतरे, गंभीर चिकित्सा आपात स्थिति, या आग लगने की स्थिति में, कृपया ऐप समर्थन मांगने से पहले राष्ट्रीय आपातकालीन नंबर (112) डायल करें।",
    
    emTitle: "राष्ट्रीय आपातकालीन हेल्पलाइन",
    emKisan: "किसान कॉल सेंटर",
    emKisanDesc: "कृषि मार्गदर्शन और विशेषज्ञ खेती सलाह।",
    emAmb: "एम्बुलेंस",
    emAmbDesc: "चिकित्सा आपात स्थिति और तत्काल स्वास्थ्य सहायता।",
    emFire: "फायर ब्रिगेड",
    emFireDesc: "आग लगने या फसल जलने की दुर्घटनाओं की रिपोर्ट करें।",
    emPolice: "पुलिस",
    emPoliceDesc: "कानून व्यवस्था और तत्काल सुरक्षा सहायता।",
    emDisaster: "आपदा प्रबंधन",
    emDisasterDesc: "बाढ़, सूखा या खराब मौसम के दौरान मदद।",
    emEmergency: "राष्ट्रीय आपातकाल",
    emEmergencyDesc: "किसी भी संकट के लिए ऑल-इन-वन आपातकालीन हेल्पलाइन।",

    appTitle: "फसलसाथी ऐप सपोर्ट",
    appWa: "व्हाट्सएप सपोर्ट",
    appWaDesc: "हमारे सपोर्ट बॉट या लाइव एजेंट से तुरंत चैट करें।",
    appEmail: "ईमेल सपोर्ट",
    appEmailDesc: "स्क्रीनशॉट के साथ हमें एक विस्तृत प्रश्न भेजें।",
    appCall: "कस्टमर केयर",
    appCallDesc: "सीधे हमारे सहायता अधिकारियों से बात करें।",

    tipsTitle: "सहायता टिप्स",
    t1: "सपोर्ट को कॉल करते समय अपना पंजीकृत मोबाइल नंबर अपने पास रखें।",
    t2: "ऐप त्रुटियों के लिए, स्क्रीनशॉट लेने से हमें समस्या को तेज़ी से हल करने में मदद मिलती है।",
    t3: "किसान कॉल सेंटर (1551) सभी 365 दिन सुबह 6:00 बजे से रात 10:00 बजे तक काम करता है।",
    t4: "हमारी ईमेल सपोर्ट टीम आमतौर पर 2 से 4 कार्य घंटों के भीतर जवाब देती है।",
    t5: "सुनिश्चित करें कि आपके पास फसलसाथी ऐप का नवीनतम संस्करण स्थापित है।",
    t6: "पहले दिशानिर्देश पृष्ठ देखें—हो सकता है आपके प्रश्न का उत्तर पहले ही दिया जा चुका हो!",

    ctaQuestion: "ऐप का उपयोग करना सीखना चाहते हैं?",
    ctaSub: "फसलसाथी में महारत हासिल करने के लिए हमारे चरण-दर-चरण उपयोगकर्ता दिशानिर्देश पढ़ें।",
    ctaBtn: "दिशानिर्देश देखें →"
  },
  mr: {
    heroBadge: "२४/७ मदत",
    heroTitle: "मदत आणि समर्थन",
    heroDesc: "तुमची सुरक्षा आणि शेतीतील यश हे आमचे प्राधान्य आहे. खाली तातडीचे आपत्कालीन संपर्क आणि फसलसाथी ॲप सपोर्ट शोधा.",
    alertTitle: "आपत्कालीन सूचना",
    alertDesc: "तातडीचा शारीरिक धोका, गंभीर वैद्यकीय आणीबाणी किंवा आग लागल्यास, कृपया ॲप सपोर्ट घेण्यापूर्वी राष्ट्रीय आपत्कालीन क्रमांक (११२) डायल करा.",
    
    emTitle: "राष्ट्रीय आपत्कालीन हेल्पलाइन",
    emKisan: "किसान कॉल सेंटर",
    emKisanDesc: "कृषी मार्गदर्शन आणि तज्ञांचा शेती सल्ला.",
    emAmb: "रुग्णवाहिका",
    emAmbDesc: "वैद्यकीय आणीबाणी आणि तातडीची आरोग्य मदत.",
    emFire: "अग्निशमन दल",
    emFireDesc: "आग, पीक जळण्याच्या घटनांची तक्रार करा.",
    emPolice: "पोलीस",
    emPoliceDesc: "कायद्याची अंमलबजावणी आणि तातडीची सुरक्षा मदत.",
    emDisaster: "आपत्ती व्यवस्थापन",
    emDisasterDesc: "पूर, दुष्काळ किंवा खराब हवामानात मदत.",
    emEmergency: "राष्ट्रीय आणीबाणी",
    emEmergencyDesc: "कोणत्याही संकटासाठी ऑल-इन-वन आपत्कालीन हेल्पलाइन.",

    appTitle: "फसलसाथी ॲप सपोर्ट",
    appWa: "व्हॉट्सॲप सपोर्ट",
    appWaDesc: "आमच्या सपोर्ट बॉट किंवा प्रतिनिधीशी त्वरित चॅट करा.",
    appEmail: "ईमेल सपोर्ट",
    appEmailDesc: "स्क्रीनशॉटसह आम्हाला सविस्तर प्रश्न पाठवा.",
    appCall: "कस्टमर केअर",
    appCallDesc: "थेट आमच्या सपोर्ट अधिकाऱ्यांशी बोला.",

    tipsTitle: "सपोर्ट टिप्स",
    t1: "सपोर्टला कॉल करताना तुमचा नोंदणीकृत मोबाईल नंबर जवळ ठेवा.",
    t2: "ॲप एररसाठी, स्क्रीनशॉट घेतल्यास आम्हाला समस्या लवकर सोडवण्यास मदत होते.",
    t3: "किसान कॉल सेंटर (१५५१) सर्व ३६५ दिवस सकाळी ६:०० ते रात्री १०:०० पर्यंत चालते.",
    t4: "आमची ईमेल सपोर्ट टीम साधारणपणे २ ते ४ कामाच्या तासांत उत्तर देते.",
    t5: "तुमच्याकडे फसलसाथी ॲपची नवीनतम आवृत्ती इन्स्टॉल असल्याची खात्री करा.",
    t6: "प्रथम मार्गदर्शक तत्त्वे पृष्ठ तपासा—तुमच्या प्रश्नाचे उत्तर आधीच दिलेले असू शकते!",

    ctaQuestion: "ॲप कसे वापरावे हे शिकायचे आहे?",
    ctaSub: "फसलसाथी समजून घेण्यासाठी आमची मार्गदर्शक तत्त्वे वाचा.",
    ctaBtn: "मार्गदर्शक तत्त्वे पहा →"
  },
  pa: {
    heroBadge: "24/7 ਸਹਾਇਤਾ",
    heroTitle: "ਮਦਦ ਅਤੇ ਸਹਾਇਤਾ",
    heroDesc: "ਤੁਹਾਡੀ ਸੁਰੱਖਿਆ ਅਤੇ ਖੇਤੀ ਦੀ ਸਫਲਤਾ ਸਾਡੀ ਤਰਜੀਹ ਹੈ। ਹੇਠਾਂ ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ ਅਤੇ ਫਸਲਸਾਥੀ ਐਪ ਸਪੋਰਟ ਲੱਭੋ।",
    alertTitle: "ਐਮਰਜੈਂਸੀ ਬੇਦਾਅਵਾ",
    alertDesc: "ਤੁਰੰਤ ਸਰੀਰਕ ਖ਼ਤਰੇ, ਗੰਭੀਰ ਡਾਕਟਰੀ ਐਮਰਜੈਂਸੀ, ਜਾਂ ਅੱਗ ਲੱਗਣ ਦੀ ਸਥਿਤੀ ਵਿੱਚ, ਕਿਰਪਾ ਕਰਕੇ ਐਪ ਸਹਾਇਤਾ ਲੈਣ ਤੋਂ ਪਹਿਲਾਂ ਰਾਸ਼ਟਰੀ ਐਮਰਜੈਂਸੀ ਨੰਬਰ (112) ਡਾਇਲ ਕਰੋ।",
    
    emTitle: "ਰਾਸ਼ਟਰੀ ਐਮਰਜੈਂਸੀ ਹੈਲਪਲਾਈਨਾਂ",
    emKisan: "ਕਿਸਾਨ ਕਾਲ ਸੈਂਟਰ",
    emKisanDesc: "ਖੇਤੀਬਾੜੀ ਮਾਰਗਦਰਸ਼ਨ ਅਤੇ ਮਾਹਰ ਖੇਤੀ ਸਲਾਹ।",
    emAmb: "ਐਂਬੂਲੈਂਸ",
    emAmbDesc: "ਡਾਕਟਰੀ ਐਮਰਜੈਂਸੀ ਅਤੇ ਤੁਰੰਤ ਸਿਹਤ ਸਹਾਇਤਾ।",
    emFire: "ਫਾਇਰ ਬ੍ਰਿਗੇਡ",
    emFireDesc: "ਅੱਗ, ਫਸਲਾਂ ਸੜਨ ਦੀਆਂ ਘਟਨਾਵਾਂ ਦੀ ਰਿਪੋਰਟ ਕਰੋ।",
    emPolice: "ਪੁਲਿਸ",
    emPoliceDesc: "ਕਾਨੂੰਨ ਲਾਗੂ ਕਰਨਾ ਅਤੇ ਤੁਰੰਤ ਸੁਰੱਖਿਆ ਸਹਾਇਤਾ।",
    emDisaster: "ਆਫ਼ਤ ਪ੍ਰਬੰਧਨ",
    emDisasterDesc: "ਹੜ੍ਹਾਂ, ਸੋਕੇ ਜਾਂ ਖਰਾਬ ਮੌਸਮ ਦੌਰਾਨ ਮਦਦ।",
    emEmergency: "ਰਾਸ਼ਟਰੀ ਐਮਰਜੈਂਸੀ",
    emEmergencyDesc: "ਕਿਸੇ ਵੀ ਸੰਕਟ ਲਈ ਆਲ-ਇਨ-ਵਨ ਐਮਰਜੈਂਸੀ ਹੈਲਪਲਾਈਨ।",

    appTitle: "ਫਸਲਸਾਥੀ ਐਪ ਸਪੋਰਟ",
    appWa: "ਵਟਸਐਪ ਸਪੋਰਟ",
    appWaDesc: "ਸਾਡੇ ਸਪੋਰਟ ਬੋਟ ਜਾਂ ਏਜੰਟ ਨਾਲ ਤੁਰੰਤ ਗੱਲਬਾਤ ਕਰੋ।",
    appEmail: "ਈਮੇਲ ਸਪੋਰਟ",
    appEmailDesc: "ਸਕ੍ਰੀਨਸ਼ੌਟਸ ਦੇ ਨਾਲ ਸਾਨੂੰ ਇੱਕ ਵਿਸਤ੍ਰਿਤ ਸਵਾਲ ਭੇਜੋ।",
    appCall: "ਗਾਹਕ ਸੇਵਾ",
    appCallDesc: "ਸਿੱਧਾ ਸਾਡੇ ਸਪੋਰਟ ਐਗਜ਼ੀਕਿਊਟਿਵ ਨਾਲ ਗੱਲ ਕਰੋ।",

    tipsTitle: "ਸਪੋਰਟ ਟਿਪਸ",
    t1: "ਸਪੋਰਟ ਨੂੰ ਕਾਲ ਕਰਨ ਵੇਲੇ ਆਪਣਾ ਰਜਿਸਟਰਡ ਮੋਬਾਈਲ ਨੰਬਰ ਆਪਣੇ ਕੋਲ ਰੱਖੋ।",
    t2: "ਐਪ ਦੀਆਂ ਗਲਤੀਆਂ ਲਈ, ਸਕ੍ਰੀਨਸ਼ੌਟ ਲੈਣ ਨਾਲ ਸਾਨੂੰ ਸਮੱਸਿਆ ਨੂੰ ਜਲਦੀ ਹੱਲ ਕਰਨ ਵਿੱਚ ਮਦਦ ਮਿਲਦੀ ਹੈ।",
    t3: "ਕਿਸਾਨ ਕਾਲ ਸੈਂਟਰ (1551) ਸਾਰੇ 365 ਦਿਨ ਸਵੇਰੇ 6:00 ਵਜੇ ਤੋਂ ਰਾਤ 10:00 ਵਜੇ ਤੱਕ ਕੰਮ ਕਰਦਾ ਹੈ।",
    t4: "ਸਾਡੀ ਈਮੇਲ ਸਪੋਰਟ ਟੀਮ ਆਮ ਤੌਰ 'ਤੇ 2 ਤੋਂ 4 ਕੰਮਕਾਜੀ ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਜਵਾਬ ਦਿੰਦੀ ਹੈ।",
    t5: "ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਤੁਹਾਡੇ ਕੋਲ ਫਸਲਸਾਥੀ ਐਪ ਦਾ ਨਵੀਨਤਮ ਸੰਸਕਰਣ ਸਥਾਪਤ ਹੈ।",
    t6: "ਪਹਿਲਾਂ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ ਪੰਨੇ ਦੀ ਜਾਂਚ ਕਰੋ—ਤੁਹਾਡੇ ਸਵਾਲ ਦਾ ਜਵਾਬ ਪਹਿਲਾਂ ਹੀ ਦਿੱਤਾ ਗਿਆ ਹੋ ਸਕਦਾ ਹੈ!",

    ctaQuestion: "ਐਪ ਦੀ ਵਰਤੋਂ ਕਰਨਾ ਸਿੱਖਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
    ctaSub: "ਫਸਲਸਾਥੀ ਵਿੱਚ ਮੁਹਾਰਤ ਹਾਸਲ ਕਰਨ ਲਈ ਸਾਡੇ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ ਪੜ੍ਹੋ।",
    ctaBtn: "ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ ਦੇਖੋ →"
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
export function SupportPage() {
  const { lang } = useLanguage();
  const text = t[lang as keyof typeof t] || t.en;

  // Emergency Contacts Structured Data
  const emergencies = [
    { icon: PhoneCall, title: text.emKisan, number: "1551", desc: text.emKisanDesc, theme: "green" },
    { icon: Stethoscope, title: text.emAmb, number: "108", desc: text.emAmbDesc, theme: "blue" },
    { icon: Flame, title: text.emFire, number: "101", desc: text.emFireDesc, theme: "orange" },
    { icon: ShieldAlert, title: text.emPolice, number: "100", desc: text.emPoliceDesc, theme: "red" },
    { icon: LifeBuoy, title: text.emDisaster, number: "1078", desc: text.emDisasterDesc, theme: "purple" },
    { icon: AlertTriangle, title: text.emEmergency, number: "112", desc: text.emEmergencyDesc, theme: "teal" },
  ];

  // App Support Structured Data
  const appSupports = [
    { icon: MessageCircle, title: text.appWa, action: "Chat Now", desc: text.appWaDesc, theme: "green", link: "#" },
    { icon: Mail, title: text.appEmail, action: "support@fasalsaathi.in", desc: text.appEmailDesc, theme: "blue", link: "mailto:support@fasalsaathi.in" },
    { icon: HeadphonesIcon, title: text.appCall, action: "1800-123-4567", desc: text.appCallDesc, theme: "orange", link: "tel:18001234567" },
  ];

  const tips = [
    { icon: "📱", text: text.t1 },
    { icon: "📸", text: text.t2 },
    { icon: "⏱️", text: text.t3 },
    { icon: "✉️", text: text.t4 },
    { icon: "🔄", text: text.t5 },
    { icon: "📖", text: text.t6 },
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        .fs-sp-wrapper {
          --sp-font-body: 'Inter', system-ui, sans-serif;
          --sp-font-display: 'Poppins', system-ui, sans-serif;
          --sp-primary: #16a34a; --sp-primary-dark: #15803d; --sp-primary-light: #dcfce7;
          --sp-text-dark: #111827; --sp-text-muted: #374151; --sp-text-light: #ffffff;
          font-family: var(--sp-font-body); background-color: #f8fafc; color: var(--sp-text-dark);
          display: flex; flex-direction: column; min-height: 100vh; overflow-x: hidden;
        }

        /* Widened container to 80rem so it feels much larger and less cramped */
        .fs-sp-container { max-width: 80rem; margin: 0 auto; padding: 0 1.25rem; width: 100%; box-sizing: border-box; }
        @media (min-width: 640px) { .fs-sp-container { padding: 0 2rem; } }

        .fs-sp-h1 { font-family: var(--sp-font-display); font-size: 2.75rem; font-weight: 800; line-height: 1.2; margin-bottom: 1.25rem; color: var(--sp-text-light); }
        @media (min-width: 640px) { .fs-sp-h1 { font-size: 3.5rem; } }
        
        .fs-sp-h2 { font-family: var(--sp-font-display); font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--sp-text-dark); }
        .fs-sp-card-title { font-family: var(--sp-font-display); font-size: 1.5rem; font-weight: 700; color: var(--sp-text-dark); margin: 0; }

        .fs-sp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem 1.75rem; border-radius: 0.75rem; font-size: 1.125rem; font-weight: 600; cursor: pointer; transition: transform 0.2s ease, background-color 0.2s ease; text-decoration: none; border: none; font-family: inherit; background-color: var(--sp-primary); color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .fs-sp-btn:hover { background-color: var(--sp-primary-dark); transform: translateY(-2px); }

        /* Bigger Icons */
        .fs-sp-icon-box { width: 3.5rem; height: 3.5rem; border-radius: 0.875rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .fs-sp-icon-green { background-color: #f0fdf4; color: #16a34a; }
        .fs-sp-icon-blue { background-color: #eff6ff; color: #2563eb; }
        .fs-sp-icon-orange { background-color: #fff7ed; color: #ea580c; }
        .fs-sp-icon-red { background-color: #fef2f2; color: #dc2626; }
        .fs-sp-icon-purple { background-color: #faf5ff; color: #9333ea; }
        .fs-sp-icon-teal { background-color: #f0fdfa; color: #0d9488; }

        /* -- ANIMATED HERO (FARMING THEME) -- */
        .fs-sp-hero { position: relative; padding-top: 9rem; padding-bottom: 5rem; background: linear-gradient(180deg, #064e3b 0%, #022c22 100%); text-align: center; overflow: hidden; }
        @media (min-width: 768px) { .fs-sp-hero { padding-top: 11rem; } }
        
        .fs-sp-hero-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }

        @keyframes sunPulse { 0% { transform: scale(1); box-shadow: 0 0 50px 20px rgba(250, 204, 21, 0.2); } 100% { transform: scale(1.05); box-shadow: 0 0 80px 40px rgba(250, 204, 21, 0.4); } }
        .fs-sp-bg-sun { position: absolute; top: 15%; right: 20%; width: 140px; height: 140px; background: #facc15; border-radius: 50%; opacity: 0.6; animation: sunPulse 5s ease-in-out infinite alternate; filter: blur(20px); }

        @keyframes floatCloud { 0% { transform: translateX(-15vw); } 100% { transform: translateX(115vw); } }
        .fs-sp-bg-cloud { position: absolute; color: rgba(255, 255, 255, 0.08); animation: floatCloud linear infinite; }
        .fs-sp-bg-cloud-1 { top: 10%; left: -20%; animation-duration: 45s; animation-delay: -10s; }
        .fs-sp-bg-cloud-2 { top: 25%; left: -20%; animation-duration: 65s; animation-delay: -35s; transform: scale(1.5); color: rgba(255, 255, 255, 0.04); }

        @keyframes waveHills { 0% { transform: translateX(0) scaleY(1); } 50% { transform: translateX(-2%) scaleY(1.05); } 100% { transform: translateX(0) scaleY(1); } }
        .fs-sp-bg-hill { position: absolute; bottom: -5%; width: 120%; border-radius: 50% 50% 0 0 / 100% 100% 0 0; animation: waveHills 10s ease-in-out infinite; }
        .fs-sp-bg-hill-1 { left: -5%; background: rgba(20, 83, 45, 0.5); z-index: 1; height: 35%; animation-duration: 12s; }
        .fs-sp-bg-hill-2 { left: -10%; background: rgba(6, 95, 70, 0.7); z-index: 2; height: 25%; animation-delay: -5s; }

        @keyframes leafFall { 0% { transform: translate(0, -50px) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translate(-150px, 100vh) rotate(720deg); opacity: 0; } }
        .fs-sp-bg-leaf { position: absolute; top: -10%; background: linear-gradient(135deg, #4ade80, #16a34a); border-radius: 50% 0 50% 0; opacity: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); animation: leafFall linear infinite; }
        .fs-sp-l-1 { left: 15%; width: 16px; height: 16px; animation-duration: 12s; animation-delay: 0s; }
        .fs-sp-l-2 { left: 40%; width: 12px; height: 12px; animation-duration: 16s; animation-delay: 3s; }
        .fs-sp-l-3 { left: 65%; width: 20px; height: 20px; animation-duration: 14s; animation-delay: 1s; background: linear-gradient(135deg, #facc15, #ca8a04); }

        .fs-sp-noise { position: absolute; inset: 0; background-image: url('https://grainy-gradients.vercel.app/noise.svg'); opacity: 0.2; mix-blend-mode: overlay; z-index: 3;}

        .fs-sp-hero-content { position: relative; z-index: 10; }
        .fs-sp-hero-badge { display: inline-block; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #ffffff; font-size: 0.875rem; font-weight: 600; padding: 0.375rem 1rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.25rem; }
        /* Increased hero paragraph text */
        .fs-sp-hero-p { color: #d1fae5; font-size: 1.25rem; max-width: 48rem; margin: 0 auto; line-height: 1.625; font-weight: 400; opacity: 0.95; }

        /* -- ALERT BOX (Bigger Text) -- */
        .fs-sp-alert-wrap { padding-top: 3rem; }
        .fs-sp-alert { display: flex; align-items: flex-start; gap: 1rem; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 1rem; padding: 1.5rem; }
        .fs-sp-alert-title { font-weight: 700; color: #991b1b; font-size: 1.125rem; margin-bottom: 0.375rem; }
        .fs-sp-alert-desc { color: #b91c1c; font-size: 1rem; line-height: 1.625; margin: 0; font-weight: 500;}

        /* -- SECTIONS & MAIN CARDS -- */
        .fs-sp-sections-wrap { padding: 4rem 0 5rem; display: flex; flex-direction: column; gap: 4rem; }
        
        .fs-sp-main-card { background-color: #ffffff; border: 1px solid #f3f4f6; border-radius: 1.25rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); overflow: hidden; }
        .fs-sp-card-header { display: flex; align-items: center; gap: 1rem; padding: 2rem; background-color: #f9fafb; border-bottom: 1px solid #f3f4f6; }
        .fs-sp-card-body { padding: 2rem; }

        /* -- INNER GRIDS -- */
        .fs-sp-grid-2 { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
        @media (min-width: 768px) { .fs-sp-grid-2 { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; } }
        @media (min-width: 1024px) { .fs-sp-grid-2 { grid-template-columns: repeat(3, 1fr); gap: 2rem; } }
        
        .fs-sp-contact-item { display: flex; flex-direction: column; gap: 1.25rem; padding: 1.5rem; border-radius: 1rem; border: 1px solid #e5e7eb; transition: all 0.2s; text-decoration: none; background: #ffffff;}
        .fs-sp-contact-item:hover { border-color: var(--sp-primary); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); transform: translateY(-3px); }
        
        .fs-sp-item-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;}
        /* Increased Titles & Descriptions inside the cards */
        .fs-sp-item-title { font-family: var(--sp-font-display); font-size: 1.25rem; font-weight: 700; color: var(--sp-text-dark); margin: 0 0 0.5rem 0; }
        .fs-sp-item-desc { font-size: 1rem; color: var(--sp-text-muted); line-height: 1.6; margin: 0; font-weight: 500;}
        
        .fs-sp-item-action { display: inline-flex; align-items: center; font-family: var(--sp-font-display); font-size: 1.125rem; font-weight: 700; color: var(--sp-primary); background: #f0fdf4; padding: 0.625rem 1.25rem; border-radius: 0.75rem; align-self: flex-start; margin-top: auto;}

        /* -- TIPS SECTION (Bigger Text) -- */
        .fs-sp-tips-section { background-color: #f0fdf4; padding: 5rem 0; border-top: 1px solid #dcfce7; border-bottom: 1px solid #dcfce7;}
        .fs-sp-tips-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2.5rem; }
        .fs-sp-tips-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
        @media (min-width: 640px) { .fs-sp-tips-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .fs-sp-tips-grid { grid-template-columns: 1fr 1fr 1fr; } }
        
        .fs-sp-tip-card { display: flex; align-items: flex-start; gap: 1rem; background-color: #ffffff; border: 1px solid #dcfce7; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.05);}
        .fs-sp-tip-icon { font-size: 1.75rem; flex-shrink: 0; line-height: 1; }
        .fs-sp-tip-text { font-size: 1.05rem; color: var(--sp-text-muted); line-height: 1.625; margin: 0; font-weight: 500;}

        /* -- CTA SECTION (Bigger Text) -- */
        .fs-sp-cta-section { background-color: #ffffff; padding: 4rem 0; text-align: center; }
        .fs-sp-cta-header { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 1rem; }
        .fs-sp-cta-title { font-weight: 600; color: var(--sp-text-dark); margin: 0; font-size: 1.25rem;}
        .fs-sp-cta-desc { font-size: 1.125rem; color: var(--sp-text-muted); margin: 0 0 1.5rem 0; }
      `}</style>

      <div className="fs-sp-wrapper">
        <PublicNavbar />

        <main style={{ flex: 1 }}>
          {/* Animated Hero Section */}
          <section className="fs-sp-hero">
            <div className="fs-sp-hero-bg">
              <div className="fs-sp-bg-sun" />
              <Cloud className="fs-sp-bg-cloud fs-sp-bg-cloud-1" size={180} />
              <Cloud className="fs-sp-bg-cloud fs-sp-bg-cloud-2" size={280} />
              <div className="fs-sp-bg-hill fs-sp-bg-hill-1" />
              <div className="fs-sp-bg-hill fs-sp-bg-hill-2" />
              <div className="fs-sp-bg-leaf fs-sp-l-1" />
              <div className="fs-sp-bg-leaf fs-sp-l-2" />
              <div className="fs-sp-bg-leaf fs-sp-l-3" />
              <div className="fs-sp-noise" />
            </div>

            <div className="fs-sp-container fs-sp-hero-content">
              <FadeUp delay={0.1}>
                <span className="fs-sp-hero-badge">{text.heroBadge}</span>
              </FadeUp>
              <FadeUp delay={0.2}>
                <h1 className="fs-sp-h1">{text.heroTitle}</h1>
              </FadeUp>
              <FadeUp delay={0.3}>
                <p className="fs-sp-hero-p">{text.heroDesc}</p>
              </FadeUp>
            </div>
          </section>

          {/* Alert Box */}
          <div className="fs-sp-container fs-sp-alert-wrap">
            <FadeUp>
              <div className="fs-sp-alert">
                <AlertTriangle size={28} color="#dc2626" style={{ marginTop: '0.125rem', flexShrink: 0 }} />
                <div>
                  <p className="fs-sp-alert-title">{text.alertTitle}</p>
                  <p className="fs-sp-alert-desc">{text.alertDesc}</p>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Main Content Sections */}
          <div className="fs-sp-container fs-sp-sections-wrap">
            
            {/* Section 1: Emergency Contacts */}
            <FadeUp delay={0.1}>
              <div className="fs-sp-main-card">
                <div className="fs-sp-card-header">
                  <div className="fs-sp-icon-box fs-sp-icon-red">
                    <ShieldAlert size={28} />
                  </div>
                  <h2 className="fs-sp-card-title">{text.emTitle}</h2>
                </div>
                <div className="fs-sp-card-body">
                  <div className="fs-sp-grid-2">
                    {emergencies.map((em, idx) => (
                      <motion.a
                        href={`tel:${em.number}`}
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="fs-sp-contact-item"
                      >
                        <div className="fs-sp-item-header">
                          <div>
                            <p className="fs-sp-item-title">{em.title}</p>
                            <p className="fs-sp-item-desc">{em.desc}</p>
                          </div>
                          <div className={`fs-sp-icon-box fs-sp-icon-${em.theme}`}>
                            <em.icon size={22} />
                          </div>
                        </div>
                        <div className="fs-sp-item-action">
                          <PhoneCall size={20} style={{ marginRight: '0.625rem' }} />
                          {em.number}
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Section 2: App Support */}
            <FadeUp delay={0.2}>
              <div className="fs-sp-main-card">
                <div className="fs-sp-card-header">
                  <div className="fs-sp-icon-box fs-sp-icon-blue">
                    <HeadphonesIcon size={28} />
                  </div>
                  <h2 className="fs-sp-card-title">{text.appTitle}</h2>
                </div>
                <div className="fs-sp-card-body">
                  <div className="fs-sp-grid-2">
                    {appSupports.map((app, idx) => (
                      <motion.a
                        href={app.link}
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="fs-sp-contact-item"
                      >
                        <div className="fs-sp-item-header">
                          <div>
                            <p className="fs-sp-item-title">{app.title}</p>
                            <p className="fs-sp-item-desc">{app.desc}</p>
                          </div>
                          <div className={`fs-sp-icon-box fs-sp-icon-${app.theme}`}>
                            <app.icon size={22} />
                          </div>
                        </div>
                        <div className="fs-sp-item-action">
                          {app.action}
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>

          </div>

          {/* Dynamic Tips Section */}
          <section className="fs-sp-tips-section">
            <div className="fs-sp-container">
              <FadeUp className="fs-sp-tips-header">
                <Info size={32} color="var(--sp-primary)" />
                <h2 className="fs-sp-h2" style={{ margin: 0 }}>{text.tipsTitle}</h2>
              </FadeUp>
              <div className="fs-sp-tips-grid">
                {tips.map(({ icon, text }, i) => (
                  <FadeUp key={i} delay={i * 0.08}>
                    <div className="fs-sp-tip-card">
                      <span className="fs-sp-tip-icon">{icon}</span>
                      <p className="fs-sp-tip-text">{text}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="fs-sp-cta-section">
            <div className="fs-sp-container">
              <FadeUp>
                <div className="fs-sp-cta-header">
                  <CheckCircle size={24} color="var(--sp-primary)" />
                  <p className="fs-sp-cta-title">{text.ctaQuestion}</p>
                </div>
                <p className="fs-sp-cta-desc">{text.ctaSub}</p>
                <a href="/guidelines" className="fs-sp-btn">
                  {text.ctaBtn}
                </a>
              </FadeUp>
            </div>
          </section>
        </main>

        <PublicFooter />
      </div>
    </>
  );
}