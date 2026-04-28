import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  X, 
  Zap, 
  Star, 
  ShieldCheck, 
  RotateCcw, 
  Award, 
  Headset,
  Plus,
  Minus,
  Cloud
} from "lucide-react";
import { PublicNavbar } from "../components/public/PublicNavbar";
import { PublicFooter } from "../components/public/PublicFooter";
import { useLanguage } from "../hooks/useLanguage";

// ─── Translations Dictionary ──────────────────────────────────────────────────
const t = {
  en: {
    heroBadge: "Simple & Transparent",
    heroTitle1: "Plans for",
    heroTitle2: "Every Farm",
    heroDesc: "Start free. Upgrade when you're ready to maximize your yield. No hidden fees, cancel anytime.",
    
    // Plans
    p1Name: "Kisan Basic", p1Sub: "(किसान बेसिक)", p1Price: "₹0", p1Period: "Forever Free", p1Desc: "Perfect for small farmers getting started with digital farming.", p1Btn: "Get Started Free",
    p2Name: "Kisan Pro", p2Sub: "(किसान प्रो)", p2Price: "₹99", p2Period: "per month", p2Desc: "For serious farmers who want the full power of AI-driven farming.", p2Btn: "Start Pro — ₹99/mo", p2Badge: "Most Popular",
    p3Name: "Kisan Enterprise", p3Sub: "(किसान एंटरप्राइज)", p3Price: "Custom", p3Period: "contact us", p3Desc: "Tailored for FPOs, cooperatives, and agricultural NGOs.", p3Btn: "Contact Sales",

    // Features
    fTitle: "What's included",
    fCurrentWx: "Real-time weather (current)",
    f3DayWx: "3-day weather forecast",
    f10DayWx: "10-day detailed forecast",
    fMarket5: "Market prices (5 crops)",
    fMarketUnl: "Unlimited market price tracking",
    fCropBasic: "Basic crop recommendations",
    fCropAI: "AI crop recommendations",
    fProfile1: "1 farm profile",
    fProfile5: "Up to 5 farm profiles",
    fProfileUnl: "Unlimited farm profiles",
    fLang2: "Hindi & English language",
    fLang3: "Hindi, Marathi & English",
    fDiseaseNo: "Plant disease detection",
    fDiseaseYes: "Plant disease detection (unlimited)",
    fAlerts: "Price alerts & notifications",
    fYield: "Yield prediction & analytics",
    fExpense: "Farm expense tracker",
    fSupportPri: "Priority email support",
    fSupportPhone: "Phone support (24/7)",
    fEverything: "Everything in Pro",
    fMultiUser: "Multi-user access",
    fCustomCrop: "Custom crop database",
    fApi: "API integration support",
    fReports: "Custom reporting & exports",
    fWhiteLabel: "White-label option",
    fAccountMgr: "Dedicated account manager",
    fTraining: "On-site training",
    fSla: "SLA guarantee (99.9%)",

    // Guarantees
    g1: "Secure Payments via Razorpay",
    g2: "Cancel Anytime, No Questions",
    g3: "30-Day Money-Back Guarantee",
    g4: "Friendly Support in Hindi & English",

    // FAQ
    faqLabel: "Support",
    faqTitle: "Frequently Asked Questions",
    faqDesc1: "Can't find your answer?",
    faqDesc2: "Contact our support team.",
    q1: "Is the free plan really free forever?", a1: "Yes! The Kisan Basic plan is completely free with no time limit. You get real-time weather, 3-day forecasts, and market prices for 5 crops at no cost.",
    q2: "Can I switch plans anytime?", a2: "Absolutely. You can upgrade to Pro or downgrade to Basic at any time. Downgrades take effect at the end of the billing cycle.",
    q3: "Is my payment information secure?", a3: "All payments are processed via Razorpay, a PCI-DSS compliant payment gateway. We never store your card details.",
    q4: "Do you offer discounts for farmer groups?", a4: "Yes! FPOs and cooperatives with 10+ members get special group pricing. Contact us for a custom quote."
  },
  hi: {
    heroBadge: "सरल और पारदर्शी",
    heroTitle1: "हर खेत के लिए",
    heroTitle2: "योजनाएं",
    heroDesc: "मुफ्त शुरू करें। जब आप उपज बढ़ाने के लिए तैयार हों तो अपग्रेड करें। कोई छिपी हुई फीस नहीं, कभी भी रद्द करें।",
    
    p1Name: "किसान बेसिक", p1Sub: "(मुफ्त)", p1Price: "₹0", p1Period: "हमेशा मुफ्त", p1Desc: "डिजिटल खेती शुरू करने वाले छोटे किसानों के लिए एकदम सही।", p1Btn: "मुफ्त शुरू करें",
    p2Name: "किसान प्रो", p2Sub: "(प्रीमियम)", p2Price: "₹99", p2Period: "प्रति माह", p2Desc: "गंभीर किसानों के लिए जो AI-संचालित खेती की पूरी शक्ति चाहते हैं।", p2Btn: "प्रो शुरू करें — ₹99/माह", p2Badge: "सबसे लोकप्रिय",
    p3Name: "किसान एंटरप्राइज", p3Sub: "(संस्थाओं के लिए)", p3Price: "कस्टम", p3Period: "संपर्क करें", p3Desc: "FPO, सहकारी समितियों और कृषि NGO के लिए तैयार किया गया।", p3Btn: "संपर्क करें",

    fTitle: "इसमें क्या शामिल है",
    fCurrentWx: "रियल-टाइम मौसम (वर्तमान)",
    f3DayWx: "3-दिन का मौसम पूर्वानुमान",
    f10DayWx: "10-दिन का विस्तृत पूर्वानुमान",
    fMarket5: "मंडी भाव (5 फसलें)",
    fMarketUnl: "असीमित मंडी भाव ट्रैकिंग",
    fCropBasic: "बुनियादी फसल सिफारिशें",
    fCropAI: "AI फसल सिफारिशें",
    fProfile1: "1 खेत प्रोफ़ाइल",
    fProfile5: "5 खेत प्रोफ़ाइल तक",
    fProfileUnl: "असीमित खेत प्रोफ़ाइल",
    fLang2: "हिंदी और अंग्रेजी भाषा",
    fLang3: "हिंदी, मराठी और अंग्रेजी",
    fDiseaseNo: "पौधों के रोग की पहचान",
    fDiseaseYes: "पौधों के रोग की पहचान (असीमित)",
    fAlerts: "मूल्य अलर्ट और सूचनाएं",
    fYield: "उपज की भविष्यवाणी और विश्लेषण",
    fExpense: "खेत खर्च ट्रैकर",
    fSupportPri: "प्राथमिकता ईमेल सहायता",
    fSupportPhone: "फ़ोन सहायता (24/7)",
    fEverything: "प्रो की सभी सुविधाएं",
    fMultiUser: "मल्टी-यूज़र एक्सेस",
    fCustomCrop: "कस्टम फसल डेटाबेस",
    fApi: "API एकीकरण समर्थन",
    fReports: "कस्टम रिपोर्टिंग",
    fWhiteLabel: "व्हाइट-लेबल विकल्प",
    fAccountMgr: "समर्पित खाता प्रबंधक",
    fTraining: "ऑन-साइट प्रशिक्षण",
    fSla: "SLA गारंटी (99.9%)",

    g1: "रेज़रपे द्वारा सुरक्षित भुगतान",
    g2: "कभी भी रद्द करें, कोई सवाल नहीं",
    g3: "30-दिन की मनी-बैक गारंटी",
    g4: "हिंदी और अंग्रेजी में मैत्रीपूर्ण सहायता",

    faqLabel: "सहायता",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faqDesc1: "क्या आपको अपना जवाब नहीं मिला?",
    faqDesc2: "हमारी सहायता टीम से संपर्क करें।",
    q1: "क्या मुफ्त योजना वास्तव में हमेशा के लिए मुफ्त है?", a1: "हाँ! किसान बेसिक योजना बिना किसी समय सीमा के पूरी तरह से मुफ़्त है।",
    q2: "क्या मैं कभी भी योजना बदल सकता हूँ?", a2: "बिल्कुल। आप किसी भी समय प्रो में अपग्रेड कर सकते हैं या बेसिक में डाउनग्रेड कर सकते हैं।",
    q3: "क्या मेरी भुगतान जानकारी सुरक्षित है?", a3: "सभी भुगतान रेज़रपे के माध्यम से संसाधित किए जाते हैं। हम कभी भी आपके कार्ड का विवरण संग्रहीत नहीं करते हैं।",
    q4: "क्या आप किसान समूहों के लिए छूट प्रदान करते हैं?", a4: "हाँ! 10+ सदस्यों वाले FPO को विशेष मूल्य निर्धारण मिलता है। कस्टम कोट के लिए हमसे संपर्क करें।"
  },
  mr: {
    heroBadge: "साधे आणि पारदर्शक",
    heroTitle1: "प्रत्येक शेतासाठी",
    heroTitle2: "प्लॅन्स",
    heroDesc: "मोफत सुरू करा. जेव्हा तुम्ही तयार असाल तेव्हा अपग्रेड करा. कोणतेही छुपे शुल्क नाही, कधीही रद्द करा.",
    
    p1Name: "किसान बेसिक", p1Sub: "(मोफत)", p1Price: "₹0", p1Period: "कायम मोफत", p1Desc: "डिजिटल शेती सुरू करणाऱ्या लहान शेतकर्‍यांसाठी योग्य.", p1Btn: "मोफत सुरू करा",
    p2Name: "किसान प्रो", p2Sub: "(प्रीमियम)", p2Price: "₹99", p2Period: "प्रति महिना", p2Desc: "AI-सक्षम शेतीची पूर्ण ताकद हवी असलेल्या शेतकर्‍यांसाठी.", p2Btn: "प्रो सुरू करा — ₹99/महिना", p2Badge: "सर्वाधिक लोकप्रिय",
    p3Name: "किसान एंटरप्राइज", p3Sub: "(संस्थांसाठी)", p3Price: "कस्टम", p3Period: "संपर्क करा", p3Desc: "FPO, सहकारी संस्था आणि कृषी NGO साठी.", p3Btn: "सेल्सशी संपर्क साधा",

    fTitle: "यामध्ये काय समाविष्ट आहे",
    fCurrentWx: "थेट हवामान (सध्याचे)",
    f3DayWx: "३-दिवसांचा हवामान अंदाज",
    f10DayWx: "१०-दिवसांचा सविस्तर अंदाज",
    fMarket5: "बाजारभाव (५ पिके)",
    fMarketUnl: "अमर्यादित बाजारभाव ट्रॅकिंग",
    fCropBasic: "मूलभूत पीक शिफारसी",
    fCropAI: "AI पीक शिफारसी",
    fProfile1: "१ शेत प्रोफाइल",
    fProfile5: "५ शेत प्रोफाइल्स",
    fProfileUnl: "अमर्यादित शेत प्रोफाइल्स",
    fLang2: "हिंदी आणि इंग्रजी भाषा",
    fLang3: "हिंदी, मराठी आणि इंग्रजी",
    fDiseaseNo: "वनस्पती रोग ओळख",
    fDiseaseYes: "वनस्पती रोग ओळख (अमर्यादित)",
    fAlerts: "किंमत अलर्ट आणि सूचना",
    fYield: "उत्पन्नाचा अंदाज आणि विश्लेषण",
    fExpense: "शेती खर्च ट्रॅकर",
    fSupportPri: "प्राधान्य ईमेल सपोर्ट",
    fSupportPhone: "फोन सपोर्ट (२४/७)",
    fEverything: "प्रो मधील सर्व काही",
    fMultiUser: "मल्टी-युजर अ‍ॅक्सेस",
    fCustomCrop: "कस्टम पीक डेटाबेस",
    fApi: "API इंटिग्रेशन सपोर्ट",
    fReports: "कस्टम रिपोर्टिंग",
    fWhiteLabel: "व्हाईट-लेबल पर्याय",
    fAccountMgr: "स्वतंत्र खाते व्यवस्थापक",
    fTraining: "ऑन-साइट प्रशिक्षण",
    fSla: "SLA हमी (९९.९%)",

    g1: "Razorpay द्वारे सुरक्षित पेमेंट",
    g2: "कधीही रद्द करा, प्रश्न विचारले जाणार नाहीत",
    g3: "३०-दिवसांची मनी-बॅक हमी",
    g4: "मराठी, हिंदी आणि इंग्रजीमध्ये सपोर्ट",

    faqLabel: "सपोर्ट",
    faqTitle: "वारंवार विचारले जाणारे प्रश्न",
    faqDesc1: "तुमचे उत्तर सापडत नाही?",
    faqDesc2: "आमच्या सपोर्ट टीमशी संपर्क साधा.",
    q1: "मोफत प्लॅन खरोखरच कायम मोफत आहे का?", a1: "होय! किसान बेसिक प्लॅन कोणत्याही वेळेच्या मर्यादेशिवाय पूर्णपणे मोफत आहे.",
    q2: "मी कधीही प्लॅन बदलू शकतो का?", a2: "नक्कीच. तुम्ही कधीही प्रो मध्ये अपग्रेड करू शकता किंवा बेसिक मध्ये डाउनग्रेड करू शकता.",
    q3: "माझी पेमेंट माहिती सुरक्षित आहे का?", a3: "सर्व पेमेंट्स Razorpay द्वारे सुरक्षितपणे हाताळले जातात. आम्ही कार्ड तपशील सेव्ह करत नाही.",
    q4: "तुम्ही शेतकरी गटांसाठी सवलत देता का?", a4: "होय! १०+ सदस्य असलेल्या FPO आणि सहकारी संस्थांना विशेष सवलत मिळते."
  },
  pa: {
    heroBadge: "ਸਧਾਰਨ ਅਤੇ ਪਾਰਦਰਸ਼ੀ",
    heroTitle1: "ਹਰ ਖੇਤ ਲਈ",
    heroTitle2: "ਯੋਜਨਾਵਾਂ",
    heroDesc: "ਮੁਫਤ ਸ਼ੁਰੂ ਕਰੋ। ਜਦੋਂ ਤੁਸੀਂ ਤਿਆਰ ਹੋਵੋ ਤਾਂ ਅੱਪਗ੍ਰੇਡ ਕਰੋ। ਕੋਈ ਲੁਕਵੀਂ ਫੀਸ ਨਹੀਂ, ਕਦੇ ਵੀ ਰੱਦ ਕਰੋ।",
    
    p1Name: "ਕਿਸਾਨ ਬੇਸਿਕ", p1Sub: "(ਮੁਫਤ)", p1Price: "₹0", p1Period: "ਹਮੇਸ਼ਾ ਮੁਫਤ", p1Desc: "ਡਿਜੀਟਲ ਖੇਤੀ ਸ਼ੁਰੂ ਕਰਨ ਵਾਲੇ ਛੋਟੇ ਕਿਸਾਨਾਂ ਲਈ ਵਧੀਆ।", p1Btn: "ਮੁਫਤ ਸ਼ੁਰੂ ਕਰੋ",
    p2Name: "ਕਿਸਾਨ ਪ੍ਰੋ", p2Sub: "(ਪ੍ਰੀਮੀਅਮ)", p2Price: "₹99", p2Period: "ਪ੍ਰਤੀ ਮਹੀਨਾ", p2Desc: "AI-ਸੰਚਾਲਿਤ ਖੇਤੀ ਦੀ ਪੂਰੀ ਤਾਕਤ ਚਾਹੁਣ ਵਾਲੇ ਕਿਸਾਨਾਂ ਲਈ।", p2Btn: "ਪ੍ਰੋ ਸ਼ੁਰੂ ਕਰੋ — ₹99/ਮਹੀਨਾ", p2Badge: "ਸਭ ਤੋਂ ਪ੍ਰਸਿੱਧ",
    p3Name: "ਕਿਸਾਨ ਐਂਟਰਪ੍ਰਾਈਜ਼", p3Sub: "(ਸੰਸਥਾਵਾਂ ਲਈ)", p3Price: "ਕਸਟਮ", p3Period: "ਸੰਪਰਕ ਕਰੋ", p3Desc: "FPO, ਸਹਿਕਾਰੀ ਸਭਾਵਾਂ ਅਤੇ NGO ਲਈ ਤਿਆਰ।", p3Btn: "ਸੰਪਰਕ ਕਰੋ",

    fTitle: "ਇਸ ਵਿੱਚ ਕੀ ਸ਼ਾਮਲ ਹੈ",
    fCurrentWx: "ਅਸਲ-ਸਮੇਂ ਦਾ ਮੌਸਮ (ਮੌਜੂਦਾ)",
    f3DayWx: "3-ਦਿਨ ਦਾ ਮੌਸਮ ਪੂਰਵ ਅਨੁਮਾਨ",
    f10DayWx: "10-ਦਿਨ ਦਾ ਵਿਸਤ੍ਰਿਤ ਪੂਰਵ ਅਨੁਮਾਨ",
    fMarket5: "ਮੰਡੀ ਭਾਅ (5 ਫਸਲਾਂ)",
    fMarketUnl: "ਅਸੀਮਤ ਮੰਡੀ ਭਾਅ ਟ੍ਰੈਕਿੰਗ",
    fCropBasic: "ਬੁਨਿਆਦੀ ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ",
    fCropAI: "AI ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ",
    fProfile1: "1 ਖੇਤ ਪ੍ਰੋਫਾਈਲ",
    fProfile5: "5 ਖੇਤ ਪ੍ਰੋਫਾਈਲਾਂ ਤੱਕ",
    fProfileUnl: "ਅਸੀਮਤ ਖੇਤ ਪ੍ਰੋਫਾਈਲਾਂ",
    fLang2: "ਹਿੰਦੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਭਾਸ਼ਾ",
    fLang3: "ਹਿੰਦੀ, ਮਰਾਠੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ",
    fDiseaseNo: "ਪੌਦਿਆਂ ਦੀ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ",
    fDiseaseYes: "ਪੌਦਿਆਂ ਦੀ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ (ਅਸੀਮਤ)",
    fAlerts: "ਕੀਮਤ ਅਲਰਟ ਅਤੇ ਸੂਚਨਾਵਾਂ",
    fYield: "ਝਾੜ ਦੀ ਭਵਿੱਖਬਾਣੀ",
    fExpense: "ਖਰਚਾ ਟ੍ਰੈਕਰ",
    fSupportPri: "ਪ੍ਰਾਥਮਿਕਤਾ ਈਮੇਲ ਸਪੋਰਟ",
    fSupportPhone: "ਫੋਨ ਸਪੋਰਟ (24/7)",
    fEverything: "ਪ੍ਰੋ ਵਿੱਚ ਸਭ ਕੁਝ",
    fMultiUser: "ਮਲਟੀ-ਯੂਜ਼ਰ ਪਹੁੰਚ",
    fCustomCrop: "ਕਸਟਮ ਫਸਲ ਡੇਟਾਬੇਸ",
    fApi: "API ਏਕੀਕਰਣ ਸਹਾਇਤਾ",
    fReports: "ਕਸਟਮ ਰਿਪੋਰਟਿੰਗ",
    fWhiteLabel: "ਵਾਈਟ-ਲੇਬਲ ਵਿਕਲਪ",
    fAccountMgr: "ਸਮਰਪਿਤ ਖਾਤਾ ਪ੍ਰਬੰਧਕ",
    fTraining: "ਆਨ-ਸਾਈਟ ਟ੍ਰੇਨਿੰਗ",
    fSla: "SLA ਗਾਰੰਟੀ (99.9%)",

    g1: "ਰੇਜ਼ਰਪੇ ਰਾਹੀਂ ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ",
    g2: "ਕਦੇ ਵੀ ਰੱਦ ਕਰੋ, ਕੋਈ ਸਵਾਲ ਨਹੀਂ",
    g3: "30-ਦਿਨ ਦੀ ਮਨੀ-ਬੈਕ ਗਾਰੰਟੀ",
    g4: "ਪੰਜਾਬੀ, ਹਿੰਦੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਸਹਾਇਤਾ",

    faqLabel: "ਸਹਾਇਤਾ",
    faqTitle: "ਅਕਸਰ ਪੁੱਛੇ ਜਾਣ ਵਾਲੇ ਸਵਾਲ",
    faqDesc1: "ਕੀ ਆਪਣਾ ਜਵਾਬ ਨਹੀਂ ਮਿਲ ਰਿਹਾ?",
    faqDesc2: "ਸਾਡੀ ਸਹਾਇਤਾ ਟੀਮ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
    q1: "ਕੀ ਮੁਫਤ ਯੋਜਨਾ ਹਮੇਸ਼ਾ ਲਈ ਮੁਫਤ ਹੈ?", a1: "ਹਾਂ! ਕਿਸਾਨ ਬੇਸਿਕ ਯੋਜਨਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਫਤ ਹੈ।",
    q2: "ਕੀ ਮੈਂ ਕਦੇ ਵੀ ਯੋਜਨਾ ਬਦਲ ਸਕਦਾ ਹਾਂ?", a2: "ਬਿਲਕੁਲ। ਤੁਸੀਂ ਕਿਸੇ ਵੀ ਸਮੇਂ ਪ੍ਰੋ ਵਿੱਚ ਅੱਪਗ੍ਰੇਡ ਕਰ ਸਕਦੇ ਹੋ।",
    q3: "ਕੀ ਮੇਰੀ ਭੁਗਤਾਨ ਜਾਣਕਾਰੀ ਸੁਰੱਖਿਅਤ ਹੈ?", a3: "ਸਾਰੇ ਭੁਗਤਾਨ ਰੇਜ਼ਰਪੇ ਦੁਆਰਾ ਸੁਰੱਖਿਅਤ ਹਨ। ਅਸੀਂ ਕਾਰਡ ਦੇ ਵੇਰਵੇ ਸੇਵ ਨਹੀਂ ਕਰਦੇ।",
    q4: "ਕੀ ਤੁਸੀਂ ਕਿਸਾਨ ਸਮੂਹਾਂ ਲਈ ਛੋਟ ਦਿੰਦੇ ਹੋ?", a4: "ਹਾਂ! 10+ ਮੈਂਬਰਾਂ ਵਾਲੇ FPO ਨੂੰ ਵਿਸ਼ੇਸ਼ ਕੀਮਤਾਂ ਮਿਲਦੀਆਂ ਹਨ।"
  }
};

// ─── Animation helpers ────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── FAQ Accordion Component ──────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fs-pp-faq-card">
      <button onClick={() => setIsOpen(!isOpen)} className="fs-pp-faq-btn">
        <span className="fs-pp-faq-q">{q}</span>
        <div className={`fs-pp-faq-icon ${isOpen ? 'open' : ''}`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} style={{ overflow: "hidden" }}>
            <div className="fs-pp-faq-a">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function PricingPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const text = t[lang];

  const plans = [
    {
      name: text.p1Name, nameHindi: text.p1Sub, price: text.p1Price, period: text.p1Period,
      description: text.p1Desc, highlight: false, badge: "", ctaText: text.p1Btn, ctaTheme: "outline",
      features: [
        { label: text.fCurrentWx, included: true }, { label: text.f3DayWx, included: true }, { label: text.fMarket5, included: true },
        { label: text.fCropBasic, included: true }, { label: text.fProfile1, included: true }, { label: text.fLang2, included: true },
        { label: text.fDiseaseNo, included: false }, { label: text.f10DayWx, included: false }, { label: text.fMarketUnl, included: false },
        { label: text.fYield, included: false }, { label: text.fSupportPri, included: false },
      ],
    },
    {
      name: text.p2Name, nameHindi: text.p2Sub, price: text.p2Price, period: text.p2Period,
      description: text.p2Desc, highlight: true, badge: text.p2Badge, ctaText: text.p2Btn, ctaTheme: "solid",
      features: [
        { label: text.fCurrentWx, included: true }, { label: text.f10DayWx, included: true }, { label: text.fMarketUnl, included: true },
        { label: text.fCropAI, included: true }, { label: text.fProfile5, included: true }, { label: text.fLang3, included: true },
        { label: text.fDiseaseYes, included: true }, { label: text.fAlerts, included: true }, { label: text.fYield, included: true },
        { label: text.fExpense, included: true }, { label: text.fSupportPri, included: true },
      ],
    },
    {
      name: text.p3Name, nameHindi: text.p3Sub, price: text.p3Price, period: text.p3Period,
      description: text.p3Desc, highlight: false, badge: "", ctaText: text.p3Btn, ctaTheme: "outline",
      features: [
        { label: text.fEverything, included: true }, { label: text.fProfileUnl, included: true }, { label: text.fMultiUser, included: true },
        { label: text.fCustomCrop, included: true }, { label: text.fApi, included: true }, { label: text.fReports, included: true },
        { label: text.fWhiteLabel, included: true }, { label: text.fAccountMgr, included: true }, { label: text.fTraining, included: true },
        { label: text.fSla, included: true }, { label: text.fSupportPhone, included: true },
      ],
    },
  ];

  const faqs = [
    { q: text.q1, a: text.a1 }, { q: text.q2, a: text.a2 },
    { q: text.q3, a: text.a3 }, { q: text.q4, a: text.a4 },
  ];

  const guarantees = [
    { icon: ShieldCheck, text: text.g1 }, { icon: RotateCcw, text: text.g2 },
    { icon: Award, text: text.g3 }, { icon: Headset, text: text.g4 },
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        .fs-pp-wrapper {
          --pp-font-body: 'Inter', system-ui, sans-serif;
          --pp-font-display: 'Poppins', system-ui, sans-serif;
          --pp-primary: #10b981; --pp-primary-dark: #059669; --pp-primary-light: #d1fae5;
          --pp-text-dark: #0f172a; --pp-text-muted: #64748b; --pp-text-light: #ffffff;
          --pp-bg: #f8fafc; --pp-border: #e2e8f0;
          font-family: var(--pp-font-body); background-color: var(--pp-bg); color: var(--pp-text-dark);
          display: flex; flex-direction: column; min-height: 100vh; overflow-x: hidden;
        }

        .fs-pp-container { max-width: 80rem; margin: 0 auto; padding: 0 1rem; width: 100%; box-sizing: border-box; }
        @media (min-width: 640px) { .fs-pp-container { padding: 0 1.5rem; } }
        @media (min-width: 1024px) { .fs-pp-container { padding: 0 2rem; } }

        /* Typography */
        .fs-pp-h1 { font-family: var(--pp-font-display); font-size: 2.25rem; font-weight: 700; line-height: 1.2; margin-bottom: 1.5rem; color: var(--pp-text-light); }
        @media (min-width: 640px) { .fs-pp-h1 { font-size: 3rem; } }
        @media (min-width: 1024px) { .fs-pp-h1 { font-size: 3.75rem; } }
        
        .fs-pp-h2 { font-family: var(--pp-font-display); font-size: 1.875rem; font-weight: 700; margin-bottom: 1rem; color: var(--pp-text-dark); }
        @media (min-width: 640px) { .fs-pp-h2 { font-size: 2.25rem; } }

        /* -- ANIMATED HERO (FARMING THEME) -- */
        .fs-pp-hero {
          position: relative; padding-top: 8rem; padding-bottom: 12rem;
          background: linear-gradient(180deg, #064e3b 0%, #022c22 100%); 
          text-align: center; overflow: hidden; z-index: 10;
        }
        @media (min-width: 768px) { .fs-pp-hero { padding-top: 10rem; padding-bottom: 14rem; } }
        
        .fs-pp-hero-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }

        @keyframes sunPulse { 0% { transform: scale(1); box-shadow: 0 0 50px 20px rgba(250, 204, 21, 0.2); } 100% { transform: scale(1.05); box-shadow: 0 0 80px 40px rgba(250, 204, 21, 0.4); } }
        .fs-pp-bg-sun { position: absolute; top: 15%; right: 20%; width: 120px; height: 120px; background: #facc15; border-radius: 50%; opacity: 0.6; animation: sunPulse 5s ease-in-out infinite alternate; filter: blur(20px); }

        @keyframes floatCloud { 0% { transform: translateX(-15vw); } 100% { transform: translateX(115vw); } }
        .fs-pp-bg-cloud { position: absolute; color: rgba(255, 255, 255, 0.08); animation: floatCloud linear infinite; }
        .fs-pp-bg-cloud-1 { top: 10%; left: -20%; animation-duration: 45s; animation-delay: -10s; }
        .fs-pp-bg-cloud-2 { top: 25%; left: -20%; animation-duration: 65s; animation-delay: -35s; transform: scale(1.5); color: rgba(255, 255, 255, 0.04); }

        @keyframes waveHills { 0% { transform: translateX(0) scaleY(1); } 50% { transform: translateX(-2%) scaleY(1.05); } 100% { transform: translateX(0) scaleY(1); } }
        .fs-pp-bg-hill { position: absolute; bottom: -5%; width: 120%; border-radius: 50% 50% 0 0 / 100% 100% 0 0; animation: waveHills 10s ease-in-out infinite; }
        .fs-pp-bg-hill-1 { left: -5%; background: rgba(20, 83, 45, 0.5); z-index: 1; height: 35%; animation-duration: 12s; }
        .fs-pp-bg-hill-2 { left: -10%; background: rgba(6, 95, 70, 0.7); z-index: 2; height: 25%; animation-delay: -5s; }

        @keyframes leafFall { 0% { transform: translate(0, -50px) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translate(-150px, 100vh) rotate(720deg); opacity: 0; } }
        .fs-pp-bg-leaf { position: absolute; top: -10%; background: linear-gradient(135deg, #4ade80, #16a34a); border-radius: 50% 0 50% 0; opacity: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); animation: leafFall linear infinite; }
        .fs-pp-l-1 { left: 15%; width: 14px; height: 14px; animation-duration: 12s; animation-delay: 0s; }
        .fs-pp-l-2 { left: 40%; width: 10px; height: 10px; animation-duration: 16s; animation-delay: 3s; }
        .fs-pp-l-3 { left: 65%; width: 18px; height: 18px; animation-duration: 14s; animation-delay: 1s; background: linear-gradient(135deg, #facc15, #ca8a04); }

        .fs-pp-noise { position: absolute; inset: 0; background-image: url('https://grainy-gradients.vercel.app/noise.svg'); opacity: 0.2; mix-blend-mode: overlay; z-index: 3;}

        .fs-pp-hero-content { position: relative; z-index: 10; max-width: 48rem; margin: 0 auto; }
        .fs-pp-hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.05); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 0.75rem; font-weight: 600; padding: 0.375rem 1rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.5rem; }
        .fs-pp-hero-p { color: rgba(209, 250, 229, 0.8); font-size: 1.125rem; max-width: 42rem; margin: 0 auto; line-height: 1.625; font-weight: 300; }
        @media (min-width: 640px) { .fs-pp-hero-p { font-size: 1.25rem; } }
        .fs-pp-gradient-text { background: linear-gradient(to right, #fde047, #6ee7b7); -webkit-background-clip: text; color: transparent; }

        /* -- PRICING CARDS -- */
        .fs-pp-cards-section { position: relative; z-index: 20; margin-top: -8rem; padding-bottom: 6rem; }
        .fs-pp-cards-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; align-items: flex-start; }
        @media (min-width: 768px) { .fs-pp-cards-grid { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; } }
        @media (min-width: 1024px) { .fs-pp-cards-grid { gap: 2rem; padding: 0 2rem; } }

        .fs-pp-card { position: relative; background: #ffffff; border-radius: 2rem; padding: 2rem; display: flex; flex-direction: column; height: 100%; transition: all 0.3s ease; border: 1px solid var(--pp-border); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05); }
        .fs-pp-card:hover { transform: translateY(-4px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1); }
        .fs-pp-card.highlight { border: 2px solid var(--pp-primary); box-shadow: 0 0 40px -10px rgba(16, 185, 129, 0.2); }
        @media (min-width: 768px) { .fs-pp-card.highlight { margin-top: -2rem; } }

        .fs-pp-card-badge { position: absolute; top: -1rem; left: 50%; transform: translateX(-50%); background: var(--pp-primary); color: #ffffff; font-size: 0.75rem; font-weight: 700; padding: 0.375rem 1rem; border-radius: 999px; display: flex; align-items: center; gap: 0.375rem; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3); white-space: nowrap; }
        .fs-pp-card-header { margin-bottom: 1.5rem; }
        .fs-pp-card-title { font-family: var(--pp-font-display); font-size: 1.5rem; font-weight: 700; margin: 0 0 0.25rem 0; color: var(--pp-text-dark); }
        .fs-pp-card-subtitle { font-size: 0.875rem; color: var(--pp-text-muted); margin: 0; }

        .fs-pp-price-wrap { display: flex; align-items: baseline; gap: 0.25rem; margin-bottom: 1rem; }
        .fs-pp-price { font-family: var(--pp-font-display); font-size: 3rem; font-weight: 700; color: var(--pp-text-dark); margin: 0; line-height: 1; }
        .fs-pp-period { font-size: 0.875rem; font-weight: 500; color: var(--pp-text-muted); margin: 0; }
        .fs-pp-desc { font-size: 0.875rem; color: var(--pp-text-muted); line-height: 1.625; margin: 0 0 2rem 0; min-height: 3.25rem; }

        .fs-pp-btn { width: 100%; display: block; text-align: center; padding: 1rem; border-radius: 1rem; font-size: 0.875rem; font-weight: 700; font-family: inherit; cursor: pointer; text-decoration: none; transition: all 0.3s ease; margin-bottom: 2rem; }
        .fs-pp-btn.outline { background: #ffffff; color: var(--pp-text-dark); border: 1px solid var(--pp-border); }
        .fs-pp-btn.outline:hover { border-color: var(--pp-primary); color: var(--pp-primary-dark); background: #f8fafc; }
        .fs-pp-btn.solid { background: var(--pp-primary-dark); color: #ffffff; border: none; box-shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.2); }
        .fs-pp-btn.solid:hover { background: #047857; transform: translateY(-2px); }

        .fs-pp-features-title { font-size: 0.75rem; font-weight: 600; color: var(--pp-text-dark); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1rem 0; }
        .fs-pp-feature-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
        .fs-pp-feature-item { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.875rem; }
        .fs-pp-feature-included { color: #334155; }
        .fs-pp-feature-excluded { color: #94a3b8; }

        /* -- GUARANTEE STRIP -- */
        .fs-pp-guarantee-section { background: #ffffff; border-top: 1px solid var(--pp-border); border-bottom: 1px solid var(--pp-border); padding: 3rem 0; }
        .fs-pp-guarantee-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        @media (min-width: 768px) { .fs-pp-guarantee-grid { grid-template-columns: repeat(4, 1fr); } }
        .fs-pp-guarantee-item { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.75rem; }
        .fs-pp-icon-box { margin: 0 auto; width: 3rem; height: 3rem; background: var(--pp-primary-light); color: var(--pp-primary-dark); border-radius: 1rem; display: flex; align-items: center; justify-content: center; }
        .fs-pp-guarantee-text { font-size: 0.875rem; font-weight: 500; color: #334155; max-width: 10rem; margin: 0 auto; line-height: 1.5; }

        /* -- FAQ SECTION -- */
        .fs-pp-faq-section { padding: 8rem 0; max-width: 48rem; margin: 0 auto; }
        .fs-pp-faq-header { text-align: center; margin-bottom: 4rem; }
        .fs-pp-faq-label { font-size: 0.875rem; font-weight: 600; color: var(--pp-primary-dark); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.75rem; }
        .fs-pp-faq-desc { font-size: 1.125rem; color: var(--pp-text-muted); margin: 0; }
        .fs-pp-faq-link { color: var(--pp-primary-dark); font-weight: 500; text-decoration: none; border: none; background: transparent; cursor: pointer; padding: 0; font-family: inherit; font-size: inherit; }
        .fs-pp-faq-link:hover { text-decoration: underline; }

        .fs-pp-faq-list { display: flex; flex-direction: column; gap: 1rem; }
        .fs-pp-faq-card { background: #ffffff; border: 1px solid var(--pp-border); border-radius: 1rem; overflow: hidden; transition: border-color 0.2s ease; }
        .fs-pp-faq-card:hover { border-color: #a7f3d0; }
        .fs-pp-faq-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; background: transparent; border: none; cursor: pointer; text-align: left; font-family: inherit; }
        .fs-pp-faq-q { font-family: var(--pp-font-display); font-weight: 600; font-size: 1rem; color: var(--pp-text-dark); padding-right: 1rem; }
        .fs-pp-faq-icon { flex-shrink: 0; width: 2rem; height: 2rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #f8fafc; color: #94a3b8; transition: all 0.2s ease; }
        .fs-pp-faq-icon.open { background: var(--pp-primary-light); color: var(--pp-primary-dark); }
        .fs-pp-faq-a { padding: 0 1.5rem 1.5rem 1.5rem; font-size: 0.875rem; color: var(--pp-text-muted); line-height: 1.625; }
      `}</style>

      <div className="fs-pp-wrapper">
        <PublicNavbar />

        <main style={{ flex: 1 }}>
          {/* Animated Farming Hero */}
          <section className="fs-pp-hero">
            <div className="fs-pp-hero-bg">
              <div className="fs-pp-bg-sun" />
              <Cloud className="fs-pp-bg-cloud fs-pp-bg-cloud-1" size={160} />
              <Cloud className="fs-pp-bg-cloud fs-pp-bg-cloud-2" size={240} />
              <div className="fs-pp-bg-hill fs-pp-bg-hill-1" />
              <div className="fs-pp-bg-hill fs-pp-bg-hill-2" />
              <div className="fs-pp-bg-leaf fs-pp-l-1" />
              <div className="fs-pp-bg-leaf fs-pp-l-2" />
              <div className="fs-pp-bg-leaf fs-pp-l-3" />
              <div className="fs-pp-noise" />
            </div>

            <div className="fs-pp-container">
              <div className="fs-pp-hero-content">
                <FadeUp>
                  <div className="fs-pp-hero-badge">
                    <Zap size={16} color="#facc15" />
                    <span>{text.heroBadge}</span>
                  </div>
                </FadeUp>
                <FadeUp delay={0.1}>
                  <h1 className="fs-pp-h1">
                    {text.heroTitle1} <span className="fs-pp-gradient-text">{text.heroTitle2}</span>
                  </h1>
                </FadeUp>
                <FadeUp delay={0.2}>
                  <p className="fs-pp-hero-p">{text.heroDesc}</p>
                </FadeUp>
              </div>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="fs-pp-cards-section">
            <div className="fs-pp-container">
              <div className="fs-pp-cards-grid">
                {plans.map((plan, i) => (
                  <FadeUp key={plan.name} delay={0.2 + (i * 0.1)}>
                    <div className={`fs-pp-card ${plan.highlight ? 'highlight' : ''}`}>
                      {plan.highlight && (
                        <div className="fs-pp-card-badge">
                          <Star size={14} color="#ffffff" fill="#ffffff" />
                          {plan.badge}
                        </div>
                      )}
                      
                      <div className="fs-pp-card-header">
                        <h3 className="fs-pp-card-title">{plan.name}</h3>
                        <p className="fs-pp-card-subtitle">{plan.nameHindi}</p>
                      </div>
                      
                      <div className="fs-pp-price-wrap">
                        <span className="fs-pp-price">{plan.price}</span>
                        <span className="fs-pp-period">/{plan.period}</span>
                      </div>
                      
                      <p className="fs-pp-desc">{plan.description}</p>

                      <button onClick={() => navigate(plan.name.includes('Enterprise') || plan.name.includes('एंटरप्राइज') ? '/contact' : '/app')} className={`fs-pp-btn ${plan.ctaTheme}`}>
                        {plan.ctaText}
                      </button>

                      <div style={{ flex: 1 }}>
                        <p className="fs-pp-features-title">{text.fTitle}</p>
                        <ul className="fs-pp-feature-list">
                          {plan.features.map(({ label, included }) => (
                            <li key={label} className="fs-pp-feature-item">
                              {included ? (
                                <CheckCircle2 size={20} color="var(--pp-primary)" style={{ flexShrink: 0 }} />
                              ) : (
                                <X size={20} color="#cbd5e1" style={{ flexShrink: 0 }} />
                              )}
                              <span className={included ? "fs-pp-feature-included" : "fs-pp-feature-excluded"}>
                                {label}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>

          {/* Guarantee Strip */}
          <section className="fs-pp-guarantee-section">
            <div className="fs-pp-container">
              <div className="fs-pp-guarantee-grid">
                {guarantees.map(({ icon: Icon, text }, i) => (
                  <FadeUp key={text} delay={i * 0.1}>
                    <div className="fs-pp-guarantee-item">
                      <div className="fs-pp-icon-box">
                        <Icon size={24} />
                      </div>
                      <span className="fs-pp-guarantee-text">{text}</span>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ SECTION */}
          <section className="fs-pp-faq-section">
            <div className="fs-pp-container">
              <FadeUp className="fs-pp-faq-header">
                <span className="fs-pp-faq-label">{text.faqLabel}</span>
                <h2 className="fs-pp-h2">{text.faqTitle}</h2>
                <p className="fs-pp-faq-desc">
                  {text.faqDesc1} <button onClick={() => navigate('/contact')} className="fs-pp-faq-link">{text.faqDesc2}</button>
                </p>
              </FadeUp>
              
              <div className="fs-pp-faq-list">
                {faqs.map(({ q, a }, i) => (
                  <FadeUp key={q} delay={i * 0.1}>
                    <FAQItem q={q} a={a} />
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>
        </main>

        <PublicFooter />
      </div>
    </>
  );
}