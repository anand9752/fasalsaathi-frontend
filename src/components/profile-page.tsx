import { useState, useEffect, useMemo, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { 
  User, MapPin, CreditCard, Shield, Loader2, Save, ArrowLeft, 
  Camera, Plus, Sprout, CloudRain, CheckCircle2, Star, Droplets, 
  LayoutDashboard, Pencil, Trash2, X, Moon, Sun, CalendarDays, 
  Activity, Wheat, TestTube, Thermometer, Leaf, Target, 
  ChevronDown, ChevronRight, ChevronLeft, TrendingUp, TrendingDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import hooks and API services
import { useLanguage, Language } from "../hooks/useLanguage";
import { useCurrentUser, useFarms, useCreateFarm, useDeleteFarm, useDashboardOverview } from "../services/hooks";
import { authApi, farmApi, soilTestApi } from "../services/api";
import { FarmCropCycle } from "../types/api";

type Tab = "details" | "farms" | "soil" | "subscription" | "preferences";

const emptySoilForm = {
  soil_ph: "", nitrogen: "", phosphorus: "",
  potassium: "", soil_moisture: "", temperature: "",
};

// ─── TRANSLATION DICTIONARY ────────────────────────────────────────────────
const t = {
  en: {
    title: "Account Settings", back: "Dashboard",
    tab_user: "User Details", tab_farm: "Farm Management", tab_sub: "Subscription", tab_pref: "App Preferences", tab_soil: "Soil Health",
    u_title: "Public Profile", u_desc: "Update your personal information and contact details.",
    u_name: "Full Name", u_email: "Email Address", u_phone: "Phone Number",
    u_member: "Member Since", u_status: "Account Status", u_active: "Active",
    u_area: "Total Area", u_crop: "Primary Crop", u_none: "None",
    u_save: "Save Changes", u_success: "Your profile has been updated successfully.", u_fail: "Failed to update profile.",
    f_title: "Farm Management", f_desc: "Manage your agricultural properties, modify layouts, or remove old entries.",
    f_add: "Add New Farm", f_reg: "Register New Property", f_mod: "Modify Property Details",
    f_name: "Farm Name", f_loc: "Location", f_area: "Area (Acres)", f_soil: "Soil Type", f_irr: "Irrigation Type",
    f_save: "Save New Farm", f_update: "Update Farm", f_cancel: "Cancel",
    f_empty_title: "No farms registered yet.", f_empty_desc: "Add your first farm to unlock yield predictions and insights.",
    f_acres: "Acres", f_irrigation: "Irrigation", f_soil_lbl: "Soil", f_tests: "Soil Tests", f_cycles: "Crop Cycles",
    f_confirm_del: "Are you sure you want to delete this farm? This action cannot be undone.",
    st_title: "Soil Test Records", st_desc: "Log your latest NPK and soil test results to improve AI recommendations.",
    st_ph: "Soil pH", st_n: "Nitrogen (N)", st_p: "Phosphorus (P)", st_k: "Potassium (K)", st_moist: "Soil Moisture (%)", st_temp: "Temperature (°C)",
    st_save: "Save Soil Data", st_success: "Soil test saved successfully! Dashboard updated.", st_fail: "Failed to save soil test.", st_no_farm: "Please add a farm in 'Farm Management' first.",
    s_title: "Manage Subscription", s_desc: "Upgrade your plan to unlock premium AI capabilities and maximize yield.",
    s_current: "Current Plan", s_manage: "Manage Billing", s_upgrade: "Upgrade Plan", s_mo: "/month", s_yr: "/year",
    s_monthly: "Monthly", s_yearly: "Yearly (Save 20%)", s_cancel: "Cancel Subscription", s_next_bill: "Next Billing Date",
    p_title: "App Preferences", p_desc: "Customize your FasalSaathi experience and regional settings.",
    p_lang: "Display Language", p_lang_desc: "This changes the language for AI crop recommendations, navigation, and dashboard elements globally.",
    p_theme: "Dashboard Theme", p_theme_desc: "Choose between light mode or a battery-saving dark mode.",
    p_light: "Light Mode", p_dark: "Dark Mode",
    p_apply: "Apply Preferences", p_success: "Application preferences saved successfully.", p_fail: "Failed to update preferences.",
    loading: "Fetching data...",
    soil_opts: { Loamy: "Loamy", Clay: "Clay", Sandy: "Sandy", Black: "Black Cotton" },
    irr_opts: { Drip: "Drip", Sprinkler: "Sprinkler", Flood: "Flood", Rainfed: "Rainfed" }
  },
  hi: {
    title: "खाता सेटिंग्स", back: "डैशबोर्ड",
    tab_user: "उपयोगकर्ता विवरण", tab_farm: "खेत प्रबंधन", tab_sub: "सदस्यता", tab_pref: "ऐप प्राथमिकताएं", tab_soil: "मृदा स्वास्थ्य",
    u_title: "सार्वजनिक प्रोफ़ाइल", u_desc: "अपनी व्यक्तिगत जानकारी और संपर्क विवरण अपडेट करें।",
    u_name: "पूरा नाम", u_email: "ईमेल पता", u_phone: "फोन नंबर",
    u_member: "सदस्यता दिनांक", u_status: "खाता स्थिति", u_active: "सक्रिय",
    u_area: "कुल क्षेत्र", u_crop: "प्राथमिक फसल", u_none: "कोई नहीं",
    u_save: "परिवर्तन सहेजें", u_success: "आपकी प्रोफ़ाइल सफलतापूर्वक अपडेट कर दी गई है।", u_fail: "प्रोफ़ाइल अपडेट करने में विफल।",
    f_title: "खेत प्रबंधन", f_desc: "अपनी कृषि संपत्तियों का प्रबंधन करें, या पुरानी प्रविष्टियों को हटा दें।",
    f_add: "नया खेत जोड़ें", f_reg: "नई संपत्ति पंजीकृत करें", f_mod: "संपत्ति विवरण संशोधित करें",
    f_name: "खेत का नाम", f_loc: "स्थान", f_area: "क्षेत्र (एकड़)", f_soil: "मिट्टी का प्रकार", f_irr: "सिंचाई का प्रकार",
    f_save: "नया खेत सहेजें", f_update: "खेत अपडेट करें", f_cancel: "रद्द करें",
    f_empty_title: "अभी तक कोई खेत पंजीकृत नहीं है।", f_empty_desc: "उपज की भविष्यवाणी अनलॉक करने के लिए अपना पहला खेत जोड़ें।",
    f_acres: "एकड़", f_irrigation: "सिंचाई", f_soil_lbl: "मिट्टी", f_tests: "मिट्टी परीक्षण", f_cycles: "फसल चक्र",
    f_confirm_del: "क्या आप निश्चित रूप से इस खेत को हटाना चाहते हैं?",
    st_title: "मिट्टी परीक्षण रिकॉर्ड", st_desc: "AI सिफारिशों को बेहतर बनाने के लिए अपनी नवीनतम NPK और मिट्टी परीक्षण परिणाम दर्ज करें।",
    st_ph: "मिट्टी का pH", st_n: "नाइट्रोजन (N)", st_p: "फास्फोरस (P)", st_k: "पोटेशियम (K)", st_moist: "नमी (%)", st_temp: "तापमान (°C)",
    st_save: "मिट्टी डेटा सहेजें", st_success: "मिट्टी परीक्षण सफलतापूर्वक सहेजा गया!", st_fail: "सहेजने में विफल।", st_no_farm: "कृपया पहले 'खेत प्रबंधन' में एक खेत जोड़ें।",
    s_title: "सदस्यता प्रबंधित करें", s_desc: "प्रीमियम एआई क्षमताओं को अनलॉक करने के लिए अपनी योजना को अपग्रेड करें।",
    s_current: "वर्तमान योजना", s_manage: "बिलिंग प्रबंधित करें", s_upgrade: "योजना अपग्रेड करें", s_mo: "/महीना", s_yr: "/वर्ष",
    s_monthly: "मासिक", s_yearly: "वार्षिक (20% बचाएं)", s_cancel: "सदस्यता रद्द करें", s_next_bill: "अगली बिलिंग तिथि",
    p_title: "ऐप प्राथमिकताएं", p_desc: "अपने फसलसाथी अनुभव और क्षेत्रीय सेटिंग्स को अनुकूलित करें।",
    p_lang: "प्रदर्शन भाषा", p_lang_desc: "यह विश्व स्तर पर भाषा बदलता है।",
    p_theme: "डैशबोर्ड थीम", p_theme_desc: "लाइट मोड या बैटरी बचाने वाले डार्क मोड के बीच चुनें।",
    p_light: "लाइट मोड", p_dark: "डार्क मोड",
    p_apply: "प्राथमिकताएं लागू करें", p_success: "एप्लिकेशन प्राथमिकताएं सफलतापूर्वक सहेजी गईं।", p_fail: "प्राथमिकताएं अपडेट करने में विफल।",
    loading: "डेटा लाया जा रहा है...",
    soil_opts: { Loamy: "दोमट", Clay: "चिकनी", Sandy: "बलुई", Black: "काली कपास" },
    irr_opts: { Drip: "ड्रिप", Sprinkler: "स्प्रिंकलर", Flood: "बाढ़", Rainfed: "वर्षा आधारित" }
  },
  mr: {
    title: "खाते सेटिंग्ज", back: "डॅशबोर्ड",
    tab_user: "वापरकर्ता तपशील", tab_farm: "शेती व्यवस्थापन", tab_sub: "सबस्क्रिप्शन", tab_pref: "ॲप प्राधान्ये", tab_soil: "माती आरोग्य",
    u_title: "सार्वजनिक प्रोफाईल", u_desc: "तुमची वैयक्तिक माहिती आणि संपर्क तपशील अपडेट करा.",
    u_name: "पूर्ण नाव", u_email: "ईमेल पत्ता", u_phone: "फोन नंबर",
    u_member: "सदस्यता दिनांक", u_status: "खाते स्थिती", u_active: "सक्रिय",
    u_area: "एकूण क्षेत्र", u_crop: "मुख्य पीक", u_none: "काहीही नाही",
    u_save: "बदल सेव्ह करा", u_success: "तुमचे प्रोफाईल यशस्वीरित्या अपडेट केले आहे.", u_fail: "प्रोफाईल अपडेट करण्यात अयशस्वी.",
    f_title: "शेती व्यवस्थापन", f_desc: "तुमच्या कृषी मालमत्तांचे व्यवस्थापन करा किंवा जुन्या नोंदी काढून टाका.",
    f_add: "नवीन शेत जोडा", f_reg: "नवीन मालमत्ता नोंदणीकृत करा", f_mod: "मालमत्ता तपशील सुधारा",
    f_name: "शेताचे नाव", f_loc: "स्थान", f_area: "क्षेत्र (एकर)", f_soil: "मातीचा प्रकार", f_irr: "सिंचन प्रकार",
    f_save: "नवीन शेत सेव्ह करा", f_update: "शेत अपडेट करा", f_cancel: "रद्द करा",
    f_empty_title: "अद्याप कोणत्याही शेताची नोंदणी केलेली नाही.", f_empty_desc: "उत्पन्नाचा अंदाज अनलॉक करण्यासाठी तुमचे पहिले शेत जोडा.",
    f_acres: "एकर", f_irrigation: "सिंचन", f_soil_lbl: "माती", f_tests: "माती परीक्षण", f_cycles: "पीक चक्र",
    f_confirm_del: "तुम्हाला नक्की हे शेत काढायचे आहे का?",
    st_title: "माती परीक्षण नोंदी", st_desc: "AI शिफारसी सुधारण्यासाठी तुमचे नवीनतम NPK आणि माती परीक्षण परिणाम नोंदवा.",
    st_ph: "मातीचा pH", st_n: "नायट्रोजन (N)", st_p: "फॉस्फरस (P)", st_k: "पोटॅशियम (K)", st_moist: "मातीतील ओलावा (%)", st_temp: "तापमान (°C)",
    st_save: "माती डेटा सेव्ह करा", st_success: "माती परीक्षण यशस्वीरित्या सेव्ह केले!", st_fail: "सेव्ह करण्यात अयशस्वी.", st_no_farm: "कृपया प्रथम 'शेती व्यवस्थापन' मध्ये शेत जोडा.",
    s_title: "सबस्क्रिप्शन व्यवस्थापित करा", s_desc: "प्रीमियम AI क्षमता अनलॉक करण्यासाठी तुमचा प्लॅन अपग्रेड करा.",
    s_current: "सध्याचा प्लॅन", s_manage: "बिलिंग व्यवस्थापित करा", s_upgrade: "प्लॅन अपग्रेड करा", s_mo: "/महिना", s_yr: "/वर्ष",
    s_monthly: "मासिक", s_yearly: "वार्षिक (२०% वाचवा)", s_cancel: "सबस्क्रिप्शन रद्द करा", s_next_bill: "पुढील बिलिंग तारीख",
    p_title: "ॲप प्राधान्ये", p_desc: "तुमचा फसलसाथी अनुभव सानुकूलित करा.",
    p_lang: "प्रदर्शन भाषा", p_lang_desc: "हे जागतिक स्तरावर भाषा बदलते.",
    p_theme: "डॅशबोर्ड थीम", p_theme_desc: "लाइट मोड किंवा डार्क मोड दरम्यान निवडा.",
    p_light: "लाइट मोड", p_dark: "डार्क मोड",
    p_apply: "प्राधान्ये लागू करा", p_success: "ॲप्लिकेशन प्राधान्ये यशस्वीरित्या सेव्ह केली.", p_fail: "अपडेट करण्यात अयशस्वी.",
    loading: "डेटा मिळवत आहे...",
    soil_opts: { Loamy: "पोयटा", Clay: "चिकन", Sandy: "वाळू", Black: "काळी कापूस" },
    irr_opts: { Drip: "ठिबक", Sprinkler: "तुषार", Flood: "पूर", Rainfed: "पावसावर अवलंबून" }
  },
  pa: {
    title: "ਖਾਤਾ ਸੈਟਿੰਗਾਂ", back: "ਡੈਸ਼ਬੋਰਡ",
    tab_user: "ਉਪਭੋਗਤਾ ਵੇਰਵੇ", tab_farm: "ਖੇਤ ਪ੍ਰਬੰਧਨ", tab_sub: "ਗਾਹਕੀ", tab_pref: "ਐਪ ਤਰਜੀਹਾਂ", tab_soil: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ",
    u_title: "ਜਨਤਕ ਪ੍ਰੋਫਾਈਲ", u_desc: "ਆਪਣੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਅਤੇ ਸੰਪਰਕ ਵੇਰਵੇ ਅੱਪਡੇਟ ਕਰੋ।",
    u_name: "ਪੂਰਾ ਨਾਮ", u_email: "ਈਮੇਲ ਪਤਾ", u_phone: "ਫ਼ੋਨ ਨੰਬਰ",
    u_member: "ਮੈਂਬਰਸ਼ਿਪ ਮਿਤੀ", u_status: "ਖਾਤਾ ਸਥਿਤੀ", u_active: "ਸਰਗਰਮ",
    u_area: "ਕੁੱਲ ਖੇਤਰ", u_crop: "ਮੁੱਖ ਫਸਲ", u_none: "ਕੋਈ ਨਹੀਂ",
    u_save: "ਤਬਦੀਲੀਆਂ ਸੁਰੱਖਿਅਤ ਕਰੋ", u_success: "ਤੁਹਾਡਾ ਪ੍ਰੋਫਾਈਲ ਸਫਲਤਾਪੂਰਵਕ ਅੱਪਡੇਟ ਹੋ ਗਿਆ ਹੈ।", u_fail: "ਪ੍ਰੋਫਾਈਲ ਅੱਪਡੇਟ ਕਰਨ ਵਿੱਚ ਅਸਫਲ।",
    f_title: "ਖੇਤ ਪ੍ਰਬੰਧਨ", f_desc: "ਆਪਣੀਆਂ ਖੇਤੀਬਾੜੀ ਜਾਇਦਾਦਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ, ਜਾਂ ਪੁਰਾਣੀਆਂ ਐਂਟਰੀਆਂ ਹਟਾਓ।",
    f_add: "ਨਵਾਂ ਖੇਤ ਸ਼ਾਮਲ ਕਰੋ", f_reg: "ਨਵੀਂ ਜਾਇਦਾਦ ਰਜਿਸਟਰ ਕਰੋ", f_mod: "ਜਾਇਦਾਦ ਵੇਰਵੇ ਸੋਧੋ",
    f_name: "ਖੇਤ ਦਾ ਨਾਮ", f_loc: "ਸਥਾਨ", f_area: "ਖੇਤਰ (ਏਕੜ)", f_soil: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ", f_irr: "ਸਿੰਚਾਈ ਦੀ ਕਿਸਮ",
    f_save: "ਨਵਾਂ ਖੇਤ ਸੁਰੱਖਿਅਤ ਕਰੋ", f_update: "ਖੇਤ ਅੱਪਡੇਟ ਕਰੋ", f_cancel: "ਰੱਦ ਕਰੋ",
    f_empty_title: "ਹਾਲੇ ਤੱਕ ਕੋਈ ਖੇਤ ਰਜਿਸਟਰਡ ਨਹੀਂ ਹੈ।", f_empty_desc: "ਝਾੜ ਦੀਆਂ ਭਵਿੱਖਬਾਣੀਆਂ ਨੂੰ ਅਨਲੌਕ ਕਰਨ ਲਈ ਆਪਣਾ ਪਹਿਲਾ ਖੇਤ ਸ਼ਾਮਲ ਕਰੋ।",
    f_acres: "ਏਕੜ", f_irrigation: "ਸਿੰਚਾਈ", f_soil_lbl: "ਮਿੱਟੀ", f_tests: "ਮਿੱਟੀ ਟੈਸਟ", f_cycles: "ਫਸਲ ਚੱਕਰ",
    f_confirm_del: "ਕੀ ਤੁਸੀਂ ਯਕੀਨਨ ਇਸ ਖੇਤ ਨੂੰ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
    st_title: "ਮਿੱਟੀ ਟੈਸਟ ਰਿਕਾਰਡ", st_desc: "AI ਸਿਫਾਰਸ਼ਾਂ ਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣ ਲਈ NPK ਅਤੇ ਮਿੱਟੀ ਦੇ ਟੈਸਟ ਦੇ ਨਤੀਜੇ ਦਰਜ ਕਰੋ।",
    st_ph: "ਮਿੱਟੀ ਦਾ pH", st_n: "ਨਾਈਟ੍ਰੋਜਨ (N)", st_p: "ਫਾਸਫੋਰਸ (P)", st_k: "ਪੋਟਾਸ਼ੀਅਮ (K)", st_moist: "ਨਮੀ (%)", st_temp: "ਤਾਪਮਾਨ (°C)",
    st_save: "ਡਾਟਾ ਸੁਰੱਖਿਅਤ ਕਰੋ", st_success: "ਮਿੱਟੀ ਟੈਸਟ ਸੁਰੱਖਿਅਤ ਹੋ ਗਿਆ!", st_fail: "ਸੁਰੱਖਿਅਤ ਕਰਨ ਵਿੱਚ ਅਸਫਲ।", st_no_farm: "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਇੱਕ ਖੇਤ ਸ਼ਾਮਲ ਕਰੋ।",
    s_title: "ਗਾਹਕੀ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ", s_desc: "ਪ੍ਰੀਮੀਅਮ AI ਸਮਰੱਥਾਵਾਂ ਨੂੰ ਅਨਲੌਕ ਕਰਨ ਲਈ ਆਪਣੀ ਯੋਜਨਾ ਨੂੰ ਅੱਪਗ੍ਰੇਡ ਕਰੋ।",
    s_current: "ਮੌਜੂਦਾ ਯੋਜਨਾ", s_manage: "ਬਿਲਿੰਗ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ", s_upgrade: "ਯੋਜਨਾ ਅੱਪਗ੍ਰੇਡ ਕਰੋ", s_mo: "/ਮਹੀਨਾ", s_yr: "/ਸਾਲ",
    s_monthly: "ਮਾਸਿਕ", s_yearly: "ਸਾਲਾਨਾ (20% ਬਚਾਓ)", s_cancel: "ਗਾਹਕੀ ਰੱਦ ਕਰੋ", s_next_bill: "ਅਗਲੀ ਬਿਲਿੰਗ ਮਿਤੀ",
    p_title: "ਐਪ ਤਰਜੀਹਾਂ", p_desc: "ਆਪਣੇ ਫਸਲਸਾਥੀ ਅਨੁਭਵ ਅਤੇ ਖੇਤਰੀ ਸੈਟਿੰਗਾਂ ਨੂੰ ਅਨੁਕੂਲਿਤ ਕਰੋ।",
    p_lang: "ਡਿਸਪਲੇ ਭਾਸ਼ਾ", p_lang_desc: "ਇਹ ਵਿਸ਼ਵ ਪੱਧਰ 'ਤੇ AI ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ ਅਤੇ ਡੈਸ਼ਬੋਰਡ ਤੱਤਾਂ ਲਈ ਭਾਸ਼ਾ ਬਦਲਦਾ ਹੈ।",
    p_theme: "ਡੈਸ਼ਬੋਰਡ ਥੀਮ", p_theme_desc: "ਲਾਈਟ ਮੋਡ ਜਾਂ ਡਾਰਕ ਮੋਡ ਵਿੱਚੋਂ ਚੁਣੋ।",
    p_light: "ਲਾਈਟ ਮੋਡ", p_dark: "ਡਾਰਕ ਮੋਡ",
    p_apply: "ਤਰਜੀਹਾਂ ਲਾਗੂ ਕਰੋ", p_success: "ਐਪਲੀਕੇਸ਼ਨ ਤਰਜੀਹਾਂ ਸਫਲਤਾਪੂਰਵਕ ਸੁਰੱਖਿਅਤ ਕੀਤੀਆਂ ਗਈਆਂ।", p_fail: "ਅੱਪਡੇਟ ਕਰਨ ਵਿੱਚ ਅਸਫਲ।",
    loading: "ਡਾਟਾ ਲਿਆਂਦਾ ਜਾ ਰਿਹਾ ਹੈ...",
    soil_opts: { Loamy: "ਦੋਮਟ", Clay: "ਚੀਕਨੀ", Sandy: "ਰੇਤਲੀ", Black: "ਕਾਲੀ ਕਪਾਹ" },
    irr_opts: { Drip: "ਡ੍ਰਿਪ", Sprinkler: "ਸਪ੍ਰਿੰਕਲਰ", Flood: "ਹੜ੍ਹ", Rainfed: "ਬਾਰਸ਼ ਆਧਾਰਿਤ" }
  }
};

export function ProfilePage({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const { lang } = useLanguage();
  const txt = t[lang as keyof typeof t] || t.en;

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        /* ─── DYNAMIC THEME VARIABLES ─── */
        :root {
          --prof-bg-gradient: linear-gradient(-45deg, #f8fafc, #d1fae5, #fef3c7, #f0fdf4);
          --prof-card-bg: rgba(255, 255, 255, 0.95);
          --prof-header-bg: rgba(255, 255, 255, 0.85);
          --prof-text-main: #0f172a;
          --prof-text-muted: #64748b;
          --prof-border: #e2e8f0;
          --prof-input-bg: #f8fafc;
          --prof-primary: #10b981;
          --prof-primary-dark: #059669;
          --prof-primary-light: #ecfdf5;
          --prof-shadow: rgba(0, 0, 0, 0.06);
          --prof-prem-grad: linear-gradient(135deg, #10b981 0%, #047857 100%);
          --prof-prem-bg: #ffffff;
          --prof-prem-glow: rgba(16, 185, 129, 0.15);
        }

        html.dark {
          --prof-bg-gradient: linear-gradient(-45deg, #020617, #064e3b, #451a03, #022c22);
          --prof-card-bg: rgba(15, 23, 42, 0.85);
          --prof-header-bg: rgba(15, 23, 42, 0.9);
          --prof-text-main: #f8fafc;
          --prof-text-muted: #94a3b8;
          --prof-border: #334155;
          --prof-input-bg: rgba(30, 41, 59, 0.6);
          --prof-primary: #10b981; 
          --prof-primary-dark: #34d399;
          --prof-primary-light: rgba(16, 185, 129, 0.1);
          --prof-shadow: rgba(0, 0, 0, 0.4);
          --prof-prem-grad: linear-gradient(135deg, #34d399 0%, #10b981 100%);
          --prof-prem-bg: #0f172a;
          --prof-prem-glow: rgba(16, 185, 129, 0.2);
        }

        /* ─── BASE STYLES ─── */
        .fs-prof-wrapper {
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--prof-text-main);
          min-height: 100vh;
          background: var(--prof-bg-gradient);
          background-size: 400% 400%;
          animation: gradientMesh 15s ease infinite;
          transition: background 0.3s ease;
        }

        @keyframes gradientMesh { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

        .fs-prof-header { background: var(--prof-header-bg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid var(--prof-border); padding: 1rem 1.5rem; position: sticky; top: 0; z-index: 50; transition: all 0.3s ease; }
        .fs-prof-container { max-width: 80rem; margin: 0 auto; padding: 1.5rem 1rem; display: flex; gap: 2rem; flex-direction: column; }
        @media (min-width: 768px) { .fs-prof-container { padding: 3rem 1.5rem; } }
        @media (min-width: 1024px) { .fs-prof-container { flex-direction: row; gap: 3rem; } }

        .fs-prof-title { font-family: 'Poppins', system-ui, sans-serif; font-size: 2rem; font-weight: 700; color: var(--prof-text-main); line-height: 1.2; margin-bottom: 1.5rem; letter-spacing: -0.02em; transition: color 0.3s ease; }
        @media (min-width: 768px) { .fs-prof-title { font-size: 2.25rem; margin-bottom: 2rem; } }

        /* Sidebar Navigation */
        .fs-prof-sidebar { width: 100%; display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
        .fs-prof-sidebar::-webkit-scrollbar { display: none; }
        @media (min-width: 1024px) { .fs-prof-sidebar { width: 16rem; flex-shrink: 0; flex-direction: column; overflow-x: visible; padding-bottom: 0;} }
        
        .fs-prof-nav-btn { display: flex; align-items: center; gap: 0.875rem; padding: 0.875rem 1.25rem; border-radius: 1rem; font-size: 0.95rem; font-weight: 600; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: none; background: transparent; cursor: pointer; white-space: nowrap; flex-shrink: 0; text-align: left; color: var(--prof-text-muted); font-family: inherit;}
        @media (min-width: 1024px) { .fs-prof-nav-btn { width: 100%; padding: 1rem 1.25rem; } }
        .fs-prof-nav-btn:hover { background: var(--prof-card-bg); color: var(--prof-text-main); box-shadow: 0 4px 6px -1px var(--prof-shadow); transform: translateX(4px); }
        .fs-prof-nav-btn.active { background: var(--prof-primary); color: #ffffff; box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4); transform: scale(1.02); }
        @media (min-width: 1024px) { .fs-prof-nav-btn.active { transform: translateX(6px); } }
        .fs-prof-nav-btn.active svg { color: #ffffff; }

        /* Main Content Cards */
        .fs-prof-content-area { flex: 1; min-width: 0; }
        .fs-prof-card { background: var(--prof-card-bg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 1.5rem; border: 1px solid var(--prof-border); box-shadow: 0 20px 25px -5px var(--prof-shadow), 0 0 0 1px rgba(0,0,0,0.02); overflow: hidden; min-height: 600px; transition: all 0.3s ease; }
        .fs-prof-card-header { padding: 1.5rem; border-bottom: 1px solid var(--prof-border); transition: border-color 0.3s ease; }
        @media (min-width: 768px) { .fs-prof-card-header { padding: 2.5rem 2.5rem 2rem 2.5rem; } }
        
        .fs-prof-card-title { font-family: 'Poppins', system-ui, sans-serif; font-size: 1.25rem; font-weight: 700; margin: 0; color: var(--prof-primary-dark); letter-spacing: -0.01em; transition: color 0.3s ease; }
        @media (min-width: 768px) { .fs-prof-card-title { font-size: 1.5rem; } }
        .fs-prof-card-desc { font-size: 0.9rem; color: var(--prof-text-muted); margin: 0.5rem 0 0 0; transition: color 0.3s ease; }
        .fs-prof-card-body { padding: 1.5rem; }
        @media (min-width: 768px) { .fs-prof-card-body { padding: 2.5rem; } }

        /* Forms, Inputs & Responsive Grids */
        .fs-prof-label { display: block; font-size: 0.875rem; font-weight: 600; color: var(--prof-text-main); margin-bottom: 0.5rem; transition: color 0.3s ease; }
        .fs-prof-input { width: 100%; padding: 0.875rem 1.25rem; background: var(--prof-input-bg); border: 1px solid var(--prof-border); border-radius: 1rem; font-family: inherit; font-size: 0.95rem; color: var(--prof-text-main); transition: all 0.2s ease; outline: none; box-sizing: border-box; }
        .fs-prof-input:focus { border-color: var(--prof-primary); box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); background: transparent; }
        .fs-prof-input:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .fs-prof-form-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
        @media (min-width: 768px) { .fs-prof-form-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; } .fs-prof-full-width { grid-column: span 2; } }
        @media (min-width: 1024px) { .fs-prof-form-grid-3 { grid-template-columns: repeat(3, 1fr); } }

        /* Buttons */
        .fs-prof-btn { display: inline-flex; justify-content: center; align-items: center; gap: 0.5rem; padding: 0.875rem 1.75rem; background: var(--prof-primary); color: #ffffff; border: none; border-radius: 1rem; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.3s ease; font-family: inherit; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2); }
        .fs-prof-btn-sm { padding: 0.625rem 1.25rem !important; font-size: 0.875rem !important; border-radius: 0.75rem !important; }
        
        .fs-prof-btn:hover:not(:disabled) { background: var(--prof-primary-dark); transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3); }
        .fs-prof-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }
        .fs-prof-btn.outline { background: transparent; color: var(--prof-text-main); border: 1px solid var(--prof-border); box-shadow: 0 1px 2px 0 var(--prof-shadow); }
        .fs-prof-btn.outline:hover:not(:disabled) { border-color: var(--prof-primary); color: var(--prof-primary-dark); background: var(--prof-primary-light); }
        
        .fs-prof-icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; border-radius: 0.5rem; border: none; cursor: pointer; transition: all 0.2s; background: var(--prof-input-bg); color: var(--prof-text-muted); }
        .fs-prof-icon-btn:hover { background: var(--prof-border); color: var(--prof-text-main); transform: scale(1.05); }
        .fs-prof-icon-btn.danger:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .fs-prof-icon-btn.edit:hover { background: rgba(2, 132, 199, 0.1); color: #0284c7; }

        /* Perfectly Aligned Farm Grid */
        .fs-prof-farm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 1.5rem; align-items: stretch; }
        .fs-prof-farm-item { height: 100%; padding: 1.5rem; border: 1px solid var(--prof-border); border-radius: 1.25rem; background: var(--prof-card-bg); transition: all 0.3s ease; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px -1px var(--prof-shadow); }
        .fs-prof-farm-item::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(to right, #10b981, #3b82f6); opacity: 0; transition: opacity 0.3s; }
        .fs-prof-farm-item:hover { border-color: rgba(16, 185, 129, 0.3); box-shadow: 0 15px 25px -5px var(--prof-shadow); transform: translateY(-4px); }
        .fs-prof-farm-item:hover::before { opacity: 1; }

        /* Premium Subscription Grid */
        .fs-prof-sub-toggle-wrap { display: flex; justify-content: center; margin-bottom: 2.5rem; }
        .fs-prof-sub-toggle { display: inline-flex; background: var(--prof-input-bg); border: 1px solid var(--prof-border); border-radius: 999px; padding: 0.375rem; position: relative; }
        .fs-prof-sub-toggle-btn { padding: 0.625rem 1.25rem; border-radius: 999px; font-weight: 600; font-size: 0.9rem; border: none; cursor: pointer; transition: all 0.3s ease; background: transparent; color: var(--prof-text-muted); position: relative; z-index: 2; }
        @media (min-width: 640px) { .fs-prof-sub-toggle-btn { padding: 0.75rem 1.5rem; font-size: 0.95rem; } }
        .fs-prof-sub-toggle-btn.active { color: var(--prof-text-main); }
        
        .fs-prof-price-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; align-items: stretch; }
        @media (min-width: 1024px) { .fs-prof-price-grid { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; } }
        
        .fs-prof-price-card { height: 100%; border: 1px solid var(--prof-border); border-radius: 1.5rem; padding: 2rem; display: flex; flex-direction: column; transition: all 0.3s ease; background: var(--prof-card-bg); position: relative; z-index: 1; box-shadow: 0 4px 6px -1px var(--prof-shadow); }
        
        .fs-prof-price-card.premium { transform: scale(1); border: none; background: var(--prof-prem-bg); box-shadow: 0 20px 40px -12px var(--prof-prem-glow); z-index: 10; }
        @media (min-width: 1024px) { .fs-prof-price-card.premium { transform: scale(1.05); } }
        .fs-prof-price-card.premium::before { content: ""; position: absolute; inset: -2px; border-radius: 1.6rem; background: var(--prof-prem-grad); z-index: -1; }
        .fs-prof-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--prof-prem-grad); color: white; font-size: 0.75rem; padding: 6px 16px; border-radius: 99px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; box-shadow: 0 4px 6px -1px var(--prof-prem-glow); white-space: nowrap; }

        /* Alert Boxes */
        .fs-prof-alert { padding: 1rem 1.25rem; border-radius: 1rem; margin-bottom: 2rem; font-size: 0.95rem; display: flex; align-items: center; gap: 0.75rem; font-weight: 500; }
        .fs-prof-alert.success { background: var(--prof-primary-light); color: var(--prof-primary-dark); border: 1px solid rgba(16, 185, 129, 0.3); }
        .fs-prof-alert.error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
      `}</style>


      <div className="fs-prof-wrapper">
        <div className="fs-prof-header">
          <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
            <button onClick={onBack} className="fs-prof-btn fs-prof-btn-sm outline" style={{ borderRadius: "0.75rem" }}>
              <ArrowLeft size={16} /> <span className="hidden sm:inline">{txt.back}</span>
            </button>
          </div>
        </div>

        <div className="fs-prof-container">
          <motion.aside 
            className="fs-prof-sidebar"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={itemVariants} className="fs-prof-title hidden lg:block">{txt.title}</motion.h1>
            <motion.button variants={itemVariants} onClick={() => setActiveTab("details")} className={`fs-prof-nav-btn ${activeTab === "details" ? "active" : ""}`}>
              <User size={20} /> {txt.tab_user}
            </motion.button>
            <motion.button variants={itemVariants} onClick={() => setActiveTab("farms")} className={`fs-prof-nav-btn ${activeTab === "farms" ? "active" : ""}`}>
              <MapPin size={20} /> {txt.tab_farm}
            </motion.button>
            <motion.button variants={itemVariants} onClick={() => setActiveTab("soil")} className={`fs-prof-nav-btn ${activeTab === "soil" ? "active" : ""}`}>
              <TestTube size={20} /> {txt.tab_soil}
            </motion.button>
            <motion.button variants={itemVariants} onClick={() => setActiveTab("subscription")} className={`fs-prof-nav-btn ${activeTab === "subscription" ? "active" : ""}`}>
              <CreditCard size={20} /> {txt.tab_sub}
            </motion.button>
            <motion.button variants={itemVariants} onClick={() => setActiveTab("preferences")} className={`fs-prof-nav-btn ${activeTab === "preferences" ? "active" : ""}`}>
              <Shield size={20} /> {txt.tab_pref}
            </motion.button>
          </motion.aside>

          <main className="fs-prof-content-area">
            <div className="fs-prof-card">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.99 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ height: '100%' }}
                >
                  {activeTab === "details" && <UserDetailsTab txt={txt} />}
                  {activeTab === "farms" && <FarmManagementTab txt={txt} />}
                  {activeTab === "soil" && <SoilHealthTab txt={txt} setActiveTab={setActiveTab} />}
                  {activeTab === "subscription" && <SubscriptionTab txt={txt} />}
                  {activeTab === "preferences" && <PreferencesTab txt={txt} isDark={isDark} setIsDark={setIsDark} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1: USER DETAILS 
// ─────────────────────────────────────────────────────────────────────────────
function UserDetailsTab({ txt }: { txt: any }) {
  // ... (Identical to previous User Details logic)
  const queryClient = useQueryClient();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: dashboardData, isLoading: dashLoading } = useDashboardOverview(); 
  
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  
  const [formData, setFormData] = useState({ full_name: "", phone: "", email: "" });

  useEffect(() => {
    if (user) setFormData({ full_name: user.full_name || "", phone: user.phone || "", email: user.email || "" });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true); setMsg({ type: "", text: "" });
    try {
      await authApi.updateCurrentUser({ full_name: formData.full_name, phone: formData.phone });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setMsg({ type: "success", text: txt.u_success });
    } catch (err: any) {
      setMsg({ type: "error", text: err?.response?.data?.detail || txt.u_fail });
    } finally { setIsSaving(false); }
  };

  if (userLoading || dashLoading) return <LoadingSpinner txt={txt} />;

  const totalArea = dashboardData?.farm?.area || 0;
  const primaryCrop = dashboardData?.active_crop?.crop_name || txt.u_none;

  return (
    <>
      <div className="fs-prof-card-header flex items-center justify-between">
        <div>
          <h2 className="fs-prof-card-title"><User className="text-[var(--prof-primary)]" /> {txt.u_title}</h2>
          <p className="fs-prof-card-desc">{txt.u_desc}</p>
        </div>
      </div>
      <div className="fs-prof-card-body">
        {msg.text && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`fs-prof-alert ${msg.type}`}>
            {msg.type === 'success' ? <CheckCircle2 size={20} /> : <Shield size={20} />} {msg.text}
          </motion.div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 md:p-5 rounded-2xl border bg-[var(--prof-primary-light)] border-[var(--prof-border)] shadow-sm">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-1.5" style={{ color: 'var(--prof-primary)' }}>
              <CalendarDays size={16} className="shrink-0" />
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">{txt.u_member}</p>
            </div>
            <p className="text-sm font-semibold truncate text-[var(--prof-text-main)]">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Just joined"}
            </p>
          </div>
          <div className="flex flex-col gap-1 border-l border-[var(--prof-primary)]/20 pl-4 min-w-0">
            <div className="flex items-center gap-1.5" style={{ color: 'var(--prof-primary)' }}>
              <Activity size={16} className="shrink-0" />
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">{txt.u_status}</p>
            </div>
            <p className="text-sm font-semibold flex items-center gap-1.5 truncate text-[var(--prof-text-main)]">
              <span className="w-2 h-2 rounded-full animate-pulse shrink-0 bg-[var(--prof-primary)]"></span>
              {user?.is_active ? txt.u_active : "Pending"}
            </p>
          </div>
          <div className="flex flex-col gap-1 md:border-l border-[var(--prof-primary)]/20 md:pl-4 col-span-2 sm:col-span-1 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 min-w-0">
            <div className="flex items-center gap-1.5" style={{ color: 'var(--prof-primary)' }}>
              <LayoutDashboard size={16} className="shrink-0" />
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">{txt.u_area}</p>
            </div>
            <p className="text-sm font-semibold truncate text-[var(--prof-text-main)]">
              {totalArea} {txt.f_acres}
            </p>
          </div>
          <div className="flex flex-col gap-1 border-l border-[var(--prof-primary)]/20 pl-4 col-span-2 sm:col-span-1 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 min-w-0">
            <div className="flex items-center gap-1.5" style={{ color: 'var(--prof-primary)' }}>
              <Wheat size={16} className="shrink-0" />
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">{txt.u_crop}</p>
            </div>
            <p className="text-sm font-semibold truncate text-[var(--prof-text-main)]">
              {primaryCrop}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: '40rem' }}>
          <div className="fs-prof-form-grid mb-6">
            <div className="fs-prof-full-width">
              <label className="fs-prof-label">{txt.u_name}</label>
              <input className="fs-prof-input" type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required />
            </div>
            <div>
              <label className="fs-prof-label">{txt.u_email}</label>
              <input className="fs-prof-input" type="email" value={formData.email} disabled />
            </div>
            <div>
              <label className="fs-prof-label">{txt.u_phone}</label>
              <input className="fs-prof-input" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
          <div className="pt-6 border-t" style={{ borderColor: 'var(--prof-border)'}}>
            <button type="submit" disabled={isSaving} className="fs-prof-btn w-full sm:w-auto">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} {txt.u_save}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2: FARM MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────
function FarmManagementTab({ txt }: { txt: any }) {
  // ... (Identical to previous Farm Management logic)
  const queryClient = useQueryClient();
  const { data: farms, isLoading } = useFarms();
  const createFarmMutation = useCreateFarm();
  const deleteFarmMutation = useDeleteFarm();
  
  const updateFarmMutation = useMutation({
    mutationFn: (params: { id: number, data: any }) => farmApi.updateFarm(params.id, params.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['farms'] })
  });
  
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const defaultFarm = { name: "", location: "", area: 0, soil_type: "Loamy", irrigation_type: "Drip" };
  const [farmForm, setFarmForm] = useState(defaultFarm);

  const handleEditClick = (farm: any) => {
    setFarmForm({ name: farm.name || "", location: farm.location || "", area: farm.area || 0, soil_type: farm.soil_type || "Loamy", irrigation_type: farm.irrigation_type || "Drip" });
    setEditingId(farm.id);
    setMode('edit');
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm(txt.f_confirm_del)) {
      try { await deleteFarmMutation.mutateAsync(id); } catch (err) { console.error("Failed to delete"); }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'add') {
        await createFarmMutation.mutateAsync({ ...farmForm, initial_crop_id: 1, initial_crop_season: "Kharif", initial_crop_year: new Date().getFullYear() });
      } else if (mode === 'edit' && editingId !== null) {
        await updateFarmMutation.mutateAsync({ id: editingId, data: farmForm });
      }
      setMode('list'); setFarmForm(defaultFarm); setEditingId(null);
    } catch (err) { alert("Error saving farm."); }
  };

  const isMutating = createFarmMutation.isPending || updateFarmMutation.isPending;

  return (
    <div className="flex flex-col h-full">
      <div className="fs-prof-card-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="fs-prof-card-title"><MapPin className="text-[var(--prof-primary)]" /> {txt.f_title}</h2>
          <p className="fs-prof-card-desc">{txt.f_desc}</p>
        </div>
        {mode === 'list' && (
          <button onClick={() => { setFarmForm(defaultFarm); setMode('add'); }} className="fs-prof-btn fs-prof-btn-sm mx-auto mt-3 sm:mt-0 sm:w-auto shrink-0 shadow-sm">
            <Plus size={16} /> {txt.f_add}
          </button>
        )}
      </div>
      
      <div className="fs-prof-card-body flex-1" style={{ background: 'var(--prof-input-bg)' }}>
        <AnimatePresence mode="wait">
          {mode !== 'list' && (
            <motion.form 
              key="farm-form"
              initial={{ opacity: 0, y: -20, scale: 0.98 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mb-8 bg-white dark:bg-slate-900/80 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800"
              onSubmit={handleFormSubmit} 
            >
              <div className="flex justify-between items-center mb-8 border-b pb-4 border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[var(--prof-primary-light)] text-[var(--prof-primary)]">
                    <LayoutDashboard size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--prof-text-main)]">
                    {mode === 'add' ? txt.f_reg : txt.f_mod}
                  </h3>
                </div>
                <button type="button" onClick={() => setMode('list')} className="fs-prof-icon-btn"><X size={20}/></button>
              </div>
              
              <div className="fs-prof-form-grid mb-8">
                <div>
                  <label className="fs-prof-label">{txt.f_name}</label>
                  <input className="fs-prof-input bg-slate-50 dark:bg-slate-800" required value={farmForm.name} onChange={e => setFarmForm({...farmForm, name: e.target.value})} placeholder="e.g. North Field" />
                </div>
                <div>
                  <label className="fs-prof-label">{txt.f_loc}</label>
                  <input className="fs-prof-input bg-slate-50 dark:bg-slate-800" required value={farmForm.location} onChange={e => setFarmForm({...farmForm, location: e.target.value})} placeholder="e.g. Village Name" />
                </div>
                <div>
                  <label className="fs-prof-label">{txt.f_area}</label>
                  <input className="fs-prof-input bg-slate-50 dark:bg-slate-800" type="number" step="0.1" required value={farmForm.area} onChange={e => setFarmForm({...farmForm, area: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="fs-prof-label">{txt.f_soil}</label>
                  <select className="fs-prof-select bg-slate-50 dark:bg-slate-800 fs-prof-input bg-slate-50 dark:bg-slate-800" value={farmForm.soil_type} onChange={e => setFarmForm({...farmForm, soil_type: e.target.value})}>
                    <option value="Loamy">{txt.soil_opts.Loamy}</option><option value="Clay">{txt.soil_opts.Clay}</option><option value="Sandy">{txt.soil_opts.Sandy}</option><option value="Black">{txt.soil_opts.Black}</option>
                  </select>
                </div>
                <div className="fs-prof-full-width ">
                  <label className="fs-prof-label">{txt.f_irr}</label>
                  <select className="fs-prof-select bg-slate-50 dark:bg-slate-800 fs-prof-input bg-slate-50 dark:bg-slate-800" value={farmForm.irrigation_type} onChange={e => setFarmForm({...farmForm, irrigation_type: e.target.value})}>
                    <option value="Drip">{txt.irr_opts.Drip}</option><option value="Sprinkler">{txt.irr_opts.Sprinkler}</option><option value="Flood">{txt.irr_opts.Flood}</option><option value="Rainfed">{txt.irr_opts.Rainfed}</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" disabled={isMutating} className="fs-prof-btn w-full sm:w-auto">
                  {isMutating ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} 
                  {mode === 'add' ? txt.f_save : txt.f_update}
                </button>
                <button type="button" onClick={() => setMode('list')} className="fs-prof-btn outline w-full sm:w-auto">{txt.f_cancel}</button>
              </div>
            </motion.form>
          )}

          {isLoading && mode === 'list' && (
            <LoadingSpinner key="spinner" txt={txt} />
          )}

          {!isLoading && mode === 'list' && (!farms || farms.length === 0) && (
            <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center justify-center py-16 text-center text-[var(--prof-text-muted)] border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900/50">
              <div className="w-24 h-24 bg-[var(--prof-primary-light)] rounded-full flex items-center justify-center mb-6">
                <LayoutDashboard size={40} className="text-[var(--prof-primary)]" />
              </div>
              <p className="text-xl font-bold mb-2 text-[var(--prof-text-main)]">{txt.f_empty_title}</p>
              <p className="text-sm max-w-sm mb-8">{txt.f_empty_desc}</p>
              <button onClick={() => { setFarmForm(defaultFarm); setMode('add'); }} className="fs-prof-btn">
                <Plus size={18} /> {txt.f_add}
              </button>
            </motion.div>
          )}

          {!isLoading && mode === 'list' && farms && farms.length > 0 && (
            <motion.div layout key="grid" className="fs-prof-farm-grid">
              <AnimatePresence>
                {(farms || []).map((farm: any) => (
                  <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} key={farm.id} className="fs-prof-farm-item">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3 min-w-0 pr-4">
                        <div className="p-3 rounded-xl shrink-0 bg-[var(--prof-primary-light)] text-[var(--prof-primary)]">
                          <MapPin size={24} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold truncate text-[var(--prof-text-main)]">{farm.name || "Unnamed Farm"}</h3>
                          <p className="text-sm truncate text-[var(--prof-text-muted)]">{farm.location || "Unknown Location"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                         <button onClick={() => handleEditClick(farm)} className="fs-prof-icon-btn edit"><Pencil size={16}/></button>
                         <button onClick={() => handleDeleteClick(farm.id)} disabled={deleteFarmMutation.isPending} className="fs-prof-icon-btn danger">
                            {deleteFarmMutation.isPending ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16}/>}
                         </button>
                      </div>
                    </div>
                    <div className="flex-1"></div>
                    <div className="w-full">
                      <div className="space-y-3 pt-5 border-t p-3 border-[var(--prof-border)] text-[var(--prof-text-muted)]">
                        <div className="flex items-center text-sm">
                          <Sprout size={18} className="text-[var(--prof-primary)] mr-3 shrink-0"/> 
                          <span className="font-medium mr-1 truncate text-[var(--prof-text-main)]">{farm.area || 0}</span> {txt.f_acres}
                        </div>
                        <div className="flex items-center text-sm mt-4">
                          <Droplets size={18} className="text-blue-500 mr-3 shrink-0"/> 
                          <span className="font-medium mr-1 truncate text-[var(--prof-text-main)]">{txt.irr_opts[farm.irrigation_type as keyof typeof txt.irr_opts] || farm.irrigation_type || "N/A"}</span> {txt.f_irrigation}
                        </div>
                        <div className="flex items-center text-sm mt-4 mb-4">
                          <LayoutDashboard size={18} className="text-amber-500 mr-3 shrink-0"/> 
                          <span className="font-medium mr-1 truncate text-[var(--prof-text-main)]">{txt.soil_opts[farm.soil_type as keyof typeof txt.soil_opts] || farm.soil_type || "N/A"}</span> {txt.f_soil_lbl}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-5 pt-4 border-t text-xs font-semibold uppercase tracking-wider border-[var(--prof-border)] text-[var(--prof-text-muted)]">
                        <span className="flex items-center gap-1.5"><Shield size={14}/> {farm.soil_tests?.length || 0} {txt.f_tests}</span>
                        <span className="flex items-center gap-1.5"><CloudRain size={14}/> {farm.crop_cycles?.length || 0} {txt.f_cycles}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 3: SOIL HEALTH (Context-Aware Redesign)
// ─────────────────────────────────────────────────────────────────────────────
function SoilHealthTab({ txt, setActiveTab }: { txt: any, setActiveTab: (t: Tab) => void }) {
  const queryClient = useQueryClient();
  const { data: farms, isLoading: farmsLoading } = useFarms();
  
  const [selectedFarmId, setSelectedFarmId] = useState<number | "">("");
  
  // Set default farm safely when loaded
  useEffect(() => {
    if (farms && farms.length > 0 && selectedFarmId === "") {
      setSelectedFarmId(farms[0].id);
    }
  }, [farms, selectedFarmId]);

  const activeFarm = useMemo(() => (farms || []).find(f => f.id === Number(selectedFarmId)), [farms, selectedFarmId]);
  const activeCrops = useMemo(() => (activeFarm?.crop_cycles || []).filter(c => c.status === "active"), [activeFarm]);

  const [soilForm, setSoilForm] = useState({
    soil_ph: "", nitrogen: "", phosphorus: "", potassium: "", soil_moisture: "", temperature: ""
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // ─── ADDED: Pre-fill form when a new farm is selected ───
  useEffect(() => {
    if (activeFarm) {
      const getLatestSoil = async () => {
        try {
          const test = await soilTestApi.getLatestByFarm(activeFarm.id);
          if (test) {
            setSoilForm({
              soil_ph: String(test.soil_ph ?? ""),
              nitrogen: String(test.nitrogen ?? ""),
              phosphorus: String(test.phosphorus ?? ""),
              potassium: String(test.potassium ?? ""),
              soil_moisture: String(test.soil_moisture ?? ""),
              temperature: String(test.temperature ?? ""),
            });
          }
        } catch {
          // If no test found, fall back to farm default or empty
          const fallback = activeFarm.soil_tests?.[0];
          setSoilForm({
            soil_ph: String(fallback?.soil_ph ?? ""),
            nitrogen: String(fallback?.nitrogen ?? ""),
            phosphorus: String(fallback?.phosphorus ?? ""),
            potassium: String(fallback?.potassium ?? ""),
            soil_moisture: String(fallback?.soil_moisture ?? ""),
            temperature: String(fallback?.temperature ?? ""),
          });
        }
      };
      getLatestSoil();
    }
  }, [activeFarm]);

  const submitSoilTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFarm) {
      setMsg({ type: "error", text: txt.st_no_farm });
      return;
    }

    const payload = {
      farm_id: activeFarm.id,
      soil_ph: Number(soilForm.soil_ph),
      nitrogen: Number(soilForm.nitrogen),
      phosphorus: Number(soilForm.phosphorus),
      potassium: Number(soilForm.potassium),
      soil_moisture: Number(soilForm.soil_moisture),
      temperature: Number(soilForm.temperature),
    };

    if (Object.values(payload).some((value) => Number.isNaN(value))) {
      setMsg({ type: "error", text: "Please ensure all values are valid numbers." });
      return;
    }

    setIsSaving(true); setMsg({ type: "", text: "" });
    try {
      await soilTestApi.create(payload);
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      setMsg({ type: "success", text: txt.st_success });
    } catch {
      setMsg({ type: "error", text: txt.st_fail });
    } finally {
      setIsSaving(false);
    }
  };

  if (farmsLoading) return <LoadingSpinner txt={txt} />;

  if (!farms || farms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-[var(--prof-text-muted)]">
        <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
          <TestTube size={40} className="text-red-400 dark:text-red-500" />
        </div>
        <p className="text-xl font-bold mb-2 text-[var(--prof-text-main)]">No Farm Detected</p>
        <p className="text-sm max-w-sm mb-6">{txt.st_no_farm}</p>
        <button onClick={() => setActiveTab("farms")} className="fs-prof-btn">
          Go to Farm Management
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="fs-prof-card-header flex items-center justify-between">
        <div>
          <h2 className="fs-prof-card-title flex items-center gap-2">
            <TestTube className="text-[var(--prof-primary)]" /> {txt.st_title}
          </h2>
          <p className="fs-prof-card-desc">{txt.st_desc}</p>
        </div>
      </div>
      
      <div className="fs-prof-card-body" style={{ background: 'var(--prof-input-bg)', minHeight: '100%' }}>
        {msg.text && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`fs-prof-alert ${msg.type}`}>
            {msg.type === 'success' ? <CheckCircle2 size={20} /> : <Shield size={20} />} {msg.text}
          </motion.div>
        )}

        <div className="max-w-4xl flex flex-col gap-6">
          
          {/* STEP 1: Select Farm */}
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <label className="fs-prof-label mb-3 text-lg ">1. Select Farm for Testing</label>
            <select 
              className="fs-prof-select ml-3 mt-3 border p-3 rounded-xl text-lg font-bold bg-slate-50 dark:bg-slate-800 fs-prof-input bg-slate-50 dark:bg-slate-800" 
              value={selectedFarmId} 
              onChange={(e) => setSelectedFarmId(Number(e.target.value))}
            >
              {(farms || []).map(f => (
                <option key={f.id} value={f.id}>{f.name} - {f.location}</option>
              ))}
            </select>
          </div>

          {/* STEP 2: Crop Context Box */}
          <div className="fs-prof-input bg-slate-50 dark:bg-slate-800 bg-[var(--prof-primary-light)] p-6 rounded-xl border border-[var(--prof-primary-border)]">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="min-w-0 p-2">
                <label className="fs-prof-label text-[var(--prof-primary)] mb-1">Target Crop / Context</label>
                <p className="text-sm font-medium opacity-80 text-[var(--prof-text-main)]">
                  Updating NPK values directly affects AI yield and fertilizer recommendations.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {activeCrops && activeCrops.length > 0 ? (
                  <>
                    <span className="text-s font-bold uppercase tracking-wider text-[var(--prof-primary)] ">Currently Growing:</span>
                    {(activeCrops || []).map(c => (
                      <span key={c.id} className="bg-white text-[var(--prof-primary)] px-3 py-1.5 rounded-lg border border-[var(--prof-primary-border)] font-bold shadow-sm flex items-center gap-1.5 max-w-[150px] truncate">
                        <Leaf size={14} className="shrink-0"/> <span className="truncate">{c.crop_name_hindi || c.crop_name}</span>
                      </span>
                    ))}
                  </>
                ) : (
                  <span className="text-sm font-semibold text-[var(--prof-primary)]/80">No active crops detected.</span>
                )}
                <button onClick={() => setActiveTab("farms")} className="text-sm font-bold text-[var(--prof-primary)] underline underline-offset-2 ml-2 hover:opacity-80">
                  Manage Crops
                </button>
              </div>
            </div>
          </div>

          {/* STEP 3: Actual Form */}
          <form onSubmit={submitSoilTest} className="bg-white dark:bg-slate-900/50 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 mt-4">
            <div className="mb-6 border-b pb-4 ml-4 border-[var(--prof-border)]">
              <label className="fs-prof-label text-lg">
                2. Update Soil Metrics for {activeFarm?.name || "Farm"}
              </label>
              <p className="text-sm text-[var(--prof-text-muted)]">Previous values are pre-filled below if they exist.</p>
            </div>

            <div className="fs-prof-form-grid fs-prof-form-grid-3 mb-8">
              <div className="bg-vibrant-ocean p-4 rounded-xl">
                <label className="fs-prof-label flex items-center gap-2 mb-2"><Droplets size={16} className="text-vibrant-ocean"/> {txt.st_moist}</label>
                <input type="number" step="any" className="fs-prof-input bg-white dark:bg-slate-800 border-0 shadow-sm" required value={soilForm.soil_moisture} onChange={e => setSoilForm({...soilForm, soil_moisture: e.target.value})} placeholder="e.g. 45" />
              </div>
              <div className="bg-vibrant-sun p-4 rounded-xl">
                <label className="fs-prof-label flex items-center gap-2 mb-2"><Thermometer size={16} className="text-vibrant-sun"/> {txt.st_temp}</label>
                <input type="number" step="any" className="fs-prof-input bg-white dark:bg-slate-800 border-0 shadow-sm" required value={soilForm.temperature} onChange={e => setSoilForm({...soilForm, temperature: e.target.value})} placeholder="e.g. 24.5" />
              </div>
              <div className="bg-vibrant-amethyst p-4 rounded-xl">
                <label className="fs-prof-label flex items-center gap-2 mb-2"><Activity size={16} className="text-vibrant-amethyst"/> {txt.st_ph}</label>
                <input type="number" step="any" className="fs-prof-input bg-white dark:bg-slate-800 border-0 shadow-sm" required value={soilForm.soil_ph} onChange={e => setSoilForm({...soilForm, soil_ph: e.target.value})} placeholder="e.g. 6.5" />
              </div>
              
              <div className="p-4 mx-2 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <label className="fs-prof-label flex items-center gap-2 text-blue-600 mb-2">Nitrogen (N)</label>
                <input type="number" step="any" className="fs-prof-input bg-white dark:bg-slate-900" required value={soilForm.nitrogen} onChange={e => setSoilForm({...soilForm, nitrogen: e.target.value})} placeholder="mg/kg" />
              </div>
              <div className="p-4 mx-2 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <label className="fs-prof-label flex items-center gap-2 text-amber-500 mb-2">Phosphorus (P)</label>
                <input type="number" step="any" className="fs-prof-input bg-white dark:bg-slate-900" required value={soilForm.phosphorus} onChange={e => setSoilForm({...soilForm, phosphorus: e.target.value})} placeholder="mg/kg" />
              </div>
              <div className="p-4 mx-2 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <label className="fs-prof-label flex items-center gap-2 text-red-500 mb-2">Potassium (K)</label>
                <input type="number" step="any" className="fs-prof-input bg-white dark:bg-slate-900" required value={soilForm.potassium} onChange={e => setSoilForm({...soilForm, potassium: e.target.value})} placeholder="mg/kg" />
              </div>
            </div>

            <div className="flex flex-col sm:items-center sm:justify-between gap-4 pt-6 border-t" style={{ borderColor: 'var(--prof-border)' }}>
              <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--prof-text-muted)' }}>
                Saving this securely updates your Dashboard analytics and AI predictions for <strong>{activeFarm?.name || "the selected farm"}</strong>.
              </p>
              <button type="submit" disabled={isSaving} className="fs-prof-btn  sm:w-auto shrink-0 shadow-lg shadow-[#03402d]/20">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {txt.st_save}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 4: SUBSCRIPTION
// ─────────────────────────────────────────────────────────────────────────────
function SubscriptionTab({ txt }: { txt: any }) {
  const [cycle, setCycle] = useState<'mo'|'yr'>('mo');
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();

  const plans = [
    { name: "Kisan Basic", priceMo: "₹0", priceYr: "₹0", features: ["1 Farm Profile", "Basic Weather", "Current Market Prices"] },
    { name: "Kisan Pro", priceMo: "₹99", priceYr: "₹990", highlight: true, features: ["5 Farm Profiles", "AI Crop Tracking", "Disease Alerts", "Yield Prediction"] },
    { name: "Enterprise", priceMo: "Custom", priceYr: "Custom", features: ["Unlimited Farms", "API Access", "Dedicated Support", "Custom Reports"] }
  ];

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (planName: string, amountStr: string) => {
    if (amountStr === "Custom") {
      navigate('/contact');
      return;
    }

    const numericAmount = parseInt(amountStr.replace(/[^0-9]/g, ''));
    if (!numericAmount || numericAmount === 0) {
      alert("You are already on the free plan!");
      return;
    }

    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert('Payment system failed to load. Please check your internet connection.');
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_0yx0AGbEbJaWtH',
      amount: (numericAmount * 100).toString(), 
      currency: 'INR',
      name: 'FasalSaathi',
      description: `${planName} Subscription (${cycle === 'mo' ? 'Monthly' : 'Yearly'})`,
      image: 'https://i.imgur.com/3g7nmJC.png', 
      handler: function (response: any) {
        alert(`Payment Successful! Your Payment ID is: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: user?.full_name || '',
        email: user?.email || '',
        contact: user?.phone || ''
      },
      theme: {
        color: '#03402d' 
      }
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return (
    <>
      <div className="fs-prof-card-header text-center">
        <h2 className="fs-prof-card-title text-2xl md:text-3xl mb-2 justify-center">{txt.s_title}</h2>
        <p className="fs-prof-card-desc max-w-2xl mx-auto">{txt.s_desc}</p>
      </div>
      <div className="fs-prof-card-body" style={{ background: 'var(--prof-input-bg)' }}>
        
        <div className="fs-prof-sub-toggle-wrap">
          <div className="fs-prof-sub-toggle shadow-inner w-full max-w-sm flex">
            <button onClick={() => setCycle('mo')} className={`flex-1 fs-prof-sub-toggle-btn ${cycle === 'mo' ? 'active shadow-md' : ''}`} style={{ backgroundColor: cycle === 'mo' ? 'var(--prof-card-bg)' : 'transparent' }}>
              {txt.s_monthly}
            </button>
            <button onClick={() => setCycle('yr')} className={`flex-1 fs-prof-sub-toggle-btn ${cycle === 'yr' ? 'active shadow-md' : ''}`} style={{ backgroundColor: cycle === 'yr' ? 'var(--prof-card-bg)' : 'transparent' }}>
              {txt.s_yearly}
            </button>
          </div>
        </div>

        <div className="fs-prof-price-grid">
          {(plans || []).map((p, i) => (
            <div key={i} className={`fs-prof-price-card ${p.highlight ? 'premium' : ''}`}>
              {p.highlight && <div className="fs-prof-badge"><Star size={12} className="mr-1 inline-block mb-0.5"/> {txt.s_current}</div>}
              
              <h3 className="mb-2 text-lg md:text-xl font-semibold" style={{ color: p.highlight ? 'var(--prof-primary-dark)' : 'var(--prof-text-main)' }}>{p.name}</h3>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl md:text-5xl font-bold leading-none" style={{ fontFamily: 'var(--prof-font-display)', color: 'var(--prof-text-main)' }}>
                  {cycle === 'mo' ? p.priceMo : p.priceYr}
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--prof-text-muted)' }}>
                  {p.priceMo === "Custom" ? "" : cycle === 'mo' ? txt.s_mo : txt.s_yr}
                </span>
              </div>

              <div className="flex-1 border-t pt-6 mb-6" style={{ borderColor: 'var(--prof-border)' }}>
                <ul className="flex flex-col gap-4 m-0 p-0 list-none">
                  {(p.features || []).map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm font-medium" style={{ color: 'var(--prof-text-main)' }}>
                      <CheckCircle2 size={18} color="var(--prof-primary)" className="shrink-0 mt-0.5" /> 
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => handlePayment(p.name, cycle === 'mo' ? p.priceMo : p.priceYr)}
                className={`fs-prof-btn ${!p.highlight ? 'outline' : ''} w-full`}
              >
                {p.priceMo === "Custom" ? "Contact Sales" : (p.highlight ? txt.s_manage : txt.s_upgrade)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 5: PREFERENCES
// ─────────────────────────────────────────────────────────────────────────────
function PreferencesTab({ txt, isDark, setIsDark }: { txt: any, isDark: boolean, setIsDark: (val: boolean) => void }) {
  const queryClient = useQueryClient();
  const { lang, changeLanguage } = useLanguage();
  const { data: user } = useCurrentUser();
  
  const [localLang, setLocalLang] = useState<Language>(lang);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  
  useEffect(() => { setLocalLang(lang); }, [lang]);

  const toggleTheme = (dark: boolean) => {
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const savePref = async () => {
    setIsSaving(true); setMsg({ type: "", text: "" });
    try {
      await authApi.updateCurrentUser({ language_preference: localLang });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      changeLanguage(localLang);
      setMsg({ type: "success", text: txt.p_success });
    } catch { 
      setMsg({ type: "error", text: txt.p_fail }); 
    } finally { setIsSaving(false); }
  };

  return (
    <>
      <div className="fs-prof-card-header">
        <h2 className="fs-prof-card-title">{txt.p_title}</h2>
        <p className="fs-prof-card-desc">{txt.p_desc}</p>
      </div>
      <div className="fs-prof-card-body">
        {msg.text && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`fs-prof-alert ${msg.type}`}>
            {msg.type === 'success' ? <CheckCircle2 size={20} /> : <Shield size={20} />} {msg.text}
          </motion.div>
        )}
        <div className="max-w-2xl flex flex-col gap-8">
          
          {/* THEME SWITCHER */}
          <div>
            <label className="fs-prof-label text-base">{txt.p_theme}</label>
            <p className="text-sm mb-4" style={{ color: 'var(--prof-text-muted)' }}>{txt.p_theme_desc}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => toggleTheme(false)}
                className={`flex-1 flex sm:flex-col items-center justify-center gap-3 sm:gap-0 p-4 rounded-xl border-2 transition-all ${!isDark ? 'border-[var(--prof-primary)] bg-[var(--prof-primary-light)] text-[var(--prof-primary)]' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-emerald-300'}`}
              >
                <Sun size={24} className="sm:mb-2" />
                <span className="font-semibold text-sm">{txt.p_light}</span>
              </button>
              <button 
                onClick={() => toggleTheme(true)}
                className={`flex-1 flex sm:flex-col items-center justify-center gap-3 sm:gap-0 p-4 rounded-xl border-2 transition-all ${isDark ? 'border-[var(--prof-primary)] bg-slate-800 text-[var(--prof-primary)]' : 'border-slate-200 text-slate-500 hover:border-emerald-300'}`}
              >
                <Moon size={24} className="sm:mb-2" />
                <span className="font-semibold text-sm">{txt.p_dark}</span>
              </button>
            </div>
          </div>

          <div className="border-t pt-8 " style={{ borderColor: 'var(--prof-border)' }}>
            <label className="fs-prof-label text-base mt-4">{txt.p_lang}</label>
            <p className="text-sm mb-4" style={{ color: 'var(--prof-text-muted)' }}>{txt.p_lang_desc}</p>
            <select 
              className="fs-prof-select fs-prof-input bg-slate-50 dark:bg-slate-800" 
              value={localLang} 
              onChange={(e) => setLocalLang(e.target.value as Language)}
            >
              <option value="en">English (US)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>
          
          <div className="border-t pt-6 mt-2" style={{ borderColor: 'var(--prof-border)' }}>
            <button onClick={savePref} disabled={isSaving || localLang === user?.language_preference} className="fs-prof-btn w-full sm:w-auto">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} {txt.p_apply}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function LoadingSpinner({ txt }: { txt: any }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col justify-center items-center h-64 text-[var(--prof-primary)]">
      <Loader2 className="animate-spin w-10 h-10 mb-4" />
      <span className="text-sm font-medium" style={{color: 'var(--prof-text-muted)'}}>{txt?.loading || "Fetching data..."}</span>
    </motion.div>
  );
}