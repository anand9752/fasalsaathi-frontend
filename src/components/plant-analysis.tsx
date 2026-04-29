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
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          पौधों के रोगों की पहचान करें। फोटो अपलोड करें और तुरंत सटीक उपचार और रोकथाम के उपाय पाएं।
        </p>
      </motion.div>

      {/* Main Iframe Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="overflow-hidden border-2 border-green-100 shadow-2xl bg-white rounded-3xl group">
          <div className="bg-green-50 px-6 py-3 flex items-center justify-between border-b border-green-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800 uppercase tracking-wider">NeuroSync AI Engine Active</span>
            </div>
            <a 
              href="https://plant-disease-detection-neurosync.streamlit.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              Open in new tab <ExternalLink size={14} />
            </a>
          </div>
          <CardContent className="p-0">
            <div className="relative w-full bg-gray-50" style={{ height: '850px' }}>
              <iframe 
                src="https://plant-disease-detection-neurosync.streamlit.app/?embed=true" 
                className="w-full h-full border-none"
                style={{ minHeight: '850px' }}
                title="NeuroSync Plant Disease Detection AI"
                allow="camera; microphone; geolocation"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Footer / Information Section */}
      <motion.div 
        className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">सही परिणाम के लिए सुझाव</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              फोटो लेते समय पर्याप्त रोशनी का ध्यान रखें और रोगग्रस्त हिस्से पर ही फोकस करें। इससे AI की सटीकता बढ़ती है।
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="p-3 bg-amber-50 rounded-xl">
            <Scan className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">विशेषज्ञ सहायता</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              यह टूल शुरुआती पहचान के लिए है। यदि फसल की स्थिति गंभीर है, तो कृपया किसी कृषि विशेषज्ञ या केंद्र से संपर्क करें।
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}