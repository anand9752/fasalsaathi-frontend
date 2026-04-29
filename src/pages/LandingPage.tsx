import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, Variants } from "motion/react";
import { 
  ArrowRight, Cloud, TrendingUp, Leaf, Smartphone, 
  Shield, BarChart3, Zap, Star, CheckCircle, 
  Users, MapPin, Award 
} from "lucide-react";
import { PublicNavbar } from "../components/public/PublicNavbar";
import { PublicFooter } from "../components/public/PublicFooter";
import { useLanguage } from "../hooks/useLanguage";

// ─── Translations Dictionary ──────────────────────────────────────────────────
const t = {
  en: {
    heroBadge: "AI-Powered Smart Farming",
    heroTitle1: "Grow Smarter.",
    heroTitle2: "Earn More.",
    heroDesc: "Equipping Indian farmers with live weather intelligence, AI crop advice, and instant disease detection—in your local language.",
    btnStartFree: "Start for Free",
    btnSeeFeatures: "See Features",
    trust1: "Free to Start",
    trust2: "Local Languages",
    trust3: "No Credit Card",
    stat1: "Farmers Served",
    stat2: "States Covered",
    stat3: "Crop Varieties",
    stat4: "Uptime Guarantee",
    featLabel: "Complete Toolset",
    featTitle: "Built for the Modern Farmer",
    featDesc: "From soil preparation to market sales, FasalSaathi covers every stage of your farming journey with precision AI models trained on Indian agriculture data.",
    feat1Title: "Live Weather Intelligence",
    feat1Desc: "Hyperlocal forecasts powered by OpenWeatherMap. Know exactly when to sow, irrigate, or harvest.",
    feat2Title: "Real-Time Market Prices",
    feat2Desc: "Track mandi prices for 200+ crops across 18 states. Sell at the right time, maximise your returns.",
    feat3Title: "AI Crop Recommendations",
    feat3Desc: "AI analyses your soil type, location, and season to recommend the most profitable crop for your farm.",
    feat4Title: "Plant Disease Detection",
    feat4Desc: "Upload a photo of your crop and our AI instantly identifies the disease and suggests treatment.",
    feat5Title: "Yield Prediction",
    feat5Desc: "Data-driven yield forecasting so you can plan storage, logistics, and sales months in advance.",
    feat6Title: "Multilingual & Offline",
    feat6Desc: "Works in Hindi, Marathi, Punjabi and English. Key data caches locally so you're never left without guidance.",
    stepLabel: "Simple Process",
    stepTitle: "Get Started in Minutes",
    stepDesc: "No technical knowledge required. We designed our interface to be intuitive and accessible for every farmer.",
    step1Title: "Create Your Farm",
    step1Desc: "Register in under 2 minutes. Add your farm location, size, and primary crop. No paperwork needed.",
    step2Title: "Get Personalised Insights",
    step2Desc: "Receive AI-powered recommendations tailored to your land, weather, and local market conditions.",
    step3Title: "Grow & Profit",
    step3Desc: "Act on real-time alerts, sell at the best mandi price, and track your farm's progress over seasons.",
    testLabel: "Real Stories",
    testTitle: "Farmers Love FasalSaathi",
    ctaTitle: "Ready to Transform Your Farm?",
    ctaDesc: "Join 50,000+ farmers already using FasalSaathi. Free forever for basic features. Start making data-driven decisions today.",
    btnViewPricing: "View Pricing",
    testi1Quote: "FasalSaathi warned me about unseasonal rain 3 days early. I harvested on time and saved my entire wheat crop.",
    testi2Quote: "Market price alerts helped me sell onions at ₹38/kg instead of distress selling at ₹12. My income doubled this season.",
    testi3Quote: "The plant disease scanner is a lifesaver. Identified leaf blight on my paddy crop instantly and told me exactly what spray to use."
  },
  hi: {
    heroBadge: "AI-संचालित स्मार्ट खेती",
    heroTitle1: "स्मार्ट तरीके से उगाएं।",
    heroTitle2: "अधिक कमाएं।",
    heroDesc: "भारतीय किसानों को लाइव मौसम की जानकारी, AI फसल सलाह और त्वरित रोग पहचान से लैस करना—आपकी अपनी भाषा में।",
    btnStartFree: "मुफ्त शुरू करें",
    btnSeeFeatures: "सुविधाएं देखें",
    trust1: "मुफ्त शुरुआत",
    trust2: "स्थानीय भाषाएं",
    trust3: "नो क्रेडिट कार्ड",
    stat1: "किसानों की सेवा की",
    stat2: "कवर किए गए राज्य",
    stat3: "फसल की किस्में",
    stat4: "अपटाइम गारंटी",
    featLabel: "संपूर्ण टूलसेट",
    featTitle: "आधुनिक किसान के लिए निर्मित",
    featDesc: "मिट्टी की तैयारी से लेकर बाजार की बिक्री तक, फसलसाथी भारतीय कृषि डेटा पर प्रशिक्षित AI मॉडल के साथ आपकी खेती के हर चरण को कवर करता है।",
    feat1Title: "लाइव मौसम की जानकारी",
    feat1Desc: "OpenWeatherMap द्वारा संचालित हाइपरलोकल पूर्वानुमान। जानें कि कब बोना, सिंचाई करना या काटना है।",
    feat2Title: "रियल-टाइम मंडी भाव",
    feat2Desc: "18 राज्यों में 200+ फसलों के मंडी भाव ट्रैक करें। सही समय पर बेचें, अपना मुनाफा बढ़ाएं।",
    feat3Title: "AI फसल सिफारिशें",
    feat3Desc: "AI आपकी मिट्टी, स्थान और मौसम का विश्लेषण करके आपके खेत के लिए सबसे लाभदायक फसल की सिफारिश करता है।",
    feat4Title: "पौधों के रोग की पहचान",
    feat4Desc: "अपनी फसल की एक तस्वीर अपलोड करें और हमारा AI तुरंत बीमारी की पहचान करके इलाज का सुझाव देता है।",
    feat5Title: "उपज की भविष्यवाणी",
    feat5Desc: "डेटा-संचालित उपज पूर्वानुमान ताकि आप महीनों पहले भंडारण, रसद और बिक्री की योजना बना सकें।",
    feat6Title: "बहुभाषी और ऑफलाइन",
    feat6Desc: "हिंदी, मराठी, पंजाबी और अंग्रेजी में काम करता है। मुख्य डेटा स्थानीय रूप से सहेजा जाता है ताकि आप बिना इंटरनेट भी इसे देख सकें।",
    stepLabel: "सरल प्रक्रिया",
    stepTitle: "मिनटों में शुरू करें",
    stepDesc: "तकनीकी ज्ञान की आवश्यकता नहीं। हमने अपने इंटरफ़ेस को हर किसान के लिए सुलभ बनाया है।",
    step1Title: "अपना खेत बनाएं",
    step1Desc: "2 मिनट से कम समय में रजिस्टर करें। अपने खेत का स्थान, आकार और मुख्य फसल जोड़ें।",
    step2Title: "व्यक्तिगत अंतर्दृष्टि प्राप्त करें",
    step2Desc: "अपनी भूमि, मौसम और स्थानीय बाजार की स्थितियों के अनुरूप AI-संचालित सिफारिशें प्राप्त करें।",
    step3Title: "उगाएं और लाभ कमाएं",
    step3Desc: "रियल-टाइम अलर्ट पर कार्य करें, सर्वोत्तम मंडी भाव पर बेचें, और हर मौसम में अपनी प्रगति को ट्रैक करें।",
    testLabel: "सच्ची कहानियाँ",
    testTitle: "किसान फसलसाथी को पसंद करते हैं",
    ctaTitle: "अपने खेत को बदलने के लिए तैयार हैं?",
    ctaDesc: "फसलसाथी का उपयोग कर रहे 50,000+ किसानों से जुड़ें। बुनियादी सुविधाओं के लिए हमेशा मुफ्त। आज ही शुरुआत करें।",
    btnViewPricing: "मूल्य निर्धारण देखें",
    testi1Quote: "फसलसाथी ने मुझे बेमौसम बारिश के बारे में 3 दिन पहले चेतावनी दी थी। मैंने समय पर कटाई की और अपनी पूरी गेहूं की फसल बचा ली।",
    testi2Quote: "मंडी भाव अलर्ट ने मुझे 12 रुपये में बेचने के बजाय 38 रुपये/किलो पर प्याज बेचने में मदद की। इस सीजन मेरी आय दोगुनी हो गई।",
    testi3Quote: "प्लांट स्कैनर एक जीवन रक्षक है। मेरी धान की फसल पर लीफ ब्लाइट की तुरंत पहचान की और मुझे बताया कि कौन सा स्प्रे उपयोग करना है।"
  },
  mr: {
    heroBadge: "AI-सक्षम स्मार्ट शेती",
    heroTitle1: "स्मार्ट शेती करा.",
    heroTitle2: "अधिक कमवा.",
    heroDesc: "भारतीय शेतकर्‍यांना थेट हवामान माहिती, AI पीक सल्ला आणि तात्काळ रोग निदान प्रदान करत आहोत—तुमच्या स्थानिक भाषेत.",
    btnStartFree: "मोफत सुरू करा",
    btnSeeFeatures: "वैशिष्ट्ये पहा",
    trust1: "मोफत सुरुवात",
    trust2: "स्थानिक भाषा",
    trust3: "क्रेडिट कार्ड नको",
    stat1: "शेतकर्‍यांची सेवा केली",
    stat2: "समाविष्ट राज्ये",
    stat3: "पिकांचे प्रकार",
    stat4: "अपटाइम हमी",
    featLabel: "संपूर्ण टूलसेट",
    featTitle: "आधुनिक शेतकर्‍यांसाठी निर्मित",
    featDesc: "माती तयार करण्यापासून ते बाजारात विक्रीपर्यंत, फसलसाथी तुमच्या शेतीच्या प्रवासातील प्रत्येक टप्पा कव्हर करते.",
    feat1Title: "थेट हवामान माहिती",
    feat1Desc: "अचूक स्थानिक अंदाज. कधी पेरायचे, पाणी द्यायचे किंवा काढणी करायची हे अचूक जाणून घ्या.",
    feat2Title: "रिअल-टाइम बाजारभाव",
    feat2Desc: "१८ राज्यांतील २००+ पिकांचे बाजारभाव ट्रॅक करा. योग्य वेळी विक्री करा आणि नफा वाढवा.",
    feat3Title: "AI पीक शिफारसी",
    feat3Desc: "तुमच्या शेतासाठी सर्वात फायदेशीर पीक सुचवण्यासाठी AI माती, ठिकाण आणि हंगामाचे विश्लेषण करते.",
    feat4Title: "वनस्पती रोग ओळख",
    feat4Desc: "तुमच्या पिकाचा फोटो अपलोड करा आणि आमचे AI त्वरित रोग ओळखते आणि उपचारांचा सल्ला देते.",
    feat5Title: "उत्पन्नाचा अंदाज",
    feat5Desc: "डेटा-आधारित उत्पन्नाचा अंदाज जेणेकरून तुम्ही आगाऊ साठवणूक आणि विक्रीचे नियोजन करू शकाल.",
    feat6Title: "बहुभाषिक आणि ऑफलाइन",
    feat6Desc: "हिंदी, मराठी, पंजाबी आणि इंग्रजीमध्ये काम करते. महत्त्वाचा डेटा ऑफलाइन सेव्ह होतो.",
    stepLabel: "सोपी प्रक्रिया",
    stepTitle: "काही मिनिटांत सुरू करा",
    stepDesc: "कोणत्याही तांत्रिक ज्ञानाची आवश्यकता नाही. आमचा इंटरफेस प्रत्येक शेतकर्‍यासाठी सोपा आहे.",
    step1Title: "तुमचे शेत तयार करा",
    step1Desc: "२ मिनिटांत नोंदणी करा. शेताचे ठिकाण, आकार आणि मुख्य पीक जोडा.",
    step2Title: "वैयक्तिकृत माहिती मिळवा",
    step2Desc: "तुमची जमीन, हवामान आणि स्थानिक बाजारपेठेनुसार AI-सक्षम शिफारसी मिळवा.",
    step3Title: "वाढवा आणि नफा कमवा",
    step3Desc: "रिअल-टाइम अलर्टवर कृती करा, उत्तम बाजारभावात विक्री करा आणि प्रगती ट्रॅक करा.",
    testLabel: "खऱ्या कथा",
    testTitle: "शेतकर्‍यांना फसलसाथी आवडते",
    ctaTitle: "तुमचे शेत बदलण्यास तयार आहात?",
    ctaDesc: "फसलसाथी वापरणाऱ्या ५०,०००+ शेतकर्‍यांमध्ये सामील व्हा. मूलभूत वैशिष्ट्यांसाठी कायमचे मोफत.",
    btnViewPricing: "किंमती पहा",
    testi1Quote: "फसलसाथीने मला ३ दिवस अगोदर अवकाळी पावसाचा इशारा दिला. मी वेळेवर कापणी केली आणि माझे गव्हाचे पीक वाचवले.",
    testi2Quote: "बाजारभाव अलर्टमुळे मी १२ रुपयांऐवजी ३८ रुपये/किलो दराने कांदा विकू शकलो. या हंगामात माझे उत्पन्न दुप्पट झाले.",
    testi3Quote: "प्लांट डिसीज स्कॅनरने माझ्या धान पिकावरील रोगाची त्वरित ओळख केली आणि मला अचूक फवारणी सांगितली."
  },
  pa: {
    heroBadge: "AI-ਸੰਚਾਲਿਤ ਸਮਾਰਟ ਖੇਤੀ",
    heroTitle1: "ਸਮਾਰਟ ਖੇਤੀ ਕਰੋ।",
    heroTitle2: "ਵੱਧ ਕਮਾਓ।",
    heroDesc: "ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਨੂੰ ਲਾਈਵ ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ, AI ਫਸਲ ਸਲਾਹ ਅਤੇ ਤੁਰੰਤ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ ਨਾਲ ਲੈਸ ਕਰਨਾ—ਤੁਹਾਡੀ ਸਥਾਨਕ ਭਾਸ਼ਾ ਵਿੱਚ।",
    btnStartFree: "ਮੁਫਤ ਸ਼ੁਰੂ ਕਰੋ",
    btnSeeFeatures: "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਦੇਖੋ",
    trust1: "ਮੁਫਤ ਸ਼ੁਰੂਆਤ",
    trust2: "ਸਥਾਨਕ ਭਾਸ਼ਾਵਾਂ",
    trust3: "ਕ੍ਰੈਡਿਟ ਕਾਰਡ ਨਹੀਂ",
    stat1: "ਕਿਸਾਨਾਂ ਦੀ ਸੇਵਾ ਕੀਤੀ",
    stat2: "ਕਵਰ ਕੀਤੇ ਰਾਜ",
    stat3: "ਫਸਲਾਂ ਦੀਆਂ ਕਿਸਮਾਂ",
    stat4: "ਅਪਟਾਈਮ ਗਾਰੰਟੀ",
    featLabel: "ਪੂਰਾ ਟੂਲਸੈੱਟ",
    featTitle: "ਆਧੁਨਿਕ ਕਿਸਾਨ ਲਈ ਬਣਾਇਆ ਗਿਆ",
    featDesc: "ਮਿੱਟੀ ਦੀ ਤਿਆਰੀ ਤੋਂ ਲੈ ਕੇ ਮੰਡੀ ਦੀ ਵਿਕਰੀ ਤੱਕ, ਫਸਲਸਾਥੀ ਤੁਹਾਡੀ ਖੇਤੀ ਦੇ ਹਰ ਪੜਾਅ ਨੂੰ ਕਵਰ ਕਰਦਾ ਹੈ।",
    feat1Title: "ਲਾਈਵ ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ",
    feat1Desc: "ਸਟੀਕ ਸਥਾਨਕ ਭਵਿੱਖਬਾਣੀ। ਜਾਣੋ ਕਿ ਕਦੋਂ ਬੀਜਣਾ, ਸਿੰਚਾਈ ਕਰਨੀ ਜਾਂ ਵਾਢੀ ਕਰਨੀ ਹੈ।",
    feat2Title: "ਅਸਲ-ਸਮੇਂ ਦੇ ਮੰਡੀ ਭਾਅ",
    feat2Desc: "18 ਰਾਜਾਂ ਵਿੱਚ 200+ ਫਸਲਾਂ ਦੇ ਮੰਡੀ ਭਾਅ ਟ੍ਰੈਕ ਕਰੋ। ਸਹੀ ਸਮੇਂ 'ਤੇ ਵੇਚੋ ਅਤੇ ਮੁਨਾਫਾ ਵਧਾਓ।",
    feat3Title: "AI ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ",
    feat3Desc: "AI ਤੁਹਾਡੀ ਮਿੱਟੀ, ਸਥਾਨ ਅਤੇ ਮੌਸਮ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਕੇ ਸਭ ਤੋਂ ਵੱਧ ਲਾਭਦਾਇਕ ਫਸਲ ਦੀ ਸਿਫਾਰਸ਼ ਕਰਦਾ ਹੈ।",
    feat4Title: "ਪੌਦਿਆਂ ਦੀ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ",
    feat4Desc: "ਫਸਲ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ ਅਤੇ ਸਾਡਾ AI ਤੁਰੰਤ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ ਕਰਦਾ ਹੈ ਅਤੇ ਇਲਾਜ ਦਾ ਸੁਝਾਅ ਦਿੰਦਾ ਹੈ।",
    feat5Title: "ਝਾੜ ਦੀ ਭਵਿੱਖਬਾਣੀ",
    feat5Desc: "ਡਾਟਾ-ਸੰਚਾਲਿਤ ਝਾੜ ਦੀ ਭਵਿੱਖਬਾਣੀ ਤਾਂ ਜੋ ਤੁਸੀਂ ਪਹਿਲਾਂ ਤੋਂ ਸਟੋਰੇਜ ਅਤੇ ਵਿਕਰੀ ਦੀ ਯੋਜਨਾ ਬਣਾ ਸਕੋ।",
    feat6Title: "ਬਹੁ-ਭਾਸ਼ਾਈ ਅਤੇ ਆਫ਼ਲਾਈਨ",
    feat6Desc: "ਹਿੰਦੀ, ਮਰਾਠੀ, ਪੰਜਾਬੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਕੰਮ ਕਰਦਾ ਹੈ। ਮੁੱਖ ਡਾਟਾ ਆਫ਼ਲਾਈਨ ਸੇਵ ਹੁੰਦਾ ਹੈ।",
    stepLabel: "ਸੌਖੀ ਪ੍ਰਕਿਰਿਆ",
    stepTitle: "ਮਿੰਟਾਂ ਵਿੱਚ ਸ਼ੁਰੂ ਕਰੋ",
    stepDesc: "ਕਿਸੇ ਤਕਨੀਕੀ ਗਿਆਨ ਦੀ ਲੋੜ ਨਹੀਂ। ਸਾਡਾ ਇੰਟਰਫੇਸ ਹਰ ਕਿਸਾਨ ਲਈ ਸੌਖਾ ਹੈ।",
    step1Title: "ਆਪਣਾ ਖੇਤ ਬਣਾਓ",
    step1Desc: "2 ਮਿੰਟਾਂ ਵਿੱਚ ਰਜਿਸਟਰ ਕਰੋ। ਆਪਣੇ ਖੇਤ ਦਾ ਸਥਾਨ, ਆਕਾਰ ਅਤੇ ਮੁੱਖ ਫਸਲ ਸ਼ਾਮਲ ਕਰੋ।",
    step2Title: "ਵਿਅਕਤੀਗਤ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰੋ",
    step2Desc: "ਆਪਣੀ ਜ਼ਮੀਨ, ਮੌਸਮ ਅਤੇ ਮੰਡੀ ਦੀਆਂ ਸਥਿਤੀਆਂ ਦੇ ਅਨੁਸਾਰ AI-ਸੰਚਾਲਿਤ ਸਿਫਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰੋ।",
    step3Title: "ਉਗਾਓ ਅਤੇ ਮੁਨਾਫਾ ਕਮਾਓ",
    step3Desc: "ਰੀਅਲ-ਟਾਈਮ ਅਲਰਟ 'ਤੇ ਕਾਰਵਾਈ ਕਰੋ, ਵਧੀਆ ਮੰਡੀ ਭਾਅ 'ਤੇ ਵੇਚੋ ਅਤੇ ਤਰੱਕੀ ਨੂੰ ਟ੍ਰੈਕ ਕਰੋ।",
    testLabel: "ਅਸਲੀ ਕਹਾਣੀਆਂ",
    testTitle: "ਕਿਸਾਨ ਫਸਲਸਾਥੀ ਨੂੰ ਪਸੰਦ ਕਰਦੇ ਹਨ",
    ctaTitle: "ਆਪਣੇ ਖੇਤ ਨੂੰ ਬਦਲਣ ਲਈ ਤਿਆਰ ਹੋ?",
    ctaDesc: "ਫਸਲਸਾਥੀ ਦੀ ਵਰਤੋਂ ਕਰ ਰਹੇ 50,000+ ਕਿਸਾਨਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ। ਬੁਨਿਆਦੀ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਲਈ ਹਮੇਸ਼ਾ ਮੁਫ਼ਤ।",
    btnViewPricing: "ਕੀਮਤਾਂ ਦੇਖੋ",
    testi1Quote: "ਫਸਲਸਾਥੀ ਨੇ ਮੈਨੂੰ ਬੇਮੌਸਮੀ ਬਾਰਿਸ਼ ਬਾਰੇ 3 ਦਿਨ ਪਹਿਲਾਂ ਚੇਤਾਵਨੀ ਦਿੱਤੀ ਸੀ। ਮੈਂ ਸਮੇਂ ਸਿਰ ਵਾਢੀ ਕੀਤੀ ਅਤੇ ਆਪਣੀ ਕਣਕ ਬਚਾ ਲਈ।",
    testi2Quote: "ਮੰਡੀ ਅਲਰਟ ਨੇ ਮੈਨੂੰ 12 ਰੁਪਏ ਦੀ ਬਜਾਏ 38 ਰੁਪਏ/ਕਿਲੋ 'ਤੇ ਪਿਆਜ਼ ਵੇਚਣ ਵਿੱਚ ਮਦਦ ਕੀਤੀ। ਮੇਰੀ ਆਮਦਨ ਦੁੱਗਣੀ ਹੋ ਗਈ।",
    testi3Quote: "ਪਲਾਂਟ ਸਕੈਨਰ ਬਹੁਤ ਵਧੀਆ ਹੈ। ਮੇਰੀ ਝੋਨੇ ਦੀ ਫਸਲ 'ਤੇ ਬਿਮਾਰੀ ਦੀ ਤੁਰੰਤ ਪਛਾਣ ਕੀਤੀ ਅਤੇ ਮੈਨੂੰ ਸਹੀ ਸਪਰੇਅ ਦੱਸੀ।"
  }
};

// ─── Animation Definition (Framer Motion) ───────────────────────────────────
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: i => ({
    opacity: 1, 
    y: 0, 
    transition: { delay: i * 0.05, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }
  })
};

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const childYVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const reactiveVariants: Variants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 }
};

function FadeUp({ children, delay = 0, className = "", style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div 
      ref={ref} 
      initial="hidden" 
      animate={inView ? "visible" : "hidden"} 
      variants={fadeUpVariants} 
      custom={delay}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export function LandingPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const text = t[lang];

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const featRef = useRef(null);
  const featInView = useInView(featRef, { once: true, margin: "-100px" });
  const stepRef = useRef(null);
  const stepInView = useInView(stepRef, { once: true, margin: "-100px" });
  const testiRef = useRef(null);
  const testiInView = useInView(testiRef, { once: true, margin: "-100px" });

  const stats = [
    { value: "50,000+", label: text.stat1, icon: Users },
    { value: "18", label: text.stat2, icon: MapPin },
    { value: "200+", label: text.stat3, icon: Leaf },
    { value: "99.5%", label: text.stat4, icon: Award },
  ];

  const features = [
    { icon: Cloud, title: text.feat1Title, desc: text.feat1Desc, theme: "blue" },
    { icon: TrendingUp, title: text.feat2Title, desc: text.feat2Desc, theme: "orange" },
    { icon: Leaf, title: text.feat3Title, desc: text.feat3Desc, theme: "green" },
    { icon: Shield, title: text.feat4Title, desc: text.feat4Desc, theme: "red" },
    { icon: Smartphone, title: text.feat6Title, desc: text.feat6Desc, theme: "teal" },
  ];

  const steps = [
    { step: "01", title: text.step1Title, desc: text.step1Desc },
    { step: "02", title: text.step2Title, desc: text.step2Desc },
    { step: "03", title: text.step3Title, desc: text.step3Desc },
  ];

  const testimonials = [
    { name: "Ramesh Patel", location: "Vidisha, MP", crop: "Wheat & Soybean", text: text.testi1Quote, rating: 5, initials: "RP" },
    { name: "Sunita Devi", location: "Nashik, MH", crop: "Onion & Grapes", text: text.testi2Quote, rating: 5, initials: "SD" },
    { name: "Mohan Singh", location: "Ludhiana, PB", crop: "Rice & Maize", text: text.testi3Quote, rating: 5, initials: "MS" },
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        :root {
          --lp-font-body: 'Inter', system-ui, sans-serif; 
          --lp-font-display: 'Poppins', system-ui, sans-serif; 
          --lp-primary: #16a34a; 
          --lp-primary-dark: #15803d; 
          --lp-primary-darker: #14532d; 
          --lp-primary-light: #dcfce7; 
          --lp-text-dark: #111827; 
          --lp-text-muted: #4b5563; 
          --lp-text-light: #ffffff; 
          --lp-text-light-muted: #d1fae5;
          --lp-bg-page: #f8fafc;
        }

        .fs-lp-wrapper { 
          font-family: var(--lp-font-body); 
          background-color: var(--lp-bg-page); 
          color: var(--lp-text-dark); 
          overflow-x: hidden; 
          display: flex; 
          flex-direction: column; 
          min-height: 100vh; 
        }
        
        .fs-lp-container { max-width: 80rem; margin: 0 auto; padding: 0 1rem; width: 100%; box-sizing: border-box; }
        @media (min-width: 640px) { .fs-lp-container { padding: 0 1.5rem; } }
        @media (min-width: 1024px) { .fs-lp-container { padding: 0 2rem; } }
        
        .fs-lp-h1 { font-family: var(--lp-font-display); font-size: 3rem; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 1.5rem; }
        @media (min-width: 640px) { .fs-lp-h1 { font-size: 3.75rem; } }
        @media (min-width: 1024px) { .fs-lp-h1 { font-size: 4.5rem; } }
        
        .fs-lp-h2 { font-family: var(--lp-font-display); font-size: 1.875rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--lp-text-dark); }
        @media (min-width: 640px) { .fs-lp-h2 { font-size: 2.25rem; } }
        @media (min-width: 1024px) { .fs-lp-h2 { font-size: 3rem; } }
        
        .fs-lp-h3 { font-family: var(--lp-font-display); font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--lp-text-dark); }
        
        .fs-lp-section-label { display: block; font-size: 0.875rem; font-weight: 700; color: var(--lp-primary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
        
        .fs-lp-btn-group { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2.5rem; }
        @media (min-width: 640px) { .fs-lp-btn-group { flex-direction: row; } }
        
        .fs-lp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem 2rem; border-radius: 0.75rem; font-size: 1rem; font-weight: 600; cursor: pointer; text-decoration: none; border: none; font-family: inherit; will-change: transform, box-shadow, background-color; }
        .fs-lp-btn-white { background-color: #ffffff; color: var(--lp-primary-darker); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .fs-lp-btn-outline-white { background-color: transparent; color: #ffffff; border: 2px solid rgba(255,255,255,0.3); }
        .fs-lp-btn-outline-white:hover { background-color: rgba(255,255,255,0.1); }
        
        .fs-lp-icon-box { width: 3.5rem; height: 3.5rem; border-radius: 1rem; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; }
        .fs-lp-icon-blue { background-color: #eff6ff; color: #2563eb; } .fs-lp-icon-orange { background-color: #fff7ed; color: #ea580c; } .fs-lp-icon-green { background-color: #f0fdf4; color: #16a34a; } .fs-lp-icon-red { background-color: #fef2f2; color: #dc2626; } .fs-lp-icon-purple { background-color: #faf5ff; color: #9333ea; } .fs-lp-icon-teal { background-color: #f0fdfa; color: #0d9488; }
        
        /* ── HERO CSS ── */
        .fs-lp-hero { position: relative; padding-top: 10rem; padding-bottom: 14rem; background: linear-gradient(180deg, #064e3b 0%, #022c22 100%); color: #ffffff; overflow: hidden; z-index: 10; }
        @media (min-width: 768px) { .fs-lp-hero { padding-top: 12rem; } }
        @media (min-width: 1024px) { .fs-lp-hero { padding-top: 14rem; padding-bottom: 16rem; } }
        
        .fs-lp-hero-bg { position: absolute; inset: 0; pointer-events: none; z-index: -1; overflow: hidden; }

        @keyframes sunPulse { 0% { transform: scale(1); box-shadow: 0 0 50px 20px rgba(250, 204, 21, 0.2); } 100% { transform: scale(1.05); box-shadow: 0 0 80px 40px rgba(250, 204, 21, 0.4); } }
        .fs-lp-bg-sun { position: absolute; top: 15%; right: 20%; width: 120px; height: 120px; background: #facc15; border-radius: 50%; opacity: 0.85; animation: sunPulse 5s ease-in-out infinite alternate; }

        @keyframes floatCloud { 0% { transform: translateX(-15vw); } 100% { transform: translateX(115vw); } }
        .fs-lp-bg-cloud { position: absolute; color: rgba(255, 255, 255, 0.08); animation: floatCloud linear infinite; }
        .fs-lp-bg-cloud-1 { top: 10%; left: -20%; animation-duration: 45s; animation-delay: -10s; }
        .fs-lp-bg-cloud-2 { top: 25%; left: -20%; animation-duration: 65s; animation-delay: -35s; transform: scale(1.5); color: rgba(255, 255, 255, 0.04); }
        .fs-lp-bg-cloud-3 { top: 5%; left: -20%; animation-duration: 35s; animation-delay: -5s; transform: scale(0.8); }

        @keyframes waveHills { 0% { transform: translateX(0) scaleY(1); } 50% { transform: translateX(-2%) scaleY(1.05); } 100% { transform: translateX(0) scaleY(1); } }
        .fs-lp-bg-hill { position: absolute; bottom: -5%; width: 120%; border-radius: 50% 50% 0 0 / 100% 100% 0 0; animation: waveHills 10s ease-in-out infinite; }
        .fs-lp-bg-hill-1 { left: -5%; background: rgba(20, 83, 45, 0.5); z-index: 1; height: 35%; animation-duration: 12s; }
        .fs-lp-bg-hill-2 { left: -10%; background: rgba(6, 95, 70, 0.7); z-index: 2; height: 25%; animation-delay: -5s; }

        @keyframes leafFall { 0% { transform: translate(0, -50px) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translate(-150px, 100vh) rotate(720deg); opacity: 0; } }
        .fs-lp-bg-leaf { position: absolute; top: -10%; background: linear-gradient(135deg, #4ade80, #16a34a); border-radius: 50% 0 50% 0; opacity: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); animation: leafFall linear infinite; }
        .fs-lp-l-1 { left: 15%; width: 14px; height: 14px; animation-duration: 12s; animation-delay: 0s; }
        .fs-lp-l-2 { left: 40%; width: 10px; height: 10px; animation-duration: 16s; animation-delay: 3s; }
        .fs-lp-l-3 { left: 65%; width: 18px; height: 18px; animation-duration: 14s; animation-delay: 1s; background: linear-gradient(135deg, #facc15, #ca8a04); }
        .fs-lp-l-4 { left: 85%; width: 12px; height: 12px; animation-duration: 18s; animation-delay: 5s; }

        .fs-lp-noise { position: absolute; inset: 0; z-index: 3; background-image: url('/noise.svg'); opacity: 0.15; mix-blend-mode: overlay; pointer-events: none; }

        .fs-lp-hero-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; align-items: center; }
        @media (min-width: 1024px) { .fs-lp-hero-grid { grid-template-columns: 1fr 1fr; gap: 2rem; } }

        .fs-lp-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.05); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); border-radius: 999px; padding: 0.375rem 1rem; font-size: 0.875rem; font-weight: 500; margin-bottom: 2rem; }
        .fs-lp-hero-desc { font-size: 1.125rem; color: var(--lp-text-light-muted); line-height: 1.625; margin-bottom: 2.5rem; max-width: 42rem; font-weight: 300; }
        @media (min-width: 640px) { .fs-lp-hero-desc { font-size: 1.25rem; } }
        .fs-lp-hero-gradient-text { background: linear-gradient(to right, #fde047, #6ee7b7); -webkit-background-clip: text; color: transparent; }
        
        .fs-lp-trust-badges { display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center; }
        .fs-lp-trust-item { display: flex; align-items: center; gap: 0.375rem; font-size: 0.875rem; color: #a7f3d0; }

        .fs-lp-image-wrapper { display: none; position: relative; height: 600px; width: 100%; align-items: center; justify-content: center; z-index: 20; }
        @media (min-width: 1024px) { .fs-lp-image-wrapper { display: flex; } }
        .fs-lp-image-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; height: 400px; background: radial-gradient(circle, rgba(110, 231, 183, 0.4) 0%, rgba(110, 231, 183, 0) 70%); filter: blur(50px); z-index: 0; pointer-events: none; }
        
        @keyframes floatCart { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(1deg); } 100% { transform: translateY(0px) rotate(0deg); } }
        .fs-lp-hero-image { width: 100%; max-width: 800px; height: auto; z-index: 10; object-fit: contain; animation: floatCart 6s ease-in-out infinite; filter: drop-shadow(0 30px 40px rgba(0,0,0,0.5)); will-change: transform; }

        /* ── ENHANCED SECTIONS (Blending with Hero theme) ── */
        .fs-lp-stats-wrapper { position: relative; z-index: 30; margin-top: -6rem; }
        .fs-lp-stats-box { 
          background: rgba(255, 255, 255, 0.95); 
          backdrop-filter: blur(12px);
          border: 1px solid rgba(22, 163, 74, 0.15); 
          border-radius: 1.5rem; 
          padding: 2rem; 
          box-shadow: 0 25px 50px -12px rgba(6, 78, 59, 0.15); 
        }
        @media (min-width: 640px) { .fs-lp-stats-box { padding: 3rem; } }
        .fs-lp-stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
        @media (min-width: 1024px) { .fs-lp-stats-grid { grid-template-columns: repeat(4, 1fr); gap: 3rem; } }
        .fs-lp-stat-col { text-align: center; }
        @media (min-width: 1024px) { .fs-lp-stat-col { border-left: 1px solid rgba(22, 163, 74, 0.1); padding-left: 1.5rem; } .fs-lp-stat-col:first-child { border-left: none; padding-left: 0; } }
        .fs-lp-stat-icon { width: 3.5rem; height: 3.5rem; background: var(--lp-primary-light); border-radius: 1rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; }
        .fs-lp-stat-val { font-family: var(--lp-font-display); font-size: 2.25rem; font-weight: 700; color: var(--lp-text-dark); line-height: 1; margin-bottom: 0.5rem; }
        .fs-lp-stat-lbl { font-size: 0.875rem; font-weight: 500; color: var(--lp-text-muted); }

        .fs-lp-section { padding: 6rem 0; }
        @media (min-width: 1024px) { .fs-lp-section { padding: 8rem 0; } }
        
        .fs-lp-section-gray { background: linear-gradient(180deg, var(--lp-bg-page) 0%, #ffffff 100%); }
        .fs-lp-section-green { background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%); }
        
        .fs-lp-section-header { text-align: center; max-width: 48rem; margin: 0 auto 5rem; }
        .fs-lp-section-p { font-size: 1.125rem; color: var(--lp-text-muted); line-height: 1.625; }

        .fs-lp-features-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 768px) { .fs-lp-features-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .fs-lp-features-grid { grid-template-columns: repeat(3, 1fr); } }
        .fs-lp-feature-card { background: #ffffff; padding: 2rem; border-radius: 1.5rem; border: 1px solid rgba(22, 163, 74, 0.1); display: flex; flex-direction: column; height: 100%; cursor: pointer; will-change: transform, box-shadow; transition: all 0.3s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .fs-lp-feature-desc { color: var(--lp-text-muted); line-height: 1.625; flex: 1; }

        .fs-lp-steps-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; position: relative; }
        @media (min-width: 1024px) { .fs-lp-steps-grid { grid-template-columns: repeat(3, 1fr); } }
        .fs-lp-step-line { display: none; position: absolute; top: 2.5rem; left: 15%; right: 15%; height: 2px; border-top: 2px dashed rgba(22, 163, 74, 0.3); z-index: 0; }
        @media (min-width: 1024px) { .fs-lp-step-line { display: block; } }
        .fs-lp-step-card { text-align: center; position: relative; z-index: 10; cursor: pointer; }
        .fs-lp-step-num { width: 5rem; height: 5rem; margin: 0 auto 2rem; background: var(--lp-primary); color: #ffffff; border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; transform: rotate(3deg); transition: transform 0.3s ease; box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.3); }
        .fs-lp-step-card:hover .fs-lp-step-num { transform: rotate(0deg); }
        .fs-lp-step-num-inner { transform: rotate(-3deg); transition: transform 0.3s ease; }
        .fs-lp-step-card:hover .fs-lp-step-num-inner { transform: rotate(0deg); }

        .fs-lp-testi-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 768px) { .fs-lp-testi-grid { grid-template-columns: repeat(3, 1fr); } }
        .fs-lp-testi-card { background: #ffffff; padding: 2rem; border-radius: 1.5rem; border: 1px solid rgba(22, 163, 74, 0.15); cursor: pointer; display: flex; flex-direction: column; height: 100%; transition: all 0.3s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .fs-lp-stars { display: flex; gap: 0.25rem; margin-bottom: 1.5rem; }
        .fs-lp-quote { color: #374151; font-size: 1.125rem; line-height: 1.625; font-style: italic; flex: 1; margin-bottom: 2rem; }
        .fs-lp-user { display: flex; align-items: center; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid rgba(22, 163, 74, 0.1); }
        .fs-lp-avatar { width: 3rem; height: 3rem; border-radius: 50%; background: var(--lp-primary-light); color: var(--lp-primary-dark); font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .fs-lp-user-name { font-weight: 700; color: var(--lp-text-dark); margin: 0; }
        .fs-lp-user-loc { font-size: 0.875rem; color: var(--lp-text-muted); margin: 0; }
      `}</style>

      <div className="fs-lp-wrapper">
        <PublicNavbar />
        
        <main style={{ flex: 1 }}>
          {/* ── HERO ── */}
          <section className="fs-lp-hero">
            <div className="fs-lp-hero-bg">
              <div className="fs-lp-bg-sun" />
              <Cloud className="fs-lp-bg-cloud fs-lp-bg-cloud-1" size={200} />
              <Cloud className="fs-lp-bg-cloud fs-lp-bg-cloud-2" size={300} />
              <Cloud className="fs-lp-bg-cloud fs-lp-bg-cloud-3" size={150} />
              <div className="fs-lp-bg-hill fs-lp-bg-hill-1" />
              <div className="fs-lp-bg-hill fs-lp-bg-hill-2" />
              <div className="fs-lp-bg-leaf fs-lp-l-1" />
              <div className="fs-lp-bg-leaf fs-lp-l-2" />
              <div className="fs-lp-bg-leaf fs-lp-l-3" />
              <div className="fs-lp-bg-leaf fs-lp-l-4" />
              <div className="fs-lp-noise" />
            </div>

            <div className="fs-lp-container">
              <div className="fs-lp-hero-grid">
                <div style={{ zIndex: 10 }}>
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="fs-lp-badge">
                    <Zap size={16} color="#facc15" />
                    <span>{text.heroBadge}</span>
                  </motion.div>

                  <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }} className="fs-lp-h1">
                    {text.heroTitle1} <br />
                    <span className="fs-lp-hero-gradient-text">{text.heroTitle2}</span>
                  </motion.h1>

                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.25 }} className="fs-lp-hero-desc">
                    {text.heroDesc}
                  </motion.p>

                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="fs-lp-btn-group">
                    <motion.button onClick={() => navigate("/app")} variants={reactiveVariants} whileHover="hover" whileTap="tap" className="fs-lp-btn fs-lp-btn-white">
                      {text.btnStartFree} <ArrowRight size={20} />
                    </motion.button>
                    <motion.button onClick={() => navigate("/features")} variants={reactiveVariants} whileHover="hover" whileTap="tap" className="fs-lp-btn fs-lp-btn-outline-white">
                      {text.btnSeeFeatures}
                    </motion.button>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="fs-lp-trust-badges">
                    {[text.trust1, text.trust2, text.trust3].map((badge) => (
                      <div key={badge} className="fs-lp-trust-item">
                        <CheckCircle size={16} color="#34d399" />
                        <span>{badge}</span>
                      </div>
                    ))}
                  </motion.div>
                </div>

                <div className="fs-lp-image-wrapper">
                  <div className="fs-lp-image-glow" />
                  <motion.img 
                    src="/bal-gadi.png" 
                    alt="Traditional Bullock Cart"
                    initial={{ opacity: 0, scale: 0.5, rotate: -20, y: 50 }} 
                    animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }} 
                    transition={{ duration: 1.2, delay: 0.3, type: "spring", bounce: 0.2 }}
                    className="fs-lp-hero-image"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── STATS ── */}
          <section className="fs-lp-container fs-lp-stats-wrapper">
            <motion.div ref={statsRef} initial="hidden" animate={statsInView ? "visible" : "hidden"} variants={staggerContainerVariants} className="fs-lp-stats-box">
              <div className="fs-lp-stats-grid">
                {stats.map(({ value, label, icon: Icon }) => (
                  <motion.div key={label} variants={childYVariants} className="fs-lp-stat-col">
                    <div className="fs-lp-stat-icon">
                      <Icon size={28} color="var(--lp-primary)" />
                    </div>
                    <p className="fs-lp-stat-val">{value}</p>
                    <p className="fs-lp-stat-lbl">{label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ── FEATURES ── */}
          <section className="fs-lp-section fs-lp-section-gray">
            <div className="fs-lp-container">
              <FadeUp className="fs-lp-section-header">
                <span className="fs-lp-section-label">{text.featLabel}</span>
                <h2 className="fs-lp-h2">{text.featTitle}</h2>
                <p className="fs-lp-section-p">{text.featDesc}</p>
              </FadeUp>

              <motion.div ref={featRef} initial="hidden" animate={featInView ? "visible" : "hidden"} variants={staggerContainerVariants} className="fs-lp-features-grid">
                {features.map(({ icon: Icon, title, desc, theme }) => (
                  <motion.div key={title} variants={childYVariants} whileHover={{ y: -8, borderColor: "#16a34a", boxShadow: "0 25px 30px -10px rgba(22,163,74,0.1)" }} className="fs-lp-feature-card">
                    <div className={`fs-lp-icon-box fs-lp-icon-${theme}`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="fs-lp-h3">{title}</h3>
                    <p className="fs-lp-feature-desc">{desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── STEPS ── */}
          <section className="fs-lp-section" style={{ borderTop: '1px solid rgba(22, 163, 74, 0.1)', borderBottom: '1px solid rgba(22, 163, 74, 0.1)' }}>
            <div className="fs-lp-container">
              <FadeUp className="fs-lp-section-header">
                <span className="fs-lp-section-label">{text.stepLabel}</span>
                <h2 className="fs-lp-h2">{text.stepTitle}</h2>
                <p className="fs-lp-section-p">{text.stepDesc}</p>
              </FadeUp>

              <motion.div ref={stepRef} initial="hidden" animate={stepInView ? "visible" : "hidden"} variants={staggerContainerVariants} className="fs-lp-steps-grid">
                <motion.div initial={{ opacity: 0 }} animate={stepInView ? { opacity: 1, transition: { delay: 0.5, duration: 1 } } : {}} className="fs-lp-step-line" />
                {steps.map(({ step, title, desc }) => (
                  <motion.div key={step} variants={childYVariants} className="fs-lp-step-card">
                    <div className="fs-lp-step-num">
                      <span className="fs-lp-step-num-inner">{step}</span>
                    </div>
                    <h3 className="fs-lp-h3">{title}</h3>
                    <p className="fs-lp-section-p" style={{ padding: '0 1rem' }}>{desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── TESTIMONIALS ── */}
          <section className="fs-lp-section fs-lp-section-green">
            <div className="fs-lp-container">
              <FadeUp className="fs-lp-section-header">
                <span className="fs-lp-section-label">{text.testLabel}</span>
                <h2 className="fs-lp-h2">{text.testTitle}</h2>
              </FadeUp>

              <motion.div ref={testiRef} initial="hidden" animate={testiInView ? "visible" : "hidden"} variants={staggerContainerVariants} className="fs-lp-testi-grid">
                {testimonials.map(({ name, location, crop, text, rating, initials }) => (
                  <motion.div key={name} variants={childYVariants} whileHover={{ y: -5, borderColor: "#16a34a", boxShadow: "0 20px 25px -5px rgba(22,163,74,0.1)" }} className="fs-lp-testi-card">
                    <div className="fs-lp-stars">
                      {Array.from({ length: rating }).map((_, j) => (
                        <Star key={j} size={20} color="#facc15" fill="#facc15" />
                      ))}
                    </div>
                    <p className="fs-lp-quote">"{text}"</p>
                    <div className="fs-lp-user">
                      <div className="fs-lp-avatar">{initials}</div>
                      <div>
                        <p className="fs-lp-user-name">{name}</p>
                        <p className="fs-lp-user-loc">{location} · {crop}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── CTA BANNER (NIGHT FARM & GLASS CARD) ── */}
          <section style={{ position: 'relative', padding: '8rem 1rem', overflow: 'hidden', background: 'linear-gradient(180deg, #022c22 0%, #064e3b 100%)' }}>
            
            {/* Fixed Animated Background Layer matching Hero CSS */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
              <div className="fs-lp-bg-sun" style={{ filter: 'grayscale(1) brightness(1.5)', opacity: 0.15 }} />
              <Cloud className="fs-lp-bg-cloud" style={{ top: '10%', animationDuration: '40s', opacity: 0.3 }} size={160} />
              <Cloud className="fs-lp-bg-cloud" style={{ top: '25%', animationDuration: '60s', animationDelay: '-10s', opacity: 0.2 }} size={240} />
              
              <div className="fs-lp-bg-hill fs-lp-bg-hill-1" style={{ background: 'rgba(2, 44, 34, 0.8)' }} />
              <div className="fs-lp-bg-hill fs-lp-bg-hill-2" style={{ background: 'rgba(2, 44, 34, 0.95)' }} />

              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="fs-lp-bg-leaf" 
                  style={{ 
                    left: `${15 * i}%`, 
                    opacity: 0.4, 
                    animationDelay: `${i * 1.5}s`,
                    animationDuration: `${12 + (i % 3) * 2}s`
                  }} 
                />
              ))}
              <div className="fs-lp-noise" />
            </div>
            
            {/* Foreground Content - Glassmorphism Card */}
            <div className="fs-lp-container" style={{ position: 'relative', zIndex: 10, maxWidth: '56rem', margin: '0 auto' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '2rem',
                padding: '4rem 2rem',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)'
              }}>
                <FadeUp>
                  <h2 style={{ fontFamily: 'var(--lp-font-display)', fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff', lineHeight: 1.2 }}>
                    {text.ctaTitle}
                  </h2>
                </FadeUp>
                
                <FadeUp delay={0.1}>
                  <p style={{ color: '#d1fae5', margin: '0 auto 3rem', maxWidth: '38rem', fontSize: '1.125rem', lineHeight: 1.6, opacity: 0.9 }}>
                    {text.ctaDesc}
                  </p>
                </FadeUp>
                
                <FadeUp delay={0.25} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>  
                  <motion.button 
                    onClick={() => navigate("/app")} 
                    variants={reactiveVariants} 
                    whileHover="hover" 
                    whileTap="tap" 
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ffffff', color: '#064e3b',
                      padding: '1.125rem 2.5rem', borderRadius: '1rem', fontSize: '1.125rem', fontWeight: 700,
                      border: 'none', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(255, 255, 255, 0.2)',
                      fontFamily: 'inherit'
                    }}
                  >
                    {text.btnStartFree} <ArrowRight size={20} />
                  </motion.button>
                  
                  <motion.button 
                    onClick={() => navigate("/pricing")} 
                    variants={reactiveVariants} 
                    whileHover="hover" 
                    whileTap="tap" 
                    style={{
                      display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#ffffff',
                      padding: '1.125rem 2.5rem', borderRadius: '1rem', fontSize: '1.125rem', fontWeight: 600,
                      border: '1px solid rgba(255, 255, 255, 0.2)', cursor: 'pointer', fontFamily: 'inherit'
                    }}
                  >
                    {text.btnViewPricing}
                  </motion.button>
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