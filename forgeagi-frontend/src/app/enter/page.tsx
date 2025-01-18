"use client"

import { useTheme } from "next-themes"
import { Waves } from "@/components/ui/waves-background"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { setCookie } from 'cookies-next'
import { useEffect } from 'react'

export default function EnterPage() {
  const { theme } = useTheme()

  // Force redirect if cookie exists
  useEffect(() => {
    const checkCookie = () => {
      const entered = document.cookie.includes('entered=true')
      if (entered) {
        window.location.href = '/'
      }
    }
    checkCookie()
  }, [])

  const handleEnter = () => {
    setCookie('entered', 'true', { maxAge: 60 * 60 * 24 * 30 }) // 30 days
    // Force a hard reload to ensure everything resets
    window.location.href = '/'
  }

  return (
    <div className="relative w-full h-screen bg-stone-50 dark:bg-stone-950 overflow-hidden">
      <div className="absolute inset-0">
        <Waves
          lineColor={theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)"}
          backgroundColor="transparent"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold text-stone-900 dark:text-white mb-2">
            Forge<span className="text-stone-400 dark:text-stone-500">...</span>
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mb-8">
            Your AI-powered workspace
          </p>
          <Button
            variant="default"
            size="lg"
            className="text-lg px-8"
            onClick={handleEnter}
          >
            Enter
          </Button>
        </motion.div>
      </div>
    </div>
  )
} 