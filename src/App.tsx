import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Result from './pages/Result';
import { EmotionProvider } from './context/EmotionContext';

function App() {
  return (
    <EmotionProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/result" element={<Result />} />
            </Routes>
          </main>
        </div>
      </Router>
    </EmotionProvider>
  );
}

export default App;