// frontend/src/App.jsx
import { useEffect, useState, useMemo } from "react";
import { configureDependencies } from "./config/dependencies";
import { apiService } from "./frameworks-drivers/services/apiService";

// Import Views
import LandingPageView from "./frameworks-drivers/views/LandingPageView";
import LoginView from "./frameworks-drivers/views/LoginView";
import SignupView from "./frameworks-drivers/views/SignupView";
import LoggedInUIView from "./frameworks-drivers/views/LoggedInUIView";

import "./App.css";

function App() {
  // Configure dependencies
  const dependencies = useMemo(() => configureDependencies(), []);
  const { 
    authViewModel, 
    authController
  } = dependencies;

  // App state
  const [currentView, setCurrentView] = useState('landing');
  const [authState, setAuthState] = useState(authViewModel.getState());
  const [injuryRiskData, setInjuryRiskData] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState(null);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = authViewModel.subscribe((newState) => {
      console.log('🔐 Auth state changed:', newState);
      setAuthState(newState);
      
      // Auto-navigate on auth state changes
      if (newState.isAuthenticated) {
        console.log('✅ User authenticated, navigating to logged in view');
        setCurrentView('loggedIn');
        // IMPORTANT: Fetch ML data after successful login
        fetchInjuryRiskData();
      } else if (currentView === 'loggedIn') {
        console.log('🚪 User logged out, navigating to landing');
        setCurrentView('landing');
      }
    });

    return unsubscribe;
  }, [currentView]);

  // Fetch injury risk data from backend
  const fetchInjuryRiskData = async () => {
    console.log('📊 Starting injury risk data fetch...');
    setMlLoading(true);
    setMlError(null);

    try {
      // IMPORTANT: Update this path to match where your CSV actually is
      // CSV is at: backend/ml_injury/final_dataset/yankees.csv
      // Docker path: /app/backend/ml_injury/final_dataset/yankees.csv
      const csvPath = '/app/backend/ml_injury/final_dataset/yankees.csv';
      
      console.log('📁 CSV Path:', csvPath);
      console.log('🔗 Calling API endpoint: /api/ml/get-all-predictions');
      
      // Call the NEW backend endpoint
      const response = await apiService.getMLPredictions(csvPath, 0.10, '2024-04-01');
      
      console.log('✅ API response received:', response);
      
      if (response.success && response.predictions) {
        console.log('✅ ML Predictions loaded successfully');
        console.log('🎯 Players with predictions:', Object.keys(response.predictions));
        console.log('📊 Sample prediction:', Object.entries(response.predictions)[0]);
        setInjuryRiskData(response.predictions);
      } else {
        const errorMsg = response.error || 'No predictions available';
        console.warn('⚠️ Unexpected response:', response);
        setMlError(errorMsg);
      }
    } catch (error) {
      console.error('❌ Failed to load injury risk data:', error);
      console.error('Error stack:', error.stack);
      setMlError(error.message || 'Failed to fetch ML predictions');
    } finally {
      setMlLoading(false);
    }
  };

  // Auth handlers
  const handleLogin = async (email, password) => {
    console.log('🔑 Attempting login...');
    await authController.handleLogin(email, password);
  };

  const handleSignup = async (email, password, confirmPassword, teamName) => {
    console.log('📝 Attempting signup...');
    await authController.handleSignup(email, password, confirmPassword, teamName);
  };

  const handleLogout = async () => {
    console.log('👋 Logging out...');
    await authController.handleLogout();
    setCurrentView('landing');
    setInjuryRiskData(null); // Clear data on logout
  };

  // Navigation handlers
  const navigateToLogin = () => setCurrentView('login');
  const navigateToSignup = () => setCurrentView('signup');
  const navigateToLanding = () => setCurrentView('landing');

  // Render appropriate view based on currentView state
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPageView 
            onNavigateToLogin={navigateToLogin}
            onNavigateToSignup={navigateToSignup}
          />
        );

      case 'login':
        return (
          <LoginView
            onLogin={handleLogin}
            onNavigateToSignup={navigateToSignup}
            onNavigateToLanding={navigateToLanding}
            isLoading={authState.isLoading}
            error={authState.authError}
          />
        );

      case 'signup':
        return (
          <SignupView
            onSignup={handleSignup}
            onNavigateToLogin={navigateToLogin}
            onNavigateToLanding={navigateToLanding}
            isLoading={authState.isLoading}
            error={authState.authError}
          />
        );

      case 'loggedIn':
        console.log('🎨 Rendering LoggedInUIView');
        console.log('  injuryRiskData:', injuryRiskData);
        console.log('  mlLoading:', mlLoading);
        console.log('  mlError:', mlError);
        return (
          <LoggedInUIView
            currentUser={authState.currentUser}
            coachId={authState.currentUser?.coach_id}
            onLogout={handleLogout}
            authLoading={authState.isLoading}
            injuryRiskData={injuryRiskData}
            mlLoading={mlLoading}
            mlError={mlError}
          />
        );

      default:
        return (
          <LandingPageView 
            onNavigateToLogin={navigateToLogin}
            onNavigateToSignup={navigateToSignup}
          />
        );
    }
  };

  return renderView();
}

export default App;