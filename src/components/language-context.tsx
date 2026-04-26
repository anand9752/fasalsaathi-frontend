import { createContext, useContext, useState, ReactNode } from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from "./ui/button";

type Language = 'hi' | 'en' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  speak: (text: string) => void;
}

const translations = {
  hi: {
    // Navigation
    'dashboard': 'डैशबोर्ड',
    'my-farm': 'मेरा खेत',
    'calendar': 'कैलेंडर',
    'market-prices': 'बाजार भाव',
    'analyze-plant': 'पौधा विश्लेषण',
    'ask-saathi': 'साथी से पूछें',
    'crop-recommendations': 'फसल सुझाव',
    'inventory': 'इन्वेंटरी',
    'yield-prediction': 'उत्पादन पूर्वानुमान',
    'more': 'और विकल्प',
    'plant-analysis': 'पौधा विश्लेषण',
    
    // Dashboard
    'good-evening': 'शुभ संध्या',
    'tonight-priority': 'आज रात की प्राथमिकता',
    'live-farm-vitals': 'लाइव फार्म स्वास्थ्य',
    'yield-forecast': 'उत्पादन पूर्वानुमान',
    'market-price-alert': 'बाजार भाव अलर्ट',
    'soil-moisture': 'मिट्टी में नमी',
    'soil-ph': 'मिट्टी pH',
    'high-priority': 'उच्च प्राथमिकता',
    'good-condition': 'अच्छी स्थिति',
    'ideal-level': 'आदर्श स्तर',
    'dashboard-layout-variations': 'डैशबोर्ड लेआउट विकल्प',
    'choose-preferred-layout': 'अपना पसंदीदा डैशबोर्ड लेआउट चुनें',
    'balanced-grid': 'संतुलित ग्रिड',
    'feed-style': 'फीड स्टाइल',
    'data-centric': 'डेटा केंद्रित',
    'active': 'सक्रिय',
    
    // Yield Prediction
    'soybean-final-yield-forecast': 'सोयाबीन अंतिम उत्पादन पूर्वानुमान',
    'kharif-2025': 'खरीफ 2025',
    'most-likely-outcome': 'सबसे संभावित परिणाम',
    'quintal-per-acre': 'क्विंटल प्रति एकड़',
    'crop-growth-timeline': 'फसल विकास समयसीमा',
    'sowing-date': 'बुआई तिथि',
    'estimated-harvest': 'अनुमानित कटाई',
    'today': 'आज',
    'germination': 'अंकुरण',
    'flowering': 'फूल आना',
    'pod-filling': 'फली भरना',
    'influencing-factors': 'प्रभावशाली कारक',
    'weather-forecast': 'मौसम पूर्वानुमान',
    'favorable': 'अनुकूल',
    'consistent-rainfall-beneficial': 'निरंतर वर्षा लाभकारी रही है, लेकिन अंतिम उत्पादन साफ आसमान पर निर्भर करेगा',
    'soil-moisture-optimal': 'मिट्टी में नमी फली भरने के अंतिम चरण के लिए पर्याप्त है',
    'pest-disease-low-risk': 'सक्रिय निगरानी ने बड़े संक्रमण को रोका है',
    'yield-forecast-summary': 'आपकी सोयाबीन फसल का अंतिम उत्पादन पूर्वानुमान सबसे संभावित रूप से 17.2 क्विंटल प्रति एकड़ होगा',
    
    // Common Actions
    'view-details': 'विस्तार देखें',
    'close': 'बंद करें',
    'save': 'सेव करें',
    'cancel': 'रद्द करें',
    'add': 'जोड़ें',
    'edit': 'संपादित करें',
    'delete': 'हटाएं',
    'search': 'खोजें',
    'filter': 'फिल्टर',
    'sort-by': 'इसके अनुसार क्रमबद्ध करें',
    'back': 'वापस',
    'next': 'आगे',
    'previous': 'पिछला',
    'submit': 'जमा करें',
    'add-new-item': 'नया आइटम जोड़ें',
    'start-inspection': 'जांच शुरू करें',
    'remind-later': 'बाद में याद दिलाएं',
    'full-report': 'पूरी रिपोर्ट देखें',
    'detailed-forecast': 'विस्तृत पूर्वानुमान देखें',
    'detailed-chart': 'विस्तृत चार्ट',
    'set-price-alert': 'प्राइस अलर्ट सेट करें',
    
    // Status & Conditions
    'high': 'उच्च',
    'medium': 'मध्यम',
    'low': 'कम',
    'optimal': 'आदर्श',
    'warning': 'चेतावनी',
    'positive': 'सकारात्मक',
    'neutral': 'तटस्थ',
    'excellent': 'उत्कृष्ट',
    'good': 'अच्छा',
    'fair': 'मध्यम',
    
    // Units & Measurements
    'per-acre': 'प्रति एकड़',
    'per-quintal': 'प्रति क्विंटल',
    'kg': 'किलोग्राम',
    'bags': 'बैग',
    'liters': 'लीटर',
    'pieces': 'पीस',
    'tons': 'टन',
    
    // Time & Dates
    'evening': 'शाम',
    'morning': 'सुबह',
    'afternoon': 'दोपहर',
    'night': 'रात',
    'today': 'आज',
    'yesterday': 'कल',
    'tomorrow': 'कल',
    'this-week': 'इस सप्ताह',
    'last-week': 'पिछले सप्ताह',
    'this-month': 'इस महीने',
    'last-month': 'पिछले महीने',
    
    // Farm & Agriculture
    'soybean': 'सोयाबीन',
    'wheat': 'गेहूं',
    'rice': 'चावल',
    'corn': 'मक्का',
    'field-a-b': 'खेत A & B',
    'itarsi-mandi': 'इटारसी मंडी',
    'itarsi-mp': 'इटारसी, मध्य प्रदेश',
    
    // Footer
    'copyright-text': '© 2024 FasalSaathi - भारतीय कृषि के लिए AI-संचालित फार्मिंग सलाहकार',
    'tagline': 'एक समय में एक फसल के साथ किसानों को प्रौद्योगिकी से सशक्त बनाना',
    
    // Profile & Settings
    'profile': 'प्रोफ़ाइल',
    'settings': 'सेटिंग्स',
    'logout': 'लॉग आउट',
  },
  
  en: {
    // Navigation
    'dashboard': 'Dashboard',
    'my-farm': 'My Farm',
    'calendar': 'Calendar',
    'market-prices': 'Market Prices',
    'analyze-plant': 'Analyze Plant',
    'ask-saathi': 'Ask Saathi',
    'crop-recommendations': 'Crop Recommendations',
    'inventory': 'Inventory',
    'yield-prediction': 'Yield Prediction',
    'more': 'More',
    'plant-analysis': 'Plant Analysis',
    
    // Dashboard
    'good-evening': 'Good Evening',
    'tonight-priority': "Tonight's Top Priority",
    'live-farm-vitals': 'Live Farm Vitals',
    'yield-forecast': 'Yield Forecast',
    'market-price-alert': 'Market Price Alert',
    'soil-moisture': 'Soil Moisture',
    'soil-ph': 'Soil pH',
    'high-priority': 'High Priority',
    'good-condition': 'Good Condition',
    'ideal-level': 'Ideal Level',
    'dashboard-layout-variations': 'Dashboard Layout Variations',
    'choose-preferred-layout': 'Choose your preferred dashboard layout',
    'balanced-grid': 'Balanced Grid',
    'feed-style': 'Feed Style',
    'data-centric': 'Data-Centric',
    'active': 'Active',
    
    // Yield Prediction
    'soybean-final-yield-forecast': 'Soybean Final Yield Forecast',
    'kharif-2025': 'Kharif 2025',
    'most-likely-outcome': 'Most Likely Outcome',
    'quintal-per-acre': 'Quintal per Acre',
    'crop-growth-timeline': 'Crop Growth Timeline',
    'sowing-date': 'Sowing Date',
    'estimated-harvest': 'Estimated Harvest Date',
    'today': 'Today',
    'germination': 'Germination',
    'flowering': 'Flowering',
    'pod-filling': 'Pod Filling',
    'influencing-factors': 'Key Influencing Factors',
    'weather-forecast': 'Weather Forecast',
    'favorable': 'Favorable',
    'consistent-rainfall-beneficial': 'Consistent rainfall has been beneficial, but final yield depends on clear skies for harvest',
    'soil-moisture-optimal': 'Soil moisture is sufficient for the final pod-filling stage',
    'pest-disease-low-risk': 'Proactive monitoring has prevented major infestations',
    'yield-forecast-summary': 'The final yield forecast for your Soybean crop is most likely to be 17.2 quintals per acre',
    
    // Common Actions
    'view-details': 'View Details',
    'close': 'Close',
    'save': 'Save',
    'cancel': 'Cancel',
    'add': 'Add',
    'edit': 'Edit',
    'delete': 'Delete',
    'search': 'Search',
    'filter': 'Filter',
    'sort-by': 'Sort By',
    'back': 'Back',
    'next': 'Next',
    'previous': 'Previous',
    'submit': 'Submit',
    'add-new-item': 'Add New Item',
    'start-inspection': 'Start Inspection',
    'remind-later': 'Remind Later',
    'full-report': 'View Full Report',
    'detailed-forecast': 'View Detailed Forecast',
    'detailed-chart': 'Detailed Chart',
    'set-price-alert': 'Set Price Alert',
    
    // Status & Conditions
    'high': 'High',
    'medium': 'Medium',
    'low': 'Low',
    'optimal': 'Optimal',
    'warning': 'Warning',
    'positive': 'Positive',
    'neutral': 'Neutral',
    'excellent': 'Excellent',
    'good': 'Good',
    'fair': 'Fair',
    
    // Units & Measurements
    'per-acre': 'per Acre',
    'per-quintal': 'per Quintal',
    'kg': 'kg',
    'bags': 'Bags',
    'liters': 'Liters',
    'pieces': 'Pieces',
    'tons': 'Tons',
    
    // Time & Dates
    'evening': 'Evening',
    'morning': 'Morning',
    'afternoon': 'Afternoon',
    'night': 'Night',
    'today': 'Today',
    'yesterday': 'Yesterday',
    'tomorrow': 'Tomorrow',
    'this-week': 'This Week',
    'last-week': 'Last Week',
    'this-month': 'This Month',
    'last-month': 'Last Month',
    
    // Farm & Agriculture
    'soybean': 'Soybean',
    'wheat': 'Wheat',
    'rice': 'Rice',
    'corn': 'Corn',
    'field-a-b': 'Field A & B',
    'itarsi-mandi': 'Itarsi Mandi',
    'itarsi-mp': 'Itarsi, Madhya Pradesh',
    
    // Footer
    'copyright-text': '© 2024 FasalSaathi - AI-Powered Farming Advisor for Indian Agriculture',
    'tagline': 'Empowering farmers with technology, one crop at a time',
    
    // Profile & Settings
    'profile': 'Profile',
    'settings': 'Settings',
    'logout': 'Logout',
  },
  
  mr: {
    // Navigation
    'dashboard': 'डॅशबोर्ड',
    'my-farm': 'माझे शेत',
    'calendar': 'दिनदर्शिका',
    'market-prices': 'बाजार भाव',
    'analyze-plant': 'वनस्पती विश्लेषण',
    'ask-saathi': 'साथीला विचारा',
    'crop-recommendations': 'पीक शिफारसी',
    'inventory': 'यादी',
    'yield-prediction': 'उत्पादन अंदाज',
    'more': 'आणखी पर्याय',
    'plant-analysis': 'वनस्पती विश्लेषण',
    
    // Dashboard
    'good-evening': 'शुभ संध्याकाळ',
    'tonight-priority': 'आज रात्रीची प्राथमिकता',
    'live-farm-vitals': 'लाइव्ह शेत स्वास्थ्य',
    'yield-forecast': 'उत्पादन अंदाज',
    'market-price-alert': 'बाजार भाव सूचना',
    'soil-moisture': 'मातीची ओलावा',
    'soil-ph': 'माती pH',
    'high-priority': 'उच्च प्राथमिकता',
    'good-condition': 'चांगली स्थिती',
    'ideal-level': 'आदर्श पातळी',
    'dashboard-layout-variations': 'डॅशबोर्ड लेआउट पर्याय',
    'choose-preferred-layout': 'तुमचा पसंतीचा डॅशबोर्ड लेआउट निवडा',
    'balanced-grid': 'संतुलित ग्रिड',
    'feed-style': 'फीड स्टाइल',
    'data-centric': 'डेटा केंद्रित',
    'active': 'सक्रिय',
    
    // Yield Prediction
    'soybean-final-yield-forecast': 'सोयाबीन अंतिम उत्पादन अंदाज',
    'kharif-2025': 'खरीप 2025',
    'most-likely-outcome': 'सर्वात संभाव्य परिणाम',
    'quintal-per-acre': 'क्विंटल प्रति एकर',
    'crop-growth-timeline': 'पीक विकास वेळापत्रक',
    'sowing-date': 'बियाणे पेरणी तारीख',
    'estimated-harvest': 'अंदाजित कापणी',
    'today': 'आज',
    'germination': 'अंकुरण',
    'flowering': 'फुले येणे',
    'pod-filling': 'शेंग भरणे',
    'influencing-factors': 'प्रभावशाली घटक',
    'weather-forecast': 'हवामान अंदाज',
    'favorable': 'अनुकूल',
    'consistent-rainfall-beneficial': 'सातत्यपूर्ण पाऊस फायदेशीर आहे, परंतु अंतिम उत्पादन कापणीसाठी स्वच्छ आकाशावर अवलंबून आहे',
    'soil-moisture-optimal': 'मातीची ओलावा अंतिम शेंग भरण्याच्या टप्प्यासाठी पुरेशी आहे',
    'pest-disease-low-risk': 'सक्रिय निरीक्षणामुळे मोठे संक्रमण टाळले आहे',
    'yield-forecast-summary': 'तुमच्या सोयाबीन पिकाचा अंतिम उत्पादन अंदाज बहुधा 17.2 क्विंटल प्रति एकर असेल',
    
    // Common Actions
    'view-details': 'तपशील पहा',
    'close': 'बंद करा',
    'save': 'जतन करा',
    'cancel': 'रद्द करा',
    'add': 'जोडा',
    'edit': 'संपादित करा',
    'delete': 'हटवा',
    'search': 'शोधा',
    'filter': 'गाळणी',
    'sort-by': 'यानुसार क्रमवारी',
    'back': 'मागे',
    'next': 'पुढे',
    'previous': 'मागील',
    'submit': 'सबमिट करा',
    'add-new-item': 'नवीन आयटम जोडा',
    'start-inspection': 'तपासणी सुरू करा',
    'remind-later': 'नंतर आठवण करा',
    'full-report': 'संपूर्ण अहवाल पहा',
    'detailed-forecast': 'तपशीलवार अंदाज पहा',
    'detailed-chart': 'तपशीलवार चार्ट',
    'set-price-alert': 'किंमत अलर्ट सेट करा',
    
    // Status & Conditions
    'high': 'उच्च',
    'medium': 'मध्यम',
    'low': 'कमी',
    'optimal': 'आदर्श',
    'warning': 'चेतावणी',
    'positive': 'सकारात्मक',
    'neutral': 'तटस्थ',
    'excellent': 'उत्कृष्ट',
    'good': 'चांगले',
    'fair': 'मध्यम',
    
    // Units & Measurements
    'per-acre': 'प्रति एकर',
    'per-quintal': 'प्रति क्विंटल',
    'kg': 'किलोग्राम',
    'bags': 'पिशव्या',
    'liters': 'लिटर',
    'pieces': 'तुकडे',
    'tons': 'टन',
    
    // Time & Dates
    'evening': 'संध्याकाळ',
    'morning': 'सकाळ',
    'afternoon': 'दुपार',
    'night': 'रात्र',
    'today': 'आज',
    'yesterday': 'काल',
    'tomorrow': 'उद्या',
    'this-week': 'या आठवड्यात',
    'last-week': 'गेल्या आठवड्यात',
    'this-month': 'या महिन्यात',
    'last-month': 'गेल्या महिन्यात',
    
    // Farm & Agriculture
    'soybean': 'सोयाबीन',
    'wheat': 'गहू',
    'rice': 'तांदूळ',
    'corn': 'मका',
    'field-a-b': 'शेत A आणि B',
    'itarsi-mandi': 'इटारसी मंडी',
    'itarsi-mp': 'इटारसी, मध्य प्रदेश',
    
    // Footer
    'copyright-text': '© 2024 FasalSaathi - भारतीय शेतीसाठी AI-संचालित शेतकरी सल्लागार',
    'tagline': 'एका वेळी एक पीक असे तंत्रज्ञानाने शेतकऱ्यांना सशक्त बनवत आहे',
    
    // Profile & Settings
    'profile': 'प्रोफाइल',
    'settings': 'सेटिंग्स',
    'logout': 'लॉग आउट',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('hi');

  const t = (key: string, fallback?: string): string => {
    return translations[language][key] || fallback || key;
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, speak }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Speaker Button Component for text-to-speech
export function SpeakerButton({ text, className = "" }: { text: string; className?: string }) {
  const { speak } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`p-1 h-auto w-auto hover:bg-primary/10 ${className}`}
      onClick={() => speak(text)}
      aria-label="Listen to text"
    >
      <Volume2 className="w-4 h-4 text-primary" />
    </Button>
  );
}