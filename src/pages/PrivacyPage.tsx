import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Lock, ChevronRight, Cloud } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNavbar } from "../components/public/PublicNavbar";
import { PublicFooter } from "../components/public/PublicFooter";
import { useLanguage } from "../hooks/useLanguage";

// ─── Translations Dictionary ──────────────────────────────────────────────────
const t = {
  en: {
    heroBadge: "Privacy Policy",
    heroTitle: "Privacy Policy",
    heroSub: "Last updated: April 2026 · We take your privacy seriously",
    tldrTitle: "🌿 The Short Version",
    tldr1: "Your farm data belongs to you. We never sell it.",
    tldr2: "Zero advertising or tracking cookies on FasalSaathi.",
    tldr3: "All data stored on servers in India (AWS Asia-Pacific).",
    tocTitle: "Table of Contents",
    copy: `© ${new Date().getFullYear()} FasalSaathi. All rights reserved.`,
    termsLink: "Terms & Conditions",
    contactLink: "Contact Us",
    sections: [
      {
        title: "1. Information We Collect",
        content: `We collect the following types of information when you use FasalSaathi:\n\nAccount Information: Name, email address, phone number, and password (stored as a secure hash).\n\nFarm Data: Farm location, size, soil type, crop history, and seasonal records you provide.\n\nUsage Data: Pages visited, features used, time spent on the app, and error logs for improving the service.\n\nDevice Information: Device type, operating system, browser type, and IP address (for security and localised content).\n\nLocation Data: Your GPS coordinates or manually entered village/tehsil for weather and market localisation. We never track your real-time movements.`,
      },
      {
        title: "2. How We Use Your Information",
        content: `We use your information to:\n- Provide personalised weather forecasts, crop recommendations, and market prices\n- Improve AI models for crop disease detection and yield prediction\n- Send service alerts, price notifications, and important updates\n- Ensure platform security and prevent fraudulent activity\n- Comply with applicable Indian laws and regulations\n- Conduct anonymised research to improve agricultural outcomes for Indian farmers\n\nWe do NOT use your data for advertising targeting or sell it to third-party marketers.`,
      },
      {
        title: "3. Data Sharing",
        content: `We share your information only in the following limited circumstances:\n\nService Providers: Third-party vendors who help us operate the Platform (e.g., OpenWeatherMap for weather data, cloud hosting providers). These vendors are contractually bound to protect your data.\n\nLegal Requirements: When required by Indian law, court order, or government authority.\n\nBusiness Transfers: If FasalSaathi is acquired or merges with another entity, user data may be transferred. We will notify you of such events.\n\nAggregated Data: We may share anonymised, aggregated statistics (e.g., "60% of farmers in MP grow wheat") that cannot identify any individual.\n\nWe never sell your personal data to data brokers or advertisers.`,
      },
      {
        title: "4. Data Security",
        content: `We implement industry-standard technical and organisational measures to protect your data:\n- All data transmitted between your device and our servers is encrypted using TLS 1.3\n- Passwords are hashed using bcrypt (never stored in plain text)\n- Farm data is stored on AWS servers located in India (Asia-Pacific region)\n- Access to your data is limited to authorised FasalSaathi personnel on a need-to-know basis\n- We conduct regular security audits and vulnerability assessments\n\nDespite these measures, no system is 100% secure. If you suspect your account has been compromised, change your password immediately and contact support.`,
      },
      {
        title: "5. Data Retention",
        content: `We retain your personal data for as long as your account is active or as needed to provide services. Specifically:\n\nAccount data is retained for 3 years after your last login.\n\nFarm records and crop history are retained for 5 seasons by default. You can delete individual records anytime.\n\nWeather and market data is anonymised after 90 days.\n\nIf you delete your account, all personal data is permanently erased within 30 days, except for records required by law.`,
      },
      {
        title: "6. Your Rights",
        content: `Under applicable Indian data protection law, you have the right to:\n\nAccess: Request a copy of all personal data we hold about you.\n\nCorrection: Request correction of inaccurate or incomplete data.\n\nDeletion: Request erasure of your personal data ("right to be forgotten").\n\nPortability: Request your farm data in a machine-readable format (CSV/JSON).\n\nObjection: Object to processing of your data for purposes you haven't consented to.\n\nTo exercise any of these rights, email us at privacy@fasalsaathi.in with the subject "Data Rights Request".`,
      },
      {
        title: "7. Cookies",
        content: `FasalSaathi uses the following types of cookies:\n\nEssential Cookies: Required for login sessions and platform security. Cannot be disabled.\n\nPreference Cookies: Remember your language preference and dashboard settings.\n\nAnalytics Cookies: Anonymised usage data to improve the platform (can be opted out in Settings).\n\nWe do not use advertising or tracking cookies.`,
      },
      {
        title: "8. Children's Privacy",
        content: `FasalSaathi is designed for adults (18+). We do not knowingly collect personal information from children under 18. If we discover that a child under 18 has provided personal data, we will delete it immediately. If you are a parent or guardian who believes your child has provided data, contact us at privacy@fasalsaathi.in.`,
      },
      {
        title: "9. Third-Party Links",
        content: `The Platform may contain links to external websites (e.g., government agriculture portals, KVK websites). We are not responsible for the privacy practices of those external sites. We encourage you to read the privacy policy of every website you visit.`,
      },
      {
        title: "10. Changes to This Policy",
        content: `We may update this Privacy Policy from time to time. We will notify you of material changes via email or in-app notification at least 14 days before changes take effect. The date of the most recent revision is displayed at the top of this page. Your continued use of the Platform after changes constitutes acceptance.`,
      },
      {
        title: "11. Contact Us",
        content: `If you have any questions, concerns, or requests regarding this Privacy Policy, contact our Data Protection Officer:\n\nEmail: privacy@fasalsaathi.in\nAddress: FasalSaathi, Data Privacy Team, Itarsi, Madhya Pradesh – 461111, India\nResponse Time: We respond to all privacy enquiries within 72 hours.`,
      }
    ]
  },
  hi: {
    heroBadge: "गोपनीयता नीति",
    heroTitle: "गोपनीयता नीति",
    heroSub: "अंतिम अपडेट: अप्रैल 2026 · हम आपकी गोपनीयता को गंभीरता से लेते हैं",
    tldrTitle: "🌿 संक्षिप्त जानकारी",
    tldr1: "आपके खेत का डेटा आपका है। हम इसे कभी नहीं बेचते।",
    tldr2: "फसलसाथी पर कोई विज्ञापन या ट्रैकिंग कुकीज़ नहीं हैं।",
    tldr3: "सभी डेटा भारत में सर्वर पर सुरक्षित है (AWS एशिया-पैसिफिक)।",
    tocTitle: "विषय सूची",
    copy: `© ${new Date().getFullYear()} फसलसाथी। सर्वाधिकार सुरक्षित।`,
    termsLink: "नियम एवं शर्तें",
    contactLink: "हमसे संपर्क करें",
    sections: [
      {
        title: "1. हम जो जानकारी एकत्र करते हैं",
        content: `जब आप फसलसाथी का उपयोग करते हैं तो हम निम्नलिखित प्रकार की जानकारी एकत्र करते हैं:\n\nखाता जानकारी: नाम, ईमेल पता, फोन नंबर, और पासवर्ड (सुरक्षित रूप में संग्रहीत)।\n\nखेत का डेटा: खेत का स्थान, आकार, मिट्टी का प्रकार, और मौसमी रिकॉर्ड।\n\nउपयोग डेटा: देखे गए पृष्ठ, उपयोग की गई सुविधाएं, ऐप पर बिताया गया समय।\n\nडिवाइस जानकारी: डिवाइस का प्रकार, ऑपरेटिंग सिस्टम और आईपी पता।\n\nस्थान डेटा: मौसम और बाजार के लिए आपका GPS या दर्ज किया गया गाँव। हम आपके वास्तविक समय की गतिविधियों को ट्रैक नहीं करते हैं।`,
      },
      {
        title: "2. हम आपकी जानकारी का उपयोग कैसे करते हैं",
        content: `हम आपकी जानकारी का उपयोग निम्न के लिए करते हैं:\n- व्यक्तिगत मौसम पूर्वानुमान और बाजार मूल्य प्रदान करना\n- AI मॉडल में सुधार करना\n- सेवा अलर्ट और महत्वपूर्ण अपडेट भेजना\n- प्लेटफ़ॉर्म सुरक्षा सुनिश्चित करना\n- भारतीय कानूनों का पालन करना\n\nहम विज्ञापन के लिए आपके डेटा का उपयोग नहीं करते हैं और न ही इसे बेचते हैं।`,
      },
      {
        title: "3. डेटा साझा करना",
        content: `हम आपकी जानकारी केवल सीमित परिस्थितियों में साझा करते हैं:\n\nसेवा प्रदाता: तृतीय-पक्ष विक्रेता (जैसे, मौसम डेटा के लिए OpenWeatherMap)। वे आपके डेटा की सुरक्षा के लिए बाध्य हैं।\n\nकानूनी आवश्यकताएं: जब भारतीय कानून या न्यायालय के आदेश द्वारा आवश्यक हो।\n\nव्यापार हस्तांतरण: विलय या अधिग्रहण के मामले में।\n\nएकत्रित डेटा: हम अनाम आंकड़े साझा कर सकते हैं (जैसे, "मप्र में 60% किसान गेहूं उगाते हैं")।\n\nहम कभी भी आपका व्यक्तिगत डेटा विज्ञापनदाताओं को नहीं बेचते हैं।`,
      },
      {
        title: "4. डेटा सुरक्षा",
        content: `हम आपके डेटा की सुरक्षा के लिए उद्योग-मानक उपाय लागू करते हैं:\n- सभी डेटा TLS 1.3 का उपयोग करके एन्क्रिप्ट किया गया है\n- पासवर्ड bcrypt का उपयोग करके सुरक्षित किए जाते हैं\n- खेत का डेटा भारत में AWS सर्वर पर संग्रहीत है\n- डेटा तक पहुंच सीमित है\n\nयदि आपको लगता है कि आपका खाता खतरे में है, तो तुरंत अपना पासवर्ड बदलें।`,
      },
      {
        title: "5. डेटा प्रतिधारण",
        content: `हम आपका व्यक्तिगत डेटा तब तक रखते हैं जब तक आपका खाता सक्रिय है। विशेष रूप से:\n\nखाता डेटा अंतिम लॉगिन के 3 साल बाद तक रखा जाता है।\n\nखेत के रिकॉर्ड डिफ़ॉल्ट रूप से 5 सीज़न के लिए रखे जाते हैं।\n\nमौसम और बाजार डेटा 90 दिनों के बाद अनाम कर दिया जाता है।\n\nखाता हटाने पर, सभी व्यक्तिगत डेटा 30 दिनों के भीतर मिटा दिया जाता है।`,
      },
      {
        title: "6. आपके अधिकार",
        content: `भारतीय डेटा संरक्षण कानून के तहत, आपको निम्नलिखित अधिकार हैं:\n\nपहुंच: अपने व्यक्तिगत डेटा की एक प्रति का अनुरोध करें।\n\nसुधार: गलत डेटा में सुधार का अनुरोध करें।\n\nहटाना: अपना डेटा मिटाने का अनुरोध करें।\n\nपोर्टेबिलिटी: मशीन-पठनीय प्रारूप में अपना डेटा मांगें।\n\nआपत्ति: अपने डेटा के प्रसंस्करण पर आपत्ति जताएं।\n\nइन अधिकारों का प्रयोग करने के लिए privacy@fasalsaathi.in पर ईमेल करें।`,
      },
      {
        title: "7. कुकीज़",
        content: `फसलसाथी निम्नलिखित प्रकार की कुकीज़ का उपयोग करता है:\n\nआवश्यक कुकीज़: लॉगिन और सुरक्षा के लिए आवश्यक।\n\nप्राथमिकता कुकीज़: आपकी भाषा और सेटिंग्स याद रखने के लिए।\n\nएनालिटिक्स कुकीज़: प्लेटफ़ॉर्म को बेहतर बनाने के लिए अनाम उपयोग डेटा।\n\nहम विज्ञापन कुकीज़ का उपयोग नहीं करते हैं।`,
      },
      {
        title: "8. बच्चों की गोपनीयता",
        content: `फसलसाथी वयस्कों (18+) के लिए बनाया गया है। हम जानबूझकर 18 वर्ष से कम उम्र के बच्चों से जानकारी एकत्र नहीं करते हैं।`,
      },
      {
        title: "9. तृतीय-पक्ष लिंक",
        content: `प्लेटफ़ॉर्म में बाहरी वेबसाइटों (जैसे, कृषि पोर्टल) के लिंक हो सकते हैं। हम उन बाहरी साइटों की गोपनीयता प्रथाओं के लिए ज़िम्मेदार नहीं हैं।`,
      },
      {
        title: "10. इस नीति में परिवर्तन",
        content: `हम इस गोपनीयता नीति को अपडेट कर सकते हैं। परिवर्तन लागू होने से कम से कम 14 दिन पहले हम आपको सूचित करेंगे।`,
      },
      {
        title: "11. हमसे संपर्क करें",
        content: `यदि आपके कोई प्रश्न हैं, तो हमारे डेटा संरक्षण अधिकारी से संपर्क करें:\n\nईमेल: privacy@fasalsaathi.in\nपता: फसलसाथी, डेटा गोपनीयता टीम, इटारसी, मध्य प्रदेश – 461111, भारत\nहम 72 घंटों के भीतर जवाब देते हैं।`,
      }
    ]
  },
  mr: {
    heroBadge: "गोपनीयता धोरण",
    heroTitle: "गोपनीयता धोरण",
    heroSub: "अंतिम अपडेट: एप्रिल २०२६ · आम्ही तुमची गोपनीयता जपतो",
    tldrTitle: "🌿 थोडक्यात माहिती",
    tldr1: "तुमचा शेतीचा डेटा तुमचा आहे. आम्ही तो कधीही विकत नाही.",
    tldr2: "फसलसाथीवर कोणत्याही जाहिराती किंवा ट्रॅकिंग कुकीज नाहीत.",
    tldr3: "सर्व डेटा भारतातील सर्व्हरवर सुरक्षित आहे (AWS).",
    tocTitle: "अनुक्रमणिका",
    copy: `© ${new Date().getFullYear()} फसलसाथी. सर्व हक्क राखीव.`,
    termsLink: "अटी आणि शर्ती",
    contactLink: "आमच्याशी संपर्क साधा",
    sections: [
      {
        title: "1. आम्ही गोळा करत असलेली माहिती",
        content: `जेव्हा तुम्ही फसलसाथी वापरता तेव्हा आम्ही खालील माहिती गोळा करतो:\n\nखाते माहिती: नाव, ईमेल, फोन नंबर आणि पासवर्ड.\n\nशेतीचा डेटा: ठिकाण, आकार, मातीचा प्रकार आणि पिकांचा इतिहास.\n\nवापर डेटा: अ‍ॅपवरील तुमचा वापर आणि त्रुटी.\n\nडिव्हाइस माहिती: डिव्हाइस प्रकार आणि आयपी अ‍ॅड्रेस.\n\nस्थान डेटा: हवामान आणि बाजारभावासाठी तुमचे GPS. आम्ही तुमचे रिअल-टाइम ट्रॅकिंग करत नाही.`,
      },
      {
        title: "2. आम्ही तुमची माहिती कशी वापरतो",
        content: `आम्ही तुमची माहिती यासाठी वापरतो:\n- वैयक्तिकृत हवामान आणि बाजारभाव प्रदान करण्यासाठी\n- AI मॉडेल्स सुधारण्यासाठी\n- सेवा अलर्ट पाठवण्यासाठी\n- सुरक्षा सुनिश्चित करण्यासाठी\n- भारतीय कायद्यांचे पालन करण्यासाठी\n\nआम्ही तुमचा डेटा जाहिरातींसाठी वापरत नाही.`,
      },
      {
        title: "3. डेटा शेअरिंग",
        content: `आम्ही तुमची माहिती केवळ मर्यादित परिस्थितीत शेअर करतो:\n\nसेवा प्रदाते: हवामान डेटासाठी OpenWeatherMap सारखे प्रदाते. ते डेटा संरक्षित करण्यास बांधील आहेत.\n\nकायदेशीर आवश्यकता: भारतीय कायद्यानुसार आवश्यक असल्यास.\n\nव्यवसाय हस्तांतरण: कंपनी विलीनीकरणाच्या बाबतीत.\n\nएकत्रित डेटा: आम्ही अनामित आकडेवारी शेअर करू शकतो.\n\nआम्ही तुमचा डेटा जाहिरातदारांना विकत नाही.`,
      },
      {
        title: "4. डेटा सुरक्षा",
        content: `तुमचा डेटा सुरक्षित ठेवण्यासाठी आम्ही उपाययोजना करतो:\n- सर्व डेटा TLS 1.3 वापरून एन्क्रिप्ट केला आहे\n- पासवर्ड bcrypt वापरून हॅश केले जातात\n- डेटा भारतातील AWS सर्व्हरवर संग्रहित आहे\n- डेटा अ‍ॅक्सेस मर्यादित आहे\n\nखाते धोक्यात असल्याचे वाटल्यास, त्वरित पासवर्ड बदला.`,
      },
      {
        title: "5. डेटा रिटेन्शन (डेटा जतन)",
        content: `तुमचे खाते सक्रिय असेपर्यंत आम्ही तुमचा डेटा ठेवतो:\n\nखाते डेटा: शेवटच्या लॉगिननंतर ३ वर्षे.\n\nशेती रेकॉर्ड: डीफॉल्टनुसार ५ हंगाम.\n\nहवामान आणि बाजार डेटा: ९० दिवसांनंतर अनामित केला जातो.\n\nखाते हटवल्यास, सर्व डेटा ३० दिवसांत कायमचा हटवला जातो.`,
      },
      {
        title: "6. तुमचे अधिकार",
        content: `भारतीय डेटा संरक्षण कायद्यानुसार, तुम्हाला हे अधिकार आहेत:\n\nअ‍ॅक्सेस: तुमच्या डेटाच्या प्रतीची विनंती करणे.\n\nसुधारणा: चुकीचा डेटा दुरुस्त करणे.\n\nहटवणे: तुमचा डेटा हटवण्याची विनंती करणे.\n\nपोर्टेबिलिटी: मशीन-वाचण्यायोग्य स्वरूपात डेटा मिळवणे.\n\nया अधिकारांचा वापर करण्यासाठी privacy@fasalsaathi.in वर ईमेल करा.`,
      },
      {
        title: "7. कुकीज",
        content: `आम्ही खालील कुकीज वापरतो:\n\nआवश्यक कुकीज: लॉगिन आणि सुरक्षिततेसाठी.\n\nपसंती कुकीज: भाषा लक्षात ठेवण्यासाठी.\n\nअ‍ॅनालिटिक्स कुकीज: अ‍ॅप सुधारण्यासाठी.\n\nआम्ही जाहिरात कुकीज वापरत नाही.`,
      },
      {
        title: "8. मुलांची गोपनीयता",
        content: `फसलसाथी प्रौढांसाठी (१८+) बनवले आहे. आम्ही १८ वर्षांखालील मुलांची माहिती गोळा करत नाही.`,
      },
      {
        title: "9. थर्ड-पार्टी लिंक्स",
        content: `अ‍ॅपमध्ये बाह्य वेबसाइट्सच्या लिंक्स असू शकतात. त्यांच्या गोपनीयता धोरणांसाठी आम्ही जबाबदार नाही.`,
      },
      {
        title: "10. या धोरणातील बदल",
        content: `आम्ही हे धोरण वेळोवेळी अपडेट करू शकतो. बदल लागू होण्यापूर्वी किमान १४ दिवस आधी आम्ही तुम्हाला कळवू.`,
      },
      {
        title: "11. संपर्क साधा",
        content: `काही प्रश्न असल्यास, आमच्या डेटा संरक्षण अधिकाऱ्याशी संपर्क साधा:\n\nईमेल: privacy@fasalsaathi.in\nपत्ता: फसलसाथी, इटारसी, मध्य प्रदेश – ४६११११\nआम्ही ७२ तासांच्या आत उत्तर देतो.`,
      }
    ]
  },
  pa: {
    heroBadge: "ਗੋਪਨੀਯਤਾ ਨੀਤੀ",
    heroTitle: "ਗੋਪਨੀਯਤਾ ਨੀਤੀ",
    heroSub: "ਆਖਰੀ ਅਪਡੇਟ: ਅਪ੍ਰੈਲ 2026 · ਅਸੀਂ ਤੁਹਾਡੀ ਗੋਪਨੀਯਤਾ ਨੂੰ ਗੰਭੀਰਤਾ ਨਾਲ ਲੈਂਦੇ ਹਾਂ",
    tldrTitle: "🌿 ਸੰਖੇਪ ਜਾਣਕਾਰੀ",
    tldr1: "ਤੁਹਾਡਾ ਖੇਤ ਦਾ ਡੇਟਾ ਤੁਹਾਡਾ ਹੈ। ਅਸੀਂ ਇਸਨੂੰ ਕਦੇ ਨਹੀਂ ਵੇਚਦੇ।",
    tldr2: "ਫਸਲਸਾਥੀ 'ਤੇ ਕੋਈ ਵਿਗਿਆਪਨ ਜਾਂ ਟਰੈਕਿੰਗ ਕੂਕੀਜ਼ ਨਹੀਂ ਹਨ।",
    tldr3: "ਸਾਰਾ ਡੇਟਾ ਭਾਰਤ ਵਿੱਚ ਸਰਵਰਾਂ 'ਤੇ ਸੁਰੱਖਿਅਤ ਹੈ (AWS)।",
    tocTitle: "ਵਿਸ਼ਾ ਸੂਚੀ",
    copy: `© ${new Date().getFullYear()} ਫਸਲਸਾਥੀ। ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।`,
    termsLink: "ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ",
    contactLink: "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
    sections: [
      {
        title: "1. ਅਸੀਂ ਜੋ ਜਾਣਕਾਰੀ ਇਕੱਠੀ ਕਰਦੇ ਹਾਂ",
        content: `ਜਦੋਂ ਤੁਸੀਂ ਫਸਲਸਾਥੀ ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹੋ ਤਾਂ ਅਸੀਂ ਇਹ ਜਾਣਕਾਰੀ ਲੈਂਦੇ ਹਾਂ:\n\nਖਾਤਾ ਜਾਣਕਾਰੀ: ਨਾਮ, ਈਮੇਲ, ਫ਼ੋਨ ਨੰਬਰ ਅਤੇ ਪਾਸਵਰਡ।\n\nਖੇਤ ਦਾ ਡੇਟਾ: ਸਥਾਨ, ਆਕਾਰ, ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਅਤੇ ਫਸਲ ਦਾ ਇਤਿਹਾਸ।\n\nਵਰਤੋਂ ਡੇਟਾ: ਐਪ ਦੀ ਵਰਤੋਂ ਅਤੇ ਐਰਰ ਲੌਗ।\n\nਡਿਵਾਈਸ ਜਾਣਕਾਰੀ: ਡਿਵਾਈਸ ਦੀ ਕਿਸਮ ਅਤੇ IP ਐਡਰੈੱਸ।\n\nਸਥਾਨ ਡੇਟਾ: ਮੌਸਮ ਅਤੇ ਮੰਡੀ ਲਈ ਤੁਹਾਡਾ GPS। ਅਸੀਂ ਤੁਹਾਡੀ ਹਰ ਸਮੇਂ ਦੀ ਲੋਕੇਸ਼ਨ ਟਰੈਕ ਨਹੀਂ ਕਰਦੇ।`,
      },
      {
        title: "2. ਅਸੀਂ ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਕਰਦੇ ਹਾਂ",
        content: `ਅਸੀਂ ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਦੀ ਵਰਤੋਂ ਇਹਨਾਂ ਲਈ ਕਰਦੇ ਹਾਂ:\n- ਮੌਸਮ ਅਤੇ ਮੰਡੀ ਭਾਅ ਪ੍ਰਦਾਨ ਕਰਨ ਲਈ\n- AI ਮਾਡਲਾਂ ਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣ ਲਈ\n- ਅਲਰਟ ਭੇਜਣ ਲਈ\n- ਸੁਰੱਖਿਆ ਯਕੀਨੀ ਬਣਾਉਣ ਲਈ\n\nਅਸੀਂ ਤੁਹਾਡਾ ਡੇਟਾ ਵਿਗਿਆਪਨਾਂ ਲਈ ਨਹੀਂ ਵਰਤਦੇ ਅਤੇ ਨਾ ਹੀ ਵੇਚਦੇ ਹਾਂ।`,
      },
      {
        title: "3. ਡਾਟਾ ਸਾਂਝਾ ਕਰਨਾ",
        content: `ਅਸੀਂ ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਸਿਰਫ਼ ਇਹਨਾਂ ਹਾਲਾਤਾਂ ਵਿੱਚ ਸਾਂਝੀ ਕਰਦੇ ਹਾਂ:\n\nਸੇਵਾ ਪ੍ਰਦਾਤਾ: ਜਿਵੇਂ ਮੌਸਮ ਲਈ OpenWeatherMap। ਉਹ ਡੇਟਾ ਸੁਰੱਖਿਅਤ ਰੱਖਣ ਲਈ ਪਾਬੰਦ ਹਨ।\n\nਕਾਨੂੰਨੀ ਲੋੜਾਂ: ਜਦੋਂ ਭਾਰਤੀ ਕਾਨੂੰਨ ਦੁਆਰਾ ਜ਼ਰੂਰੀ ਹੋਵੇ।\n\nਕਾਰੋਬਾਰੀ ਤਬਾਦਲੇ: ਕੰਪਨੀ ਦੇ ਰਲੇਵੇਂ ਦੇ ਮਾਮਲੇ ਵਿੱਚ।\n\nਸਮੂਹਿਕ ਡੇਟਾ: ਅਸੀਂ ਗੁਮਨਾਮ ਅੰਕੜੇ ਸਾਂਝੇ ਕਰ ਸਕਦੇ ਹਾਂ।\n\nਅਸੀਂ ਕਦੇ ਵੀ ਤੁਹਾਡਾ ਡੇਟਾ ਇਸ਼ਤਿਹਾਰ ਦੇਣ ਵਾਲਿਆਂ ਨੂੰ ਨਹੀਂ ਵੇਚਦੇ।`,
      },
      {
        title: "4. ਡਾਟਾ ਸੁਰੱਖਿਆ",
        content: `ਤੁਹਾਡੇ ਡੇਟਾ ਦੀ ਸੁਰੱਖਿਆ ਲਈ ਸਾਡੇ ਉਪਾਅ:\n- ਸਾਰਾ ਡੇਟਾ TLS 1.3 ਦੁਆਰਾ ਐਨਕ੍ਰਿਪਟ ਕੀਤਾ ਗਿਆ ਹੈ\n- ਪਾਸਵਰਡ ਸੁਰੱਖਿਅਤ ਰੂਪ ਵਿੱਚ ਰੱਖੇ ਜਾਂਦੇ ਹਨ\n- ਡੇਟਾ ਭਾਰਤ ਵਿੱਚ AWS ਸਰਵਰਾਂ 'ਤੇ ਸਟੋਰ ਹੈ\n- ਡੇਟਾ ਤੱਕ ਪਹੁੰਚ ਸੀਮਤ ਹੈ\n\nਜੇਕਰ ਤੁਹਾਨੂੰ ਲੱਗਦਾ ਹੈ ਕਿ ਤੁਹਾਡਾ ਖਾਤਾ ਹੈਕ ਹੋ ਗਿਆ ਹੈ, ਤਾਂ ਤੁਰੰਤ ਪਾਸਵਰਡ ਬਦਲੋ।`,
      },
      {
        title: "5. ਡਾਟਾ ਸੰਭਾਲ",
        content: `ਅਸੀਂ ਤੁਹਾਡਾ ਡੇਟਾ ਉਦੋਂ ਤੱਕ ਰੱਖਦੇ ਹਾਂ ਜਦੋਂ ਤੱਕ ਖਾਤਾ ਸਰਗਰਮ ਹੈ:\n\nਖਾਤਾ ਡੇਟਾ: ਆਖਰੀ ਲੌਗਇਨ ਤੋਂ 3 ਸਾਲ ਬਾਅਦ ਤੱਕ।\n\nਖੇਤ ਦਾ ਰਿਕਾਰਡ: 5 ਸੀਜ਼ਨਾਂ ਲਈ।\n\nਮੌਸਮ ਅਤੇ ਮੰਡੀ ਡੇਟਾ: 90 ਦਿਨਾਂ ਬਾਅਦ ਗੁਮਨਾਮ ਕਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।\n\nਖਾਤਾ ਮਿਟਾਉਣ 'ਤੇ, 30 ਦਿਨਾਂ ਦੇ ਅੰਦਰ ਡੇਟਾ ਡਿਲੀਟ ਕਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।`,
      },
      {
        title: "6. ਤੁਹਾਡੇ ਅਧਿਕਾਰ",
        content: `ਭਾਰਤੀ ਕਾਨੂੰਨ ਦੇ ਤਹਿਤ, ਤੁਹਾਡੇ ਅਧਿਕਾਰ ਹਨ:\n\nਪਹੁੰਚ: ਆਪਣੇ ਡੇਟਾ ਦੀ ਕਾਪੀ ਮੰਗਣ ਦਾ ਅਧਿਕਾਰ।\n\nਸੁਧਾਰ: ਗਲਤ ਡੇਟਾ ਠੀਕ ਕਰਵਾਉਣ ਦਾ ਅਧਿਕਾਰ।\n\nਡਿਲੀਟ: ਆਪਣਾ ਡੇਟਾ ਮਿਟਾਉਣ ਦਾ ਅਧਿਕਾਰ।\n\nਪੋਰਟੇਬਿਲਟੀ: ਆਪਣਾ ਡੇਟਾ ਫਾਈਲ ਰੂਪ ਵਿੱਚ ਲੈਣ ਦਾ ਅਧਿਕਾਰ।\n\nਇਹਨਾਂ ਲਈ privacy@fasalsaathi.in 'ਤੇ ਈਮੇਲ ਕਰੋ।`,
      },
      {
        title: "7. ਕੂਕੀਜ਼",
        content: `ਅਸੀਂ ਹੇਠ ਲਿਖੀਆਂ ਕੂਕੀਜ਼ ਵਰਤਦੇ ਹਾਂ:\n\nਜ਼ਰੂਰੀ ਕੂਕੀਜ਼: ਲੌਗਇਨ ਅਤੇ ਸੁਰੱਖਿਆ ਲਈ।\n\nਤਰਜੀਹ ਕੂਕੀਜ਼: ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਯਾਦ ਰੱਖਣ ਲਈ।\n\nਵਿਸ਼ਲੇਸ਼ਣ ਕੂਕੀਜ਼: ਐਪ ਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣ ਲਈ।\n\nਅਸੀਂ ਵਿਗਿਆਪਨ ਕੂਕੀਜ਼ ਦੀ ਵਰਤੋਂ ਨਹੀਂ ਕਰਦੇ।`,
      },
      {
        title: "8. ਬੱਚਿਆਂ ਦੀ ਗੋਪਨੀਯਤਾ",
        content: `ਫਸਲਸਾਥੀ ਬਾਲਗਾਂ (18+) ਲਈ ਹੈ। ਅਸੀਂ 18 ਸਾਲ ਤੋਂ ਘੱਟ ਉਮਰ ਦੇ ਬੱਚਿਆਂ ਦਾ ਡੇਟਾ ਇਕੱਠਾ ਨਹੀਂ ਕਰਦੇ।`,
      },
      {
        title: "9. ਤੀਜੀ-ਧਿਰ ਦੇ ਲਿੰਕ",
        content: `ਪਲੇਟਫਾਰਮ ਵਿੱਚ ਬਾਹਰੀ ਵੈੱਬਸਾਈਟਾਂ ਦੇ ਲਿੰਕ ਹੋ ਸਕਦੇ ਹਨ। ਅਸੀਂ ਉਹਨਾਂ ਦੀਆਂ ਨੀਤੀਆਂ ਲਈ ਜ਼ਿੰਮੇਵਾਰ ਨਹੀਂ ਹਾਂ।`,
      },
      {
        title: "10. ਇਸ ਨੀਤੀ ਵਿੱਚ ਬਦਲਾਅ",
        content: `ਅਸੀਂ ਇਸ ਨੀਤੀ ਨੂੰ ਅਪਡੇਟ ਕਰ ਸਕਦੇ ਹਾਂ। ਅਸੀਂ ਤੁਹਾਨੂੰ ਬਦਲਾਅ ਲਾਗੂ ਹੋਣ ਤੋਂ 14 ਦਿਨ ਪਹਿਲਾਂ ਸੂਚਿਤ ਕਰਾਂਗੇ।`,
      },
      {
        title: "11. ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
        content: `ਜੇਕਰ ਤੁਹਾਡੇ ਕੋਈ ਸਵਾਲ ਹਨ, ਤਾਂ ਸੰਪਰਕ ਕਰੋ:\n\nਈਮੇਲ: privacy@fasalsaathi.in\nਪਤਾ: ਫਸਲਸਾਥੀ, ਇਟਾਰਸੀ, ਮੱਧ ਪ੍ਰਦੇਸ਼ – 461111\nਅਸੀਂ 72 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਜਵਾਬ ਦਿੰਦੇ ਹਾਂ।`,
      }
    ]
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
export function PrivacyPage() {
  const { lang } = useLanguage();
  const text = t[lang];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        .fs-pr-wrapper {
          --pr-font-body: 'Inter', system-ui, sans-serif;
          --pr-font-display: 'Poppins', system-ui, sans-serif;
          --pr-primary: #16a34a; --pr-text-dark: #111827; --pr-text-muted: #4b5563;
          --pr-text-light: #ffffff; --pr-bg-light: #f9fafb; --pr-border: #f3f4f6;
          font-family: var(--pr-font-body); background-color: #ffffff; color: var(--pr-text-dark);
          display: flex; flex-direction: column; min-height: 100vh; overflow-x: hidden;
        }

        .fs-pr-container { max-width: 56rem; margin: 0 auto; padding: 0 1rem; width: 100%; box-sizing: border-box; }
        @media (min-width: 640px) { .fs-pr-container { padding: 0 1.5rem; } }

        /* -- ANIMATED HERO (FARMING THEME) -- */
        .fs-pr-hero { position: relative; padding-top: 8rem; padding-bottom: 4rem; background: linear-gradient(180deg, #064e3b 0%, #022c22 100%); text-align: center; overflow: hidden; }
        @media (min-width: 768px) { .fs-pr-hero { padding-top: 10rem; padding-bottom: 5rem; } }
        
        .fs-pr-hero-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }

        @keyframes sunPulse { 0% { transform: scale(1); box-shadow: 0 0 50px 20px rgba(250, 204, 21, 0.2); } 100% { transform: scale(1.05); box-shadow: 0 0 80px 40px rgba(250, 204, 21, 0.4); } }
        .fs-pr-bg-sun { position: absolute; top: 15%; right: 20%; width: 120px; height: 120px; background: #facc15; border-radius: 50%; opacity: 0.6; animation: sunPulse 5s ease-in-out infinite alternate; filter: blur(20px); }

        @keyframes floatCloud { 0% { transform: translateX(-15vw); } 100% { transform: translateX(115vw); } }
        .fs-pr-bg-cloud { position: absolute; color: rgba(255, 255, 255, 0.08); animation: floatCloud linear infinite; }
        .fs-pr-bg-cloud-1 { top: 10%; left: -20%; animation-duration: 45s; animation-delay: -10s; }
        .fs-pr-bg-cloud-2 { top: 25%; left: -20%; animation-duration: 65s; animation-delay: -35s; transform: scale(1.5); color: rgba(255, 255, 255, 0.04); }

        @keyframes waveHills { 0% { transform: translateX(0) scaleY(1); } 50% { transform: translateX(-2%) scaleY(1.05); } 100% { transform: translateX(0) scaleY(1); } }
        .fs-pr-bg-hill { position: absolute; bottom: -5%; width: 120%; border-radius: 50% 50% 0 0 / 100% 100% 0 0; animation: waveHills 10s ease-in-out infinite; }
        .fs-pr-bg-hill-1 { left: -5%; background: rgba(20, 83, 45, 0.5); z-index: 1; height: 35%; animation-duration: 12s; }
        .fs-pr-bg-hill-2 { left: -10%; background: rgba(6, 95, 70, 0.7); z-index: 2; height: 25%; animation-delay: -5s; }

        @keyframes leafFall { 0% { transform: translate(0, -50px) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translate(-150px, 100vh) rotate(720deg); opacity: 0; } }
        .fs-pr-bg-leaf { position: absolute; top: -10%; background: linear-gradient(135deg, #4ade80, #16a34a); border-radius: 50% 0 50% 0; opacity: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); animation: leafFall linear infinite; }
        .fs-pr-l-1 { left: 15%; width: 14px; height: 14px; animation-duration: 12s; animation-delay: 0s; }
        .fs-pr-l-2 { left: 40%; width: 10px; height: 10px; animation-duration: 16s; animation-delay: 3s; }
        .fs-pr-l-3 { left: 65%; width: 18px; height: 18px; animation-duration: 14s; animation-delay: 1s; background: linear-gradient(135deg, #facc15, #ca8a04); }

        .fs-pr-noise { position: absolute; inset: 0; background-image: url('https://grainy-gradients.vercel.app/noise.svg'); opacity: 0.2; mix-blend-mode: overlay; z-index: 3;}

        .fs-pr-hero-content { position: relative; z-index: 10; }
        .fs-pr-hero-icon-box { display: inline-flex; align-items: center; justify-content: center; width: 3.5rem; height: 3.5rem; background: rgba(255,255,255,0.1); border-radius: 1rem; margin-bottom: 1rem; }
        .fs-pr-h1 { font-family: var(--pr-font-display); font-size: 2.25rem; font-weight: 700; color: var(--pr-text-light); margin: 0 0 0.5rem 0; line-height: 1.2; }
        @media (min-width: 640px) { .fs-pr-h1 { font-size: 2.5rem; } }
        .fs-pr-hero-sub { color: #d1fae5; font-size: 0.875rem; margin: 0; font-weight: 400; }

        /* -- CONTENT AREA -- */
        .fs-pr-content-area { padding: 0 0 4rem 0; }
        .fs-pr-tldr { background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 1rem; padding: 1.5rem; margin-top: 3rem; margin-bottom: 2.5rem; }
        .fs-pr-tldr-title { font-family: var(--pr-font-display); font-weight: 700; color: #166534; margin: 0 0 0.75rem 0; font-size: 1rem; }
        .fs-pr-tldr-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 640px) { .fs-pr-tldr-grid { grid-template-columns: repeat(3, 1fr); } }
        .fs-pr-tldr-item { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.875rem; color: #15803d; }
        .fs-pr-tldr-icon { font-size: 1.25rem; line-height: 1; flex-shrink: 0; }

        .fs-pr-toc { background-color: var(--pr-bg-light); border: 1px solid var(--pr-border); border-radius: 1rem; padding: 1.5rem; margin-bottom: 3rem; }
        .fs-pr-toc-title { font-family: var(--pr-font-display); font-size: 0.875rem; font-weight: 600; color: var(--pr-text-dark); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1rem 0; }
        .fs-pr-toc-grid { display: grid; grid-template-columns: 1fr; gap: 0.75rem; }
        @media (min-width: 640px) { .fs-pr-toc-grid { grid-template-columns: 1fr 1fr; } }
        .fs-pr-toc-link { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.875rem; color: var(--pr-text-muted); cursor: pointer; transition: color 0.2s ease; }
        .fs-pr-toc-link:hover { color: var(--pr-primary); }
        .fs-pr-toc-link svg { flex-shrink: 0; margin-top: 0.125rem; }

        .fs-pr-prose { display: flex; flex-direction: column; gap: 2.5rem; }
        .fs-pr-section { scroll-margin-top: 6rem; }
        .fs-pr-section-title { font-family: var(--pr-font-display); font-size: 1.125rem; font-weight: 700; color: var(--pr-text-dark); margin: 0 0 0.75rem 0; }
        .fs-pr-section-text { font-size: 0.875rem; color: var(--pr-text-muted); line-height: 1.75; margin: 0; white-space: pre-line; }

        .fs-pr-footer-bar { margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--pr-border); display: flex; flex-direction: column; align-items: center; gap: 1rem; justify-content: space-between; }
        @media (min-width: 640px) { .fs-pr-footer-bar { flex-direction: row; } }
        .fs-pr-copyright { color: #9ca3af; font-size: 0.875rem; margin: 0; }
        .fs-pr-footer-links { display: flex; gap: 1rem; }
        .fs-pr-footer-link { color: var(--pr-primary); font-size: 0.875rem; text-decoration: none; transition: text-decoration 0.2s; }
        .fs-pr-footer-link:hover { text-decoration: underline; }
      `}</style>

      <div className="fs-pr-wrapper">
        <PublicNavbar />

        <main style={{ flex: 1 }}>
          {/* Animated Farming Hero */}
          <section className="fs-pr-hero">
            <div className="fs-pr-hero-bg">
              <div className="fs-pr-bg-sun" />
              <Cloud className="fs-pr-bg-cloud fs-pr-bg-cloud-1" size={160} />
              <Cloud className="fs-pr-bg-cloud fs-pr-bg-cloud-2" size={240} />
              <div className="fs-pr-bg-hill fs-pr-bg-hill-1" />
              <div className="fs-pr-bg-hill fs-pr-bg-hill-2" />
              <div className="fs-pr-bg-leaf fs-pr-l-1" />
              <div className="fs-pr-bg-leaf fs-pr-l-2" />
              <div className="fs-pr-bg-leaf fs-pr-l-3" />
              <div className="fs-pr-noise" />
            </div>

            <div className="fs-pr-container fs-pr-hero-content">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="fs-pr-hero-icon-box">
                  <Lock size={28} color="#ffffff" />
                </div>
                <h1 className="fs-pr-h1">{text.heroTitle}</h1>
                <p className="fs-pr-hero-sub">{text.heroSub}</p>
              </motion.div>
            </div>
          </section>

          {/* Content Area */}
          <section className="fs-pr-content-area">
            <div className="fs-pr-container">
              
              {/* Dynamic TL;DR */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="fs-pr-tldr">
                <h2 className="fs-pr-tldr-title">{text.tldrTitle}</h2>
                <div className="fs-pr-tldr-grid">
                  <div className="fs-pr-tldr-item"><span className="fs-pr-tldr-icon">🔒</span><span>{text.tldr1}</span></div>
                  <div className="fs-pr-tldr-item"><span className="fs-pr-tldr-icon">🚫</span><span>{text.tldr2}</span></div>
                  <div className="fs-pr-tldr-item"><span className="fs-pr-tldr-icon">🇮🇳</span><span>{text.tldr3}</span></div>
                </div>
              </motion.div>

              {/* Dynamic TOC */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="fs-pr-toc">
                <h2 className="fs-pr-toc-title">{text.tocTitle}</h2>
                <div className="fs-pr-toc-grid">
                  {text.sections.map(({ title }, i) => (
                    <div key={title} onClick={() => scrollToSection(`section-${i}`)} className="fs-pr-toc-link">
                      <ChevronRight size={14} color="var(--pr-primary)" />
                      {title}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Dynamic Legal Sections */}
              <div className="fs-pr-prose">
                {text.sections.map(({ title, content }, i) => (
                  <motion.section
                    key={title}
                    id={`section-${i}`}
                    className="fs-pr-section"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.04 * (i % 6) }}
                  >
                    <h2 className="fs-pr-section-title">{title}</h2>
                    <p className="fs-pr-section-text">{content}</p>
                  </motion.section>
                ))}
              </div>

              {/* Dynamic Footer Links */}
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="fs-pr-footer-bar">
                <p className="fs-pr-copyright">{text.copy}</p>
                <div className="fs-pr-footer-links">
                  <Link to="/terms" className="fs-pr-footer-link">{text.termsLink}</Link>
                  <Link to="/contact" className="fs-pr-footer-link">{text.contactLink}</Link>
                </div>
              </motion.div>
              
            </div>
          </section>
        </main>

        <PublicFooter />
      </div>
    </>
  );
}