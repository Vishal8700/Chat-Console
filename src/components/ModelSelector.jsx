import { useState, useRef, useEffect } from 'react';
import './ModelSelector.css';
function ModelDropdown({ MODELS, currentModel, setCurrentModel }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleModelSelect = (modelKey) => {
    setCurrentModel(modelKey);
    setIsOpen(false);
  };

  const currentModelData = MODELS[currentModel];

  return (
    <div className="model-dropdown" ref={dropdownRef}>
      <button 
        className={`model-dropdown-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="model-icon">{currentModelData.icon}</span>
        <span>{currentModelData.name}</span>
        <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>
      
      <div className={`model-dropdown-content ${isOpen ? 'show' : ''}`}>
        {Object.entries(MODELS).map(([key, model]) => (
          <div
            key={key}
            className={`model-option ${currentModel === key ? 'selected' : ''}`}
            onClick={() => handleModelSelect(key)}
          >
            <span className="model-icon">{model.icon}</span>
            <div className="model-info">
              <span className="model-name">{model.name}</span>
              <span className="model-description">
                {model.supportsImages ? 'Supports images' : 'Text only'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModelDropdown;