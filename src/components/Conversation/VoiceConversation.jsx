

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './VoiceConversation.css';

const VoiceConversation = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState(null);

  const recognition = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const micStreamRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const isCleaningUpRef = useRef(false);
  const particlesRef = useRef([]);

  // Generate particles for visual effect
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 320; i++) {
        const angle = (i / 120) * 2 * Math.PI;
        const radius = 120 + Math.random() * 30;
        newParticles.push({
          id: i,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          baseX: Math.cos(angle) * radius,
          baseY: Math.sin(angle) * radius,
          angle: angle,
        });
      }
      particlesRef.current = newParticles;
      console.log('Particles generated:', newParticles);
      setParticlesUpdated(Date.now());
    };
    generateParticles();
  }, []);

  // Animate particles based on audio level
  useEffect(() => {
    let animationFrameId = null;

    const animateParticles = () => {
      if (!isListening || audioLevel <= 0) {
        animationFrameId = requestAnimationFrame(animateParticles);
        return;
      }

      particlesRef.current = particlesRef.current.map(particle => ({
        ...particle,
        x: particle.baseX + (Math.random() - 0.5) * audioLevel * 2,
        y: particle.baseY + (Math.random() - 0.5) * audioLevel * 2,
      }));

      setParticlesUpdated(Date.now());
      animationFrameId = requestAnimationFrame(animateParticles);
    };

    if (isListening && audioLevel > 0) {
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isListening, audioLevel]);

  const [particlesUpdated, setParticlesUpdated] = useState(Date.now());

  // Cleanup function
  const cleanup = useCallback(() => {
    if (isCleaningUpRef.current) return;
    isCleaningUpRef.current = true;

    if (recognition.current) {
      try {
        recognition.current.stop();
        recognition.current.abort();
      } catch (e) {}
    }

    if (speechSynthesisRef.current || window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }

    if (micStreamRef.current) {
      try {
        micStreamRef.current.getTracks().forEach(track => {
          if (track.readyState === 'live') {
            track.stop();
          }
        });
      } catch (e) {}
      micStreamRef.current = null;
    }

    setIsListening(false);
    setIsSpeaking(false);
    setAudioLevel(0);
    isCleaningUpRef.current = false;
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.interimResults = true;
    recognition.current.lang = 'en-US';
    recognition.current.maxAlternatives = 1;

    recognition.current.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      setTranscript(interimTranscript || finalTranscript);

      if (finalTranscript.trim()) {
        handleSendMessage(finalTranscript.trim());
      }
    };

    recognition.current.onerror = (event) => {
      if (event.error === 'no-speech') {
        setTimeout(() => {
          if (!isCleaningUpRef.current && !isSpeaking && !isProcessing) {
            try {
              recognition.current.start();
            } catch (e) {
              setIsListening(true); // not chnage this 
            }
          }
        }, 2000); // dont chnage this 
      } else {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
        setTranscript('');
      }
    };

    recognition.current.onend = () => {
      setIsListening(false);
      setTranscript('');
    };

    recognition.current.onstart = () => {
      setError(null);
    };

    return cleanup;
  }, [cleanup]);

  // Handle page unload/refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanup();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cleanup();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cleanup();
    };
  }, [cleanup]);

  const startAudioMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      micStreamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (!analyserRef.current || isCleaningUpRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        setAudioLevel(Math.min(average / 2, 100));
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    } catch (error) {
      setError('Could not access microphone. Please check permissions.');
    }
  };

  const stopAudioMonitoring = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }

    if (micStreamRef.current) {
      try {
        micStreamRef.current.getTracks().forEach(track => {
          if (track.readyState === 'live') {
            track.stop();
          }
        });
      } catch (e) {}
      micStreamRef.current = null;
    }

    setAudioLevel(0);
  };

  const startListening = async () => {
    if (!recognition.current || isListening || isProcessing || isSpeaking) {
      return;
    }

    try {
      setIsListening(true);
      setTranscript('');
      setError(null);
      await startAudioMonitoring();
      recognition.current.start();
    } catch (error) {
      // setError('Failed to start listening'); 
      setIsListening(true); // not chnage here 
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      try {
        recognition.current.stop();
      } catch (e) {}
      stopAudioMonitoring();
      setIsListening(false);
      setTranscript('');
    }
  };

  const processTextForSpeech = (text) => {
    // Replace asterisks in lists (e.g., "* item" -> "1. item") for natural speech
    let counter = 1;
    let processedText = text.replace(/\* ([^\n]+)/g, (match, item) => {
      return `${counter++}. ${item}`;
    });
    // Handle standalone asterisks or emphasis (e.g., "*word*" -> "word")
    processedText = processedText.replace(/\*([^*]+)\*/g, '$1');
    return processedText;
  };

  const speakText = (text) => {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      if (isListening) {
        stopListening();
      }

      window.speechSynthesis.cancel();

      setTimeout(() => {
        const processedText = processTextForSpeech(text);
        const utterance = new window.SpeechSynthesisUtterance(processedText);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          speechSynthesisRef.current = null;
          if (!isCleaningUpRef.current && !isProcessing) {
            setTimeout(() => {
              if (!isCleaningUpRef.current && !isSpeaking && !isProcessing) {
                startListening();
              }
            }, 50);
          }
          resolve();
        };

        utterance.onerror = (event) => {
          setIsSpeaking(false);
          speechSynthesisRef.current = null;
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        speechSynthesisRef.current = utterance;

        if (window.speechSynthesis.getVoices().length === 0) {
          window.speechSynthesis.addEventListener('voiceschanged', () => {
            window.speechSynthesis.speak(utterance);
          }, { once: true });
        } else {
          window.speechSynthesis.speak(utterance);
        }
      }, 1000);
    });
  };

  const callGeminiAPI = async (messages) => {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY';
    const MAX_RETRIES = 3;
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        const prompt = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
        console.log('Sending to Gemini:', prompt);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt + '\n\nPlease provide a brief, conversational response suitable for voice interaction.',
              }],
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 150,
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Gemini API error:', response.status, errorText);

          if (response.status === 503 || response.status === 429) {
            retries++;
            if (retries < MAX_RETRIES) {
              console.log(`Retrying in ${1000 * retries}ms...`);
              await new Promise(resolve => setTimeout(resolve, 1000 * retries));
              continue;
            }
          }
          throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Gemini API response:', data);

        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
          throw new Error('No response text received from Gemini');
        }

        return responseText.trim();
      } catch (error) {
        console.error(`Attempt ${retries + 1} failed:`, error);
        if (retries === MAX_RETRIES - 1) {
          throw error;
        }
        retries++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
  };

  const handleSendMessage = useCallback(async (message) => {
    setIsProcessing(true);
    setError(null);
    try {
      const userMessage = { role: 'user', content: message };
      setConversation(prev => [...prev, userMessage]);
      let storedConversation = [];
      try {
        const stored = localStorage.getItem('voiceConversation');
        storedConversation = stored ? JSON.parse(stored) : [];
      } catch (e) {
        storedConversation = [];
      }
      const fullConversation = [...storedConversation, userMessage];

      let response;
      // Check if the message is asking about the developer
      const lowerMessage = message.toLowerCase();
      if (
        lowerMessage.includes('developer') ||
        lowerMessage.includes('creator') ||
        lowerMessage.includes('who made you') ||
        lowerMessage.includes('who created you')
      ) {
        response = 'I was developed by Vishal Kumar, a BTech fourth-year student at NSUT.';
      } else {
        response = await callGeminiAPI(fullConversation);
      }

      const assistantMessage = { role: 'assistant', content: response };
      const updatedConversation = [...fullConversation, assistantMessage];
      setConversation(updatedConversation);
      try {
        localStorage.setItem('voiceConversation', JSON.stringify(updatedConversation));
      } catch (e) {}
      await speakText(response);
    } catch (error) {
      setError(`Error: ${error.message}`);
      const errorMessage = 'Sorry, I encountered an error processing your request.';
      try {
        await speakText(errorMessage);
      } catch (speechError) {}
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearConversation = () => {
    cleanup();
    setConversation([]);
    setError(null);
    try {
      localStorage.removeItem('voiceConversation');
    } catch (e) {}
  };

  const getStatusText = () => {
    if (error) return error;
    if (isProcessing) return 'Processing...';
    if (isSpeaking) return 'Speaking...';
    if (isListening) return 'Listening...';
    return 'Tap to speak';
  };

  const getParticleClassName = () => {
    if (isSpeaking) return 'speaking';
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    return '';
  };

  return (
    <div className="voice-conversation">
      <div className="voice-interface">
        <div className="particle-container">
          <div className={`particle-circle ${getParticleClassName()}`}>
            {particlesRef.current.map(particle => (
              <div
                key={particle.id}
                className="particle"
                style={{
                  left: `calc(50% + ${particle.x}px)`,
                  top: `calc(50% + ${particle.y}px)`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="controls">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`voice-button ${isListening ? 'listening' : ''}`}
          >
            {isListening ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="4" width="4" height="16" fill="#333" />
                <rect x="14" y="4" width="4" height="16" fill="#333" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="3" width="6" height="12" rx="3" fill="white" />
                <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="white" strokeWidth="2" />
                <line x1="12" y1="19" x2="12" y2="22" stroke="white" strokeWidth="2" />
                <line x1="8" y1="22" x2="16" y2="22" stroke="white" strokeWidth="2" />
              </svg>
            )}
          </button>
          <button onClick={clearConversation} className="clear-button-round" title="Clear Conversation">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block', margin: 'auto' }}
            >
              <line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
                stroke="#e53935"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
                stroke="#e53935"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="status">
          <div className="status-text">{getStatusText()}</div>
          {transcript && (
            <div className="transcript">"{transcript}"</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceConversation;