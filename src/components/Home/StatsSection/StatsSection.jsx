"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import "./StatsSection.css"

function AnimatedNumber({ target, duration = 2000 }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      setCurrent((prev) => {
        if (prev < target) {
          return Math.min(prev + increment, target)
        }
        clearInterval(timer)
        return target
      })
    }, 16)

    return () => clearInterval(timer)
  }, [target, duration])

  return Math.floor(current).toLocaleString()
}

const stats = [
  { number: 1000000, label: "Searches Processed", suffix: "+" },
  { number: 99, label: "Accuracy Rate", suffix: "%" },
  { number: 50000, label: "Happy Users", suffix: "+" },
  { number: 24, label: "Hours Available", suffix: "/7" },
]

export default function StatsSection() {
  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <span className="stat-number">
                <AnimatedNumber target={stat.number} />
                {stat.suffix}
              </span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
