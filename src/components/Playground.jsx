

import React, { useState, useEffect } from "react";
import { Zap, Settings, Download, Copy, Shuffle, Sparkles } from "lucide-react";
import "./Playground.css";
import InspirationGallery from "./inspiration-gallery";

export default function FluxImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [seed, setSeed] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [logoRotation, setLogoRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoRotation((prev) => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const randomSeed = () => Math.floor(Math.random() * 100000000);

  const copyPrompt = () => {
    if (prompt.trim()) navigator.clipboard.writeText(prompt);
  };

  const generateRandomSeed = () => {
    setSeed(randomSeed().toString());
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError("");
    setImage(null);

    const thisSeed = seed ? Number(seed) : randomSeed();
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?width=${width}&height=${height}&seed=${thisSeed}`;

    const img = new Image();
    img.onload = () => {
      setImage({ src: imageUrl, seed: thisSeed });
      setLoading(false);
    };
    img.onerror = () => {
      setError("Failed to generate image.");
      setLoading(false);
    };
    img.src = imageUrl;
  };

  return (
    <div className="playground">
      <div className="playground-container">
        {/* Header */}
        <div className="pa-header">
          <div className="pa-header-title">
            <div
              className="pa-logo-container"
              style={{ transform: `rotate(${logoRotation}deg)` }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="custom-logo" viewBox="0 0 48 48">
                <defs>
                  <linearGradient id="logoGradient" x1="40.4" x2="9.56" y1="7.6" y2="38.44">
                    <stop offset="0" stopColor="#ec4899" />
                    <stop offset="0.5" stopColor="#8b5cf6" />
                    <stop offset="1" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <path
                  className="logo-path"
                  fill="url(#logoGradient)"
                  d="M43.1,23.96c-10.35-.41-18.65-8.71-19.06-19.06l-.04-.9-.04.9c-.41,10.35-8.71,18.65-19.06,19.06l-.9.04.9.04c10.35.41,18.65,8.71,19.06,19.06l.04.9.04-.9c.41-10.35,8.71-18.65,19.06-19.06l.9-.04-.9-.04Z"
                />
                <path
                  className="logo-stroke"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M24,44l.04-.9c.41-10.35,8.71-18.65,19.06-19.06l.9-.04-.9-.04c-3.87-.15-7.46-1.41-10.45-3.46"
                />
                <path
                  className="logo-stroke"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M27.23,14.95c-1.9-2.91-3.05-6.35-3.19-10.05l-.04-.9-.04.9c-.41,10.35-8.71,18.65-19.06,19.06l-.9.04.9.04c6.96.27,13,4.12,16.33,9.76"
                />
              </svg>
            </div>
            <h1 className="title gradient-text">POLLINATIONS AI - dev Studio</h1>
          </div>
          <p className="subtitle">Professional AI Image Generation</p>
        </div>

        <div className="grid-layout">
          {/* Controls */}
          <div className="control-panel">
            <h2 className="section-title"><Zap className="icon yellow" /> Generate Images</h2>

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
                <button onClick={copyPrompt} className="pa-copy-button" title="Copy prompt">
                  <Copy className="icon-small" />
                </button>
              </div>
            </div>

            <div className="settings-grid">
              <div>
                <label className="input-label">Dimensions</label>
                <select
                  className="select-input"
                  onChange={(e) => {
                    const [w, h] = e.target.value.split("x").map(Number);
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
            </div>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="advanced-toggle"
            >
              <Settings className="icon-small" />
              Advanced Settings
              <div className={`toggle-arrow ${showAdvanced ? "rotated" : ""}`}>▼</div>
            </button>

            <div className={`advanced-settings ${showAdvanced ? "visible" : ""}`}>
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
                  <button onClick={generateRandomSeed} className="shuffle-button" title="Random seed">
                    <Shuffle className="icon-small" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className={`generate-button ${loading || !prompt.trim() ? "disabled" : ""}`}
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

            {error && <div className="error-message">{error}</div>}
          </div>

          {/* Results */}
          <div className="results-panel">
            <h2 className="section-title">Generated Images</h2>

            {!image && !loading && (
              <div className="empty-state">
                <div className="empty-icon"><Sparkles className="sparkle-icon" /></div>
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
              {image && (
                <div className="image-card">
                  <div className="image-container">
                    <img src={image.src} alt="Generated" className="generated-image" />
                  </div>
                  <div className="image-footer">
                    <span className="seed-text">Seed: {image.seed}</span>
                    <a
                      href={image.src}
                      download={`flux1dev_${image.seed}.png`}
                      className="download-button"
                    >
                      <Download className="icon-small" />
                      Download
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="inspiration-section">
          <InspirationGallery />
        </div>
      </div>
    </div>
  );
}
