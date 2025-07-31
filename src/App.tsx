import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import InfoPage from './pages/InfoPage';
import PicturesPage from './pages/PicturesPage';
import AdminPage from './pages/AdminPage';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/kalender" replace />} />
            <Route path="kalender" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
            <Route path="info" element={<ProtectedRoute><InfoPage /></ProtectedRoute>} />
            <Route path="bilder" element={<ProtectedRoute><PicturesPage /></ProtectedRoute>} />
            <Route 
              path="admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
          </Route>
          
          <Route path="*" element={<Navigate to="/kalender" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;