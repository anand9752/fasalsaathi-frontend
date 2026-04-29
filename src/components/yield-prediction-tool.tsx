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
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
          अपनी फसल की पैदावार का सटीक अनुमान लगाएं। मिट्टी की स्थिति, मौसम और उर्वरक के आधार पर AI-संचालित रिपोर्ट प्राप्त करें।
        </p>
      </motion.div>

      {/* Main Iframe Container - Seamless Integration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        {/* Decorative corner elements to make it feel custom */}
        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-emerald-500 rounded-tl-2xl z-10 opacity-50" />
        <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-emerald-500 rounded-tr-2xl z-10 opacity-50" />
        <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-emerald-500 rounded-bl-2xl z-10 opacity-50" />
        <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-emerald-500 rounded-br-2xl z-10 opacity-50" />

        <Card className="overflow-hidden border-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white rounded-3xl relative">
          <CardContent className="p-0">
            <div className="relative w-full bg-white" style={{ height: '900px' }}>
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
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex items-start gap-4">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Leaf className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-900 mb-1">फसल डेटा</h4>
            <p className="text-sm text-emerald-800/80 leading-relaxed font-medium">
              यह मॉडल विभिन्न जलवायु परिस्थितियों में फसल की उपज का विश्लेषण करने के लिए ऐतिहासिक डेटा का उपयोग करता है।
            </p>
          </div>
        </div>

        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">त्वरित विश्लेषण</h4>
            <p className="text-sm text-blue-800/80 leading-relaxed font-medium">
              कुछ ही सेकंड में अपनी भूमि के लिए संभावित उपज (Yield) की जानकारी प्राप्त करें।
            </p>
          </div>
        </div>

        <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-xl">
            <Info className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 mb-1">महत्वपूर्ण सूचना</h4>
            <p className="text-sm text-amber-800/80 leading-relaxed font-medium">
              भविष्यवाणी की सटीकता आपके द्वारा दर्ज किए गए डेटा (जैसे उर्वरक उपयोग, वर्षा) पर निर्भर करती है।
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
