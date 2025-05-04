import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Moon, RotateCcw, ChevronDown, AlertCircle, Download } from 'lucide-react';
import './Playground.css';

const MODELS = {
  'stable-diffusion': { name: 'Stable Diffusion 2.1', id: 'stabilityai/stable-diffusion-2-1' },
  'sdxl': { name: 'Stable Diffusion XL', id: 'stabilityai/stable-diffusion-xl-base-1.0' },
  'openjourney': { name: 'OpenJourney (Midjourney Style)', id: 'prompthero/openjourney' },
  'dreamshaper': { name: 'DreamShaper Photoreal', id: 'dreamlike-art/dreamlike-photoreal-2.0' },
};

const IMAGE_COUNTS = [1, 2, 3, 4];
const ASPECT_RATIOS = {
  '1:1': 'Square (1:1)',
  '16:9': 'Landscape (16:9)',
  '9:16': 'Portrait (9:16)',
  '4:3': 'Classic (4:3)',
};

// Add this component outside of the main Playground function
const ImageModal = ({ image, onClose }) => {
  if (!image) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
        <img src={image} alt="Preview" className="modal-image" />
      </div>
    </div>
  );
};

function Playground() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('sdxl');
  const [imageCount, setImageCount] = useState(2);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sparkleActive, setSparkleActive] = useState(false);
  
  // Use this ref to prevent infinite re-renders
  const imagesContainerRef = useRef(null);

  // Function to handle image downloads
  const downloadImage = (imageUrl, index) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Effect to add sparkle effect when images are loaded
  useEffect(() => {
    if (images.length > 0 && !loading) {
      setSparkleActive(true);
      const timer = setTimeout(() => {
        setSparkleActive(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [images, loading]);

  // Function to check for inappropriate content
  function isInappropriate(prompt) {
    const BLOCKED_TERMS = [
      'hello'
    ];
    
    const normalizedPrompt = prompt.toLowerCase();
    return BLOCKED_TERMS.some(term => normalizedPrompt.includes(term)) ||
      /\b(?:18\+|21\+|nsfw|adult(?:\s+only)?)\b/i.test(normalizedPrompt);
  }

  // Image generation function
  // Add this function near the top of your component
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Modify the image generation function to include retries
  const generateImages = async () => {
    try {
      setLoading(true);
      setError(null);
      setImages([]);
  
      if (isInappropriate(prompt)) {
        throw new Error('Your prompt contains inappropriate content. Please keep it family-friendly.');
      }
  
      const maxRetries = 3;
      const generateWithRetry = async (retryCount = 0) => {
        try {
          const response = await fetch(`https://api-inference.huggingface.co/models/${MODELS[selectedModel].id}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_HUGGING_FACE_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              inputs: prompt,
              options: {
                wait_for_model: true,
              }
            }),
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            if (errorData.error?.includes('CUDA out of memory') && retryCount < maxRetries) {
              await delay(2000); // Wait 2 seconds before retrying
              return generateWithRetry(retryCount + 1);
            }
            throw new Error(`API error: ${errorData.error || 'Unknown error'}`);
          }
  
          const buffer = await response.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
          return `data:image/jpeg;base64,${base64}`;
        } catch (error) {
          if (error.message?.includes('CUDA out of memory') && retryCount < maxRetries) {
            await delay(2000);
            return generateWithRetry(retryCount + 1);
          }
          throw error;
        }
      };
  
      const promises = Array(imageCount).fill(null).map(() => generateWithRetry());
      const newImages = await Promise.all(promises);
      setImages(newImages);
    } catch (err) {
      setError(err.message || 'Failed to generate images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Apply aspect ratio
  const getAspectRatioStyle = () => {
    let ratio = '1/1';
    
    switch(aspectRatio) {
      case '16:9':
        ratio = '16/9';
        break;
      case '9:16':
        ratio = '9/16';
        break;
      case '4:3':
        ratio = '4/3';
        break;
      default:
        ratio = '1/1';
    }
    
    return { '--aspect-ratio': ratio };
  };

  // Add this state near your other state declarations
  const [selectedImage, setSelectedImage] = useState(null);
  
  return (
    <div className="playground-container">
      <div className="playground-card">
        <div className="pa-header">
          <div className="pa-header-title">
            <div className="icon-container">
              <Sparkles />
            </div>
            <h1 className="title">AI Image Generator</h1>
          </div>
        </div>

        <div className="content">
          <div className="prompt-container">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A floating island with waterfalls pouring into clouds below..."
              className="prompt-textarea"
              rows={3}
            />
            <div className="prompt-footer">
              <div className="warning-text">
                <AlertCircle size={14} />
                Keep prompts family-friendly
              </div>
              <button onClick={() => setPrompt('')} className="theme-button">
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          <div className="controls">
            <div className="select-container">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="select"
              >
                {Object.entries(MODELS).map(([key, { name }]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>

            <div className="count-select">
              <select
                value={imageCount}
                onChange={(e) => setImageCount(Number(e.target.value))}
                className="select"
              >
                {IMAGE_COUNTS.map(count => (
                  <option key={count} value={count}>{count} Images</option>
                ))}
              </select>
            </div>

            <div className="ratio-select">
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="select"
              >
                {Object.entries(ASPECT_RATIOS).map(([ratio, label]) => (
                  <option key={ratio} value={ratio}>{label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={generateImages}
              disabled={loading || !prompt.trim()}
              className="generate-button"
            >
              {loading ? (
                <>
                  <span className="spin">⚪</span>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {loading && (
            <div className="images-grid" style={getAspectRatioStyle()}>
              {Array(imageCount).fill(null).map((_, index) => (
                <div key={`placeholder-${index}`} className="generation-placeholder" style={getAspectRatioStyle()} />
              ))}
            </div>
          )}

          {!loading && images.length > 0 && (
            <div 
              ref={imagesContainerRef}
              className={`images-grid ${sparkleActive ? 'sparkle-effect' : ''}`}
            >
              {images.map((image, index) => (
                <div key={`image-${index}`} className="image-wrapper" style={getAspectRatioStyle()}>
                  <img
                    src={image}
                    alt={`Generated image ${index + 1}`}
                    className="generated-image"
                    onClick={() => setSelectedImage(image)}
                  />
                  <div className="image-overlay">
                    <button 
                      className="download-btn"
                      onClick={() => downloadImage(image, index)}
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedImage && (
            <ImageModal 
              image={selectedImage} 
              onClose={() => setSelectedImage(null)} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Playground;