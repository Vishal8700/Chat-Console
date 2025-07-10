

import { useState, useEffect, useRef } from 'react';
import './PdfSearch.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

function PdfSearch() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [question, setQuestion] = useState('');
  const [pdfId, setPdfId] = useState(localStorage.getItem('pdf_id') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: 'How can I assist you with PDF?' }
  ]);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (pdfId) {
      localStorage.setItem('pdf_id', pdfId);
    }
  }, [pdfId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfUrl(URL.createObjectURL(file));
      uploadPdf(file);

      setChatMessages(prev => [
        ...prev,
        { role: 'system', content: `PDF "${file.name}" uploaded. You can now ask questions about it.` }
      ]);
    } else {
      alert('Please select a PDF file');
    }
  };

  const uploadPdf = async (file) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      setChatMessages(prev => [
        ...prev,
        { role: 'system', content: 'Processing PDF, please wait...' }
      ]);

      const response = await fetch('https://sera-ai-llm-v1.onrender.com/pdf_upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.pdf_id) {
        setPdfId(data.pdf_id);
        setChatMessages(prev => [
          ...prev,
          { role: 'ai', content: 'PDF processed successfully. What would you like to know about this document?' }
        ]);
      } else {
        setChatMessages(prev => [
          ...prev,
          { role: 'system', content: 'Error: No PDF ID received from server.' }
        ]);
      }
    } catch (error) {
      setChatMessages(prev => [
        ...prev,
        { role: 'system', content: `Error uploading PDF: ${error.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    if (!pdfId) {
      setChatMessages(prev => [
        ...prev,
        { role: 'system', content: 'Please upload a PDF first' }
      ]);
      return;
    }

    const userQuestion = question.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    setQuestion('');
    setIsLoading(true);

    try {
      setChatMessages(prev => [...prev, { role: 'typing', content: '' }]);

      const formData = new FormData();
      formData.append('pdf_id', pdfId);
      formData.append('question', userQuestion);

      const response = await fetch('https://sera-ai-llm-v1.onrender.com/pdf_ask', {
        method: 'POST',
        body: formData,
      });

      setChatMessages(prev => prev.filter(msg => msg.role !== 'typing'));

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const cleanedAnswer = data.answer ?
        data.answer.replace(/[^\w\s.,?!:;()\[\]{}'"\/\\-]/g, '') :
        'No answer received';

      setChatMessages(prev => [...prev, { role: 'ai', content: cleanedAnswer }]);
    } catch (error) {
      setChatMessages(prev => [
        ...prev.filter(msg => msg.role !== 'typing'),
        { role: 'system', content: `Error: ${error.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        const tooltip = document.createElement('div');
        tooltip.className = 'pdf-copy-tooltip';
        tooltip.textContent = 'Copied!';
        document.body.appendChild(tooltip);

        const mouseX = window.event.clientX;
        const mouseY = window.event.clientY;
        tooltip.style.left = `${mouseX + 10}px`;
        tooltip.style.top = `${mouseY - 30}px`;

        setTimeout(() => {
          tooltip.classList.add('fade-out');
          setTimeout(() => document.body.removeChild(tooltip), 300);
        }, 1000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  const saveChatAsPdf = async () => {
    if (chatMessages.length <= 1) {
      alert('No chat content to save.');
      return;
    }

    setIsLoading(true);

    try {
      const chatElement = chatContainerRef.current;
      const canvas = await html2canvas(chatElement, {
        backgroundColor: '#1e1e1e',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('pdf-chat-conversation.pdf');

      setChatMessages(prev => [
        ...prev,
        { role: 'system', content: 'Chat conversation saved as PDF.' }
      ]);
    } catch (error) {
      setChatMessages(prev => [
        ...prev,
        { role: 'system', content: `Error saving PDF: ${error.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pdf-app-container">
      <div className="pdf-chat-container" ref={chatContainerRef}>
        <div className="pdf-chat-header">
          <div className="pdf-chat-title-with-logo">
            <img
              src="src/assets/icon.png"  // Replace with actual path
              alt="Logo"
              className="pdf-chat-logo"
            />
            <h2>Search With Document</h2>
          </div>
          <div className="pdf-chat-actions">
            <button
              className="pdf-action-button pdf-save-pdf-button"
              onClick={saveChatAsPdf}
              title="Save conversation as PDF"
              disabled={isLoading || chatMessages.length <= 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <line x1="10" y1="9" x2="8" y2="9"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="pdf-chat-messages">
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`pdf-message pdf-${message.role}-message`}
              style={{ opacity: message.role === 'typing' ? 0.7 : 1 }}
            >
              <div className="pdf-message-bubble">
                {message.role === 'typing' ? (
                  <div className="pdf-typing-indicator"><span></span><span></span><span></span></div>
                ) : (
                  <>
                    <div className="pdf-message-content">{message.content}</div>
                    {(message.role === 'ai' || message.role === 'user') && (
                      <button
                        className="pdf-copy-button"
                        onClick={() => copyToClipboard(message.content)}
                        title="Copy text"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form className="pdf-chat-input-form" onSubmit={handleQuestionSubmit}>
          <input
            type="text"
            placeholder="Ask a question about the PDF..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading}
            className="pdf-chat-input"
          />
          <button
            type="submit"
            className="pdf-send-button"
            disabled={isLoading || !question.trim()}
          >
            Send
          </button>
        </form>
      </div>

      <div className="pdf-pdf-container">
        {!pdfUrl ? (
          <div className="pdf-upload-area">
            <button
              className="pdf-upload-button"
              onClick={handleUploadClick}
              disabled={isLoading}
            >
              Upload PDF here
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div className="pdf-pdf-viewer-container">
            <iframe
              src={pdfUrl + '#toolbar=1&navpanes=1&scrollbar=1&view=FitH'}
              className="pdf-pdf-viewer"
              title="PDF Viewer"
              allow="fullscreen"
            />
          </div>
        )}
      </div>

  
    </div>
  );
}

export default PdfSearch;
