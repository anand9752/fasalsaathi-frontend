import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "motion/react";
import {
  Cloud, TrendingUp, Leaf, Shield, BarChart3, Smartphone,
  CheckCircle, Zap, Globe, Bell, Database, Lock,
} from "lucide-react";
import { PublicNavbar } from "../components/public/PublicNavbar";
import { PublicFooter } from "../components/public/PublicFooter";
import { useLanguage } from "../hooks/useLanguage";

// ─── Translations Dictionary for Features Page ──────────────────────────────────
const t = {
  en: {
    heroBadge: "Platform Features",
    heroTitle1: "Everything a",
    heroTitle2: "Farmer Needs",
    heroDesc: "Six powerful platforms in one app — built specifically for the challenges Indian farmers face every day.",
    feat1Title: "Live Weather Intelligence",
    feat1Sub: "Always know what's coming",
    feat1Desc: "Our hyperlocal weather system pulls real-time data from OpenWeatherMap and cross-references it with your GPS location. You get forecasts accurate to your field, not just your district.",
    feat1B1: "Hourly and 10-day forecasts", feat1B2: "Rainfall probability alerts via push notification", feat1B3: "Wind speed and humidity for spray-timing decisions", feat1B4: "Frost warnings for horticulture crops",
    feat2Title: "Real-Time Mandi Prices",
    feat2Sub: "Sell at the right moment",
    feat2Desc: "Track live prices for 200+ crops across 18 states. Set price alerts, compare mandis, and visualise historical trends so you never sell at a loss again.",
    feat2B1: "Live prices refreshed every 30 minutes", feat2B2: "Price trend charts (7d / 30d / 90d)", feat2B3: "Custom price alert notifications", feat2B4: "Compare prices across nearby mandis",
    feat3Title: "AI Crop Recommendations",
    feat3Sub: "Science-backed crop planning",
    feat3Desc: "Our machine learning model analyses your soil type, local weather patterns, water availability, and historical yield data to suggest the most profitable and suitable crops for your land.",
    feat3B1: "Top 3 recommended crops with confidence scores", feat3B2: "Seasonal planting calendars", feat3B3: "Variety selection guidance", feat3B4: "Expected yield & ROI estimates",
    feat4Title: "Plant Disease Detection",
    feat4Sub: "Diagnose instantly, act fast",
    feat4Desc: "Upload a photo of any affected leaf, stem, or fruit. Our computer vision model identifies 50+ diseases in seconds and prescribes an exact treatment plan including approved pesticides and organic alternatives.",
    feat4B1: "Identifies 50+ crop diseases", feat4B2: "Organic and chemical treatment options", feat4B3: "Dosage and application instructions", feat4B4: "Disease severity assessment",
    feat5Title: "Yield Prediction & Analytics",
    feat5Sub: "Plan your season in advance",
    feat5Desc: "Using satellite imagery, local weather history, and soil data, our model predicts your harvest quantity months before it happens. Better planning means better logistics, storage, and profit.",
    feat5B1: "Accuracy within ±8% of actual yield", feat5B2: "Season-over-season farm analytics", feat5B3: "Expense and income tracking", feat5B4: "Exportable reports for bank loans",
    feat6Title: "Multilingual & Offline Ready",
    feat6Sub: "Works anywhere, in your language",
    feat6Desc: "FasalSaathi works fully in Hindi, Marathi, and English. Key data is cached locally so you get guidance even without internet — critical in rural areas with patchy connectivity.",
    feat6B1: "Full support for Hindi, Marathi, English", feat6B2: "Offline mode caches last 7 days of data", feat6B3: "Voice-friendly interface", feat6B4: "Low-bandwidth mode for 2G networks",
    addTitle: "…and Much More",
    add1: "Smart Alerts", add2: "Farm Records", add3: "18 State Coverage", add4: "Secure & Private", add5: "Instant Insights", add6: "Verified Data",
    ctaTitle: "Experience All Features for Free",
    ctaDesc: "No credit card needed. Get started in 2 minutes.",
    btnStartFree: "Start Free Today →"
  },
  hi: {
    heroBadge: "प्लेटफ़ॉर्म की विशेषताएं",
    heroTitle1: "हर वो चीज़ जिसकी",
    heroTitle2: "किसान को जरूरत है",
    heroDesc: "एक ऐप में छह शक्तिशाली प्लेटफ़ॉर्म — विशेष रूप से उन चुनौतियों के लिए बनाए गए हैं जिनका सामना भारतीय किसान रोज़ाना करते हैं।",
    feat1Title: "लाइव मौसम की जानकारी",
    feat1Sub: "हमेशा जानें कि क्या होने वाला है",
    feat1Desc: "हमारा मौसम सिस्टम OpenWeatherMap से रियल-टाइम डेटा खींचता है। आपको केवल अपने जिले के लिए नहीं, बल्कि अपने खेत के लिए सटीक पूर्वानुमान मिलता है।",
    feat1B1: "प्रति घंटा और 10-दिन का पूर्वानुमान", feat1B2: "पुश नोटिफिकेशन द्वारा वर्षा की चेतावनी", feat1B3: "स्प्रे-समय के लिए हवा की गति और नमी", feat1B4: "बागवानी फसलों के लिए पाला पड़ने की चेतावनी",
    feat2Title: "रियल-टाइम मंडी भाव",
    feat2Sub: "सही समय पर बेचें",
    feat2Desc: "18 राज्यों में 200+ फसलों के लिए लाइव कीमतों को ट्रैक करें। अलर्ट सेट करें और ऐतिहासिक रुझानों की कल्पना करें ताकि आप कभी भी नुकसान में न बेचें।",
    feat2B1: "हर 30 मिनट में लाइव कीमतें अपडेट", feat2B2: "मूल्य प्रवृत्ति चार्ट (7 दिन/30 दिन/90 दिन)", feat2B3: "कस्टम मूल्य अलर्ट नोटिफिकेशन", feat2B4: "आसपास की मंडियों में कीमतों की तुलना",
    feat3Title: "AI फसल सिफारिशें",
    feat3Sub: "विज्ञान-समर्थित फसल योजना",
    feat3Desc: "हमारा मॉडल आपकी मिट्टी, स्थानीय मौसम, पानी की उपलब्धता का विश्लेषण करके आपके लिए सबसे लाभदायक फसल का सुझाव देता है।",
    feat3B1: "आत्मविश्वास स्कोर के साथ शीर्ष 3 फसलें", feat3B2: "मौसमी रोपण कैलेंडर", feat3B3: "किस्म चयन मार्गदर्शन", feat3B4: "अनुमानित उपज और ROI अनुमान",
    feat4Title: "पौधों के रोग की पहचान",
    feat4Sub: "तुरंत निदान करें, तेजी से कार्य करें",
    feat4Desc: "किसी भी प्रभावित पत्ते की फोटो अपलोड करें। हमारा कंप्यूटर विज़न मॉडल सेकंड में 50+ बीमारियों की पहचान करता है और सटीक उपचार बताता है।",
    feat4B1: "50+ फसल रोगों की पहचान", feat4B2: "जैविक और रासायनिक उपचार विकल्प", feat4B3: "खुराक और आवेदन निर्देश", feat4B4: "रोग की गंभीरता का आकलन",
    feat5Title: "उपज की भविष्यवाणी",
    feat5Sub: "अपने सीज़न की योजना पहले से बनाएं",
    feat5Desc: "उपग्रह इमेजरी और मिट्टी के डेटा का उपयोग करते हुए, हमारा मॉडल कटाई की मात्रा की भविष्यवाणी महीनों पहले करता है।",
    feat5B1: "वास्तविक उपज के ±8% के भीतर सटीकता", feat5B2: "सीज़न-दर-सीज़न खेत विश्लेषण", feat5B3: "व्यय और आय ट्रैकिंग", feat5B4: "बैंक ऋण के लिए निर्यात योग्य रिपोर्ट",
    feat6Title: "बहुभाषी और ऑफलाइन",
    feat6Sub: "कहीं भी काम करता है, आपकी भाषा में",
    feat6Desc: "फसलसाथी हिंदी, मराठी और अंग्रेजी में काम करता है। मुख्य डेटा स्थानीय रूप से सहेजा जाता है ताकि बिना इंटरनेट भी मार्गदर्शन मिले।",
    feat6B1: "हिंदी, मराठी, अंग्रेजी के लिए पूर्ण समर्थन", feat6B2: "ऑफ़लाइन मोड 7 दिन का डेटा सहेजता है", feat6B3: "आवाज़-अनुकूल इंटरफ़ेस", feat6B4: "2G नेटवर्क के लिए लो-बैंडविड्थ मोड",
    addTitle: "…और भी बहुत कुछ",
    add1: "स्मार्ट अलर्ट", add2: "खेत रिकॉर्ड", add3: "18 राज्य कवरेज", add4: "सुरक्षित और निजी", add5: "त्वरित अंतर्दृष्टि", add6: "सत्यापित डेटा",
    ctaTitle: "सभी सुविधाओं का मुफ्त अनुभव करें",
    ctaDesc: "किसी क्रेडिट कार्ड की आवश्यकता नहीं। 2 मिनट में शुरू करें।",
    btnStartFree: "आज ही मुफ्त शुरू करें →"
  },
  mr: {
    heroBadge: "प्लॅटफॉर्म वैशिष्ट्ये",
    heroTitle1: "शेतकर्‍याला आवश्यक असणारे",
    heroTitle2: "सर्व काही एकाच ठिकाणी",
    heroDesc: "एका ॲपमध्ये सहा शक्तिशाली प्लॅटफॉर्म — भारतीय शेतकर्‍यांना दररोज भेडसावणाऱ्या आव्हानांसाठी विशेषतः तयार केलेले.",
    feat1Title: "थेट हवामान माहिती",
    feat1Sub: "नेहमी सावध रहा",
    feat1Desc: "आमची प्रणाली OpenWeatherMap वरून रिअल-टाइम डेटा घेते. तुम्हाला फक्त तुमच्या जिल्ह्यासाठी नाही, तर तुमच्या शेतासाठी अचूक अंदाज मिळतो.",
    feat1B1: "दर तासाचे आणि १० दिवसांचे अंदाज", feat1B2: "पावसाची शक्यता अलर्ट (पुश नोटिफिकेशन)", feat1B3: "फवारणीसाठी वाऱ्याचा वेग आणि आर्द्रता", feat1B4: "फळबागांसाठी दंव इशारा",
    feat2Title: "रिअल-टाइम मंडी भाव",
    feat2Sub: "योग्य वेळी विक्री करा",
    feat2Desc: "१८ राज्यांतील २००+ पिकांच्या थेट किमती ट्रॅक करा. किंमत अलर्ट सेट करा आणि ऐतिहासिक ट्रेंड पहा जेणेकरून तुमचे नुकसान होणार नाही.",
    feat2B1: "दर ३० मिनिटांनी लाइव्ह किमती अपडेट", feat2B2: "किंमत ट्रेंड चार्ट (७ दिवस / ३० दिवस)", feat2B3: "सानुकूल किंमत अलर्ट", feat2B4: "जवळपासच्या मंडईंमधील किमतींची तुलना",
    feat3Title: "AI पीक शिफारसी",
    feat3Sub: "शास्त्रशुद्ध पीक नियोजन",
    feat3Desc: "आमचे मॉडेल मातीचा प्रकार, हवामान आणि पाण्याच्या उपलब्धतेचे विश्लेषण करून सर्वात योग्य आणि फायदेशीर पिके सुचवते.",
    feat3B1: "आत्मविश्वास स्कोअरसह शीर्ष ३ पिके", feat3B2: "हंगामी लागवड दिनदर्शिका", feat3B3: "वाण निवड मार्गदर्शन", feat3B4: "अपेक्षित उत्पन्न आणि परतावा अंदाज",
    feat4Title: "वनस्पती रोग ओळख",
    feat4Sub: "त्वरित निदान करा, वेगाने कृती करा",
    feat4Desc: "बाधित पानाचा फोटो अपलोड करा. आमचे AI काही सेकंदात ५०+ रोगांची ओळख करून अचूक उपचार पद्धती सुचवते.",
    feat4B1: "५०+ पीक रोगांची ओळख", feat4B2: "सेंद्रिय आणि रासायनिक उपचार पर्याय", feat4B3: "डोस आणि फवारणी सूचना", feat4B4: "रोगाच्या तीव्रतेचे मूल्यांकन",
    feat5Title: "उत्पन्नाचा अंदाज",
    feat5Sub: "हंगामाचे आगाऊ नियोजन करा",
    feat5Desc: "उपग्रह प्रतिमा आणि माती डेटा वापरून, आमचे मॉडेल काढणीपूर्वीच उत्पन्नाचा अंदाज वर्तवते. यामुळे चांगले नियोजन शक्य होते.",
    feat5B1: "अचूकता ±८% च्या आत", feat5B2: "हंगामानुसार शेतीचे विश्लेषण", feat5B3: "खर्च आणि उत्पन्न ट्रॅकिंग", feat5B4: "बँक कर्जासाठी रिपोर्ट",
    feat6Title: "बहुभाषिक आणि ऑफलाइन",
    feat6Sub: "कुठेही चालेल, तुमच्या भाषेत",
    feat6Desc: "फसलसाथी हिंदी, मराठी आणि इंग्रजीमध्ये चालते. इंटरनेट नसतानाही मार्गदर्शन मिळण्यासाठी महत्त्वाचा डेटा जतन केला जातो.",
    feat6B1: "हिंदी, मराठी, इंग्रजी समर्थन", feat6B2: "ऑफ़लाइन मोड (मागील ७ दिवसांचा डेटा)", feat6B3: "व्हॉइस-फ्रेंडली इंटरफेस", feat6B4: "2G नेटवर्कसाठी कमी बँडविड्थ मोड",
    addTitle: "…आणि बरेच काही",
    add1: "स्मार्ट अलर्ट", add2: "शेती रेकॉर्ड", add3: "१८ राज्ये कव्हर", add4: "सुरक्षित आणि खाजगी", add5: "त्वरित अंतर्दृष्टी", add6: "सत्यापित डेटा",
    ctaTitle: "सर्व वैशिष्ट्ये मोफत अनुभवा",
    ctaDesc: "क्रेडिट कार्डची आवश्यकता नाही. २ मिनिटांत सुरू करा.",
    btnStartFree: "आजच मोफत सुरू करा →"
  },
  pa: {
    heroBadge: "ਪਲੇਟਫਾਰਮ ਦੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
    heroTitle1: "ਹਰ ਉਹ ਚੀਜ਼ ਜਿਸਦੀ",
    heroTitle2: "ਕਿਸਾਨ ਨੂੰ ਲੋੜ ਹੈ",
    heroDesc: "ਇੱਕ ਐਪ ਵਿੱਚ ਛੇ ਸ਼ਕਤੀਸ਼ਾਲੀ ਪਲੇਟਫਾਰਮ — ਖਾਸ ਤੌਰ 'ਤੇ ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਦੀਆਂ ਚੁਣੌਤੀਆਂ ਲਈ ਬਣਾਏ ਗਏ।",
    feat1Title: "ਲਾਈਵ ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ",
    feat1Sub: "ਹਮੇਸ਼ਾ ਜਾਣੋ ਕਿ ਕੀ ਹੋਣ ਵਾਲਾ ਹੈ",
    feat1Desc: "ਸਾਡਾ ਸਿਸਟਮ OpenWeatherMap ਤੋਂ ਰੀਅਲ-ਟਾਈਮ ਡੇਟਾ ਲੈਂਦਾ ਹੈ। ਤੁਹਾਨੂੰ ਸਿਰਫ ਜ਼ਿਲ੍ਹੇ ਦੀ ਨਹੀਂ, ਬਲਕਿ ਆਪਣੇ ਖੇਤ ਦੀ ਸਹੀ ਭਵਿੱਖਬਾਣੀ ਮਿਲਦੀ ਹੈ।",
    feat1B1: "ਹਰ ਘੰਟੇ ਅਤੇ 10-ਦਿਨ ਦੀ ਭਵਿੱਖਬਾਣੀ", feat1B2: "ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਦੇ ਅਲਰਟ", feat1B3: "ਸਪਰੇਅ ਦੇ ਸਮੇਂ ਲਈ ਹਵਾ ਦੀ ਗਤੀ", feat1B4: "ਬਾਗਵਾਨੀ ਲਈ ਕੋਰੇ ਦੀ ਚੇਤਾਵਨੀ",
    feat2Title: "ਅਸਲ-ਸਮੇਂ ਦੇ ਮੰਡੀ ਭਾਅ",
    feat2Sub: "ਸਹੀ ਸਮੇਂ 'ਤੇ ਵੇਚੋ",
    feat2Desc: "18 ਰਾਜਾਂ ਵਿੱਚ 200+ ਫਸਲਾਂ ਦੀਆਂ ਲਾਈਵ ਕੀਮਤਾਂ ਟ੍ਰੈਕ ਕਰੋ। ਅਲਰਟ ਸੈੱਟ ਕਰੋ ਤਾਂ ਜੋ ਤੁਸੀਂ ਕਦੇ ਨੁਕਸਾਨ ਵਿੱਚ ਨਾ ਵੇਚੋ।",
    feat2B1: "ਹਰ 30 ਮਿੰਟਾਂ ਵਿੱਚ ਭਾਅ ਅੱਪਡੇਟ", feat2B2: "ਕੀਮਤ ਰੁਝਾਨ ਚਾਰਟ (7 ਦਿਨ/30 ਦਿਨ)", feat2B3: "ਕਸਟਮ ਕੀਮਤ ਅਲਰਟ", feat2B4: "ਨੇੜਲੀਆਂ ਮੰਡੀਆਂ ਨਾਲ ਤੁਲਨਾ",
    feat3Title: "AI ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ",
    feat3Sub: "ਵਿਗਿਆਨ ਅਧਾਰਤ ਫਸਲ ਯੋਜਨਾ",
    feat3Desc: "ਸਾਡਾ ਮਾਡਲ ਤੁਹਾਡੀ ਮਿੱਟੀ, ਸਥਾਨਕ ਮੌਸਮ ਅਤੇ ਪਾਣੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਕੇ ਸਭ ਤੋਂ ਵੱਧ ਲਾਭਦਾਇਕ ਫਸਲ ਦਾ ਸੁਝਾਅ ਦਿੰਦਾ ਹੈ।",
    feat3B1: "ਚੋਟੀ ਦੀਆਂ 3 ਫਸਲਾਂ ਦੇ ਸੁਝਾਅ", feat3B2: "ਮੌਸਮੀ ਬਿਜਾਈ ਕੈਲੰਡਰ", feat3B3: "ਕਿਸਮ ਦੀ ਚੋਣ ਲਈ ਮਾਰਗਦਰਸ਼ਨ", feat3B4: "ਅਨੁਮਾਨਿਤ ਝਾੜ ਅਤੇ ਮੁਨਾਫਾ",
    feat4Title: "ਪੌਦਿਆਂ ਦੀ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ",
    feat4Sub: "ਤੁਰੰਤ ਨਿਦਾਨ ਕਰੋ, ਤੇਜ਼ੀ ਨਾਲ ਕੰਮ ਕਰੋ",
    feat4Desc: "ਕਿਸੇ ਵੀ ਪ੍ਰਭਾਵਿਤ ਪੱਤੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ। ਸਾਡਾ AI ਸਕਿੰਟਾਂ ਵਿੱਚ 50+ ਬਿਮਾਰੀਆਂ ਦੀ ਪਛਾਣ ਕਰਦਾ ਹੈ ਅਤੇ ਇਲਾਜ ਦੱਸਦਾ ਹੈ।",
    feat4B1: "50+ ਬਿਮਾਰੀਆਂ ਦੀ ਪਛਾਣ", feat4B2: "ਜੈਵਿਕ ਅਤੇ ਰਸਾਇਣਕ ਇਲਾਜ", feat4B3: "ਖੁਰਾਕ ਅਤੇ ਵਰਤੋਂ ਦੀਆਂ ਹਦਾਇਤਾਂ", feat4B4: "ਬਿਮਾਰੀ ਦੀ ਗੰਭੀਰਤਾ ਦਾ ਮੁਲਾਂਕਣ",
    feat5Title: "ਝਾੜ ਦੀ ਭਵਿੱਖਬਾਣੀ",
    feat5Sub: "ਪਹਿਲਾਂ ਤੋਂ ਯੋਜਨਾ ਬਣਾਓ",
    feat5Desc: "ਸੈਟੇਲਾਈਟ ਡੇਟਾ ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹੋਏ, ਸਾਡਾ ਮਾਡਲ ਮਹੀਨੇ ਪਹਿਲਾਂ ਹੀ ਤੁਹਾਡੀ ਫਸਲ ਦੇ ਝਾੜ ਦੀ ਭਵਿੱਖਬਾਣੀ ਕਰਦਾ ਹੈ।",
    feat5B1: "ਅਸਲ ਝਾੜ ਦੇ ±8% ਦੇ ਅੰਦਰ ਸਟੀਕਤਾ", feat5B2: "ਖੇਤ ਦਾ ਸੀਜ਼ਨ-ਵਾਰ ਵਿਸ਼ਲੇਸ਼ਣ", feat5B3: "ਖਰਚੇ ਅਤੇ ਆਮਦਨ ਟ੍ਰੈਕਿੰਗ", feat5B4: "ਬੈਂਕ ਲੋਨ ਲਈ ਰਿਪੋਰਟਾਂ",
    feat6Title: "ਬਹੁ-ਭਾਸ਼ਾਈ ਅਤੇ ਆਫ਼ਲਾਈਨ",
    feat6Sub: "ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ ਕਿਤੇ ਵੀ",
    feat6Desc: "ਫਸਲਸਾਥੀ ਹਿੰਦੀ, ਮਰਾਠੀ ਅਤੇ ਪੰਜਾਬੀ ਵਿੱਚ ਕੰਮ ਕਰਦਾ ਹੈ। ਮੁੱਖ ਡਾਟਾ ਆਫ਼ਲਾਈਨ ਸੇਵ ਹੁੰਦਾ ਹੈ।",
    feat6B1: "ਪੰਜਾਬੀ, ਹਿੰਦੀ, ਮਰਾਠੀ, ਅੰਗਰੇਜ਼ੀ ਸਮਰਥਨ", feat6B2: "ਆਫ਼ਲਾਈਨ ਮੋਡ (7 ਦਿਨਾਂ ਦਾ ਡੇਟਾ)", feat6B3: "ਆਵਾਜ਼-ਅਨੁਕੂਲ ਇੰਟਰਫੇਸ", feat6B4: "2G ਨੈੱਟਵਰਕਾਂ ਲਈ ਘੱਟ-ਬੈਂਡਵਿਡਥ ਮੋਡ",
    addTitle: "…ਅਤੇ ਹੋਰ ਬਹੁਤ ਕੁਝ",
    add1: "ਸਮਾਰਟ ਅਲਰਟ", add2: "ਖੇਤ ਦਾ ਰਿਕਾਰਡ", add3: "18 ਰਾਜ ਕਵਰੇਜ", add4: "ਸੁਰੱਖਿਅਤ ਅਤੇ ਪ੍ਰਾਈਵੇਟ", add5: "ਤੁਰੰਤ ਜਾਣਕਾਰੀ", add6: "ਤਸਦੀਕਸ਼ੁਦਾ ਡੇਟਾ",
    ctaTitle: "ਸਾਰੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਮੁਫਤ ਅਜ਼ਮਾਓ",
    ctaDesc: "ਕੋਈ ਕ੍ਰੈਡਿਟ ਕਾਰਡ ਨਹੀਂ। 2 ਮਿੰਟਾਂ ਵਿੱਚ ਸ਼ੁਰੂ ਕਰੋ।",
    btnStartFree: "ਅੱਜ ਹੀ ਮੁਫਤ ਸ਼ੁਰੂ ਕਰੋ →"
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

export function FeaturesPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const text = t[lang];

  const featureSections = [
    {
      icon: Cloud, theme: "blue", title: text.feat1Title, subtitle: text.feat1Sub, description: text.feat1Desc,
      bullets: [text.feat1B1, text.feat1B2, text.feat1B3, text.feat1B4],
    },
    {
      icon: TrendingUp, theme: "orange", title: text.feat2Title, subtitle: text.feat2Sub, description: text.feat2Desc,
      bullets: [text.feat2B1, text.feat2B2, text.feat2B3, text.feat2B4],
    },
    {
      icon: Leaf, theme: "green", title: text.feat3Title, subtitle: text.feat3Sub, description: text.feat3Desc,
      bullets: [text.feat3B1, text.feat3B2, text.feat3B3, text.feat3B4],
    },
    {
      icon: Shield, theme: "red", title: text.feat4Title, subtitle: text.feat4Sub, description: text.feat4Desc,
      bullets: [text.feat4B1, text.feat4B2, text.feat4B3, text.feat4B4],
    },
    {
      icon: BarChart3, theme: "purple", title: text.feat5Title, subtitle: text.feat5Sub, description: text.feat5Desc,
      bullets: [text.feat5B1, text.feat5B2, text.feat5B3, text.feat5B4],
    },
    {
      icon: Smartphone, theme: "teal", title: text.feat6Title, subtitle: text.feat6Sub, description: text.feat6Desc,
      bullets: [text.feat6B1, text.feat6B2, text.feat6B3, text.feat6B4],
    },
  ];

  const additionalFeatures = [
    { icon: Bell, label: text.add1 }, { icon: Database, label: text.add2 },
    { icon: Globe, label: text.add3 }, { icon: Lock, label: text.add4 },
    { icon: Zap, label: text.add5 }, { icon: CheckCircle, label: text.add6 },
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        .fs-fp-wrapper {
          --fp-font-body: 'Inter', system-ui, sans-serif;
          --fp-font-display: 'Poppins', system-ui, sans-serif;
          --fp-primary: #16a34a; --fp-primary-dark: #15803d;
          --fp-text-dark: #111827; --fp-text-muted: #4b5563; --fp-text-light: #ffffff;
          font-family: var(--fp-font-body); background-color: #ffffff; color: var(--fp-text-dark);
          overflow-x: hidden; display: flex; flex-direction: column; min-height: 100vh;
        }
        .fs-fp-container { max-width: 80rem; margin: 0 auto; padding: 0 1rem; width: 100%; box-sizing: border-box; }
        @media (min-width: 640px) { .fs-fp-container { padding: 0 1.5rem; } }
        @media (min-width: 1024px) { .fs-fp-container { padding: 0 2rem; } }

        .fs-fp-h1 { font-family: var(--fp-font-display); font-size: 2.25rem; font-weight: 700; line-height: 1.2; margin-bottom: 1rem; color: var(--fp-text-light); }
        @media (min-width: 640px) { .fs-fp-h1 { font-size: 3rem; } }
        .fs-fp-h2 { font-family: var(--fp-font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--fp-text-dark); }
        @media (min-width: 640px) { .fs-fp-h2 { font-size: 1.875rem; } }

        .fs-fp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem 2rem; border-radius: 0.75rem; font-size: 1rem; font-weight: 700; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; text-decoration: none; border: none; font-family: inherit; background-color: #ffffff; color: var(--fp-primary-dark); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .fs-fp-btn:hover { transform: scale(1.05); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }

        .fs-fp-icon-box { width: 3.5rem; height: 3.5rem; border-radius: 1rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
        .fs-fp-visual-box { border-radius: 1.5rem; display: flex; align-items: center; justify-content: center; min-height: 280px; border: 1px solid rgba(0,0,0,0.05); }
        .fs-fp-icon-blue { background-color: #eff6ff; color: #2563eb; } .fs-fp-visual-blue { background: linear-gradient(to bottom right, #eff6ff, #cffafe); }
        .fs-fp-icon-orange { background-color: #fff7ed; color: #ea580c; } .fs-fp-visual-orange { background: linear-gradient(to bottom right, #fff7ed, #fef3c7); }
        .fs-fp-icon-green { background-color: #f0fdf4; color: #16a34a; } .fs-fp-visual-green { background: linear-gradient(to bottom right, #f0fdf4, #d1fae5); }
        .fs-fp-icon-red { background-color: #fef2f2; color: #dc2626; } .fs-fp-visual-red { background: linear-gradient(to bottom right, #fef2f2, #ffe4e6); }
        .fs-fp-icon-purple { background-color: #faf5ff; color: #9333ea; } .fs-fp-visual-purple { background: linear-gradient(to bottom right, #faf5ff, #ede9fe); }
        .fs-fp-icon-teal { background-color: #f0fdfa; color: #0d9488; } .fs-fp-visual-teal { background: linear-gradient(to bottom right, #f0fdfa, #cffafe); }

        /* -- ANIMATED HERO -- */
        .fs-fp-hero { position: relative; padding-top: 8rem; padding-bottom: 4rem; background: linear-gradient(180deg, #064e3b 0%, #022c22 100%); text-align: center; overflow: hidden; }
        @media (min-width: 768px) { .fs-fp-hero { padding-top: 10rem; } }
        
        .fs-fp-hero-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }

        @keyframes sunPulse { 0% { transform: scale(1); box-shadow: 0 0 50px 20px rgba(250, 204, 21, 0.2); } 100% { transform: scale(1.05); box-shadow: 0 0 80px 40px rgba(250, 204, 21, 0.4); } }
        .fs-fp-bg-sun { position: absolute; top: -10%; left: 50%; transform: translateX(-50%); width: 250px; height: 250px; background: #facc15; border-radius: 50%; opacity: 0.2; animation: sunPulse 6s ease-in-out infinite alternate; filter: blur(50px); }

        @keyframes floatCloud { 0% { transform: translateX(-15vw); } 100% { transform: translateX(115vw); } }
        .fs-fp-bg-cloud { position: absolute; color: rgba(255, 255, 255, 0.08); animation: floatCloud linear infinite; }
        .fs-fp-bg-cloud-1 { top: 10%; left: -20%; animation-duration: 45s; animation-delay: -10s; }
        .fs-fp-bg-cloud-2 { top: 25%; left: -20%; animation-duration: 65s; animation-delay: -35s; transform: scale(1.5); color: rgba(255, 255, 255, 0.04); }

        @keyframes waveHills { 0% { transform: translateX(0) scaleY(1); } 50% { transform: translateX(-2%) scaleY(1.05); } 100% { transform: translateX(0) scaleY(1); } }
        .fs-fp-bg-hill { position: absolute; bottom: -5%; width: 120%; border-radius: 50% 50% 0 0 / 100% 100% 0 0; animation: waveHills 10s ease-in-out infinite; }
        .fs-fp-bg-hill-1 { left: -5%; background: rgba(20, 83, 45, 0.5); z-index: 1; height: 35%; animation-duration: 12s; }
        .fs-fp-bg-hill-2 { left: -10%; background: rgba(6, 95, 70, 0.7); z-index: 2; height: 25%; animation-delay: -5s; }

        @keyframes leafFall { 0% { transform: translate(0, -50px) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translate(-150px, 100vh) rotate(720deg); opacity: 0; } }
        .fs-fp-bg-leaf { position: absolute; top: -10%; background: linear-gradient(135deg, #4ade80, #16a34a); border-radius: 50% 0 50% 0; opacity: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); animation: leafFall linear infinite; }
        .fs-fp-l-1 { left: 25%; width: 14px; height: 14px; animation-duration: 12s; animation-delay: 0s; }
        .fs-fp-l-2 { left: 75%; width: 18px; height: 18px; animation-duration: 14s; animation-delay: 2s; background: linear-gradient(135deg, #facc15, #ca8a04); }

        .fs-fp-noise { position: absolute; inset: 0; background-image: url('https://grainy-gradients.vercel.app/noise.svg'); opacity: 0.2; mix-blend-mode: overlay; z-index: 3;}

        .fs-fp-hero-content { position: relative; z-index: 10; max-width: 48rem; margin: 0 auto; }
        .fs-fp-hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.05); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 0.75rem; font-weight: 600; padding: 0.375rem 1rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
        .fs-fp-gradient-text { background: linear-gradient(to right, #fde047, #6ee7b7); -webkit-background-clip: text; color: transparent; }
        .fs-fp-hero-p { color: rgba(209, 250, 229, 0.8); font-size: 1.125rem; max-width: 42rem; margin: 0 auto; line-height: 1.625; font-weight: 300; }

        /* -- SECTIONS -- */
        .fs-fp-sections-wrap { padding: 5rem 0; display: flex; flex-direction: column; gap: 6rem; }
        .fs-fp-row { display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: center; }
        @media (min-width: 768px) { .fs-fp-row { grid-template-columns: 1fr 1fr; } .fs-fp-row-reverse > :first-child { order: 2; } }
        .fs-fp-subtitle { font-size: 0.875rem; font-weight: 600; color: var(--fp-primary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; display: block; }
        .fs-fp-desc { color: var(--fp-text-muted); line-height: 1.625; margin-bottom: 1.5rem; }
        .fs-fp-bullets { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.625rem; }
        .fs-fp-bullet { display: flex; align-items: flex-start; gap: 0.625rem; font-size: 0.875rem; color: #374151; }

        .fs-fp-add-wrap { background-color: #f9fafb; padding: 4rem 0; text-align: center; }
        .fs-fp-pill-wrap { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-top: 2.5rem; }
        .fs-fp-pill { display: flex; align-items: center; gap: 0.625rem; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 999px; padding: 0.625rem 1.25rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .fs-fp-pill-text { font-size: 0.875rem; font-weight: 500; color: #374151; }

        .fs-fp-cta { background-color: #15803d; padding: 4rem 0; text-align: center; }
        .fs-fp-cta-h2 { font-family: var(--fp-font-display); font-size: 1.875rem; font-weight: 700; color: #ffffff; margin-bottom: 1rem; }
      `}</style>

      <div className="fs-fp-wrapper">
        <PublicNavbar />

        <main style={{ flex: 1 }}>
          <section className="fs-fp-hero">
            {/* Animated Farming Background */}
            <div className="fs-fp-hero-bg">
              <div className="fs-fp-bg-sun" />
              <Cloud className="fs-fp-bg-cloud fs-fp-bg-cloud-1" size={160} />
              <Cloud className="fs-fp-bg-cloud fs-fp-bg-cloud-2" size={240} />
              <div className="fs-fp-bg-hill fs-fp-bg-hill-1" />
              <div className="fs-fp-bg-hill fs-fp-bg-hill-2" />
              <div className="fs-fp-bg-leaf fs-fp-l-1" />
              <div className="fs-fp-bg-leaf fs-fp-l-2" />
              <div className="fs-fp-noise" />
            </div>

            <div className="fs-fp-container fs-fp-hero-content">
              <FadeUp delay={0.1}>
                <div className="fs-fp-hero-badge">
                  <Zap size={16} color="#facc15" />
                  <span>{text.heroBadge}</span>
                </div>
              </FadeUp>
              <FadeUp delay={0.2}>
                <h1 className="fs-fp-h1">
                  {text.heroTitle1} <span className="fs-fp-gradient-text">{text.heroTitle2}</span>
                </h1>
              </FadeUp>
              <FadeUp delay={0.3}>
                <p className="fs-fp-hero-p">{text.heroDesc}</p>
              </FadeUp>
            </div>
          </section>

          <div className="fs-fp-container fs-fp-sections-wrap">
            {featureSections.map(({ icon: Icon, title, subtitle, description, bullets, theme }, i) => (
              <FadeUp key={title} delay={0.1}>
                <div className={`fs-fp-row ${i % 2 === 1 ? "fs-fp-row-reverse" : ""}`}>
                  <div>
                    <div className={`fs-fp-icon-box fs-fp-icon-${theme}`}>
                      <Icon size={28} />
                    </div>
                    <span className="fs-fp-subtitle">{subtitle}</span>
                    <h2 className="fs-fp-h2">{title}</h2>
                    <p className="fs-fp-desc">{description}</p>
                    <ul className="fs-fp-bullets">
                      {bullets.map((b) => (
                        <li key={b} className="fs-fp-bullet">
                          <CheckCircle size={20} color="var(--fp-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} className={`fs-fp-visual-box fs-fp-visual-${theme}`}>
                    <Icon size={112} color="rgba(0,0,0,0.1)" strokeWidth={0.8} />
                  </motion.div>
                </div>
              </FadeUp>
            ))}
          </div>

          <section className="fs-fp-add-wrap">
            <div className="fs-fp-container">
              <FadeUp>
                <h2 className="fs-fp-h2" style={{ margin: 0 }}>{text.addTitle}</h2>
              </FadeUp>
              <div className="fs-fp-pill-wrap">
                {additionalFeatures.map(({ icon: Icon, label }) => (
                  <FadeUp key={label}>
                    <div className="fs-fp-pill">
                      <Icon size={16} color="var(--fp-primary)" />
                      <span className="fs-fp-pill-text">{label}</span>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>

          <section className="fs-fp-cta">
            <div className="fs-fp-container">
              <FadeUp>
                <h2 className="fs-fp-cta-h2">{text.ctaTitle}</h2>
                <p className="fs-fp-hero-p" style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>{text.ctaDesc}</p>
                <a href="/app" className="fs-fp-btn">
                  {text.btnStartFree}
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