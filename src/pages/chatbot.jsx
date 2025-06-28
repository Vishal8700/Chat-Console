
import { useState, useRef, useEffect } from 'react'
import { GoogleLogin, GoogleOAuthProvider, googleLogout } from '@react-oauth/google'
import ChatMessages from '../components/ChatMessages';
import ChatInput from '../components/ChatInput';
import Sidebar from '../components/Sidebar';
import ModelDropdown from '../components/ModelSelector';
import './Chatbot.css';


import WeatherWidget from '../components/Weather/WeatherWidget'
const MODELS = {
  deepseek: {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek-R1',
    apiKey: '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',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M12 7L7 10V14L12 17L17 14V10L12 7Z" fill="currentColor"/>
        <circle cx="12" cy="12" r="2" fill="white"/>
      </svg>
    ),
    supportsImages: false
  },
  
  dolphin: {
    id: 'cognitivecomputations/dolphin3.0-r1-mistral-24b:free',
    name: 'Dolphin-R1',
    apiKey: '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',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.5 2 5.5 3.5 4 6C3 8 3.5 10.5 5 12C4 14 4.5 16.5 6 18C7.5 20.5 10.5 22 14 22C16 22 17.5 21 18.5 19.5C19.5 18 20 16 19 14C20.5 12.5 21 10 20 8C19 5.5 16 2 12 2Z"/>
        <path d="M9 9C9.5 9 10 9.5 10 10S9.5 11 9 11 8 10.5 8 10 8.5 9 9 9Z" fill="white"/>
        <path d="M6 12C7.5 13 9 13.5 11 13C10 14 8.5 14.5 7 14C6.5 13.5 6 13 6 12Z" fill="white"/>
      </svg>
    ),
    supportsImages: false
  },
   
  Sarvam: {
    id: 'sarvamai/sarvam-m:free',
    name: 'Sarvam AI',
    apiKey: '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',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M12 6L18 10V14L12 18L6 14V10L12 6Z" fill="currentColor"/>
        <text x="12" y="14" textAnchor="middle" fontSize="6" fill="white" fontFamily="sans-serif">स</text>
      </svg>
    ),
    supportsImages: false
  },
  
  gemini: {
    id: 'qwen/qwen3-30b-a3b:free',
    name: 'Qwin 3',
    apiKey: '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',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L3 7L12 12L21 7L12 2Z"/>
        <path d="M3 12L12 17L21 12"/>
        <path d="M3 17L12 22L21 17"/>
        <circle cx="12" cy="7" r="1.5" fill="white"/>
        <circle cx="12" cy="12" r="1.5" fill="white"/>
        <circle cx="12" cy="17" r="1.5" fill="white"/>
      </svg>
    ),
    supportsImages: false
  },
  
  qwin: {
    id: 'qwen/qwen2.5-vl-72b-instruct:free',
    name: 'Qwin 2.5',
    apiKey: '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',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M8 8L16 16M16 8L8 16" stroke="currentColor" strokeWidth="2"/>
        <circle cx="8" cy="8" r="2" fill="currentColor"/>
        <circle cx="16" cy="8" r="2" fill="currentColor"/>
        <circle cx="8" cy="16" r="2" fill="currentColor"/>
        <circle cx="16" cy="16" r="2" fill="currentColor"/>
      </svg>
    ),
    supportsImages: true
  },
  
  mistral: {
    id: 'mistralai/mistral-small-3.2-24b-instruct:free',
    name: 'mistral',
    apiKey: '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',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6C4 4.9 4.9 4 6 4H18C19.1 4 20 4.9 20 6V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V6Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M8 12L12 8L16 12L12 16L8 12Z" fill="currentColor"/>
        <path d="M12 6V10M12 14V18M6 12H10M14 12H18" stroke="white" strokeWidth="1.5"/>
      </svg>
    ),
    supportsImages: true
  },
 
  sera: {
    id: 'sera-ai',
    name: 'Sera AI',
    apiKey: '', // No API key needed for this model
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L22 9V22H2V9L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M12 7L17 10V17H7V10L12 7Z" fill="currentColor"/>
        <path d="M9 12H15" stroke="white" strokeWidth="2"/>
        <path d="M12 9V15" stroke="white" strokeWidth="2"/>
        <circle cx="12" cy="12" r="1.5" fill="white"/>
      </svg>
    ),
    supportsImages: false
  }
}
const STORAGE_KEY = 'deepseek-chat-history'
const USER_KEY = 'chat-user-data'

function Chatbot() {
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem(STORAGE_KEY)
    return savedChats ? JSON.parse(savedChats) : [{
      id: 'default',
      title: 'New Chat',
      messages: []
    }]
  })
  const [currentChatId, setCurrentChatId] = useState('default')
  const [currentModel, setCurrentModel] = useState('deepseek')
  const [input, setInput] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY)
    return savedUser ? JSON.parse(savedUser) : null
  })
  
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  const currentChat = chats.find(chat => chat.id === currentChatId) || chats[0]

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
  }, [chats])

  useEffect(() => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }, [user])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentChat.messages, isLoading])

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`
    }
  }

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: []
    }
    setChats(prev => [...prev, newChat])
    setCurrentChatId(newChat.id)
  }

  const deleteChat = (chatId) => {
    setChats(prev => {
      const newChats = prev.filter(chat => chat.id !== chatId)
      if (chatId === currentChatId) {
        setCurrentChatId(newChats[0]?.id || 'default')
      }
      return newChats.length > 0 ? newChats : [{
        id: 'default',
        title: 'New Chat',
        messages: []
      }]
    })
  }

  const handleLogin = (credentialResponse) => {
    try {
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]))
      setUser({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      })
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleLogout = () => {
    googleLogout()
    setUser(null)
  }

  const updateChatTitle = (chatId, messages) => {
    if (messages.length > 0) {
      const firstMessage = typeof messages[0].content === 'string' 
        ? messages[0].content 
        : messages[0].content[0].text
      const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '')
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, title } : chat
      ))
    }
  }

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 1024
          const MAX_HEIGHT = 1024
          let width = img.width
          let height = img.height
  
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }
  
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.8))
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    })
  }
  
  const [isImageLoading, setIsImageLoading] = useState(false)
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard')
    })
  }


  const cleanResponse = (text) => {
    // Code blocks (important to avoid parsing inner markdown)
    text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
      return `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    });

    // Convert ### Heading lines to bullet list items
    const headingLines = text.match(/^(###\s+.*\n?)+/gm);
    if (headingLines) {
      headingLines.forEach(match => {
        const listItems = match.trim().split('\n').map(line => {
          return line.replace(/^###\s+(.*)/, '<li>$1</li>');
        }).join('');
        text = text.replace(match, `<ul>${listItems}</ul>`);
      });
    }

    // Inline formatting
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');  // Bold
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');              // Italic
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');            // Inline code

    // Lists: Convert - item to <li>item</li>, wrap all in <ul>
    const listMatches = text.match(/^(\s*-\s+.*\n?)+/gm);
    if (listMatches) {
      listMatches.forEach(match => {
        const listItems = match.trim().split('\n').map(line => {
          return line.replace(/^\s*-\s+(.*)/, '<li>$1</li>');
        }).join('');
        text = text.replace(match, `<ul>${listItems}</ul>`);
      });
    }

    // Paragraph breaks: split by double newlines
    text = text.split(/\n{2,}/).map(para => `<p>${para.trim()}</p>`).join('');

    // Line breaks
    text = text.replace(/\n/g, '<br>');

    // Inline LaTeX math: \( ... \)
    text = text.replace(/\\\((.+?)\\\)/g, (match, math) => {
      return `<span class="math-inline">\\(${math.trim()}\\)</span>`;
    });

    // Remove any stray markdown brackets like [text]
    text = text.replace(/\[.*?\]/g, '');

    // LaTeX math blocks: $$...$$
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
      return `<div class="math-block">\\[${math.trim()}\\]</div>`;
    });

    // Inline math: $...$
    text = text.replace(/\$(.+?)\$/g, (match, math) => {
      return `<span class="math-inline">\\(${math.trim()}\\)</span>`;
    });

    return text.trim();
  };


  const sendMessage = async () => {
    if ((!input.trim() && !imageUrl) || isLoading) return

    let messageContent
    let userMessage

    if ((currentModel === 'qwin' || currentModel === 'mistral') && imageUrl) {
      messageContent = [
        {
          type: 'text',
          text: input.trim() || 'What is in this image?'
        },
        {
          type: 'image_url',
          image_url: {
            url: imageUrl
          }
        }
      ]
      userMessage = { 
        role: 'user', 
        content: messageContent,
        displayImage: imageUrl
      }
    } else {
      messageContent = input.trim()
      userMessage = { 
        role: 'user', 
        content: messageContent 
      }
    }

    const updatedMessages = [...currentChat.messages, userMessage]
    
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: updatedMessages }
        : chat
    ))
    
    if (currentChat.messages.length === 0) {
      updateChatTitle(currentChatId, [userMessage])
    }

    setInput('')
    setImageUrl('')
    setIsLoading(true)
    adjustTextareaHeight()

    try {
      let response;
      let data;
      
      if (currentModel === 'sera') {
        // Special handling for Sera AI model
        response = await fetch('https://sera-ai-llm-v1.onrender.com/ask', {
          method: 'POST',  // Changed from GET to POST
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            question: messageContent
          })
        });
        data = await response.json();
        const botMessage = {
          role: 'assistant',
          content: cleanResponse(data.answer || data.response || data.text || 'No response received')
        };
        
        setChats(prev => prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...updatedMessages, botMessage] }
            : chat
        ));
      } else {
        // Original OpenRouter API call for other models
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${MODELS[currentModel].apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AI Chat App'
          },
          body: JSON.stringify({
            model: MODELS[currentModel].id,
            messages: updatedMessages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          })
        });

        data = await response.json();
        const cleanedContent = cleanResponse(data.choices[0].message.content);
        const botMessage = {
          role: 'assistant',
          content: cleanedContent
        };
        
        setChats(prev => prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...updatedMessages, botMessage] }
            : chat
        ));
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      }
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...updatedMessages, errorMessage] }
          : chat
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInput = (e) => {
    setInput(e.target.value)
    adjustTextareaHeight()
  }

  return (
    <GoogleOAuthProvider clientId="887141845221-7u6tiqd99j060mstrq80oi5i0sgkdmo9.apps.googleusercontent.com">
      <div className="app-container">
        <Sidebar 
          user={user}
          chats={chats}
          currentChatId={currentChatId}
          currentModel={currentModel}
          MODELS={MODELS}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          createNewChat={createNewChat}
          setCurrentChatId={setCurrentChatId}
          deleteChat={deleteChat}
        />

        <div className="main-content">
          <div className="chat-header">
          <ModelDropdown
            MODELS={MODELS}
            currentModel={currentModel}
            setCurrentModel={setCurrentModel}
          />
            
          <div className="header-right">
            <WeatherWidget />
          </div>

          </div>

          <ChatMessages 
            messages={currentChat.messages}
            isLoading={isLoading}
            MODELS={MODELS}
            currentModel={currentModel}
            messagesEndRef={messagesEndRef}
            copyToClipboard={copyToClipboard}
          />

<ChatInput 
  MODELS={MODELS}
  currentModel={currentModel}
  input={input}
  setInput={setInput}
  imageUrl={imageUrl}
  setImageUrl={setImageUrl}
  isLoading={isLoading}
  sendMessage={sendMessage}
  textareaRef={textareaRef}
  handleInput={handleInput}
  handleKeyPress={handleKeyPress}
  handleImageUpload={handleImageUpload}
  fileInputRef={fileInputRef}
/>

        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Chatbot;