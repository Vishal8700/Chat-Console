
import { useState, useRef, useEffect } from 'react'
import { GoogleLogin, GoogleOAuthProvider, googleLogout } from '@react-oauth/google'
import ChatMessages from '../components/ChatMessages';
import ChatInput from '../components/ChatInput';
import Sidebar from '../components/Sidebar';
import ModelDropdown from '../components/ModelSelector';
import './Chatbot.css';
import katex from "katex";
import "katex/dist/katex.min.css";

import WeatherWidget from '../components/Weather/WeatherWidget'

const MODELS = {
  deepseek: {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek-R1',
    apiKey: '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',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1L2 4.5L8 8L14 4.5L8 1Z"/>
        <path d="M2 6.5V11.5L8 15L14 11.5V6.5L8 10L2 6.5Z"/>
      </svg>
    ),
    supportsImages: false
  },
  Microsoftpi: {
    id: 'microsoft/phi-4-reasoning-plus:free',
    name: 'Microsoft-pi',
    apiKey: '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',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1L2 4.5L8 8L14 4.5L8 1Z"/>
        <path d="M2 6.5V11.5L8 15L14 11.5V6.5L8 10L2 6.5Z"/>
      </svg>
    ),
    supportsImages: false
  },
  
  dolphin: {
    id: 'cognitivecomputations/dolphin3.0-r1-mistral-24b:free',
    name: 'Dolphin-R1',
    apiKey: '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',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 2C4.5 2 2 4.5 2 8C2 11.5 4.5 14 8 14C11.5 14 14 11.5 14 8C14 4.5 11.5 2 8 2ZM8 12C5.5 12 4 10.5 4 8C4 5.5 5.5 4 8 4C10.5 4 12 5.5 12 8C12 10.5 10.5 12 8 12Z"/>
        <path d="M8 6C6.9 6 6 6.9 6 8C6 9.1 6.9 10 8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6Z"/>
      </svg>
    ),
    supportsImages: false
  },
   
  moonshot: {
    id: 'moonshotai/moonlight-16b-a3b-instruct:free',
    name: 'Moonshot-ai',
    apiKey: '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',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 12.6C4.4 13.6 1.4 10.6 1.4 8S4.4 2.4 8 2.4s6.6 3 6.6 6.6-3 6.6-6.6 6.6z"/>
        <path d="M8 3.5C5 3.5 2.5 6 2.5 9s2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5S11 3.5 8 3.5zm0 9.9c-2.4 0-4.4-2-4.4-4.4S5.6 4.6 8 4.6s4.4 2 4.4 4.4-2 4.4-4.4 4.4z"/>
      </svg>
    ),
    supportsImages: false
  },
  gemini: {
    id: 'google/gemma-3-1b-it:free',
    name: 'Gemini-3.1b',
    apiKey: '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',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0L3 3V7C3 10.3137 5.13401 13.1159 8 14C10.866 13.1159 13 10.3137 13 7V3L8 0Z"/>
      </svg>
    ),
    supportsImages: false
  },
  qwin: {
    id: 'qwen/qwen2.5-vl-3b-instruct:free',
    name: 'Qwin 2.5',
    apiKey: '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',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
        <path d="M21 12C21.0013 13.7425 20.9053 15.4852 20.712 17.2199L20.6948 17.3739C20.4473 19.5951 18.7041 21.357 16.48 21.6342L15.5738 21.7471C15.079 21.8088 14.8316 21.8396 14.5845 21.8654C12.866 22.0449 11.1335 22.0449 9.41505 21.8654C9.16792 21.8396 8.92051 21.8088 8.42569 21.7471L7.41019 21.6206C5.24868 21.3512 3.55266 19.6422 3.30532 17.4844C2.89823 13.9329 2.89823 10.3467 3.30532 6.79516L3.32102 6.65818C3.56225 4.55367 5.15124 2.85176 7.23936 2.4614L7.4544 2.4212C10.4585 1.8596 13.541 1.8596 16.5451 2.42119L16.8681 2.48157C18.8934 2.86019 20.4367 4.50764 20.6774 6.54809C20.7345 7.03145 20.7839 7.51548 20.8258 8" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M17 6C16.2804 6.60263 14.49 7.5 12 7.5C9.51 7.5 7.71957 6.60263 7 6" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    supportsImages: true
  },
  gemma: {
    id: 'google/gemma-3-1b-it:free',
    name: 'Gemma-3.1b',
    apiKey: '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',
    icon: (
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" strokeWidth="3" stroke="currentColor" fill="none">
        <circle cx="34.52" cy="11.43" r="5.82"></circle>
        <circle cx="53.63" cy="31.6" r="5.82"></circle>
        <circle cx="34.52" cy="50.57" r="5.82"></circle>
        <circle cx="15.16" cy="42.03" r="5.82"></circle>
        <circle cx="15.16" cy="19.27" r="5.82"></circle>
        <circle cx="34.51" cy="29.27" r="4.7"></circle>
        <line x1="20.17" y1="16.3" x2="28.9" y2="12.93"></line>
        <line x1="38.6" y1="15.59" x2="49.48" y2="27.52"></line>
        <line x1="50.07" y1="36.2" x2="38.67" y2="46.49"></line>
        <line x1="18.36" y1="24.13" x2="30.91" y2="46.01"></line>
        <line x1="20.31" y1="44.74" x2="28.7" y2="48.63"></line>
        <line x1="17.34" y1="36.63" x2="31.37" y2="16.32"></line>
        <line x1="20.52" y1="21.55" x2="30.34" y2="27.1"></line>
        <line x1="39.22" y1="29.8" x2="47.81" y2="30.45"></line>
        <line x1="34.51" y1="33.98" x2="34.52" y2="44.74"></line>
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

    if ((currentModel === 'gemini' || currentModel === 'gemma' || currentModel === 'qwin' || currentModel === 'deepseekv3'|| currentModel === 'gemma') && imageUrl) {
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
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
      })

      const data = await response.json()
      const cleanedContent = cleanResponse(data.choices[0].message.content)
      const botMessage = {
        role: 'assistant',
        content: cleanedContent
      }
      
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...updatedMessages, botMessage] }
          : chat
      ))
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
    <GoogleOAuthProvider clientId="887141845221-7u6tiqd99j060mstrq80oi5i0sgk4a9a.apps.googleusercontent.com">
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