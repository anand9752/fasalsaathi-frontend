import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Mic,
  MicOff,
  X,
  Minimize2,
  Maximize2,
  Leaf,
  Bug,
  Droplets,
  Sun,
  TrendingUp
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface AIChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AIChatAssistant({ isOpen, onToggle }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'नमस्ते! मैं आपका AI कृषि सलाहकार हूं। मैं खेती, फसल, मौसम और बाजार के बारे में आपकी मदद कर सकता हूं। आप मुझसे क्या पूछना चाहते हैं?',
      isBot: true,
      timestamp: new Date(),
      suggestions: [
        'मेरी सोयाबीन की फसल कैसी है?',
        'आज पानी देना चाहिए?',
        'कीट नियंत्रण के उपाय?',
        'मार्केट रेट क्या है?'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): { text: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('सोयाबीन') || message.includes('फसल')) {
      return {
        text: 'आपकी सोयाबीन की फसल अच्छी स्थिति में है! वर्तमान में यह फूल आने के चरण में है। मिट्टी में नमी 45% है जो अच्छी है। अगले 2-3 दिनों में हल्की बारिश का अनुमान है।',
        suggestions: ['कब सिंचाई करूं?', 'उर्वरक डालना है?', 'कीट से बचाव कैसे करूं?']
      };
    } else if (message.includes('पानी') || message.includes('सिंचाई')) {
      return {
        text: 'मिट्टी में नमी 45% है। शाम को सिंचाई करना बेहतर होगा क्योंकि कल तेज धूप का अनुमान है। 2-3 घंटे ड्रिप सिंचाई करें।',
        suggestions: ['कितना पानी दूं?', 'सिंचाई का सही समय?', 'पानी की गुणवत्ता कैसे चेक करूं?']
      };
    } else if (message.includes('कीट') || message.includes('रोग')) {
      return {
        text: 'इस समय सफेद मक्खी का खतरा मध्यम स्तर पर है। पीले चिपचिपे ट्रैप लगाएं और नीम ऑयल का छिड़काव करें। साप्ताहिक निरीक्षण जरूरी है।',
        suggestions: ['कौन सा कीटनाशक इस्तेमाल करूं?', 'कीट की पहचान कैसे करूं?', 'घरेलू उपाय बताएं']
      };
    } else if (message.includes('मार्केट') || message.includes('भाव') || message.includes('कीमत')) {
      return {
        text: 'आज सोयाबीन का भाव इटारसी मंडी में ₹5,250 प्रति क्विंटल है। कल से ₹50 की बढ़त है। अगले हफ्ते और तेजी की संभावना है।',
        suggestions: ['कब बेचना चाहिए?', 'दूसरी मंडी के रेट?', 'फसल स्टोरेज की जानकारी']
      };
    } else if (message.includes('मौसम') || message.includes('बारिश')) {
      return {
        text: 'अगले 3 दिनों का मौसम: आज - 28°C, साफ। कल - 30°C, हल्की बारिश की संभावना। परसों - 26°C, बादल। हवा की गति सामान्य रहेगी।',
        suggestions: ['क्या छिड़काव कर सकते हैं?', 'बारिश के बाद क्या करें?', 'तापमान का फसल पर प्रभाव']
      };
    } else {
      return {
        text: 'मैं आपकी मदद करने की कोशिश कर रहा हूं। कृपया अपना सवाल और स्पष्ट करें। आप खेती, फसल, कीट, मौसम या मार्केट के बारे में पूछ सकते हैं।',
        suggestions: ['मेरी फसल की जांच करें', 'आज के कार्य बताएं', 'मौसम की जानकारी', 'बाजार की कीमतें']
      };
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateBotResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Here you would integrate with speech recognition API
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-16 h-16 bg-primary rounded-full shadow-lg flex items-center justify-center z-50 hover:shadow-xl transition-shadow"
      >
        <MessageCircle className="w-8 h-8 text-white" />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
          <Bot className="w-3 h-3 text-accent-foreground" />
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.8 }}
      className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border z-50 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      } transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI सलाहकार</h3>
            <p className="text-xs text-green-100">ऑनलाइन</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(600px - 140px)' }}>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isBot ? 'bg-primary mr-2' : 'bg-gray-100 ml-2'
                    }`}>
                      {message.isBot ? (
                        <Bot className="w-4 h-4 text-white" />
                      ) : (
                        <User className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className={`p-3 rounded-lg ${
                        message.isBot 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-primary text-white'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                      
                      {message.suggestions && (
                        <div className="flex flex-wrap gap-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs h-auto py-1 px-2"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t bg-gray-50">
            <div className="flex space-x-2 overflow-x-auto">
              {[
                { icon: Leaf, text: 'फसल स्वास्थ्य', color: 'text-green-600' },
                { icon: Droplets, text: 'सिंचाई', color: 'text-blue-600' },
                { icon: Bug, text: 'कीट नियंत्रण', color: 'text-red-600' },
                { icon: TrendingUp, text: 'मार्केट', color: 'text-purple-600' },
                { icon: Sun, text: 'मौसम', color: 'text-yellow-600' }
              ].map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSuggestionClick(action.text)}
                  className="flex-shrink-0 p-2"
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="अपना सवाल टाइप करें..."
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleListening}
                  className={`absolute right-1 top-1 h-8 w-8 p-0 ${
                    isListening ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              <Button onClick={sendMessage} disabled={!inputText.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}