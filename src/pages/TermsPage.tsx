import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { FileText, ChevronRight, Cloud } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNavbar } from "../components/public/PublicNavbar";
import { PublicFooter } from "../components/public/PublicFooter";
import { useLanguage } from "../hooks/useLanguage";

// ─── Translations Dictionary ──────────────────────────────────────────────────
const t = {
  en: {
    heroTitle: "Terms & Conditions",
    heroSub: "Last updated: April 2026 · Effective immediately",
    tocTitle: "Table of Contents",
    copy: `© ${new Date().getFullYear()} FasalSaathi. All rights reserved.`,
    privacyLink: "Privacy Policy",
    contactLink: "Contact Us",
    sections: [
      {
        title: "1. Acceptance of Terms",
        content: `By accessing or using FasalSaathi ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to all terms herein, you may not access or use the Platform. These terms apply to all visitors, users, and farmers who access or use the Platform.`,
      },
      {
        title: "2. Description of Service",
        content: `FasalSaathi is an AI-powered agricultural advisory platform that provides farmers with weather forecasts, market prices, crop recommendations, plant disease detection, and yield predictions. The Platform is designed to assist — not replace — professional agricultural advice from qualified agronomists or government agricultural officers.`,
      },
      {
        title: "3. User Accounts",
        content: `You must register an account to access full Platform features. You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information during registration. You must be at least 18 years of age to create an account. FasalSaathi reserves the right to terminate accounts that violate these terms.`,
      },
      {
        title: "4. Acceptable Use",
        content: `You agree not to: (a) use the Platform for any unlawful purpose or in violation of any regulations; (b) impersonate any person or entity; (c) upload false or misleading information; (d) attempt to gain unauthorised access to any part of the Platform; (e) scrape or harvest data from the Platform; (f) use the Platform to transmit spam, malware, or harmful content.`,
      },
      {
        title: "5. Accuracy of Information",
        content: `While FasalSaathi strives to provide accurate weather, market, and crop information, all data is provided "as is" without warranty of any kind. Weather forecasts are probabilistic and may not accurately reflect actual conditions. Market prices are indicative and may differ from actual mandi prices. Crop recommendations are AI-generated suggestions and should be verified with local agricultural experts before acting upon them.`,
      },
      {
        title: "6. Limitation of Liability",
        content: `FasalSaathi and its operators shall not be liable for any losses or damages arising from: (a) reliance on weather forecasts, market data, or crop recommendations; (b) crop failure, financial loss, or yield shortfall; (c) interruption or unavailability of the Platform services; (d) any decisions made based on Platform data without consulting a qualified agricultural officer. Users accept full responsibility for all farming decisions made using Platform data.`,
      },
      {
        title: "7. Intellectual Property",
        content: `All content, algorithms, designs, logos, and text on the Platform are the exclusive property of FasalSaathi. You may not copy, reproduce, distribute, or create derivative works from any Platform content without written permission. The FasalSaathi name and logo are trademarks and may not be used without express written consent.`,
      },
      {
        title: "8. Privacy",
        content: `Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices regarding the collection, use, and disclosure of your personal information.`,
      },
      {
        title: "9. Subscription & Payments",
        content: `Paid features (Kisan Pro) are billed monthly or annually as selected. Subscriptions automatically renew unless cancelled before the renewal date. No refunds are issued for partial months, except as required under applicable Indian consumer protection law. We reserve a 30-day money-back guarantee for first-time Pro subscribers.`,
      },
      {
        title: "10. Modifications to Terms",
        content: `FasalSaathi reserves the right to modify these Terms at any time. We will notify registered users of material changes via email or in-app notification at least 14 days before changes take effect. Continued use of the Platform after changes take effect constitutes acceptance of the revised Terms.`,
      },
      {
        title: "11. Governing Law",
        content: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from or relating to these Terms or use of the Platform shall be subject to the exclusive jurisdiction of the courts of Madhya Pradesh, India.`,
      },
      {
        title: "12. Contact",
        content: `If you have any questions about these Terms and Conditions, please contact us at: legal@fasalsaathi.in or write to FasalSaathi, Itarsi, Madhya Pradesh – 461111, India.`,
      }
    ]
  },
  hi: {
    heroTitle: "नियम एवं शर्तें",
    heroSub: "अंतिम अपडेट: अप्रैल 2026 · तत्काल प्रभावी",
    tocTitle: "विषय सूची",
    copy: `© ${new Date().getFullYear()} फसलसाथी। सर्वाधिकार सुरक्षित।`,
    privacyLink: "गोपनीयता नीति",
    contactLink: "हमसे संपर्क करें",
    sections: [
      {
        title: "1. शर्तों की स्वीकृति",
        content: `फसलसाथी ("प्लेटफ़ॉर्म") का उपयोग करके, आप इन नियमों और शर्तों से बंधे होने के लिए सहमत हैं। यदि आप सहमत नहीं हैं, तो आप प्लेटफ़ॉर्म का उपयोग नहीं कर सकते हैं।`,
      },
      {
        title: "2. सेवा का विवरण",
        content: `फसलसाथी एक AI-संचालित कृषि सलाहकार प्लेटफ़ॉर्म है। यह किसानों को मौसम, बाजार मूल्य, और फसल संबंधी सलाह प्रदान करता है। यह प्लेटफ़ॉर्म विशेषज्ञों की सलाह की सहायता के लिए है, उसका विकल्प नहीं।`,
      },
      {
        title: "3. उपयोगकर्ता खाते",
        content: `पूर्ण सुविधाओं तक पहुँचने के लिए आपको एक खाता पंजीकृत करना होगा। आपको सटीक जानकारी प्रदान करनी होगी और आपकी आयु कम से कम 18 वर्ष होनी चाहिए।`,
      },
      {
        title: "4. स्वीकार्य उपयोग",
        content: `आप प्लेटफ़ॉर्म का उपयोग किसी गैरकानूनी उद्देश्य के लिए, किसी को धोखा देने, या प्लेटफ़ॉर्म को नुकसान पहुंचाने वाले मैलवेयर या स्पैम भेजने के लिए नहीं करेंगे।`,
      },
      {
        title: "5. जानकारी की सटीकता",
        content: `हालांकि हम सटीक जानकारी प्रदान करने का प्रयास करते हैं, सभी डेटा "जैसा है" के आधार पर प्रदान किया जाता है। मौसम और बाजार के रुझान सांकेतिक हैं। महत्वपूर्ण निर्णय लेने से पहले विशेषज्ञों से पुष्टि करें।`,
      },
      {
        title: "6. देयता की सीमा",
        content: `फसलसाथी डेटा पर निर्भरता, फसल की विफलता, वित्तीय नुकसान, या प्लेटफ़ॉर्म की अनुपलब्धता से होने वाले किसी भी नुकसान के लिए उत्तरदायी नहीं होगा।`,
      },
      {
        title: "7. बौद्धिक संपदा",
        content: `प्लेटफ़ॉर्म पर मौजूद सभी सामग्री, डिज़ाइन और लोगो फसलसाथी की विशेष संपत्ति हैं। बिना अनुमति के इनकी प्रतिलिपि बनाना निषिद्ध है।`,
      },
      {
        title: "8. गोपनीयता",
        content: `प्लेटफ़ॉर्म का आपका उपयोग हमारी गोपनीयता नीति द्वारा भी शासित होता है। कृपया इसे पढ़ें।`,
      },
      {
        title: "9. सदस्यता और भुगतान",
        content: `सशुल्क सुविधाएं (किसान प्रो) मासिक या वार्षिक रूप से बिल की जाती हैं। सदस्यताएँ स्वचालित रूप से नवीनीकृत होती हैं जब तक कि उन्हें रद्द न किया जाए।`,
      },
      {
        title: "10. शर्तों में संशोधन",
        content: `हम किसी भी समय इन शर्तों को संशोधित करने का अधिकार सुरक्षित रखते हैं। परिवर्तन लागू होने से 14 दिन पहले हम आपको सूचित करेंगे।`,
      },
      {
        title: "11. शासी कानून",
        content: `ये शर्तें भारत के कानूनों द्वारा शासित होंगी। कोई भी विवाद मध्य प्रदेश, भारत के न्यायालयों के विशेष अधिकार क्षेत्र के अधीन होगा।`,
      },
      {
        title: "12. संपर्क",
        content: `यदि आपके पास इन नियमों और शर्तों के बारे में कोई प्रश्न हैं, तो कृपया legal@fasalsaathi.in पर संपर्क करें।`,
      }
    ]
  },
  mr: {
    heroTitle: "अटी आणि शर्ती",
    heroSub: "अंतिम अपडेट: एप्रिल २०२६ · तत्काळ लागू",
    tocTitle: "अनुक्रमणिका",
    copy: `© ${new Date().getFullYear()} फसलसाथी. सर्व हक्क राखीव.`,
    privacyLink: "गोपनीयता धोरण",
    contactLink: "संपर्क साधा",
    sections: [
      {
        title: "1. अटींची स्वीकृती",
        content: `फसलसाथी ("प्लॅटफॉर्म") वापरून, तुम्ही या अटी आणि शर्तींना बांधील राहण्यास सहमती दर्शवता. जर तुम्ही सहमत नसाल, तर तुम्ही प्लॅटफॉर्म वापरू नये.`,
      },
      {
        title: "2. सेवेचे वर्णन",
        content: `फसलसाथी हे AI-सक्षम कृषी सल्लागार प्लॅटफॉर्म आहे. हे हवामान, बाजारभाव आणि पिकांबद्दल सल्ला देते. हे प्लॅटफॉर्म तज्ञांच्या सल्ल्याला पर्याय नाही, तर मदतीसाठी आहे.`,
      },
      {
        title: "3. वापरकर्ता खाती",
        content: `पूर्ण वैशिष्ट्ये वापरण्यासाठी तुम्हाला खाते उघडावे लागेल. तुमची माहिती अचूक असावी आणि तुमचे वय किमान १८ वर्षे असावे.`,
      },
      {
        title: "4. स्वीकार्य वापर",
        content: `तुम्ही प्लॅटफॉर्मचा वापर बेकायदेशीर हेतूसाठी, फसवणूक करण्यासाठी किंवा स्पॅम पाठवण्यासाठी करणार नाही.`,
      },
      {
        title: "5. माहितीची अचूकता",
        content: `आम्ही अचूक माहिती देण्याचा प्रयत्न करतो, परंतु सर्व डेटा "जसा आहे" तसाच दिला जातो. हवामान आणि बाजारभाव अंदाजित आहेत. महत्त्वाचे निर्णय घेण्यापूर्वी तज्ञांचा सल्ला घ्या.`,
      },
      {
        title: "6. दायित्वाची मर्यादा",
        content: `फसलसाथी डेटावरील अवलंबित्व, पिकाचे नुकसान किंवा प्लॅटफॉर्म उपलब्ध नसल्यामुळे होणाऱ्या कोणत्याही नुकसानीसाठी फसलसाथी जबाबदार राहणार नाही.`,
      },
      {
        title: "7. बौद्धिक संपदा",
        content: `प्लॅटफॉर्मवरील सर्व सामग्री, डिझाईन आणि लोगो ही फसलसाथीची मालमत्ता आहे. परवानगीशिवाय कॉपी करणे निषिद्ध आहे.`,
      },
      {
        title: "8. गोपनीयता",
        content: `प्लॅटफॉर्मचा तुमचा वापर आमच्या गोपनीयता धोरणाद्वारे नियंत्रित केला जातो. कृपया ते वाचा.`,
      },
      {
        title: "9. सदस्यता आणि पेमेंट",
        content: `पेड फीचर्ससाठी (किसान प्रो) मासिक किंवा वार्षिक बिल दिले जाते. रद्द न केल्यास सदस्यत्व आपोआप रिन्यू होते.`,
      },
      {
        title: "10. अटींमधील बदल",
        content: `आम्ही कोणत्याही वेळी या अटींमध्ये बदल करण्याचा अधिकार राखून ठेवतो. बदल लागू होण्यापूर्वी १४ दिवस आधी आम्ही तुम्हाला कळवू.`,
      },
      {
        title: "11. लागू कायदा",
        content: `या अटी भारतीय कायद्यांद्वारे नियंत्रित केल्या जातील. कोणतेही वाद मध्य प्रदेश, भारताच्या न्यायालयांच्या अधिकारक्षेत्रात असतील.`,
      },
      {
        title: "12. संपर्क",
        content: `या अटी आणि शर्तींबद्दल प्रश्न असल्यास, कृपया legal@fasalsaathi.in वर संपर्क साधा.`,
      }
    ]
  },
  pa: {
    heroTitle: "ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ",
    heroSub: "ਆਖਰੀ ਅਪਡੇਟ: ਅਪ੍ਰੈਲ 2026 · ਤੁਰੰਤ ਲਾਗੂ",
    tocTitle: "ਵਿਸ਼ਾ ਸੂਚੀ",
    copy: `© ${new Date().getFullYear()} ਫਸਲਸਾਥੀ। ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।`,
    privacyLink: "ਗੋਪਨੀਯਤਾ ਨੀਤੀ",
    contactLink: "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
    sections: [
      {
        title: "1. ਸ਼ਰਤਾਂ ਦੀ ਮਨਜ਼ੂਰੀ",
        content: `ਫਸਲਸਾਥੀ ("ਪਲੇਟਫਾਰਮ") ਦੀ ਵਰਤੋਂ ਕਰਕੇ, ਤੁਸੀਂ ਇਹਨਾਂ ਨਿਯਮਾਂ ਅਤੇ ਸ਼ਰਤਾਂ ਨਾਲ ਸਹਿਮਤ ਹੋ। ਜੇਕਰ ਤੁਸੀਂ ਸਹਿਮਤ ਨਹੀਂ ਹੋ, ਤਾਂ ਤੁਸੀਂ ਇਸਦੀ ਵਰਤੋਂ ਨਹੀਂ ਕਰ ਸਕਦੇ।`,
      },
      {
        title: "2. ਸੇਵਾ ਦਾ ਵੇਰਵਾ",
        content: `ਫਸਲਸਾਥੀ ਇੱਕ AI-ਸੰਚਾਲਿਤ ਖੇਤੀ ਸਲਾਹਕਾਰ ਪਲੇਟਫਾਰਮ ਹੈ ਜੋ ਮੌਸਮ, ਮੰਡੀ ਭਾਅ, ਅਤੇ ਫਸਲ ਦੀ ਸਿਫਾਰਸ਼ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ। ਇਹ ਮਾਹਰਾਂ ਦੀ ਸਲਾਹ ਦਾ ਬਦਲ ਨਹੀਂ ਹੈ।`,
      },
      {
        title: "3. ਉਪਭੋਗਤਾ ਖਾਤੇ",
        content: `ਪੂਰੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਲਈ ਤੁਹਾਨੂੰ ਖਾਤਾ ਬਣਾਉਣਾ ਪਵੇਗਾ। ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਸਹੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ ਅਤੇ ਉਮਰ 18 ਸਾਲ ਤੋਂ ਵੱਧ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।`,
      },
      {
        title: "4. ਪ੍ਰਵਾਨਯੋਗ ਵਰਤੋਂ",
        content: `ਤੁਸੀਂ ਪਲੇਟਫਾਰਮ ਦੀ ਵਰਤੋਂ ਕਿਸੇ ਗੈਰ-ਕਾਨੂੰਨੀ ਕੰਮ, ਧੋਖਾਧੜੀ, ਜਾਂ ਵਾਇਰਸ/ਸਪੈਮ ਭੇਜਣ ਲਈ ਨਹੀਂ ਕਰੋਗੇ।`,
      },
      {
        title: "5. ਜਾਣਕਾਰੀ ਦੀ ਸ਼ੁੱਧਤਾ",
        content: `ਅਸੀਂ ਸਹੀ ਡੇਟਾ ਪ੍ਰਦਾਨ ਕਰਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰਦੇ ਹਾਂ, ਪਰ ਇਹ "ਜਿਵੇਂ ਹੈ" ਪ੍ਰਦਾਨ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਮੌਸਮ ਅਤੇ ਮੰਡੀ ਦੇ ਰੁਝਾਨ ਅਨੁਮਾਨਿਤ ਹਨ। ਵੱਡੇ ਫੈਸਲੇ ਲੈਣ ਤੋਂ ਪਹਿਲਾਂ ਮਾਹਰਾਂ ਨਾਲ ਪੁਸ਼ਟੀ ਕਰੋ।`,
      },
      {
        title: "6. ਦੇਣਦਾਰੀ ਦੀ ਸੀਮਾ",
        content: `ਫਸਲਸਾਥੀ ਡੇਟਾ 'ਤੇ ਨਿਰਭਰਤਾ, ਫਸਲ ਦੇ ਨੁਕਸਾਨ, ਜਾਂ ਪਲੇਟਫਾਰਮ ਦੇ ਬੰਦ ਹੋਣ ਕਾਰਨ ਹੋਏ ਨੁਕਸਾਨ ਲਈ ਜ਼ਿੰਮੇਵਾਰ ਨਹੀਂ ਹੋਵੇਗਾ।`,
      },
      {
        title: "7. ਬੌਧਿਕ ਸੰਪਤੀ",
        content: `ਐਪ ਵਿਚਲੀ ਸਾਰੀ ਸਮੱਗਰੀ, ਡਿਜ਼ਾਈਨ ਅਤੇ ਲੋਗੋ ਫਸਲਸਾਥੀ ਦੀ ਸੰਪਤੀ ਹਨ। ਬਿਨਾਂ ਇਜਾਜ਼ਤ ਨਕਲ ਕਰਨਾ ਮਨ੍ਹਾ ਹੈ।`,
      },
      {
        title: "8. ਗੋਪਨੀਯਤਾ",
        content: `ਪਲੇਟਫਾਰਮ ਦੀ ਵਰਤੋਂ ਸਾਡੀ ਗੋਪਨੀਯਤਾ ਨੀਤੀ ਦੇ ਅਧੀਨ ਵੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਸਨੂੰ ਪੜ੍ਹੋ।`,
      },
      {
        title: "9. ਗਾਹਕੀ ਅਤੇ ਭੁਗਤਾਨ",
        content: `ਭੁਗਤਾਨ ਵਾਲੀਆਂ ਸੇਵਾਵਾਂ (ਕਿਸਾਨ ਪ੍ਰੋ) ਦਾ ਮਹੀਨਾਵਾਰ ਜਾਂ ਸਾਲਾਨਾ ਬਿੱਲ ਆਉਂਦਾ ਹੈ। ਰੱਦ ਨਾ ਕਰਨ 'ਤੇ ਗਾਹਕੀ ਆਪਣੇ ਆਪ ਰੀਨਿਊ ਹੋ ਜਾਂਦੀ ਹੈ।`,
      },
      {
        title: "10. ਸ਼ਰਤਾਂ ਵਿੱਚ ਸੋਧ",
        content: `ਅਸੀਂ ਕਿਸੇ ਵੀ ਸਮੇਂ ਸ਼ਰਤਾਂ ਬਦਲਣ ਦਾ ਅਧਿਕਾਰ ਰੱਖਦੇ ਹਾਂ। ਅਸੀਂ ਤੁਹਾਨੂੰ 14 ਦਿਨ ਪਹਿਲਾਂ ਸੂਚਿਤ ਕਰਾਂਗੇ।`,
      },
      {
        title: "11. ਲਾਗੂ ਕਾਨੂੰਨ",
        content: `ਇਹ ਸ਼ਰਤਾਂ ਭਾਰਤੀ ਕਾਨੂੰਨ ਅਧੀਨ ਹੋਣਗੀਆਂ। ਕੋਈ ਵੀ ਵਿਵਾਦ ਮੱਧ ਪ੍ਰਦੇਸ਼ ਦੀਆਂ ਅਦਾਲਤਾਂ ਦੇ ਅਧਿਕਾਰ ਖੇਤਰ ਵਿੱਚ ਆਵੇਗਾ।`,
      },
      {
        title: "12. ਸੰਪਰਕ",
        content: `ਜੇਕਰ ਤੁਹਾਡੇ ਕੋਈ ਸਵਾਲ ਹਨ, ਤਾਂ legal@fasalsaathi.in 'ਤੇ ਸੰਪਰਕ ਕਰੋ।`,
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
export function TermsPage() {
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
        .fs-tp-wrapper {
          --tp-font-body: 'Inter', system-ui, sans-serif;
          --tp-font-display: 'Poppins', system-ui, sans-serif;
          --tp-primary: #16a34a; --tp-text-dark: #111827; --tp-text-muted: #4b5563;
          --tp-text-light: #ffffff; --tp-bg-light: #f9fafb; --tp-border: #f3f4f6;
          font-family: var(--tp-font-body); background-color: #ffffff; color: var(--tp-text-dark);
          display: flex; flex-direction: column; min-height: 100vh; overflow-x: hidden;
        }

        .fs-tp-container { max-width: 56rem; margin: 0 auto; padding: 0 1rem; width: 100%; box-sizing: border-box; }
        @media (min-width: 640px) { .fs-tp-container { padding: 0 1.5rem; } }

        /* -- ANIMATED HERO (FARMING THEME) -- */
        .fs-tp-hero { position: relative; padding-top: 8rem; padding-bottom: 4rem; background: linear-gradient(180deg, #064e3b 0%, #022c22 100%); text-align: center; overflow: hidden; }
        @media (min-width: 768px) { .fs-tp-hero { padding-top: 10rem; padding-bottom: 5rem; } }
        
        .fs-tp-hero-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }

        @keyframes sunPulse { 0% { transform: scale(1); box-shadow: 0 0 50px 20px rgba(250, 204, 21, 0.2); } 100% { transform: scale(1.05); box-shadow: 0 0 80px 40px rgba(250, 204, 21, 0.4); } }
        .fs-tp-bg-sun { position: absolute; top: 15%; right: 20%; width: 120px; height: 120px; background: #facc15; border-radius: 50%; opacity: 0.6; animation: sunPulse 5s ease-in-out infinite alternate; filter: blur(20px); }

        @keyframes floatCloud { 0% { transform: translateX(-15vw); } 100% { transform: translateX(115vw); } }
        .fs-tp-bg-cloud { position: absolute; color: rgba(255, 255, 255, 0.08); animation: floatCloud linear infinite; }
        .fs-tp-bg-cloud-1 { top: 10%; left: -20%; animation-duration: 45s; animation-delay: -10s; }
        .fs-tp-bg-cloud-2 { top: 25%; left: -20%; animation-duration: 65s; animation-delay: -35s; transform: scale(1.5); color: rgba(255, 255, 255, 0.04); }

        @keyframes waveHills { 0% { transform: translateX(0) scaleY(1); } 50% { transform: translateX(-2%) scaleY(1.05); } 100% { transform: translateX(0) scaleY(1); } }
        .fs-tp-bg-hill { position: absolute; bottom: -5%; width: 120%; border-radius: 50% 50% 0 0 / 100% 100% 0 0; animation: waveHills 10s ease-in-out infinite; }
        .fs-tp-bg-hill-1 { left: -5%; background: rgba(20, 83, 45, 0.5); z-index: 1; height: 35%; animation-duration: 12s; }
        .fs-tp-bg-hill-2 { left: -10%; background: rgba(6, 95, 70, 0.7); z-index: 2; height: 25%; animation-delay: -5s; }

        @keyframes leafFall { 0% { transform: translate(0, -50px) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translate(-150px, 100vh) rotate(720deg); opacity: 0; } }
        .fs-tp-bg-leaf { position: absolute; top: -10%; background: linear-gradient(135deg, #4ade80, #16a34a); border-radius: 50% 0 50% 0; opacity: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); animation: leafFall linear infinite; }
        .fs-tp-l-1 { left: 15%; width: 14px; height: 14px; animation-duration: 12s; animation-delay: 0s; }
        .fs-tp-l-2 { left: 40%; width: 10px; height: 10px; animation-duration: 16s; animation-delay: 3s; }
        .fs-tp-l-3 { left: 65%; width: 18px; height: 18px; animation-duration: 14s; animation-delay: 1s; background: linear-gradient(135deg, #facc15, #ca8a04); }

        .fs-tp-noise { position: absolute; inset: 0; background-image: url('https://grainy-gradients.vercel.app/noise.svg'); opacity: 0.2; mix-blend-mode: overlay; z-index: 3;}

        .fs-tp-hero-content { position: relative; z-index: 10; }
        .fs-tp-hero-icon-box { display: inline-flex; align-items: center; justify-content: center; width: 3.5rem; height: 3.5rem; background: rgba(255,255,255,0.1); border-radius: 1rem; margin-bottom: 1rem; }
        .fs-tp-h1 { font-family: var(--tp-font-display); font-size: 2.25rem; font-weight: 700; color: var(--tp-text-light); margin: 0 0 0.5rem 0; line-height: 1.2; }
        @media (min-width: 640px) { .fs-tp-h1 { font-size: 2.5rem; } }
        .fs-tp-hero-sub { color: #d1fae5; font-size: 0.875rem; margin: 0; font-weight: 400; }

        /* -- CONTENT AREA -- */
        .fs-tp-content-area { padding: 4rem 0; }

        .fs-tp-toc { background-color: var(--tp-bg-light); border: 1px solid var(--tp-border); border-radius: 1rem; padding: 1.5rem; margin-bottom: 3rem; }
        .fs-tp-toc-title { font-family: var(--tp-font-display); font-size: 0.875rem; font-weight: 600; color: var(--tp-text-dark); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1rem 0; }
        .fs-tp-toc-grid { display: grid; grid-template-columns: 1fr; gap: 0.75rem; }
        @media (min-width: 640px) { .fs-tp-toc-grid { grid-template-columns: 1fr 1fr; } }
        .fs-tp-toc-link { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.875rem; color: var(--tp-text-muted); cursor: pointer; transition: color 0.2s ease; }
        .fs-tp-toc-link:hover { color: var(--tp-primary); }
        .fs-tp-toc-link svg { flex-shrink: 0; margin-top: 0.125rem; }

        .fs-tp-prose { display: flex; flex-direction: column; gap: 2.5rem; }
        .fs-tp-section { scroll-margin-top: 6rem; }
        .fs-tp-section-title { font-family: var(--tp-font-display); font-size: 1.125rem; font-weight: 700; color: var(--tp-text-dark); margin: 0 0 0.75rem 0; }
        .fs-tp-section-text { font-size: 0.875rem; color: var(--tp-text-muted); line-height: 1.75; margin: 0; white-space: pre-line; }

        .fs-tp-footer-bar { margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--tp-border); display: flex; flex-direction: column; align-items: center; gap: 1rem; justify-content: space-between; }
        @media (min-width: 640px) { .fs-tp-footer-bar { flex-direction: row; } }
        .fs-tp-copyright { color: #9ca3af; font-size: 0.875rem; margin: 0; }
        .fs-tp-footer-links { display: flex; gap: 1rem; }
        .fs-tp-footer-link { color: var(--tp-primary); font-size: 0.875rem; text-decoration: none; transition: text-decoration 0.2s; }
        .fs-tp-footer-link:hover { text-decoration: underline; }
      `}</style>

      <div className="fs-tp-wrapper">
        <PublicNavbar />

        <main style={{ flex: 1 }}>
          {/* Animated Farming Hero */}
          <section className="fs-tp-hero">
            <div className="fs-tp-hero-bg">
              <div className="fs-tp-bg-sun" />
              <Cloud className="fs-tp-bg-cloud fs-tp-bg-cloud-1" size={160} />
              <Cloud className="fs-tp-bg-cloud fs-tp-bg-cloud-2" size={240} />
              <div className="fs-tp-bg-hill fs-tp-bg-hill-1" />
              <div className="fs-tp-bg-hill fs-tp-bg-hill-2" />
              <div className="fs-tp-bg-leaf fs-tp-l-1" />
              <div className="fs-tp-bg-leaf fs-tp-l-2" />
              <div className="fs-tp-bg-leaf fs-tp-l-3" />
              <div className="fs-tp-noise" />
            </div>

            <div className="fs-tp-container fs-tp-hero-content">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="fs-tp-hero-icon-box">
                  <FileText size={28} color="#ffffff" />
                </div>
                <h1 className="fs-tp-h1">{text.heroTitle}</h1>
                <p className="fs-tp-hero-sub">{text.heroSub}</p>
              </motion.div>
            </div>
          </section>

          {/* Content Area */}
          <section className="fs-tp-content-area">
            <div className="fs-tp-container">
              
              {/* Dynamic TOC */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fs-tp-toc">
                <h2 className="fs-tp-toc-title">{text.tocTitle}</h2>
                <div className="fs-tp-toc-grid">
                  {text.sections.map(({ title }, i) => (
                    <div key={title} onClick={() => scrollToSection(`section-${i}`)} className="fs-tp-toc-link">
                      <ChevronRight size={14} color="var(--tp-primary)" />
                      {title}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Dynamic Legal Sections */}
              <div className="fs-tp-prose">
                {text.sections.map(({ title, content }, i) => (
                  <motion.section
                    key={title}
                    id={`section-${i}`}
                    className="fs-tp-section"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.05 * (i % 5) }}
                  >
                    <h2 className="fs-tp-section-title">{title}</h2>
                    <p className="fs-tp-section-text">{content}</p>
                  </motion.section>
                ))}
              </div>

              {/* Dynamic Footer Links */}
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="fs-tp-footer-bar">
                <p className="fs-tp-copyright">{text.copy}</p>
                <div className="fs-tp-footer-links">
                  <Link to="/privacy" className="fs-tp-footer-link">{text.privacyLink}</Link>
                  <Link to="/contact" className="fs-tp-footer-link">{text.contactLink}</Link>
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