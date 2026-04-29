import { Card, CardContent } from "./ui/card";
import { 
  Scan,
  Info,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { motion } from "motion/react";

export function PlantAnalysisPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section with Animation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center p-4 bg-green-600/10 rounded-2xl mb-4 shadow-inner">
          <Scan className="w-10 h-10 text-green-600 animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4" style={{ fontFamily: 'Poppins' }}>
          AI <span className="text-green-600">Plant Disease</span> Detection
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
          पौधों के रोगों की पहचान करें। फोटो अपलोड करें और तुरंत सटीक उपचार और रोकथाम के उपाय पाएं।
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
        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-green-500 rounded-tl-2xl z-10 opacity-50" />
        <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-green-500 rounded-tr-2xl z-10 opacity-50" />
        <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-green-500 rounded-bl-2xl z-10 opacity-50" />
        <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-green-500 rounded-br-2xl z-10 opacity-50" />

        <Card className="overflow-hidden border-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white rounded-3xl relative">
          <CardContent className="p-0">
            <div className="relative w-full bg-white" style={{ height: '900px' }}>
              <iframe 
                src="https://plant-disease-detection-neurosync.streamlit.app/?embed=true" 
                className="w-full h-full border-none"
                style={{ minHeight: '900px' }}
                title="NeuroSync Plant Disease Detection AI"
                allow="camera; microphone; geolocation"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Footer / Information Section */}
      <motion.div 
        className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100 flex items-start gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <Info className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h4 className="font-bold text-green-900 mb-1">सही परिणाम के लिए सुझाव</h4>
            <p className="text-sm text-green-800/80 leading-relaxed font-medium">
              फोटो लेते समय पर्याप्त रोशनी का ध्यान रखें और रोगग्रस्त हिस्से पर ही फोकस करें। इससे AI की सटीकता बढ़ती है।
            </p>
          </div>
        </div>

        <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-xl">
            <Scan className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 mb-1">विशेषज्ञ सहायता</h4>
            <p className="text-sm text-amber-800/80 leading-relaxed font-medium">
              यह टूल शुरुआती पहचान के लिए है। यदि फसल की स्थिति गंभीर है, तो कृपया किसी कृषि विशेषज्ञ या केंद्र से संपर्क करें।
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}