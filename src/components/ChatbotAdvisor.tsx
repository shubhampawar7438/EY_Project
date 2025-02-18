import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, ArrowRight } from 'lucide-react';
import type { ChatMessage, UserCareerPreferences } from '../types/career';
import { careers } from '../data/careers';
import { supabase } from '../lib/supabase';

const CHAT_FLOW = {
  'Science & Math': {
    question: 'What type of scientific work interests you most?',
    options: [
      'Technology & Programming 💻',
      'Data Analysis & Research 📊',
      'Healthcare & Medicine 🏥',
      'Engineering & Design 🔧'
    ]
  },
  'Business & Finance': {
    question: 'What type of business work interests you?',
    options: [
      'Managing money, stocks, and investments 📈',
      'Creating marketing campaigns and branding 📢',
      'Advising companies on business strategy 💼',
      'Market research and analysis 📊'
    ]
  },
  'Arts & Creativity': {
    question: 'What type of creative work do you prefer?',
    options: [
      'Graphic design, branding, and digital art 🎨',
      'UX/UI design for apps and websites 🖥️',
      'Animation and visual storytelling 🎬',
      'Brand design and marketing visuals 🎯'
    ]
  },
  'Law & Justice': {
    question: 'Which area of law interests you most?',
    options: [
      'Representing clients in legal cases ⚖️',
      'Corporate law and business regulations 💼',
      'Public policy and government 🏛️',
      'International law and relations 🌍'
    ]
  },
  'Social Sciences & Psychology': {
    question: 'What aspect of human behavior interests you most?',
    options: [
      'Counseling and therapy 🤝',
      'Research and analysis 📊',
      'Social work and community service 🏘️',
      'Educational psychology 📚'
    ]
  }
};

interface ChatbotAdvisorProps {
  onCareersSelected: (careers: string[]) => void;
}

export function ChatbotAdvisor({ onCareersSelected }: ChatbotAdvisorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    type: 'bot',
    content: "Hello! 👋 Welcome to Parallel Skill Worlds, your AI-powered career guide. I'm here to help you discover the best career path based on your interests and skills.\n\nBefore we begin, what's your name?",
  }]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [preferences, setPreferences] = useState<UserCareerPreferences>({
    subjects: [],
    hobbies: [],
    strengths: [],
    weaknesses: [],
    workPreference: ''
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOptionSelect = async (option: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: option
    };

    setMessages(prev => [...prev, newMessage]);
    await processNextStep(option);
  };

  const handleCareerSelect = (careerId: string) => {
    setSelectedCareers(prev => {
      if (prev.includes(careerId)) {
        return prev.filter(id => id !== careerId);
      }
      if (prev.length < 2) {
        return [...prev, careerId];
      }
      return prev;
    });
  };

  const processNextStep = async (userResponse: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    let nextMessage: ChatMessage;

    switch (currentStep) {
      case 0:
        setUserName(userResponse);
        nextMessage = {
          id: Date.now().toString(),
          type: 'bot',
          content: `Nice to meet you, ${userResponse}! 😊 Let's explore careers that match your interests.\n\nWhich subject do you enjoy the most?`,
          options: [
            'Science & Math (Technology, Engineering, Healthcare)',
            'Business & Finance (Marketing, Investment, Business Strategy)',
            'Arts & Creativity (Design, Animation, UX/UI)',
            'Law & Justice (Legal Careers, Public Policy)',
            'Social Sciences & Psychology (Human Behavior, Counseling)'
          ]
        };
        break;

      case 1:
        setPreferences(prev => ({
          ...prev,
          subjects: [...prev.subjects, userResponse]
        }));
        const flow = CHAT_FLOW[userResponse.split(' (')[0] as keyof typeof CHAT_FLOW];
        nextMessage = {
          id: Date.now().toString(),
          type: 'bot',
          content: flow.question,
          options: flow.options
        };
        break;

      case 2:
        setPreferences(prev => ({
          ...prev,
          hobbies: [...prev.hobbies, userResponse]
        }));
        nextMessage = {
          id: Date.now().toString(),
          type: 'bot',
          content: "What is your strongest skill?",
          options: [
            'Analyzing data and identifying trends 📊',
            'Communication and presentation 🎯',
            'Problem-solving and critical thinking 🧩',
            'Creativity and innovation 💡',
            'Leadership and team management 👥'
          ]
        };
        break;

      case 3:
        setPreferences(prev => ({
          ...prev,
          strengths: [...prev.strengths, userResponse]
        }));
        nextMessage = {
          id: Date.now().toString(),
          type: 'bot',
          content: "Which of these would you like to improve?",
          options: [
            'Technical skills and expertise 💻',
            'Public speaking and presentation 🎤',
            'Time management and organization 📅',
            'Creative thinking and innovation 🎨',
            'Leadership and decision making 👑'
          ]
        };
        break;

      case 4:
        setPreferences(prev => ({
          ...prev,
          weaknesses: [...prev.weaknesses, userResponse]
        }));
        
        const recommendations = generateRecommendations(preferences);
        nextMessage = {
          id: Date.now().toString(),
          type: 'bot',
          content: `Based on your interests and skills, ${userName}, here are three careers that would be perfect for you. Please select exactly two to proceed:`,
          options: recommendations.map(career => career.title),
          careers: recommendations
        };
        break;

      default:
        if (selectedCareers.length === 2) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('career_selections').insert({
              user_id: user.id,
              selected_careers: selectedCareers,
              selection_method: 'chatbot',
              preferences: preferences
            });
          }
          onCareersSelected(selectedCareers);
          nextMessage = {
            id: Date.now().toString(),
            type: 'bot',
            content: "Perfect choices! 🎉 Let's begin your learning journey with mock tests and study materials tailored to your selected careers.",
          };
        } else {
          nextMessage = {
            id: Date.now().toString(),
            type: 'bot',
            content: "Please select exactly two careers to proceed.",
          };
        }
    }

    setMessages(prev => [...prev, nextMessage]);
    setCurrentStep(prev => prev + 1);
    setLoading(false);
  };

  const generateRecommendations = (prefs: UserCareerPreferences) => {
    let recommendedCareers = [...careers];
    
    if (prefs.subjects.includes('Science & Math')) {
      recommendedCareers = recommendedCareers.filter(career => 
        ['software-engineer', 'data-scientist', 'cybersecurity-analyst'].includes(career.id)
      );
    } else if (prefs.subjects.includes('Business & Finance')) {
      recommendedCareers = recommendedCareers.filter(career => 
        ['digital-marketer', 'financial-analyst'].includes(career.id)
      );
    }

    return recommendedCareers.slice(0, 3);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-xl p-6 h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className={`flex items-start max-w-[80%] space-x-2 ${
              message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' ? 'bg-indigo-100' : 'bg-indigo-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-5 h-5 text-indigo-600" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white shadow-md text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.options && message.options.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.options.map(option => {
                      const career = message.careers?.find(c => c.title === option);
                      const isSelected = career && selectedCareers.includes(career.id);
                      
                      return (
                        <button
                          key={option}
                          onClick={() => {
                            if (career) {
                              handleCareerSelect(career.id);
                            } else {
                              handleOptionSelect(option);
                            }
                          }}
                          disabled={career && selectedCareers.length >= 2 && !isSelected}
                          className={`
                            px-4 py-2 rounded-full text-sm font-medium
                            transition-all duration-200 transform hover:scale-105
                            ${isSelected
                              ? 'bg-indigo-600 text-white'
                              : message.type === 'user'
                                ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                            }
                            ${career && selectedCareers.length >= 2 && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-center">
            <div className="bg-white rounded-full p-3 shadow-md">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {selectedCareers.length === 2 && currentStep > 4 && (
        <div className="flex justify-center mb-4">
          <button
            onClick={() => processNextStep('')}
            className="bg-indigo-600 text-white rounded-full shadow-lg px-6 py-3 flex items-center space-x-2 hover:bg-indigo-700"
          >
            <span>Continue with selected careers</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-md">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-transparent px-4 py-2 focus:outline-none"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && userInput.trim()) {
              const newMessage: ChatMessage = {
                id: Date.now().toString(),
                type: 'user',
                content: userInput.trim()
              };
              setMessages(prev => [...prev, newMessage]);
              setUserInput('');
              processNextStep(userInput.trim());
            }
          }}
        />
        <button
          onClick={() => {
            if (userInput.trim()) {
              const newMessage: ChatMessage = {
                id: Date.now().toString(),
                type: 'user',
                content: userInput.trim()
              };
              setMessages(prev => [...prev, newMessage]);
              setUserInput('');
              processNextStep(userInput.trim());
            }
          }}
          className="bg-indigo-600 text-white rounded-lg p-3 hover:bg-indigo-700 transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}