

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import logo from '../assets/icon.png';
function Sidebar({ user, chats, currentChatId, currentModel, MODELS, handleLogin, handleLogout, createNewChat, setCurrentChatId, deleteChat }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items for new tabs
  const navItems = [
    { 
      id: 'home', 
      name: 'Home', 
      path: '/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    { 
      id: 'discover', 
      name: 'Discover', 
      path: '/discover',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      )
    },
    { 
      id: 'spaces', 
      name: 'Spaces', 
      path: '/spaces',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    },
    { 
      id: 'library', 
      name: 'Library', 
      path: '/library',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    },
    { 
      id: 'Live Voice', 
      name: 'Live Voice', 
      path: '/conversation',
      icon: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
            <path d="M16 4.5c1.38.83 2.25 2.34 2.25 4.25s-.87 3.42-2.25 4.25" />
            <path d="M8 4.5C6.62 5.33 5.75 6.84 5.75 8.75s.87 3.42 2.25 4.25" />
          </svg>
      )
    }
    
  ];

  // Library submenu items
  const libraryItems = [
    'supervised and unsupervised',
    'Challenges: Variability in speech',
    'extract and explain all',
    'suggest me lab category for',
    'B. Trapped or Safe time limit'
  ];

  // Check if a route is active
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img
            src={logo} // Update with actual path
            alt="Sera AI Logo"
            className="logo-image"
          />
          <span className="logo-text">Sera AI</span>
        </div>

        
        {user ? (
          <div className="user-profile">
            <img src={user.picture} alt={user.name} className="user-avatar" />
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="login-container">
            <GoogleLogin
              onSuccess={handleLogin}
              onError={() => console.log('Login Failed')}
              theme="filled_black"
              shape="pill"
              text="continue_with"
              useOneTap
            />
          </div>
        )}
        
        <button className="new-chat-button" onClick={createNewChat}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
          New Chat
        </button>
      </div>

      {/* New Navigation Tabs Section */}
      <div className="navigation-tabs">
        {navItems.map((item) => (
          <div key={item.id} className="nav-item-container">
            <button 
              className={`nav-item ${isActiveRoute(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="nav-item-text">{item.name}</span>
            </button>
            
            {/* {item.id === 'library' && !isCollapsed && (
              <div className="library-submenu">
                {libraryItems.map((subItem, index) => (
                  <div 
                    key={index} 
                    className="submenu-item"
                    onClick={() => navigate(`/library/${subItem.replace(/\s+/g, '-').toLowerCase()}`)}
                  >
                    {subItem}
                  </div>
                ))}
              </div>
            )} */}
          </div>
        ))}
      </div>

      <div className="chat-list">
        <h3 className="recent-chats-title">Recent Chats</h3>
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`chat-item ${chat.id === currentChatId ? 'active' : ''}`}
          >
            <div 
              className="chat-item-content"
              onClick={() => setCurrentChatId(chat.id)}
            >
              {MODELS && MODELS[currentModel] && MODELS[currentModel].icon}
              {chat.title}
            </div>
            <button
              className="delete-chat-button"
              onClick={() => deleteChat(chat.id)}
              aria-label="Delete chat"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
                <path d="M12 4h-1V3c0-.6-.4-1-1-1H6c-.6 0-1 .4-1 1v1H4c-.6 0-1 .4-1 1v1h10V5c0-.6-.4-1-1-1zM6 3h4v1H6V3zm5 4H5v6c0 .6.4 1 1 1h4c.6 0 1-.4 1-1V7z"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

     

      {/* Your existing collapse button */}
      <button 
        className="collapse-button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
          <path 
            d={isCollapsed ? "M9 4l6 8-6 8" : "M15 4l-6 8 6 8"} 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default Sidebar;
