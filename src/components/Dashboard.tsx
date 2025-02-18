import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  User as UserIcon,
  Award,
  Clock,
  ArrowUpRight,
  LogOut,
  CheckCircle,
  TrendingUp,
  BookOpenCheck,
  Star
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { careers } from '../data/careers';
import type { TestResult } from '../types/test';
import type { Career } from '../types/career';

export function Dashboard() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedCareers, setSelectedCareers] = useState<Career[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'profile'>('overview');
  const [careerPreferences, setCareerPreferences] = useState<any>(null);
  const [completedResources, setCompletedResources] = useState<string[]>([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Load test results
    const { data: results } = await supabase
      .from('test_results')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (results) {
      setTestResults(results);
    }

    // Load career preferences
    const { data: preferences } = await supabase
      .from('career_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (preferences) {
      setCareerPreferences(preferences);
      const careerData = careers.filter(career => 
        [preferences.primary_career, preferences.secondary_career].includes(career.id)
      );
      setSelectedCareers(careerData);
    }

    // Load completed resources
    const { data: resources } = await supabase
      .from('completed_resources')
      .select('resource_id')
      .eq('user_id', user.id);

    if (resources) {
      setCompletedResources(resources.map(r => r.resource_id));
    }

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const markResourceCompleted = async (resourceId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('completed_resources').insert({
      user_id: user.id,
      resource_id: resourceId
    });

    setCompletedResources(prev => [...prev, resourceId]);
  };

  const calculateProgress = (careerId: string) => {
    const careerTests = testResults.filter(result => result.careerId === careerId);
    if (careerTests.length === 0) return 0;
    
    const totalScore = careerTests.reduce((sum, test) => sum + test.score, 0);
    return Math.round(totalScore / careerTests.length);
  };

  const getLatestTestDate = (careerId: string) => {
    const careerTests = testResults.filter(result => result.careerId === careerId);
    if (careerTests.length === 0) return null;
    
    return new Date(careerTests[0].completedAt).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {profile?.full_name || 'Student'}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Your learning journey continues here
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Career Assessment Results */}
        {careerPreferences && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">Career Assessment Results</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Primary Career Path</h3>
                    <p className="text-indigo-600 font-bold text-xl mt-1">
                      {careers.find(c => c.id === careerPreferences.primary_career)?.title}
                    </p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                    {careerPreferences.primary_score.toFixed(0)}% Match
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${careerPreferences.primary_score}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Secondary Career Path</h3>
                    <p className="text-blue-600 font-bold text-xl mt-1">
                      {careers.find(c => c.id === careerPreferences.secondary_career)?.title}
                    </p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                    {careerPreferences.secondary_score.toFixed(0)}% Match
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${careerPreferences.secondary_score}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`p-6 rounded-xl shadow-md transition-all ${
              activeTab === 'overview' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white hover:bg-indigo-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6" />
              <span className="font-medium text-lg">Overview</span>
            </div>
            <p className={`mt-2 text-sm ${activeTab === 'overview' ? 'text-indigo-100' : 'text-gray-600'}`}>
              View your overall progress and stats
            </p>
          </button>
          
          <button
            onClick={() => setActiveTab('progress')}
            className={`p-6 rounded-xl shadow-md transition-all ${
              activeTab === 'progress' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white hover:bg-indigo-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6" />
              <span className="font-medium text-lg">Learning Progress</span>
            </div>
            <p className={`mt-2 text-sm ${activeTab === 'progress' ? 'text-indigo-100' : 'text-gray-600'}`}>
              Track your test scores and achievements
            </p>
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`p-6 rounded-xl shadow-md transition-all ${
              activeTab === 'profile' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white hover:bg-indigo-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <UserIcon className="h-6 w-6" />
              <span className="font-medium text-lg">Profile</span>
            </div>
            <p className={`mt-2 text-sm ${activeTab === 'profile' ? 'text-indigo-100' : 'text-gray-600'}`}>
              Manage your personal information
            </p>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid gap-6 md:grid-cols-2">
            {selectedCareers.map(career => (
              <div key={career.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {career.title}
                      </h3>
                      <p className="text-gray-600">{career.description}</p>
                    </div>
                    <div className="bg-indigo-100 rounded-full p-3">
                      <GraduationCap className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Overall Progress</span>
                        <span className="font-medium">{calculateProgress(career.id)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${calculateProgress(career.id)}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4">
                        <div className="flex items-center text-gray-700 mb-2">
                          <Award className="h-5 w-5 mr-2 text-green-600" />
                          <span className="font-medium">Latest Score</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                          {testResults.find(r => r.careerId === career.id)?.score || 0}%
                        </span>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4">
                        <div className="flex items-center text-gray-700 mb-2">
                          <Clock className="h-5 w-5 mr-2 text-blue-600" />
                          <span className="font-medium">Last Test</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                          {getLatestTestDate(career.id) || 'No tests yet'}
                        </span>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg py-3 px-4 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center group">
                      <BookOpenCheck className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                      Continue Learning
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-8">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">Learning Progress</h2>
            </div>
            
            <div className="space-y-8">
              {selectedCareers.map(career => (
                <div key={career.id} className="border-b pb-8 last:border-b-0">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {career.title}
                    </h3>
                    <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
                      {calculateProgress(career.id)}% Complete
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {testResults
                      .filter(result => result.careerId === career.id)
                      .map(result => (
                        <div key={result.id} className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="bg-indigo-100 rounded-full p-2">
                                <Award className="h-5 w-5 text-indigo-600" />
                              </div>
                              <span className="font-medium text-gray-900">
                                Mock Test #{result.testId}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {new Date(result.completedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="flex-1 mr-4">
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                                  style={{ width: `${result.score}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-lg font-bold text-gray-900 min-w-[60px] text-right">
                              {result.score}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && profile && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <UserIcon className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                <Settings className="h-5 w-5" />
                <span>Edit Profile</span>
              </button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-lg text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">
                    {profile.full_name}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <p className="text-lg text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">
                    {profile.age}
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                  <p className="text-lg text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">
                    {profile.education_level}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currently Studying</label>
                  <p className="text-lg text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">
                    {profile.currently_studying}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? Your progress will be saved.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}