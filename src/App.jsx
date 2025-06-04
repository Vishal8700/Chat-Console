import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Chatbot from './pages/chatbot.jsx';
import Playground from './components/Playground.jsx';
import './App.css';
import NewsApp from './pages/NewsApp.jsx';
import PdfSearch from './components/PdfSearch/PdfSearch.jsx';
import VoiceConversation from './components/Conversation/VoiceConversation.jsx';


function App() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentModel, setCurrentModel] = useState('gpt4');



  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        <div className="app">

          <div className="main-content">
            <Routes>
              <Route path="/" element={
                <Chatbot
                  user={user}
                  chats={chats}
                  setChats={setChats}
                  currentChatId={currentChatId}
                  currentModel={currentModel}
                  setCurrentModel={setCurrentModel}
                />
              } />
              <Route path="/spaces" element={<Playground />} />
              <Route path="/discover" element={<NewsApp/>} />
              <Route path="/library" element={<PdfSearch/>} />
              <Route path="/conversation" element={<VoiceConversation/>} />
            </Routes>
          </div>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;