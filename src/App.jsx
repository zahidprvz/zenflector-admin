// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import GenreScreen from './screens/GenreScreen';
import AudioScreen from './screens/AudioScreen';
import EditAudio from './components/EditAudio';
import AudioList from './components/AudioList';
import PrivacyPolicy from './screens/PrivacyPolicy'; // Import
import TermsOfService from './screens/TermsOfService'; // Import
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/genres" element={<GenreScreen />} />
        <Route path="/audio" element={<AudioScreen />} />
        <Route path="/audio-list" element={<AudioList />} />  {/* Add Route */}
        <Route path="/edit-audio/:id" element={<EditAudio />} />  {/* Add Route */}
        <Route path="/privacy" element={<PrivacyPolicy />} /> {/* Add route */}
        <Route path="/terms" element={<TermsOfService />} /> {/* Add route */}

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;