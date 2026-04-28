import { Card, CardContent } from "./ui/card";
import { 
  Scan,
  Info,
  ExternalLink,
  ShieldCheck,
  Dog
} from "lucide-react";
import { motion } from "motion/react";

export function BreedAnalysisPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section with Animation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center p-4 bg-emerald-600/10 rounded-2xl mb-4 shadow-inner">
          <Scan className="w-10 h-10 text-emerald-600 animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          AI <span className="text-emerald-600">Breed</span> Analysis
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
          पशुओं की नस्ल की पहचान करें। गाय या भैंस की फोटो अपलोड करें और तुरंत सटीक नस्ल की जानकारी प्राप्त करें।
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
                src="https://cowbuffaloclassifier.streamlit.app/?embed=true" 
                className="w-full h-full border-none"
                style={{ minHeight: '900px' }}
                title="Cow & Buffalo Breed Classifier AI"
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
        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex items-start gap-4">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Info className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-900 mb-1">सही परिणाम के लिए सुझाव</h4>
            <p className="text-sm text-emerald-800/80 leading-relaxed font-medium">
              पशु की स्पष्ट और सामने से ली गई फोटो का उपयोग करें। अच्छी रोशनी में ली गई फोटो से AI बेहतर परिणाम देता है।
            </p>
          </div>
        </div>

        <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-xl">
            <Scan className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 mb-1">नस्ल विवरण</h4>
            <p className="text-sm text-amber-800/80 leading-relaxed font-medium">
              यह उपकरण विभिन्न भारतीय और विदेशी नस्लों की पहचान करने में मदद करता है। अधिक जानकारी के लिए पशु चिकित्सक से परामर्श लें।
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
