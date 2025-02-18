import React, { useState } from 'react';
import { MessageSquare, List, ArrowRight, GraduationCap } from 'lucide-react';
import { ChatbotAdvisor } from './ChatbotAdvisor';
import { ManualSelection } from './ManualSelection';
import { MockTest } from './MockTest';
import type { TestResult } from '../types/test';
import { supabase } from '../lib/supabase';

interface CareerSelectionProps {
  onComplete: () => void;
}

export function CareerSelection({ onComplete }: CareerSelectionProps) {
  const [selectionMethod, setSelectionMethod] = useState<'none' | 'chatbot' | 'manual'>('none');
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [showTest, setShowTest] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const handleCareerSelection = (careers: string[]) => {
    setSelectedCareers(careers);
    setShowTest(true);
  };

  const handleTestComplete = async (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
    
    if (currentTestIndex < selectedCareers.length - 1) {
      setCurrentTestIndex(prev => prev + 1);
    } else {
      // Both tests are complete, determine primary and secondary careers
      const results = [...testResults, result];
      const [firstResult, secondResult] = results;
      
      const primaryCareer = firstResult.score >= secondResult.score ? selectedCareers[0] : selectedCareers[1];
      const secondaryCareer = firstResult.score >= secondResult.score ? selectedCareers[1] : selectedCareers[0];
      
      // Save career preferences
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('career_preferences').insert({
          user_id: user.id,
          primary_career: primaryCareer,
          secondary_career: secondaryCareer,
          primary_score: Math.max(firstResult.score, secondResult.score),
          secondary_score: Math.min(firstResult.score, secondResult.score)
        });
      }
      
      onComplete();
    }
  };

  if (showTest) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Career Assessment
          </h1>
          <p className="text-gray-600">
            {currentTestIndex === 0 
              ? "Let's start with your first career assessment"
              : "Great! Now let's assess your second career choice"}
          </p>
          <p className="text-indigo-600 font-medium">
            Testing for: {selectedCareers[currentTestIndex]}
          </p>
        </div>
        <MockTest
          careerId={selectedCareers[currentTestIndex]}
          onComplete={handleTestComplete}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          Explore Your Career Path
        </h1>
        
        {selectionMethod === 'none' && (
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setSelectionMethod('chatbot')}
              className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <MessageSquare className="h-12 w-12 text-indigo-600" />
                <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Chat with AI Career Advisor
              </h2>
              <p className="text-gray-600">
                Get personalized career recommendations through an interactive conversation
              </p>
            </button>

            <button
              onClick={() => setSelectionMethod('manual')}
              className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <List className="h-12 w-12 text-indigo-600" />
                <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Browse Career Options
              </h2>
              <p className="text-gray-600">
                Explore and compare different career paths at your own pace
              </p>
            </button>
          </div>
        )}

        {selectionMethod === 'chatbot' && (
          <ChatbotAdvisor onCareersSelected={handleCareerSelection} />
        )}
        {selectionMethod === 'manual' && (
          <ManualSelection onCareersSelected={handleCareerSelection} />
        )}
      </div>
    </div>
  );
}