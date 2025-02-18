import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { mockTests, learningResources } from '../data/mockTests';
import type { Question, TestResult } from '../types/test';
import { supabase } from '../lib/supabase';

interface MockTestProps {
  careerId: string;
  onComplete: (result: TestResult) => void;
}

export function MockTest({ careerId, onComplete }: MockTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const test = mockTests[careerId]?.[0];
  if (!test) return null;

  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    test.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return (correct / test.questions.length) * 100;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const score = calculateScore();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const result: TestResult = {
        id: crypto.randomUUID(),
        userId: user.id,
        testId: test.id,
        careerId,
        score,
        answers: selectedAnswers,
        completedAt: new Date().toISOString()
      };

      const { error } = await supabase
        .from('test_results')
        .insert({
          user_id: user.id,
          test_id: test.id,
          career_id: careerId,
          score,
          answers: selectedAnswers,
          completed_at: new Date().toISOString()
        });
      
      if (error) throw error;

      setShowResults(true);
      onComplete(result);
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Failed to submit test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  if (showResults) {
    const score = calculateScore();
    const resources = learningResources[careerId] || [];

    return (
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-indigo-50 mb-4">
            {score >= 70 ? (
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            ) : (
              <BookOpen className="w-12 h-12 text-indigo-500" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Test Complete!
          </h2>
          <p className="text-lg text-gray-600">
            You scored {score.toFixed(0)}%
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-50 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-900 mb-2">
              Recommended Learning Resources
            </h3>
            <div className="space-y-3">
              {resources.map(resource => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {resource.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {resource.description}
                      </p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="bg-indigo-100 px-2 py-1 rounded">
                          {resource.type}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{resource.duration}</span>
                        <span className="mx-2">•</span>
                        <span>{resource.provider}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-indigo-500" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {test.title}
          </h2>
          <span className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {test.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%`
            }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {currentQuestion.text}
          </h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                  selectedAnswers[currentQuestion.id] === option
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white hover:bg-indigo-50 text-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {showExplanation && (
          <div className={`rounded-lg p-4 ${
            selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex items-center mb-2">
              {selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer ? (
                <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 mr-2 text-red-500" />
              )}
              <span className="font-medium">
                {selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer
                  ? 'Correct!'
                  : 'Incorrect'}
              </span>
            </div>
            <p className="text-sm">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => setShowExplanation(true)}
            className="text-indigo-600 hover:text-indigo-700"
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            Show Explanation
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedAnswers[currentQuestion.id] || submitting}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>{isLastQuestion ? 'Submit Test' : 'Next Question'}</span>
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          </button>
        </div>
      </div>
    </div>
  );
}