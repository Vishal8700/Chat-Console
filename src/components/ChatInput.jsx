
import { useRef, useState } from 'react';
import './ChatInput.css';
import { useEffect } from 'react';

function ChatInput({ 
  MODELS, 
  currentModel,
  input, 
  setInput, 
  imageUrl, 
  setImageUrl, 
  isLoading, 
  sendMessage, 
  textareaRef, 
  handleInput, 
  handleKeyPress 
}) {
  const fileInputRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  // Add speech recognition handler
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setInput('Listening...');
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setInput('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      if (!isListening) {
        recognition.start();
      } else {
        recognition.stop();
        setInput('');
      }
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
useEffect(() => {
  const textarea = textareaRef.current;
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}, [input]);


  return (
    <div className="input-container">
      <div className="input-wrapper">
        {MODELS[currentModel].supportsImages && (
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <button 
              className="image-button"
              onClick={() => fileInputRef.current.click()}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M12 2C11.4477 2 11 2.44772 11 3V11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H11V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H13V3C13 2.44772 12.5523 2 12 2Z" fill="#ffffff"/>
              </svg>
            </button>
            {imageUrl && (
            <div className="image-preview">
              <img src={imageUrl} alt="Preview" />
              <button onClick={() => setImageUrl('')}>×</button>
            </div>
          )}

          </div>
        )}
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={input}
          onChange={handleInput}
          onKeyPress={handleKeyPress}
          placeholder={`Message ${MODELS[currentModel].name}...`}
          disabled={isLoading}
          rows={1}
        />
        <button 
          className={`mic-button ${isListening ? 'listening' : ''}`}
          onClick={handleVoiceInput}
          title={isListening ? 'Stop listening' : 'Start listening'}
        >
          <svg viewBox="0 0 24 24" fill={isListening ? '#ff4444' : 'currentColor'} width="24" height="24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </button>
        <button
          className="send-button"
          onClick={sendMessage}
          disabled={isLoading || (!input.trim() && !imageUrl)}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default ChatInput;