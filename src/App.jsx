// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import GenreScreen from './screens/GenreScreen';
import AudioScreen from './screens/AudioScreen';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/genres" element={<GenreScreen />} />
        <Route path="/audio" element={<AudioScreen />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;