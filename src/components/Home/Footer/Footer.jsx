"use client"
import { motion } from "framer-motion"
import "./Footer.css"

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.footer
      className="footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="footer-container">
        <motion.div className="footer-section" variants={itemVariants}>
          <div className="footer-logo">
            <LogoIcon />
            <span>AI Excellence</span>
          </div>
          <p>
            Empowering the future with cutting-edge AI technology. From advanced language models to custom solutions,
            we're building the next generation of artificial intelligence.
          </p>
          <div className="social-links">
            <motion.a
              href="#"
              className="social-link"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <TwitterIcon />
            </motion.a>
            <motion.a
              href="#"
              className="social-link"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <LinkedInIcon />
            </motion.a>
            <motion.a
              href="#"
              className="social-link"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <GithubIcon />
            </motion.a>
            <motion.a
              href="#"
              className="social-link"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <EmailIcon />
            </motion.a>
          </div>
        </motion.div>

        <motion.div className="footer-section" variants={itemVariants}>
          <h3>AI Models</h3>
          <ul>
            <li>
              <a href="#">DeepSeek</a>
            </li>
            <li>
              <a href="#">Dolphin</a>
            </li>
            <li>
              <a href="#">Qwen</a>
            </li>
            <li>
              <a href="#">Mistral</a>
            </li>
            <li>
              <a href="#">Sravan AI</a>
            </li>
            <li>
              <a href="#">Sera AI</a>
            </li>
          </ul>
        </motion.div>

        <motion.div className="footer-section" variants={itemVariants}>
          <h3>Features</h3>
          <ul>
            <li>
              <a href="#">Image Generation</a>
            </li>
            <li>
              <a href="#">News Explorer</a>
            </li>
            <li>
              <a href="#">Document Summarizer</a>
            </li>
            <li>
              <a href="#">Question Answering</a>
            </li>
            <li>
              <a href="#">Image Search</a>
            </li>
            <li>
              <a href="#">Multi-Modal AI</a>
            </li>
          </ul>
        </motion.div>

        <motion.div className="footer-section" variants={itemVariants}>
          <h3>Company</h3>
          <ul>
            <li>
              <a href="#">About Us</a>
            </li>
           
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
          </ul>
        </motion.div>
      </div>

      <motion.div className="footer-bottom" variants={itemVariants}>
        <p>
          © 2025 Sera AI. All rights reserved. | Made with ❤️ by <span className="made-by">Vishal</span>
        </p>
      </motion.div>
    </motion.footer>
  )
}
