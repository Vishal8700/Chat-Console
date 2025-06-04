
import React, { useState, useEffect } from "react";
import { Zap, Settings, Download, Copy, Shuffle, Sparkles } from "lucide-react";
import "./Playground.css";
const HF_API_TOKEN = "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";
const MODEL_ID = "black-forest-labs/FLUX.1-dev";
import InspirationGallery from "./inspiration-gallery"

// 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
export default function FluxImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [steps, setSteps] = useState(30);
  const [guidanceScale, setGuidanceScale] = useState(3.5);
  const [seed, setSeed] = useState("");
  const [count, setCount] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [logoRotation, setLogoRotation] = useState(0);

  // Animate logo rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoRotation(prev => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Helper for random seed
  const randomSeed = () => Math.floor(Math.random() * 100000000);

  const generateImages = async () => {
    setLoading(true);
    setError("");
    setImages([]);
    try {
      const promises = [];
      for (let i = 0; i < count; i++) {
        const thisSeed = seed ? Number(seed) : randomSeed();
        promises.push(
          fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${HF_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: prompt,
              parameters: {
                height: Number(height),
                width: Number(width),
                guidance_scale: Number(guidanceScale),
                num_inference_steps: Number(steps),
                seed: thisSeed,
              },
              options: { wait_for_model: true },
            }),
          })
            .then(async (res) => {
              if (!res.ok) {
                let err = await res.json();
                throw new Error(err.error || "Failed to generate image");
              }
              const buffer = await res.arrayBuffer();
              const base64 = btoa(
                String.fromCharCode(...new Uint8Array(buffer))
              );
              return {
                src: "data:image/png;base64," + base64,
                seed: thisSeed,
              };
            })
        );
      }
      const results = await Promise.all(promises);
      setImages(results);
    } catch (e) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
  };

  const generateRandomSeed = () => {
    setSeed(randomSeed().toString());
  };

  return (
    <div className="playground">
      <div className="playground-container">
        {/* Header with Animated Logo */}
        <div className="pa-header">
          <div className="pa-header-title">
            <div 
              className="pa-logo-container"
              style={{ transform: `rotate(${logoRotation}deg)` }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="custom-logo" viewBox="0 0 48 48">
                <defs>
                  <linearGradient id="logoGradient" x1="40.4" x2="9.56" y1="7.6" y2="38.44" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#ec4899"></stop>
                    <stop offset="0.5" stopColor="#8b5cf6"></stop>
                    <stop offset="1" stopColor="#3b82f6"></stop>
                  </linearGradient>
                </defs>
                <path className="logo-path" fill="url(#logoGradient)" d="M43.1,23.96c-10.35-.41-18.65-8.71-19.06-19.06l-.04-.9-.04.9c-.41,10.35-8.71,18.65-19.06,19.06l-.9.04.9.04c10.35.41,18.65,8.71,19.06,19.06l.04.9.04-.9c.41-10.35,8.71-18.65,19.06-19.06l.9-.04-.9-.04Z"></path>
                <path className="logo-stroke" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M24,44l.04-.9c.41-10.35,8.71-18.65,19.06-19.06l.9-.04-.9-.04c-3.87-.15-7.46-1.41-10.45-3.46"></path>
                <path className="logo-stroke" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M27.23,14.95c-1.9-2.91-3.05-6.35-3.19-10.05l-.04-.9-.04.9c-.41,10.35-8.71,18.65-19.06,19.06l-.9.04.9.04c6.96.27,13,4.12,16.33,9.76"></path>
              </svg>
            </div>
            <h1 className="title gradient-text">FLUX.1-dev Studio</h1>
          </div>
          <p className="subtitle">Professional AI Image Generation</p>
        </div>

        <div className="grid-layout">
          {/* Control Panel */}
          <div className="control-panel">
            <h2 className="section-title">
              <Zap className="icon yellow" />
              Generate Images
            </h2>

            {/* Prompt Input */}
            <div className="input-group">
              <label className="input-label">Prompt</label>
              <div className="textarea-container">
                <textarea
                  rows={3}
                  className="prompt-textarea"
                  placeholder="Describe your image... (e.g., 'A majestic dragon soaring through clouds')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button
                  onClick={copyPrompt}
                  className="pa-copy-button"
                  title="Copy prompt"
                >
                  <Copy className="icon-small" />
                </button>
              </div>
            </div>

            {/* Quick Settings */}
            <div className="settings-grid">
              <div>
                <label className="input-label">Dimensions</label>
                <select 
                  className="select-input"
                  onChange={(e) => {
                    const [w, h] = e.target.value.split('x').map(Number);
                    setWidth(w);
                    setHeight(h);
                  }}
                  value={`${width}x${height}`}
                >
                  <option value="1024x1024">Square (1024×1024)</option>
                  <option value="1344x768">Landscape (1344×768)</option>
                  <option value="768x1344">Portrait (768×1344)</option>
                  <option value="1536x640">Wide (1536×640)</option>
                </select>
              </div>
              <div>
                <label className="input-label">Count</label>
                <select 
                  className="select-input"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                >
                  <option value={1}>1 Image</option>
                 
                </select>
              </div>
            </div>

            {/* Advanced Settings Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="advanced-toggle"
            >
              <Settings className="icon-small" />
              Advanced Settings
              <div className={`toggle-arrow ${showAdvanced ? 'rotated' : ''}`}>▼</div>
            </button>

            {/* Advanced Settings */}
            <div className={`advanced-settings ${showAdvanced ? 'visible' : ''}`}>
              <div className="settings-grid">
                <div>
                  <label className="input-label">Steps: {steps}</label>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    value={steps}
                    onChange={(e) => setSteps(Number(e.target.value))}
                    className="range-input"
                  />
                </div>
                <div>
                  <label className="input-label">Guidance: {guidanceScale}</label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.1}
                    value={guidanceScale}
                    onChange={(e) => setGuidanceScale(Number(e.target.value))}
                    className="range-input"
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Seed (Optional)</label>
                <div className="seed-input-group">
                  <input
                    type="number"
                    placeholder="Random seed"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    className="number-input"
                  />
                  <button
                    onClick={generateRandomSeed}
                    className="shuffle-button"
                    title="Generate random seed"
                  >
                    <Shuffle className="icon-small" />
                  </button>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateImages}
              disabled={loading || !prompt.trim()}
              className={`generate-button ${loading || !prompt.trim() ? 'disabled' : ''}`}
            >
              {loading ? (
                <div className="loading-content">
                  <div className="spinner"></div>
                  Generating Magic...
                </div>
              ) : (
                <div className="button-content">
                  <Zap className="icon-small" />
                  Generate Images
                </div>
              )}
            </button>

            {/* Error Display */}
            {error && (
              <div className="error-message">{error}</div>
            )}
          </div>

          {/* Results Panel */}
          <div className="results-panel">
            <h2 className="section-title">Generated Images</h2>
            
            {images.length === 0 && !loading && (
              <div className="empty-state">
                <div className="empty-icon">
                  <Sparkles className="sparkle-icon" />
                </div>
                <p className="empty-title">Ready to create amazing images!</p>
                <p className="empty-subtitle">Enter a prompt and click generate</p>
              </div>
            )}

            {loading && (
              <div className="loading-state">
                <div className="loading-spinner">
                  <div className="spinner-ring"></div>
                  <div className="spinner-core"></div>
                </div>
                <p className="loading-title">Creating your masterpiece...</p>
                <p className="loading-subtitle">This may take a few moments</p>
              </div>
            )}

            <div className="images-grid">
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  className="image-card"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="image-container">
                    <img
                      src={img.src}
                      alt="Generated"
                      className="generated-image"
                    />
                  </div>
                  <div className="image-footer">
                    <span className="seed-text">Seed: {img.seed}</span>
                    <a 
                      href={img.src} 
                      download={`flux1dev_${img.seed}.png`}
                      className="download-button"
                    >
                      <Download className="icon-small" />
                      Download
                    </a>
                  </div>
                </div>
              ))}
              
            </div>
          </div>
        </div>

        {/* Add Inspiration Gallery */}
        <div className="inspiration-section">
          <InspirationGallery />
        </div>
      </div>
    </div>
  );
}