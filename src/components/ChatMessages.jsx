import React, { useState, useRef, useEffect } from 'react';
import './ChatMessages.css';

function ChatMessages({ messages, isLoading, MODELS, currentModel, messagesEndRef, copyToClipboard }) {
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Ensure voices are loaded
    if (typeof window !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const refineTextForSpeech = (text) => {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/```[\s\S]*?```/g, 'code block omitted')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/[#*_~`]/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const speakWithBrowserTTS = (text, messageId) => {
    const refinedText = refineTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(refinedText);
    utterance.lang = 'en-US';
    utterance.rate = 1.2;
    utterance.pitch = 1.1;

    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice =>
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('zira')
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onend = () => setSpeakingMessageId(null);

    speechSynthesis.cancel(); // stop any current speech
    speechSynthesis.speak(utterance);
    setSpeakingMessageId(messageId);
  };

  const speakMessage = (text, messageId) => {
    if (speakingMessageId === messageId) {
      // Stop the same message
      speechSynthesis.cancel();
      setSpeakingMessageId(null);
    } else {
      // Stop previous and play new
      speechSynthesis.cancel();
      speakWithBrowserTTS(text, messageId);
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
                  className={`speak-button ${speakingMessageId === index ? 'speaking' : ''}`}
                  onClick={() => speakMessage(
                    typeof message.content === 'string' 
                      ? message.content 
                      : message.content[0].text,
                    index
                  )}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    {speakingMessageId === index ? (
                      <path d="M14,19.14H18V5.14H14M6,19.14H10V5.14H6V19.14Z" />
                    ) : (
                      <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
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
              <div className="thinking-icon">{MODELS[currentModel].icon}</div>
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
