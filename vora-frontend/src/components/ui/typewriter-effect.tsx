import { useEffect, useState } from "react"

interface TypewriterEffectProps {
  text: string
  delay?: number
  className?: string
}

export function TypewriterEffect({
  text,
  delay = 50,
  className = "",
}: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const animate = () => {
      if (currentIndex < text.length) {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }
    }

    const timeout = setTimeout(animate, delay)
    return () => clearTimeout(timeout)
  }, [currentIndex, delay, text])

  return (
    <div className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </div>
  )
} 