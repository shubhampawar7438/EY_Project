import React, { useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { CareerSelection } from './components/CareerSelection';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user } = useAuth();
  const [showDashboard, setShowDashboard] = useState(false);

  if (!user) {
    return <AuthForm />;
  }

  return showDashboard ? <Dashboard /> : <CareerSelection onComplete={() => setShowDashboard(true)} />;
}

export default App;