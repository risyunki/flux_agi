"use client"

import { useEffect, useRef } from 'react'

interface WavesProps {
  lineColor?: string
  backgroundColor?: string
  waveSpeedX?: number
  waveSpeedY?: number
  waveAmpX?: number
  waveAmpY?: number
  friction?: number
  tension?: number
  maxCursorMove?: number
  xGap?: number
  yGap?: number
}

export function Waves({
  lineColor = 'rgba(0, 0, 0, 0.15)',
  backgroundColor = 'transparent',
  waveSpeedX = 0.02,
  waveSpeedY = 0.01,
  waveAmpX = 40,
  waveAmpY = 20,
  friction = 0.9,
  tension = 0.01,
  maxCursorMove = 120,
  xGap = 12,
  yGap = 36,
}: WavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const pointsRef = useRef<{ x: number; y: number; baseY: number }[][]>([])
  const frameRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      initPoints()
    }

    const initPoints = () => {
      pointsRef.current = []
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      for (let y = yGap; y < height - yGap; y += yGap) {
        const row = []
        for (let x = 0; x < width + xGap; x += xGap) {
          row.push({ x, y, baseY: y })
        }
        pointsRef.current.push(row)
      }
    }

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      timeRef.current += 0.01
      const points = pointsRef.current
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio
      const mouseX = mouseRef.current.x
      const mouseY = mouseRef.current.y

      for (let i = 0; i < points.length; i++) {
        ctx.beginPath()
        ctx.moveTo(0, height)

        for (let j = 0; j < points[i].length; j++) {
          const point = points[i][j]
          const distX = mouseX - point.x
          const distY = mouseY - point.baseY
          const dist = Math.sqrt(distX * distX + distY * distY)
          const force = Math.max(0, (maxCursorMove - dist) / maxCursorMove)
          const angleX = timeRef.current * waveSpeedX + (point.x * waveSpeedX)
          const angleY = timeRef.current * waveSpeedY + (point.x * waveSpeedY)
          
          point.y += (
            (Math.sin(angleX) * waveAmpX +
            Math.sin(angleY) * waveAmpY +
            force * maxCursorMove - 
            (point.y - point.baseY) * tension) * friction
          )

          if (j === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            const xc = (point.x + points[i][j - 1].x) / 2
            const yc = (point.y + points[i][j - 1].y) / 2
            ctx.quadraticCurveTo(points[i][j - 1].x, points[i][j - 1].y, xc, yc)
          }
        }

        ctx.strokeStyle = lineColor
        ctx.lineTo(width, height)
        ctx.stroke()
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }

    const handleResize = () => {
      resizeCanvas()
    }

    resizeCanvas()
    animate()

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [backgroundColor, friction, lineColor, maxCursorMove, tension, waveAmpX, waveAmpY, waveSpeedX, waveSpeedY, xGap, yGap])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: backgroundColor }}
    />
  )
} 