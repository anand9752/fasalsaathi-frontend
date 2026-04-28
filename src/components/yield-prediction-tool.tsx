import { Card, CardContent } from "./ui/card";
import { 
  TrendingUp,
  Info,
  ExternalLink,
  ShieldCheck,
  Zap,
  Leaf
} from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "./language-context";

export function YieldPredictionTool({ onBack }: { onBack: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center p-4 bg-emerald-600/10 rounded-2xl mb-4 shadow-inner">
          <TrendingUp className="w-10 h-10 text-emerald-600 animate-bounce" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4" style={{ fontFamily: 'Poppins' }}>
          Crop <span className="text-emerald-600">Yield</span> Predictor
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          अपनी फसल की पैदावार का सटीक अनुमान लगाएं। मिट्टी की स्थिति, मौसम और उर्वरक के आधार पर AI-संचालित रिपोर्ट प्राप्त करें।
        </p>
      </motion.div>

      {/* Main Iframe Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="overflow-hidden border-2 border-emerald-100 shadow-2xl bg-white rounded-3xl group">
          <div className="bg-emerald-50 px-6 py-3 flex items-center justify-between border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-800 uppercase tracking-wider">Advanced Yield AI Engine Active</span>
            </div>
            <a 
              href="https://crop-yield-predictor-a.streamlit.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              Open in new tab <ExternalLink size={14} />
            </a>
          </div>
          <CardContent className="p-0">
            <div className="relative w-full bg-gray-50" style={{ height: '900px' }}>
              <iframe 
                src="https://crop-yield-predictor-a.streamlit.app/?embed=true" 
                className="w-full h-full border-none"
                style={{ minHeight: '900px' }}
                title="Crop Yield Predictor AI"
                allow="camera; microphone; geolocation"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Footer / Information Section */}
      <motion.div 
        className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-emerald-200 transition-all">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <Leaf className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">फसल डेटा</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              यह मॉडल विभिन्न जलवायु परिस्थितियों में फसल की उपज का विश्लेषण करने के लिए ऐतिहासिक डेटा का उपयोग करता है।
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-emerald-200 transition-all">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">त्वरित विश्लेषण</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              कुछ ही सेकंड में अपनी भूमि के लिए संभावित उपज (Yield) की जानकारी प्राप्त करें।
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-emerald-200 transition-all">
          <div className="p-3 bg-amber-50 rounded-xl">
            <Info className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">महत्वपूर्ण सूचना</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              भविष्यवाणी की सटीकता आपके द्वारा दर्ज किए गए डेटा (जैसे उर्वरक उपयोग, वर्षा) पर निर्भर करती है।
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
