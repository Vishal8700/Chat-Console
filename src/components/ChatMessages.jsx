import React, { useState, useRef } from 'react';
import './ChatMessages.css';

function ChatMessages({ messages, isLoading, MODELS, currentModel, messagesEndRef, copyToClipboard }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [elevenLabsLoading, setElevenLabsLoading] = useState(false);
  const audioRef = useRef(new Audio());
  
  // In Vite, environment variables need to be prefixed with VITE_
  // Access them using import.meta.env instead of process.env
  const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY || 'your-api-key-here';
  
  // Default voice ID - Rachel (female voice)
  // You can change this to other voice IDs from ElevenLabs
  const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel voice
  
  const refineTextForSpeech = (text) => {
    // Remove HTML tags while preserving content
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ') // Normalize spaces
      .replace(/```[\s\S]*?```/g, 'code block omitted') // Remove code blocks
      .replace(/\[.*?\]/g, '') // Remove markdown links
      .trim();
  };
  
  // ElevenLabs TTS implementation using fetch instead of axios
  const speakWithElevenLabs = async (text) => {
    try {
      setElevenLabsLoading(true);
      
      // Limit text length for API request
      const refinedText = refineTextForSpeech(text);
      const limitedText = refinedText.slice(0, 4000); // ElevenLabs has character limits
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY
        },
        body: JSON.stringify({
          text: limitedText,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }
      
      // Get the blob data from the response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Play audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = audioUrl;
        
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl); // Clean up
        };
        
        audioRef.current.play();
        setIsSpeaking(true);
      }
      
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      // Fallback to browser TTS on error
      speakWithBrowserTTS(text);
    } finally {
      setElevenLabsLoading(false);
    }
  };
  
  // Fallback to browser TTS
  const speakWithBrowserTTS = (text) => {
    const refinedText = refineTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(refinedText);
    utterance.lang = 'en-US';
    utterance.rate = 1.3;
    utterance.pitch = 1.1;
    
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('female') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Microsoft Zira')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };
  
  // Main speak function - handles both speaking and stopping
  const speakMessage = (text) => {
    if (isSpeaking) {
      // Stop speaking
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Start speaking with ElevenLabs
      speakWithElevenLabs(text);
    }
  };

  return (
    <div className="chat-messages">
      {messages.length === 0 && (
        <div className="bot-message message">
          <div className="message-role">{MODELS[currentModel].name}</div>
          <div className="message-content">
            Hi, I'm {MODELS[currentModel].name}. How can I help you today?
          </div>
        </div>
      )}
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
        >
          <div className="message-header">
            <div className="message-role">
              {message.role === 'user' ? 'You' : MODELS[currentModel].name}
            </div>
            <div className="message-actions">
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(
                  typeof message.content === 'string' 
                    ? message.content 
                    : message.content[0].text
                )}
              >
                <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
                  <path d="M4 4v10h10V4H4zm9 9H5V5h8v8z"/>
                  <path d="M2 2v10h1V3h9V2H2z"/>
                </svg>
              </button>
              {message.role !== 'user' && (
                <button 
                  className={`speak-button ${isSpeaking ? 'speaking' : ''} ${elevenLabsLoading ? 'loading' : ''}`}
                  onClick={() => speakMessage(
                    typeof message.content === 'string' 
                      ? message.content 
                      : message.content[0].text
                  )}
                  disabled={elevenLabsLoading}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    {elevenLabsLoading ? (
                      <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z">
                        <animateTransform
                          attributeName="transform"
                          attributeType="XML"
                          type="rotate"
                          from="0 12 12"
                          to="360 12 12"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </path>
                    ) : isSpeaking ? (
                      <path d="M14,19.14H18V5.14H14M6,19.14H10V5.14H6V19.14Z" /> // Pause icon
                    ) : (
                      <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" /> // Speaker icon
                    )}
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="message-content">
            {typeof message.content === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: message.content }} />
            ) : (
              <>
                <div dangerouslySetInnerHTML={{ __html: message.content[0].text }} />
                {message.displayImage && (
                  <img 
                    src={message.displayImage} 
                    alt="User uploaded" 
                    className="message-image"
                  />
                )}
              </>
            )}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="bot-message message thinking">
          <div className="message-role">{MODELS[currentModel].name}</div>
          <div className="message-content">
            <div className="thinking-indicator">
              <div className="thinking-icon">
                {MODELS[currentModel].icon}
              </div>
              <div className="thinking-text">Thinking...</div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;