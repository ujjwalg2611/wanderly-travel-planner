import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import TripsPage from './pages/TripsPage';
import TripDetail from './pages/TripDetail';
import NewTripPage from './pages/NewTripPage';
import ItineraryPage from './pages/ItineraryPage';
import ExplorePage from './pages/ExplorePage';
import SocialPage from './pages/SocialPage';
import ExpensesPage from './pages/ExpensesPage';
import ExpenseSplitPage from './pages/ExpenseSplitPage';
import SavedPage from './pages/SavedPage';
import RecommendationsPage from './pages/RecommendationsPage';
import SettingsPage from './pages/SettingsPage';
import FlightsPage from './pages/FlightsPage';
import HotelsPage from './pages/HotelsPage';
import VisaPage from './pages/VisaPage';
import WeatherPage from './pages/WeatherPage';
import LoyaltyPage from './pages/LoyaltyPage';
import MapsPage from './pages/MapsPage';
import AIAssistantPage from './pages/AIAssistantPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a1420]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sand-400 to-sand-600 flex items-center justify-center shadow-glow-sand animate-pulse">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M22 16.5L13.5 8L10 11.5L5.5 7L2 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M2 21H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="text-sand-600 dark:text-sand-400 font-semibold font-display">Loading Wanderly...</div>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/auth" replace/>;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace/> : children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{
            duration: 3000,
            style: { borderRadius: '12px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif' },
          }}/>
          <Routes>
            <Route path="/auth" element={<PublicRoute><AuthPage/></PublicRoute>}/>

            {/* Core */}
            <Route path="/dashboard"    element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
            <Route path="/trips"        element={<PrivateRoute><TripsPage/></PrivateRoute>}/>
            <Route path="/trips/new"    element={<PrivateRoute><NewTripPage/></PrivateRoute>}/>
            <Route path="/trips/:id"    element={<PrivateRoute><TripDetail/></PrivateRoute>}/>
            <Route path="/itinerary"    element={<PrivateRoute><ItineraryPage/></PrivateRoute>}/>

            {/* AI */}
            <Route path="/ai-assistant" element={<PrivateRoute><AIAssistantPage/></PrivateRoute>}/>

            {/* Booking */}
            <Route path="/flights"      element={<PrivateRoute><FlightsPage/></PrivateRoute>}/>
            <Route path="/hotels"       element={<PrivateRoute><HotelsPage/></PrivateRoute>}/>
            <Route path="/maps"         element={<PrivateRoute><MapsPage/></PrivateRoute>}/>

            {/* Tools */}
            <Route path="/weather"      element={<PrivateRoute><WeatherPage/></PrivateRoute>}/>
            <Route path="/visa"         element={<PrivateRoute><VisaPage/></PrivateRoute>}/>
            <Route path="/expenses"     element={<PrivateRoute><ExpensesPage/></PrivateRoute>}/>
            <Route path="/split"        element={<PrivateRoute><ExpenseSplitPage/></PrivateRoute>}/>
            <Route path="/loyalty"      element={<PrivateRoute><LoyaltyPage/></PrivateRoute>}/>

            {/* Social / Explore */}
            <Route path="/explore"         element={<PrivateRoute><ExplorePage/></PrivateRoute>}/>
            <Route path="/recommendations" element={<PrivateRoute><RecommendationsPage/></PrivateRoute>}/>
            <Route path="/social"          element={<PrivateRoute><SocialPage/></PrivateRoute>}/>
            <Route path="/saved"           element={<PrivateRoute><SavedPage/></PrivateRoute>}/>

            {/* Settings */}
            <Route path="/settings" element={<PrivateRoute><SettingsPage/></PrivateRoute>}/>

            <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
