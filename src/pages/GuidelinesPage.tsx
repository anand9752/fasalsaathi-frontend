import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { BookOpen, CheckCircle, AlertTriangle, Info, Shield, Leaf, Cloud, TrendingUp } from "lucide-react";
import { PublicNavbar } from "../components/public/PublicNavbar";
import { PublicFooter } from "../components/public/PublicFooter";
import { useLanguage } from "../hooks/useLanguage";

// ─── Translations Dictionary ──────────────────────────────────────────────────
const t = {
  en: {
    heroBadge: "User Guidelines",
    heroTitle: "How to Use FasalSaathi",
    heroDesc: "Step-by-step guidance to get the most out of every feature. Available in multiple languages on your dashboard.",
    alertTitle: "Important Disclaimer",
    alertDesc: "FasalSaathi provides AI-powered guidance based on data. Always verify critical decisions (pesticide selection, major crop changes) with your local agricultural officer or KVK. We are a decision-support tool, not a replacement for expert agronomic advice.",
    
    g1Title: "Setting Up Your Farm",
    g1S1: "Create your account with your email and a secure password (minimum 6 characters).",
    g1S2: "Select your preferred language — Hindi, Marathi, Punjabi, or English.",
    g1S3: "Add your farm's name, location (tehsil or village), size in acres, and soil type.",
    g1S4: "Select your primary crop from the dropdown. You can manage multiple crops later.",
    g1S5: "Your dashboard is now personalised to your location, soil, and crop.",
    
    g2Title: "Using Weather Forecasts",
    g2S1: "The Weather section shows current conditions and a 10-day forecast for your farm location.",
    g2S2: "Green indicators mean favourable conditions for your crop; yellow/red means caution.",
    g2S3: "Rainfall alerts are sent as notifications — enable them in your browser settings.",
    g2S4: "Check wind speed before applying pesticides or fertilisers (recommended: below 15 km/h).",
    g2S5: "Use the humidity reading to gauge disease risk — high humidity favours fungal diseases.",

    g3Title: "Reading Market Prices",
    g3S1: "Navigate to 'Market Prices' from the sidebar or bottom navigation.",
    g3S2: "By default, it shows nearby mandis based on your registered location.",
    g3S3: "Use the trend chart to see if prices are rising or falling over the last 30 days.",
    g3S4: "Set a price alert: tap the bell icon next to any crop to get notified when it hits your target price.",
    g3S5: "Compare multiple mandis by using the 'Select Mandi' filter at the top.",

    g4Title: "Plant Disease Detection",
    g4S1: "Go to 'Plant Analysis' from the navigation menu.",
    g4S2: "Take a clear photo of the affected leaf, stem, or fruit in natural daylight.",
    g4S3: "Upload the photo — the AI analyses it within 5–10 seconds.",
    g4S4: "Read the diagnosis carefully. It will name the disease and its cause (fungal, bacterial, pest).",
    g4S5: "Follow the treatment plan. Always follow the recommended dosage on pesticide labels.",
    g4S6: "If symptoms persist after 5 days, consult your local KVK (Krishi Vigyan Kendra).",

    g5Title: "Data Privacy & Account Safety",
    g5S1: "Never share your FasalSaathi password with anyone, including our support staff.",
    g5S2: "Your farm data is private and is never sold to third parties.",
    g5S3: "Log out of shared devices after use (Settings → Log Out).",
    g5S4: "If you suspect unauthorised access, change your password immediately.",
    g5S5: "Enable two-factor authentication once available (coming soon).",

    tipsTitle: "Pro Tips",
    t1: "Update your crop calendar at the start of each season for the most accurate recommendations.",
    t2: "Your location determines your weather data. Make sure it's set to your actual village, not the nearest city.",
    t3: "For best disease detection results, photograph only the affected part and keep the background plain.",
    t4: "Enable browser notifications so you don't miss critical weather alerts or price spikes.",
    t5: "FasalSaathi caches 7 days of data locally — you can view recent weather and prices even without internet.",
    t6: "Share your experience with other farmers in your village — growing together makes everyone stronger.",

    ctaQuestion: "Still have questions?",
    ctaSub: "Our support team replies in your language within 2 hours.",
    ctaBtn: "Contact Support →"
  },
  hi: {
    heroBadge: "उपयोगकर्ता दिशानिर्देश",
    heroTitle: "फसलसाथी का उपयोग कैसे करें",
    heroDesc: "हर सुविधा का अधिकतम लाभ उठाने के लिए चरण-दर-चरण मार्गदर्शन। आपके डैशबोर्ड पर कई भाषाओं में उपलब्ध है।",
    alertTitle: "महत्वपूर्ण अस्वीकरण",
    alertDesc: "फसलसाथी डेटा के आधार पर AI-संचालित मार्गदर्शन प्रदान करता है। महत्वपूर्ण निर्णयों (कीटनाशक चयन, प्रमुख फसल परिवर्तन) को हमेशा अपने स्थानीय कृषि अधिकारी या KVK से सत्यापित करें। हम एक निर्णय-समर्थन उपकरण हैं, न कि विशेषज्ञ की सलाह का विकल्प।",
    
    g1Title: "अपना खेत सेट करना",
    g1S1: "अपने ईमेल और सुरक्षित पासवर्ड (न्यूनतम 6 वर्ण) के साथ अपना खाता बनाएं।",
    g1S2: "अपनी पसंदीदा भाषा चुनें — हिंदी, मराठी, पंजाबी या अंग्रेजी।",
    g1S3: "अपने खेत का नाम, स्थान (तहसील या गाँव), एकड़ में आकार और मिट्टी का प्रकार जोड़ें।",
    g1S4: "ड्रॉपडाउन से अपनी प्राथमिक फसल चुनें। आप बाद में कई फसलें प्रबंधित कर सकते हैं।",
    g1S5: "आपका डैशबोर्ड अब आपके स्थान, मिट्टी और फसल के अनुसार वैयक्तिकृत है।",

    g2Title: "मौसम पूर्वानुमान का उपयोग करना",
    g2S1: "मौसम अनुभाग आपके खेत के स्थान के लिए वर्तमान स्थिति और 10-दिन का पूर्वानुमान दिखाता है।",
    g2S2: "हरे संकेत का मतलब है फसल के लिए अनुकूल स्थिति; पीले/लाल का अर्थ है सावधानी।",
    g2S3: "वर्षा अलर्ट सूचनाओं के रूप में भेजे जाते हैं — उन्हें अपनी ब्राउज़र सेटिंग्स में सक्षम करें।",
    g2S4: "कीटनाशकों या उर्वरकों का उपयोग करने से पहले हवा की गति की जांच करें (अनुशंसित: 15 किमी/घंटा से नीचे)।",
    g2S5: "रोग के जोखिम को मापने के लिए आर्द्रता (नमी) को देखें — उच्च आर्द्रता फंगल रोगों को बढ़ाती है।",

    g3Title: "मंडी भाव पढ़ना",
    g3S1: "साइडबार या निचले नेविगेशन से 'मंडी भाव' पर जाएं।",
    g3S2: "डिफ़ॉल्ट रूप से, यह आपके पंजीकृत स्थान के आधार पर आस-पास की मंडियां दिखाता है।",
    g3S3: "यह देखने के लिए कि पिछले 30 दिनों में कीमतें बढ़ रही हैं या गिर रही हैं, ट्रेंड चार्ट का उपयोग करें।",
    g3S4: "प्राइस अलर्ट सेट करें: जब फसल आपके लक्ष्य मूल्य पर पहुंच जाए तो सूचना पाने के लिए बेल आइकन पर टैप करें।",
    g3S5: "शीर्ष पर 'मंडी चुनें' फ़िल्टर का उपयोग करके कई मंडियों की तुलना करें।",

    g4Title: "पौधों के रोग की पहचान",
    g4S1: "नेविगेशन मेनू से 'प्लांट एनालिसिस' पर जाएं।",
    g4S2: "प्राकृतिक दिन के उजाले में प्रभावित पत्ते, तने या फल की स्पष्ट तस्वीर लें।",
    g4S3: "फोटो अपलोड करें — AI 5-10 सेकंड के भीतर इसका विश्लेषण करता है।",
    g4S4: "निदान को ध्यान से पढ़ें। यह बीमारी और उसके कारण (फंगल, बैक्टीरियल, कीट) का नाम बताएगा।",
    g4S5: "उपचार योजना का पालन करें। हमेशा कीटनाशक लेबल पर अनुशंसित खुराक का पालन करें।",
    g4S6: "यदि 5 दिनों के बाद भी लक्षण बने रहते हैं, तो अपने स्थानीय KVK से परामर्श करें।",

    g5Title: "डेटा गोपनीयता और खाता सुरक्षा",
    g5S1: "अपना फसलसाथी पासवर्ड कभी किसी के साथ साझा न करें।",
    g5S2: "आपके खेत का डेटा निजी है और कभी भी तीसरे पक्ष को नहीं बेचा जाता है।",
    g5S3: "उपयोग के बाद साझा उपकरणों से लॉग आउट करें (सेटिंग्स → लॉग आउट)।",
    g5S4: "यदि आपको अनधिकृत पहुंच का संदेह है, तो अपना पासवर्ड तुरंत बदलें।",
    g5S5: "उपलब्ध होने पर टू-फैक्टर ऑथेंटिकेशन चालू करें।",

    tipsTitle: "प्रो टिप्स (सुझाव)",
    t1: "सबसे सटीक सिफारिशों के लिए प्रत्येक मौसम की शुरुआत में अपना फसल कैलेंडर अपडेट करें।",
    t2: "आपका स्थान आपके मौसम डेटा को निर्धारित करता है। सुनिश्चित करें कि यह आपके वास्तविक गाँव पर सेट है।",
    t3: "सर्वोत्तम रोग पहचान परिणामों के लिए, केवल प्रभावित हिस्से की तस्वीर लें और पृष्ठभूमि को सादा रखें।",
    t4: "ब्राउज़र सूचनाएं चालू करें ताकि आप मौसम अलर्ट या कीमतों में उछाल से न चूकें।",
    t5: "फसलसाथी 7 दिनों के डेटा को सहेजता है — आप बिना इंटरनेट के भी मौसम और कीमतें देख सकते हैं।",
    t6: "अपने गाँव के अन्य किसानों के साथ अपना अनुभव साझा करें — एक साथ बढ़ने से हर कोई मजबूत होता है।",

    ctaQuestion: "क्या अभी भी कोई प्रश्न हैं?",
    ctaSub: "हमारी सहायता टीम 2 घंटे के भीतर आपकी भाषा में जवाब देती है।",
    ctaBtn: "सहायता से संपर्क करें →"
  },
  mr: {
    heroBadge: "वापरकर्ता मार्गदर्शक",
    heroTitle: "फसलसाथी कसे वापरावे",
    heroDesc: "प्रत्येक वैशिष्ट्याचा जास्तीत जास्त फायदा घेण्यासाठी टप्प्याटप्प्याने मार्गदर्शन. डॅशबोर्डवर उपलब्ध.",
    alertTitle: "महत्त्वाची सूचना",
    alertDesc: "फसलसाथी डेटावर आधारित AI-सक्षम मार्गदर्शन प्रदान करते. महत्त्वाचे निर्णय (कीटकनाशक निवड, पीक बदल) नेहमी कृषी अधिकारी किंवा KVK कडून तपासून घ्या. हे फक्त निर्णय घेण्यास मदत करणारे साधन आहे.",
    
    g1Title: "तुमचे शेत सेट करणे",
    g1S1: "ईमेल आणि सुरक्षित पासवर्डसह (किमान ६ अक्षरे) तुमचे खाते तयार करा.",
    g1S2: "तुमची पसंतीची भाषा निवडा — मराठी, हिंदी, पंजाबी किंवा इंग्रजी.",
    g1S3: "तुमच्या शेताचे नाव, ठिकाण (गाव), आकार (एकरमध्ये) आणि मातीचा प्रकार जोडा.",
    g1S4: "ड्रॉपडाउनमधून मुख्य पीक निवडा. तुम्ही नंतर इतर पिके जोडू शकता.",
    g1S5: "तुमचा डॅशबोर्ड आता तुमच्या ठिकाणानुसार आणि पिकांनुसार वैयक्तिकृत झाला आहे.",

    g2Title: "हवामान अंदाजाचा वापर",
    g2S1: "हवामान विभाग तुमच्या शेताच्या ठिकाणासाठी सद्य स्थिती आणि १०-दिवसांचा अंदाज दर्शवितो.",
    g2S2: "हिरवा रंग म्हणजे पिकासाठी अनुकूल स्थिती; पिवळा/लाल म्हणजे काळजी घेण्याची गरज.",
    g2S3: "पावसाचे अलर्ट नोटिफिकेशन म्हणून पाठवले जातात — ते ब्राउझर सेटिंग्जमध्ये सुरू करा.",
    g2S4: "फवारणीपूर्वी वाऱ्याचा वेग तपासा (शिफारस: १५ किमी/तास पेक्षा कमी).",
    g2S5: "रोगाचा धोका मोजण्यासाठी आर्द्रता पहा — जास्त आर्द्रतेमुळे बुरशीजन्य रोग वाढतात.",

    g3Title: "बाजारभाव पाहणे",
    g3S1: "साइडबारमधून 'बाजारभाव' वर जा.",
    g3S2: "हे तुमच्या नोंदणीकृत ठिकाणावर आधारित जवळपासच्या मंडई दाखवते.",
    g3S3: "मागील ३० दिवसांत किमती वाढत आहेत की कमी होत आहेत हे पाहण्यासाठी ट्रेंड चार्ट वापरा.",
    g3S4: "किंमत अलर्ट सेट करा: पीक लक्ष्यित किमतीवर पोहोचल्यावर सूचना मिळवण्यासाठी बेल आयकॉनवर टॅप करा.",
    g3S5: "'मंडी निवडा' फिल्टर वापरून अनेक मंडईंची तुलना करा.",

    g4Title: "वनस्पती रोग ओळख",
    g4S1: "नेव्हिगेशन मेनूमधून 'प्लांट अ‍ॅनालिसिस' वर जा.",
    g4S2: "बाधित पान, खोड किंवा फळाचा दिवसाच्या प्रकाशात स्पष्ट फोटो घ्या.",
    g4S3: "फोटो अपलोड करा — AI ५-१० सेकंदात त्याचे विश्लेषण करते.",
    g4S4: "निदान काळजीपूर्वक वाचा. हे रोगाचे नाव आणि त्याचे कारण सांगेल.",
    g4S5: "उपचार योजनेचे पालन करा. कीटकनाशकांच्या लेबलवरील शिफारस केलेल्या डोसचे पालन करा.",
    g4S6: "लक्षणे ५ दिवसांनंतरही राहिल्यास स्थानिक KVK चा सल्ला घ्या.",

    g5Title: "डेटा गोपनीयता आणि खाते सुरक्षा",
    g5S1: "तुमचा फसलसाथी पासवर्ड कोणाशीही शेअर करू नका.",
    g5S2: "तुमचा शेतीचा डेटा खाजगी आहे आणि तो कधीही विकला जात नाही.",
    g5S3: "वापरानंतर सामायिक उपकरणांमधून लॉग आउट करा.",
    g5S4: "खात्याचा गैरवापर होत असल्याचा संशय आल्यास त्वरित पासवर्ड बदला.",
    g5S5: "टू-फॅक्टर ऑथेंटिकेशन उपलब्ध झाल्यावर सुरू करा.",

    tipsTitle: "प्रो टिप्स",
    t1: "अचूक शिफारसींसाठी प्रत्येक हंगामाच्या सुरुवातीला तुमचे पीक कॅलेंडर अपडेट करा.",
    t2: "तुमचे ठिकाण हवामानाचा डेटा ठरवते. ते प्रत्यक्ष गावावर सेट केलेले असल्याची खात्री करा.",
    t3: "चांगल्या रोग निदानासाठी, फक्त बाधित भागाचा फोटो काढा आणि पार्श्वभूमी साधी ठेवा.",
    t4: "हवामान अलर्ट चुकवू नये म्हणून ब्राउझर नोटिफिकेशन्स सुरू करा.",
    t5: "फसलसाथी ७ दिवसांचा डेटा सेव्ह करते — तुम्ही इंटरनेटशिवायही माहिती पाहू शकता.",
    t6: "तुमचा अनुभव गावातील इतर शेतकर्‍यांसोबत शेअर करा.",

    ctaQuestion: "अजूनही काही प्रश्न आहेत का?",
    ctaSub: "आमची सपोर्ट टीम तुमच्या भाषेत २ तासांच्या आत उत्तर देते.",
    ctaBtn: "सपोर्ट टीमशी संपर्क साधा →"
  },
  pa: {
    heroBadge: "ਉਪਭੋਗਤਾ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼",
    heroTitle: "ਫਸਲਸਾਥੀ ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਕਰੀਏ",
    heroDesc: "ਹਰ ਵਿਸ਼ੇਸ਼ਤਾ ਦਾ ਪੂਰਾ ਲਾਭ ਲੈਣ ਲਈ ਕਦਮ-ਦਰ-ਕਦਮ ਮਾਰਗਦਰਸ਼ਨ। ਡੈਸ਼ਬੋਰਡ 'ਤੇ ਉਪਲਬਧ ਹੈ।",
    alertTitle: "ਮਹੱਤਵਪੂਰਨ ਬੇਦਾਅਵਾ",
    alertDesc: "ਫਸਲਸਾਥੀ ਡੇਟਾ ਦੇ ਅਧਾਰ ਤੇ AI-ਸੰਚਾਲਿਤ ਮਾਰਗਦਰਸ਼ਨ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ। ਨਾਜ਼ੁਕ ਫੈਸਲਿਆਂ (ਕੀਟਨਾਸ਼ਕ, ਫਸਲ ਬਦਲਾਅ) ਦੀ ਹਮੇਸ਼ਾ ਖੇਤੀਬਾੜੀ ਅਧਿਕਾਰੀ ਤੋਂ ਪੁਸ਼ਟੀ ਕਰੋ।",
    
    g1Title: "ਆਪਣਾ ਖੇਤ ਸੈੱਟ ਕਰਨਾ",
    g1S1: "ਈਮੇਲ ਅਤੇ ਸੁਰੱਖਿਅਤ ਪਾਸਵਰਡ ਨਾਲ ਆਪਣਾ ਖਾਤਾ ਬਣਾਓ।",
    g1S2: "ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ — ਪੰਜਾਬੀ, ਹਿੰਦੀ, ਮਰਾਠੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ।",
    g1S3: "ਆਪਣੇ ਖੇਤ ਦਾ ਨਾਮ, ਪਿੰਡ, ਆਕਾਰ ਅਤੇ ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਸ਼ਾਮਲ ਕਰੋ।",
    g1S4: "ਡ੍ਰੌਪਡਾਉਨ ਤੋਂ ਆਪਣੀ ਮੁੱਖ ਫਸਲ ਚੁਣੋ। ਤੁਸੀਂ ਬਾਅਦ ਵਿੱਚ ਹੋਰ ਫਸਲਾਂ ਜੋੜ ਸਕਦੇ ਹੋ।",
    g1S5: "ਤੁਹਾਡਾ ਡੈਸ਼ਬੋਰਡ ਹੁਣ ਤੁਹਾਡੇ ਸਥਾਨ ਅਤੇ ਫਸਲ ਦੇ ਅਨੁਸਾਰ ਤਿਆਰ ਹੈ।",

    g2Title: "ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ ਦੀ ਵਰਤੋਂ",
    g2S1: "ਮੌਸਮ ਭਾਗ ਮੌਜੂਦਾ ਸਥਿਤੀ ਅਤੇ 10-ਦਿਨਾਂ ਦੀ ਭਵਿੱਖਬਾਣੀ ਦਿਖਾਉਂਦਾ ਹੈ।",
    g2S2: "ਹਰੇ ਰੰਗ ਦਾ ਮਤਲਬ ਅਨੁਕੂਲ ਸਥਿਤੀ; ਪੀਲਾ/ਲਾਲ ਦਾ ਮਤਲਬ ਸਾਵਧਾਨੀ ਹੈ।",
    g2S3: "ਮੀਂਹ ਦੇ ਅਲਰਟ ਸੂਚਨਾਵਾਂ ਵਜੋਂ ਭੇਜੇ ਜਾਂਦੇ ਹਨ — ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਸਮਰੱਥ ਕਰੋ।",
    g2S4: "ਸਪਰੇਅ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਹਵਾ ਦੀ ਗਤੀ ਦੀ ਜਾਂਚ ਕਰੋ।",
    g2S5: "ਬਿਮਾਰੀ ਦੇ ਖਤਰੇ ਦਾ ਪਤਾ ਲਗਾਉਣ ਲਈ ਨਮੀ ਦੀ ਜਾਂਚ ਕਰੋ।",

    g3Title: "ਮੰਡੀ ਦੇ ਭਾਅ ਪੜ੍ਹਨਾ",
    g3S1: "ਸਾਈਡਬਾਰ ਤੋਂ 'ਮੰਡੀ ਭਾਅ' 'ਤੇ ਜਾਓ।",
    g3S2: "ਇਹ ਤੁਹਾਡੇ ਰਜਿਸਟਰਡ ਸਥਾਨ ਦੇ ਅਧਾਰ 'ਤੇ ਨੇੜਲੀਆਂ ਮੰਡੀਆਂ ਦਿਖਾਉਂਦਾ ਹੈ।",
    g3S3: "ਪਿਛਲੇ 30 ਦਿਨਾਂ ਦੇ ਰੁਝਾਨ ਵੇਖਣ ਲਈ ਚਾਰਟ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
    g3S4: "ਪ੍ਰਾਈਸ ਅਲਰਟ ਸੈੱਟ ਕਰੋ: ਸੂਚਨਾ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਘੰਟੀ ਵਾਲੇ ਆਈਕਨ 'ਤੇ ਟੈਪ ਕਰੋ।",
    g3S5: "ਫਿਲਟਰ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਕਈ ਮੰਡੀਆਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।",

    g4Title: "ਪੌਦਿਆਂ ਦੀ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ",
    g4S1: "ਨੈਵੀਗੇਸ਼ਨ ਮੀਨੂ ਤੋਂ 'ਪਲਾਂਟ ਐਨਾਲਿਸਿਸ' 'ਤੇ ਜਾਓ।",
    g4S2: "ਪ੍ਰਭਾਵਿਤ ਪੱਤੇ ਜਾਂ ਫਲ ਦੀ ਸਾਫ਼ ਫੋਟੋ ਲਓ।",
    g4S3: "ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ — AI ਸਕਿੰਟਾਂ ਵਿੱਚ ਇਸਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੇਗਾ।",
    g4S4: "ਨਿਦਾਨ ਨੂੰ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ। ਇਹ ਬਿਮਾਰੀ ਅਤੇ ਕਾਰਨ ਦੱਸੇਗਾ।",
    g4S5: "ਇਲਾਜ ਯੋਜਨਾ ਦੀ ਪਾਲਣਾ ਕਰੋ। ਸਹੀ ਖੁਰਾਕ ਵਰਤੋ।",
    g4S6: "ਜੇ ਲੱਛਣ 5 ਦਿਨਾਂ ਬਾਅਦ ਵੀ ਰਹਿੰਦੇ ਹਨ, ਤਾਂ KVK ਨਾਲ ਸਲਾਹ ਕਰੋ।",

    g5Title: "ਡਾਟਾ ਗੋਪਨੀਯਤਾ ਅਤੇ ਖਾਤਾ ਸੁਰੱਖਿਆ",
    g5S1: "ਆਪਣਾ ਪਾਸਵਰਡ ਕਦੇ ਕਿਸੇ ਨਾਲ ਸਾਂਝਾ ਨਾ ਕਰੋ।",
    g5S2: "ਤੁਹਾਡਾ ਡਾਟਾ ਪ੍ਰਾਈਵੇਟ ਹੈ ਅਤੇ ਕਦੇ ਵੇਚਿਆ ਨਹੀਂ ਜਾਂਦਾ।",
    g5S3: "ਵਰਤੋਂ ਤੋਂ ਬਾਅਦ ਸਾਂਝੇ ਡਿਵਾਈਸਾਂ ਤੋਂ ਲੌਗ ਆਉਟ ਕਰੋ।",
    g5S4: "ਜੇ ਤੁਹਾਨੂੰ ਸ਼ੱਕ ਹੈ, ਤਾਂ ਆਪਣਾ ਪਾਸਵਰਡ ਤੁਰੰਤ ਬਦਲੋ।",
    g5S5: "ਉਪਲਬਧ ਹੋਣ 'ਤੇ ਟੂ-ਫੈਕਟਰ ਪ੍ਰਮਾਣੀਕਰਨ ਚਾਲੂ ਕਰੋ।",

    tipsTitle: "ਪ੍ਰੋ ਟਿਪਸ",
    t1: "ਵਧੀਆ ਸਿਫਾਰਸ਼ਾਂ ਲਈ ਹਰ ਸੀਜ਼ਨ ਦੇ ਸ਼ੁਰੂ ਵਿੱਚ ਆਪਣਾ ਫਸਲ ਕੈਲੰਡਰ ਅੱਪਡੇਟ ਕਰੋ।",
    t2: "ਆਪਣੀ ਲੋਕੇਸ਼ਨ ਆਪਣੇ ਅਸਲ ਪਿੰਡ 'ਤੇ ਸੈੱਟ ਕਰੋ।",
    t3: "ਵਧੀਆ ਨਤੀਜਿਆਂ ਲਈ, ਸਿਰਫ ਪ੍ਰਭਾਵਿਤ ਹਿੱਸੇ ਦੀ ਫੋਟੋ ਲਓ ਅਤੇ ਪਿਛੋਕੜ ਸਾਦਾ ਰੱਖੋ।",
    t4: "ਮੌਸਮ ਅਲਰਟ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਬ੍ਰਾਊਜ਼ਰ ਸੂਚਨਾਵਾਂ ਸਮਰੱਥ ਕਰੋ।",
    t5: "ਫਸਲਸਾਥੀ ਡਾਟਾ ਸੇਵ ਕਰਦਾ ਹੈ — ਤੁਸੀਂ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਵੀ ਦੇਖ ਸਕਦੇ ਹੋ।",
    t6: "ਆਪਣਾ ਤਜਰਬਾ ਪਿੰਡ ਦੇ ਹੋਰ ਕਿਸਾਨਾਂ ਨਾਲ ਸਾਂਝਾ ਕਰੋ।",

    ctaQuestion: "ਕੀ ਅਜੇ ਵੀ ਕੋਈ ਸਵਾਲ ਹਨ?",
    ctaSub: "ਸਾਡੀ ਟੀਮ 2 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ ਜਵਾਬ ਦਿੰਦੀ ਹੈ।",
    ctaBtn: "ਸਪੋਰਟ ਨਾਲ ਸੰਪਰਕ ਕਰੋ →"
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
export function GuidelinesPage() {
  const { lang } = useLanguage();
  const text = t[lang];

  // Dynamically constructed arrays based on language selection
  const guidelines = [
    { icon: Leaf, title: text.g1Title, theme: "green", steps: [text.g1S1, text.g1S2, text.g1S3, text.g1S4, text.g1S5] },
    { icon: Cloud, title: text.g2Title, theme: "blue", steps: [text.g2S1, text.g2S2, text.g2S3, text.g2S4, text.g2S5] },
    { icon: TrendingUp, title: text.g3Title, theme: "orange", steps: [text.g3S1, text.g3S2, text.g3S3, text.g3S4, text.g3S5] },
    { icon: Shield, title: text.g4Title, theme: "red", steps: [text.g4S1, text.g4S2, text.g4S3, text.g4S4, text.g4S5, text.g4S6] },
    { icon: BookOpen, title: text.g5Title, theme: "purple", steps: [text.g5S1, text.g5S2, text.g5S3, text.g5S4, text.g5S5] },
  ];

  const tips = [
    { icon: "🌱", text: text.t1 },
    { icon: "📍", text: text.t2 },
    { icon: "📸", text: text.t3 },
    { icon: "🔔", text: text.t4 },
    { icon: "💾", text: text.t5 },
    { icon: "🤝", text: text.t6 },
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        .fs-gp-wrapper {
          --gp-font-body: 'Inter', system-ui, sans-serif;
          --gp-font-display: 'Poppins', system-ui, sans-serif;
          --gp-primary: #16a34a; --gp-primary-dark: #15803d; --gp-primary-light: #dcfce7;
          --gp-text-dark: #111827; --gp-text-muted: #4b5563; --gp-text-light: #ffffff;
          font-family: var(--gp-font-body); background-color: #ffffff; color: var(--gp-text-dark);
          display: flex; flex-direction: column; min-height: 100vh; overflow-x: hidden;
        }

        .fs-gp-container { max-width: 56rem; margin: 0 auto; padding: 0 1rem; width: 100%; box-sizing: border-box; }
        @media (min-width: 640px) { .fs-gp-container { padding: 0 1.5rem; } }

        .fs-gp-h1 { font-family: var(--gp-font-display); font-size: 2.25rem; font-weight: 700; line-height: 1.2; margin-bottom: 1rem; color: var(--gp-text-light); }
        @media (min-width: 640px) { .fs-gp-h1 { font-size: 3rem; } }
        .fs-gp-h2 { font-family: var(--gp-font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--gp-text-dark); }
        .fs-gp-card-title { font-family: var(--gp-font-display); font-size: 1.125rem; font-weight: 700; color: var(--gp-text-dark); margin: 0; }

        .fs-gp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s ease, background-color 0.2s ease; text-decoration: none; border: none; font-family: inherit; background-color: var(--gp-primary); color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .fs-gp-btn:hover { background-color: var(--gp-primary-dark); transform: translateY(-2px); }

        .fs-gp-icon-box { width: 2.5rem; height: 2.5rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .fs-gp-icon-green { background-color: #f0fdf4; color: #16a34a; }
        .fs-gp-icon-blue { background-color: #eff6ff; color: #2563eb; }
        .fs-gp-icon-orange { background-color: #fff7ed; color: #ea580c; }
        .fs-gp-icon-red { background-color: #fef2f2; color: #dc2626; }
        .fs-gp-icon-purple { background-color: #faf5ff; color: #9333ea; }

        /* -- ANIMATED HERO (FARMING THEME) -- */
        .fs-gp-hero { position: relative; padding-top: 8rem; padding-bottom: 4rem; background: linear-gradient(180deg, #064e3b 0%, #022c22 100%); text-align: center; overflow: hidden; }
        @media (min-width: 768px) { .fs-gp-hero { padding-top: 10rem; } }
        
        .fs-gp-hero-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }

        @keyframes sunPulse { 0% { transform: scale(1); box-shadow: 0 0 50px 20px rgba(250, 204, 21, 0.2); } 100% { transform: scale(1.05); box-shadow: 0 0 80px 40px rgba(250, 204, 21, 0.4); } }
        .fs-gp-bg-sun { position: absolute; top: 15%; right: 20%; width: 120px; height: 120px; background: #facc15; border-radius: 50%; opacity: 0.6; animation: sunPulse 5s ease-in-out infinite alternate; filter: blur(20px); }

        @keyframes floatCloud { 0% { transform: translateX(-15vw); } 100% { transform: translateX(115vw); } }
        .fs-gp-bg-cloud { position: absolute; color: rgba(255, 255, 255, 0.08); animation: floatCloud linear infinite; }
        .fs-gp-bg-cloud-1 { top: 10%; left: -20%; animation-duration: 45s; animation-delay: -10s; }
        .fs-gp-bg-cloud-2 { top: 25%; left: -20%; animation-duration: 65s; animation-delay: -35s; transform: scale(1.5); color: rgba(255, 255, 255, 0.04); }

        @keyframes waveHills { 0% { transform: translateX(0) scaleY(1); } 50% { transform: translateX(-2%) scaleY(1.05); } 100% { transform: translateX(0) scaleY(1); } }
        .fs-gp-bg-hill { position: absolute; bottom: -5%; width: 120%; border-radius: 50% 50% 0 0 / 100% 100% 0 0; animation: waveHills 10s ease-in-out infinite; }
        .fs-gp-bg-hill-1 { left: -5%; background: rgba(20, 83, 45, 0.5); z-index: 1; height: 35%; animation-duration: 12s; }
        .fs-gp-bg-hill-2 { left: -10%; background: rgba(6, 95, 70, 0.7); z-index: 2; height: 25%; animation-delay: -5s; }

        @keyframes leafFall { 0% { transform: translate(0, -50px) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translate(-150px, 100vh) rotate(720deg); opacity: 0; } }
        .fs-gp-bg-leaf { position: absolute; top: -10%; background: linear-gradient(135deg, #4ade80, #16a34a); border-radius: 50% 0 50% 0; opacity: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); animation: leafFall linear infinite; }
        .fs-gp-l-1 { left: 15%; width: 14px; height: 14px; animation-duration: 12s; animation-delay: 0s; }
        .fs-gp-l-2 { left: 40%; width: 10px; height: 10px; animation-duration: 16s; animation-delay: 3s; }
        .fs-gp-l-3 { left: 65%; width: 18px; height: 18px; animation-duration: 14s; animation-delay: 1s; background: linear-gradient(135deg, #facc15, #ca8a04); }

        .fs-gp-noise { position: absolute; inset: 0; background-image: url('https://grainy-gradients.vercel.app/noise.svg'); opacity: 0.2; mix-blend-mode: overlay; z-index: 3;}

        .fs-gp-hero-content { position: relative; z-index: 10; }
        .fs-gp-hero-badge { display: inline-block; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #ffffff; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
        .fs-gp-hero-p { color: #d1fae5; font-size: 1.125rem; max-width: 42rem; margin: 0 auto; line-height: 1.625; font-weight: 300; }

        /* -- ALERT & CARDS -- */
        .fs-gp-alert-wrap { padding-top: 2.5rem; }
        .fs-gp-alert { display: flex; align-items: flex-start; gap: 0.75rem; background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 1rem; padding: 1.25rem; }
        .fs-gp-alert-title { font-weight: 600; color: #92400e; font-size: 0.875rem; margin-bottom: 0.25rem; }
        .fs-gp-alert-desc { color: #b45309; font-size: 0.875rem; line-height: 1.625; margin: 0; }

        .fs-gp-sections-wrap { padding: 4rem 0; display: flex; flex-direction: column; gap: 3rem; }
        .fs-gp-card { background-color: #ffffff; border: 1px solid #f3f4f6; border-radius: 1rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05); overflow: hidden; }
        .fs-gp-card-header { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.5rem; background-color: #f9fafb; border-bottom: 1px solid #f3f4f6; }
        .fs-gp-card-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .fs-gp-step { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.875rem; color: #374151; line-height: 1.625; }
        .fs-gp-step-num { display: inline-flex; align-items: center; justify-content: center; width: 1.5rem; height: 1.5rem; background-color: var(--gp-primary-light); color: var(--gp-primary-dark); border-radius: 50%; font-size: 0.75rem; font-weight: 700; flex-shrink: 0; margin-top: 0.125rem; }

        .fs-gp-tips-section { background-color: #f0fdf4; padding: 4rem 0; }
        .fs-gp-tips-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; }
        .fs-gp-tips-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 640px) { .fs-gp-tips-grid { grid-template-columns: 1fr 1fr; } }
        .fs-gp-tip-card { display: flex; align-items: flex-start; gap: 0.75rem; background-color: #ffffff; border: 1px solid #dcfce7; border-radius: 0.75rem; padding: 1rem; }
        .fs-gp-tip-icon { font-size: 1.5rem; flex-shrink: 0; line-height: 1; }
        .fs-gp-tip-text { font-size: 0.875rem; color: #374151; line-height: 1.625; margin: 0; }

        .fs-gp-cta-section { background-color: #ffffff; padding: 3rem 0; text-align: center; border-top: 1px solid #f3f4f6; }
        .fs-gp-cta-header { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.75rem; }
        .fs-gp-cta-title { font-weight: 500; color: #374151; margin: 0; }
        .fs-gp-cta-desc { font-size: 0.875rem; color: #9ca3af; margin: 0 0 1.25rem 0; }
      `}</style>

      <div className="fs-gp-wrapper">
        <PublicNavbar />

        <main style={{ flex: 1 }}>
          {/* Animated Hero Section */}
          <section className="fs-gp-hero">
            <div className="fs-gp-hero-bg">
              <div className="fs-gp-bg-sun" />
              <Cloud className="fs-gp-bg-cloud fs-gp-bg-cloud-1" size={160} />
              <Cloud className="fs-gp-bg-cloud fs-gp-bg-cloud-2" size={240} />
              <div className="fs-gp-bg-hill fs-gp-bg-hill-1" />
              <div className="fs-gp-bg-hill fs-gp-bg-hill-2" />
              <div className="fs-gp-bg-leaf fs-gp-l-1" />
              <div className="fs-gp-bg-leaf fs-gp-l-2" />
              <div className="fs-gp-bg-leaf fs-gp-l-3" />
              <div className="fs-gp-noise" />
            </div>

            <div className="fs-gp-container fs-gp-hero-content">
              <FadeUp delay={0.1}>
                <span className="fs-gp-hero-badge">{text.heroBadge}</span>
              </FadeUp>
              <FadeUp delay={0.2}>
                <h1 className="fs-gp-h1">{text.heroTitle}</h1>
              </FadeUp>
              <FadeUp delay={0.3}>
                <p className="fs-gp-hero-p">{text.heroDesc}</p>
              </FadeUp>
            </div>
          </section>

          {/* Alert Box */}
          <div className="fs-gp-container fs-gp-alert-wrap">
            <FadeUp>
              <div className="fs-gp-alert">
                <AlertTriangle size={20} color="#d97706" style={{ marginTop: '0.125rem', flexShrink: 0 }} />
                <div>
                  <p className="fs-gp-alert-title">{text.alertTitle}</p>
                  <p className="fs-gp-alert-desc">{text.alertDesc}</p>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Dynamic Guidelines Cards */}
          <div className="fs-gp-container fs-gp-sections-wrap">
            {guidelines.map(({ icon: Icon, title, theme, steps }, i) => (
              <FadeUp key={title} delay={0.1}>
                <div className="fs-gp-card">
                  <div className="fs-gp-card-header">
                    <div className={`fs-gp-icon-box fs-gp-icon-${theme}`}>
                      <Icon size={20} />
                    </div>
                    <h2 className="fs-gp-card-title">{title}</h2>
                  </div>
                  <div className="fs-gp-card-body">
                    {steps.map((step, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: j * 0.07 }}
                        className="fs-gp-step"
                      >
                        <span className="fs-gp-step-num">{j + 1}</span>
                        <span>{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Dynamic Tips Section */}
          <section className="fs-gp-tips-section">
            <div className="fs-gp-container">
              <FadeUp className="fs-gp-tips-header">
                <Info size={24} color="var(--gp-primary)" />
                <h2 className="fs-gp-h2" style={{ margin: 0 }}>{text.tipsTitle}</h2>
              </FadeUp>
              <div className="fs-gp-tips-grid">
                {tips.map(({ icon, text }, i) => (
                  <FadeUp key={text} delay={i * 0.08}>
                    <div className="fs-gp-tip-card">
                      <span className="fs-gp-tip-icon">{icon}</span>
                      <p className="fs-gp-tip-text">{text}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="fs-gp-cta-section">
            <div className="fs-gp-container">
              <FadeUp>
                <div className="fs-gp-cta-header">
                  <CheckCircle size={20} color="var(--gp-primary)" />
                  <p className="fs-gp-cta-title">{text.ctaQuestion}</p>
                </div>
                <p className="fs-gp-cta-desc">{text.ctaSub}</p>
                <a href="/contact" className="fs-gp-btn">
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