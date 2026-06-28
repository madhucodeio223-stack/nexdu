'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, Bot, User, Sparkles,
  BookOpen, GraduationCap, Calendar, Award, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  { label: 'Courses', icon: BookOpen, query: 'What courses are available?' },
  { label: 'Admissions', icon: GraduationCap, query: 'How do I apply for admission?' },
  { label: 'Fees', icon: TrendingUp, query: 'What is the fee structure?' },
  { label: 'Placements', icon: Award, query: 'Tell me about placements' },
];

const aiResponses: Record<string, string> = {
  'courses': 'We offer a wide range of programs including B.Tech (CSE, ECE, ME, CE), MBA, M.Tech (Data Science & AI), Biotechnology, and Psychology. Each program is designed with industry-relevant curriculum and hands-on learning. Visit our Courses page for detailed information.',
  'admission': 'Our admission process involves: 1) Online Application, 2) Document Upload, 3) Entrance Exam (JEE/CAT/GATE), 4) Merit List, and 5) Fee Payment. Applications for 2026 are open until March 31st. You can apply directly on our Admissions page.',
  'fee': 'Our fee structure varies by program: B.Tech ranges from ₹1.30L to ₹1.60L per year, MBA is ₹2.50L per year, and M.Tech is ₹2.00L per year. Hostel fees are additional. Scholarships are available for meritorious students.',
  'placement': 'We have an excellent placement record with 98% placement rate. Top recruiters include Google, Microsoft, Amazon, Meta, and Apple. The average package is ₹12 LPA with the highest reaching ₹45 LPA. Our Placement Cell provides comprehensive training.',
  'hello': 'Hello! I am EduNexus AI Assistant. I can help you with information about courses, admissions, fees, placements, campus facilities, and more. How can I assist you today?',
  'hi': 'Hi there! I am your EduNexus AI Assistant. Ask me anything about our university programs, admissions, or campus life!',
  'help': 'I can help you with:\n- Course information and eligibility\n- Admission process and deadlines\n- Fee structure and scholarships\n- Placement statistics\n- Campus facilities\n- Faculty information\n\nWhat would you like to know?',
  'contact': 'You can reach us at:\n- Phone: +1 (555) 123-4567\n- Email: info@edunexus.edu\n- Address: 123 University Avenue, Tech City\n\nOr visit our Contact page for department-specific contacts.',
  'library': 'Our Central Library houses over 45,000 books, digital journals, and research databases. It is open from 8 AM to 10 PM on weekdays and until midnight during exams. Students can borrow up to 4 books for 14 days.',
  'hostel': 'We have 5 hostel blocks (A, B for boys; C, D for girls; E for PG students) with a total capacity of 520 rooms. Each room is equipped with WiFi, study tables, and storage. Mess facilities provide nutritious meals.',
  'scholarship': 'We offer merit-based scholarships covering 25-100% of tuition fees for students with exceptional academic records. Additionally, there are need-based financial aid programs and sports scholarships.',
  'default': 'I am still learning about that topic. For detailed information, please contact our admissions office at admissions@edunexus.edu or call +1 (555) 123-4567. You can also explore our website for more details.',
};

function getAIResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  for (const [key, response] of Object.entries(aiResponses)) {
    if (lowerQuery.includes(key)) {
      return response;
    }
  }
  return aiResponses.default;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am EduNexus AI Assistant. I can help you with courses, admissions, fees, placements, and more. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = getAIResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '500px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">EduNexus AI</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-white/80 text-xs">Online</span>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full">
                <Sparkles className="w-3 h-3 text-white" />
                <span className="text-white text-xs">AI Powered</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'bg-primary/10' : 'bg-secondary/10'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-primary" />
                    ) : (
                      <Bot className="w-4 h-4 text-secondary" />
                    )}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted rounded-tl-sm'
                  }`}>
                    <p className="whitespace-pre-line">{message.content}</p>
                    <span className={`text-[10px] mt-1 block ${
                      message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="bg-muted p-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => handleSend(q.query)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 text-xs font-medium transition-colors"
                    >
                      <q.icon className="w-3 h-3" />
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 rounded-xl bg-muted border-0 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <Button
                  size="icon"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
