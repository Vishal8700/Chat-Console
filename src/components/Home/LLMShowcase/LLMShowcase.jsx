
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import "./LLMShowcase.css"

// SVG Icons Components
const BrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.33 12.91c.09-.09.15-.2.15-.33s-.06-.24-.15-.33L15.91 6.83c-.09-.09-.2-.15-.33-.15s-.24.06-.33.15L12 10.08 8.75 6.83c-.09-.09-.2-.15-.33-.15s-.24.06-.33.15L2.67 12.25c-.09.09-.15.2-.15.33s.06.24.15.33l5.42 5.42c.09.09.2.15.33.15s.24-.06.33-.15L12 14.58l3.25 3.25c.09.09.2.15.33.15s.24-.06.33-.15l5.42-5.42z" />
  </svg>
)

const DolphinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 5-5v10zm2-5l5-5v10l-5-5z" />
  </svg>
)

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
)

const LightningIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 2v11h3v9l7-12h-4l4-8z" />
  </svg>
)
const WebSearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l4.25 4.25c.41.41 1.09.41 1.5 0s.41-1.09 0-1.5L15.5 14zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
)

const FlagIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
  </svg>
)

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const PaletteIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.5 1.02 4.77 2.67 6.41.82.82 1.92 1.27 3.08 1.27 1.16 0 2.26-.45 3.08-1.27L12 18.24l.17.17c.82.82 1.92 1.27 3.08 1.27s2.26-.45 3.08-1.27C19.98 16.77 21 14.5 21 12c0-4.97-4.03-9-9-9z" />
  </svg>
)

const NewsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
  </svg>
)

const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
  </svg>
)

const QuestionIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
  </svg>
)

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
)
const VoiceIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 3-1.34 3-3V5a3 3 0 1 0-6 0v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
  </svg>
)


const RobotIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c-1.1 0-2 .9-2 2v1H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-2V4c0-1.1-.9-2-2-2zm0 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
  </svg>
)

const llmModels = [
  {
    name: "DeepSeek",
    type: "Reasoning Model",
    icon: <BrainIcon />,
    description:
      "Advanced reasoning capabilities with deep analytical thinking. Excels at complex problem-solving and mathematical computations.",
    features: ["Reasoning", "Math", "Code", "Analysis"],
  },
  {
    name: "Dolphin",
    type: "Conversational AI",
    icon: <DolphinIcon />,
    description:
      "Highly intelligent conversational model with excellent understanding of context and nuanced communication.",
    features: ["Chat", "Context", "Creative", "Helpful"],
  },
  {
    name: "Qwen",
    type: "Multilingual Model",
    icon: <GlobeIcon />,
    description:
      "Powerful multilingual capabilities with strong performance across different languages and cultural contexts.",
    features: ["Multilingual", "Cultural", "Translation", "Global"],
  },
  {
    name: "Mistral",
    type: "Efficient Model",
    icon: <LightningIcon />,
    description:
      "High-performance model optimized for speed and efficiency while maintaining excellent quality outputs.",
    features: ["Fast", "Efficient", "Quality", "Optimized"],
    
  },
  {
    name: "Sravan AI",
    type: "Indian AI Model",
    icon: <FlagIcon />,
    description: "Proudly Indian AI model designed with deep understanding of Indian languages, culture, and context.",
    features: ["Indian Languages", "Cultural Context", "Local Knowledge", "Desi"],
    isIndian: true,
  },
  {
    name: "Sera AI",
    type: "Custom AI Model",
    icon: <StarIcon />,
    description: "Our proprietary AI model fine-tuned for specific use cases with advanced multimodal capabilities.",
    features: ["Custom", "Multimodal", "Specialized", "Advanced"],
    isCustom: true,
  },
]

const aiFeatures = [
  {
    icon: <PaletteIcon />,
    title: "Image Generation",
    description:
      "Create stunning, high-quality images from text descriptions using advanced AI models. Perfect for creative projects and visual content.",
  },
  {
    icon: <NewsIcon />,
    title: "News Explorer",
    description:
      "Stay updated with intelligent news aggregation and analysis. Get personalized news summaries and trending topics.",
  },
  {
    icon: <DocumentIcon />,
    title: "Document Summarizer",
    description:
      "Instantly summarize long documents, research papers, and reports. Extract key insights and important information.",
  },
  {
    icon: <QuestionIcon />,
    title: "Question Answering",
    description:
      "Get accurate answers to complex questions across various domains. Powered by our advanced reasoning models.",
  },
  {
    icon: <SearchIcon />,
    title: "Image-Based Search",
    description:
      "Search and analyze images with AI. Extract text, identify objects, and get detailed descriptions from visual content.",
  },
  {
    icon: <RobotIcon />,
    title: "Multi-Modal AI",
    description:
      "Combine text, images, and data for comprehensive AI assistance. Handle complex tasks across different media types.",
  },
  {
  icon: <WebSearchIcon />,
  title: "Web Search",
  description:
    "Fetch real-time data directly from the internet. Perfect for accessing up-to-date information, news, and trends.",
},
{
  icon: <VoiceIcon />,
  title: "Voice Conversation",
  description:
    "Interact with AI using your voice. Get hands-free responses and engage in natural, real-time spoken dialogue.",
}


]

export default function LLMShowcase() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <motion.section ref={ref} className="llm-showcase-section">
      <div className="llm-showcase-container">
        <motion.h2
          className="llm-showcase-title"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Our AI Models
        </motion.h2>

        <motion.p
          className="llm-showcase-subtitle"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Experience the power of cutting-edge AI with our diverse collection of language models, including our
          custom-built solutions and proudly Indian AI technology.
        </motion.p>

        <div className="llm-models-grid">
          {llmModels.map((model, index) => (
            <motion.div
              key={index}
              className={`llm-model-card ${model.isCustom ? "custom-ai-card" : ""} ${model.isIndian ? "indian-ai-card" : ""}`}
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.02,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
            >
              <div className="llm-model-header">
                <div className="llm-model-icon">{model.icon}</div>
                <div className="llm-model-info">
                  <h3>{model.name}</h3>
                  <span className="model-type">{model.type}</span>
                </div>
              </div>

              <p className="llm-model-description">{model.description}</p>

              <div className="llm-model-features">
                {model.features.map((feature, featureIndex) => (
                  <motion.span
                    key={featureIndex}
                    className="feature-tag"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                    viewport={{ once: true }}
                  >
                    {feature}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="ai-features-section">
          <motion.h3
            className="ai-features-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            AI-Powered Features
          </motion.h3>

          <div className="ai-features-grid">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="ai-feature-card"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 120,
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  rotateZ: 1,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="ai-feature-icon">{feature.icon}</div>
                <h4 className="ai-feature-title">{feature.title}</h4>
                <p className="ai-feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
