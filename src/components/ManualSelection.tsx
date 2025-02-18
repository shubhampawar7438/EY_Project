import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { careers } from '../data/careers';
import { supabase } from '../lib/supabase';
import type { Career } from '../types/career';

interface ManualSelectionProps {
  onCareersSelected: (careers: string[]) => void;
}

export function ManualSelection({ onCareersSelected }: ManualSelectionProps) {
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCareerSelection = (careerId: string) => {
    if (selectedCareers.includes(careerId)) {
      setSelectedCareers(prev => prev.filter(id => id !== careerId));
    } else if (selectedCareers.length < 2) {
      setSelectedCareers(prev => [...prev, careerId]);
    }
  };

  const toggleExpanded = (careerId: string) => {
    setExpandedCard(prev => prev === careerId ? null : careerId);
  };

  const handleProceed = async () => {
    if (selectedCareers.length === 2) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('career_selections').insert({
          user_id: user.id,
          selected_careers: selectedCareers,
          selection_method: 'manual'
        });
      }
      onCareersSelected(selectedCareers);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 rounded-lg p-4 mb-6">
        <p className="text-indigo-800">
          Select up to two careers that interest you the most. Click on a career card to see more details.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {careers.map(career => (
          <div
            key={career.id}
            className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 ${
              expandedCard === career.id ? 'md:col-span-2' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {career.title}
                  </h3>
                  <p className="text-gray-600">{career.description}</p>
                </div>
                <button
                  onClick={() => toggleCareerSelection(career.id)}
                  className={`ml-4 p-2 rounded-full transition-colors ${
                    selectedCareers.includes(career.id)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                  disabled={selectedCareers.length >= 2 && !selectedCareers.includes(career.id)}
                >
                  <Check className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={() => toggleExpanded(career.id)}
                className="flex items-center text-indigo-600 hover:text-indigo-700"
              >
                {expandedCard === career.id ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show more
                  </>
                )}
              </button>

              {expandedCard === career.id && (
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Required Skills</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {career.skills.map(skill => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {career.education.map(edu => (
                        <li key={edu}>{edu}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Salary Range</h4>
                    <p className="text-gray-600">{career.salary}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedCareers.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handleProceed}
            disabled={selectedCareers.length !== 2}
            className={`
              bg-indigo-600 text-white rounded-full shadow-lg px-6 py-3
              flex items-center space-x-2
              ${selectedCareers.length === 2 ? 'hover:bg-indigo-700' : 'opacity-50 cursor-not-allowed'}
            `}
          >
            <span>Proceed with {selectedCareers.length} selected careers</span>
            {selectedCareers.length === 2 && <ArrowRight className="h-5 w-5" />}
          </button>
        </div>
      )}
    </div>
  );
}