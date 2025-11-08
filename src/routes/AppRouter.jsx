import Login from "../features/auth/view/loginPage";
import Register from "../features/auth/view/RegisterPage";
import Dashboard from "../features/dashboard/view/dashBoardScreen";
import AddSkillsPage from "../features/onboarding/view/AddSkillsPage";
import AddProjectsPage from "../features/onboarding/view/AddProjectsPage";
import AddInterestsPage from "../features/onboarding/view/AddInterestsPage";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Protected route wrapper
function RequireAuth({ children }) {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Onboarding route wrapper
function RequireOnboarding({ children }) {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('authToken');
  const hasCompletedOnboarding = localStorage.getItem('onboardingComplete');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Dashboard route wrapper
function RequireComplete({ children }) {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Onboarding routes */}
        <Route path="/onboarding">
          <Route path="skills" element={
            <RequireOnboarding>
              <AddSkillsPage />
            </RequireOnboarding>
          } />
          <Route path="projects" element={
            <RequireOnboarding>
              <AddProjectsPage />
            </RequireOnboarding>
          } />
          <Route path="interests" element={
            <RequireOnboarding>
              <AddInterestsPage />
            </RequireOnboarding>
          } />
        </Route>

        {/* Protected dashboard route */}
        <Route path="/dashboard" element={
          <RequireComplete>
            <Dashboard />
          </RequireComplete>
        } />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}