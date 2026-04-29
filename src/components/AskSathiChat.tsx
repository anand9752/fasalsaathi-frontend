import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Bot, 
  User, 
  Mic,
  MicOff,
  Leaf,
  Loader2,
  Sparkles,
  RefreshCw,
  Info
} from "lucide-react";
import { useLanguage } from "./language-context";
import { askSathiApi } from "../services/api";
import { Badge } from "./ui/badge";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface AskSathiChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AskSathiChat({ isOpen, onClose }: AskSathiChatProps) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = language === 'hi' 
        ? "नमस्ते! मैं 'पूछो साथी' हूँ, आपका व्यक्तिगत कृषि सहायक। मैं आपकी फसल, मिट्टी की सेहत और खेती की समस्याओं में मदद कर सकता हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?"
        : "Namaste! I am 'Ask Sathi', your personal farming companion. I can help with crop advice, soil health, and pest management. How can I assist you today?";
      
      setMessages([{
        id: '1',
        text: greeting,
        isBot: true,
        timestamp: new Date()
      }]);
    }
  }, [language, messages.length]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userText = inputText;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Map messages to history format for API
      const history = messages
        .filter(m => m.id !== '1') // Skip initial greeting if needed, or include it
        .map(m => ({
          role: m.isBot ? 'model' : 'user',
          content: m.text
        }));

      const data = await askSathiApi.ask(userText, history);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Ask Sathi Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'hi' 
          ? "क्षमा करें, मुझे जवाब देने में परेशानी हो रही है। कृपया पुनः प्रयास करें।" 
          : "Sorry, I'm having trouble responding. Please try again.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Future: Add Web Speech API integration
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-l shadow-2xl">
        <SheetHeader className="p-4 border-b bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-primary flex items-center gap-2">
                  {language === 'hi' ? 'पूछो साथी' : 'Ask Sathi'}
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider h-5 bg-primary/5 border-primary/20">Beta</Badge>
                </SheetTitle>
                <SheetDescription className="text-xs">
                  {language === 'hi' ? 'आपका AI खेती मित्र' : 'Your AI Farming Companion'}
                </SheetDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={clearChat} title="Clear Chat">
              <RefreshCw className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 bg-slate-50/30">
          <div className="space-y-4 pb-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex max-w-[85%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'} items-end gap-2`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                      message.isBot ? 'bg-primary text-white' : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {message.isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    
                    <div className={`p-3 rounded-2xl shadow-sm ${
                      message.isBot 
                        ? 'bg-white border border-slate-200 text-slate-800 rounded-bl-none' 
                        : 'bg-primary text-primary-foreground rounded-br-none'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      <span className={`text-[10px] mt-1 block opacity-50 ${message.isBot ? 'text-slate-400' : 'text-primary-foreground/70'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start items-end gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-4 shadow-sm">
                  <div className="flex space-x-1.5">
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1] }} 
                      transition={{ repeat: Infinity, duration: 1 }} 
                      className="w-1.5 h-1.5 bg-primary/40 rounded-full" 
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1] }} 
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} 
                      className="w-1.5 h-1.5 bg-primary/60 rounded-full" 
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1] }} 
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} 
                      className="w-1.5 h-1.5 bg-primary/80 rounded-full" 
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Queries */}
        {messages.length === 1 && (
          <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 overflow-x-auto scrollbar-none">
            <div className="flex gap-2 whitespace-nowrap pb-1">
              {[
                { icon: Leaf, text: language === 'hi' ? 'सोयाबीन की खेती' : 'Soybean Farming' },
                { icon: Info, text: language === 'hi' ? 'मिट्टी का स्वास्थ्य' : 'Soil Health' },
                { icon: Sparkles, text: language === 'hi' ? 'उर्वरक सुझाव' : 'Fertilizer Advice' }
              ].map((query, idx) => (
                <Button 
                  key={idx} 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full h-8 text-xs bg-white border-slate-200 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
                  onClick={() => setInputText(query.text)}
                >
                  <query.icon className="w-3 h-3 mr-1.5" />
                  {query.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 group">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={language === 'hi' ? 'अपना सवाल पूछें...' : 'Ask your question...'}
                className="pr-12 rounded-2xl border-slate-200 focus-visible:ring-primary focus-visible:border-primary h-12 transition-all"
                disabled={isLoading}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleListening}
                className={`absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl hover:bg-slate-100 ${
                  isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 group-hover:text-primary'
                }`}
                disabled={isLoading}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
            <Button 
              onClick={handleSend} 
              disabled={!inputText.trim() || isLoading}
              className="h-12 w-12 rounded-2xl shadow-md shadow-primary/20 flex-shrink-0"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-2">
            Ask Sathi can make mistakes. Verify important agricultural decisions.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
