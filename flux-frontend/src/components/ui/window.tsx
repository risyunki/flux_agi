"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

type WindowThickness = "thin" | "normal" | "thick"

interface WindowProps extends React.HTMLAttributes<HTMLDivElement> {
  thickness?: WindowThickness
  children?: React.ReactNode
}

const CONSTANTS = {
  BORDER_RADIUS: "12px",
}

const getHighlightStroke = (thickness: WindowThickness) => {
  switch (thickness) {
    case "thin":
      return "[--mask-stroke:0.5px]"
    case "thick":
      return "[--mask-stroke:1.5px]"
    default:
      return "[--mask-stroke:1px]"
  }
}

const getHighlightOpacity = (thickness: WindowThickness) => {
  switch (thickness) {
    case "thin":
      return 0.2
    case "thick":
      return 0.4
    default:
      return 0.3
  }
}

export function Window({
  thickness = "normal",
  className,
  children,
  ...props
}: WindowProps) {
  const maskComposite = [
    "exclude",
    "intersect",
    "subtract",
    "intersect",
    "subtract",
    "add",
  ]

  const defaultHighlightStyle = {
    borderRadius: CONSTANTS.BORDER_RADIUS,
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  }

  const leftTopHighlight =
    "conic-gradient(from 270deg at var(--radius) var(--radius), transparent 0deg, white 45deg, transparent 170deg), transparent"
  const leftTopMaskImage = [
    "linear-gradient(to right, black, black)",
    "linear-gradient(to right, transparent var(--mask-stroke), black calc(var(--mask-stroke) * 2))",
    "linear-gradient(to bottom, transparent var(--mask-stroke), black calc(var(--mask-stroke) * 2))",
    "linear-gradient(to right, black calc(var(--radius) - var(--mask-stroke)), transparent var(--radius))",
    "linear-gradient(to bottom, black calc(var(--radius) - var(--mask-stroke)), transparent var(--radius))",
    "radial-gradient(var(--diameter) var(--diameter) at var(--radius) var(--radius), black var(--mask-inner-distance), transparent var(--mask-outer-distance))",
  ]
  const leftTopHighlightStyle = {
    background: leftTopHighlight,
    maskImage: leftTopMaskImage.join(", "),
    maskComposite: maskComposite.join(", "),
    ...defaultHighlightStyle,
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-stone-200 bg-white/[0.6] shadow-lg backdrop-blur-[12px] backdrop-saturate-[1.8] dark:border-stone-800 dark:bg-stone-900/[0.6]",
        "[--radius:12px] [--diameter:24px]",
        className
      )}
      {...props}
    >
      <motion.div
        className={cn(
          getHighlightStroke(thickness),
          "pointer-events-none absolute inset-[-0.75px] z-40",
          "[--mask-inner-distance:calc(50%-var(--mask-stroke)-var(--mask-stroke))] [--mask-outer-distance:calc(50%-var(--mask-stroke))]"
        )}
        style={{
          ...leftTopHighlightStyle,
          opacity: getHighlightOpacity(thickness) + 0.35,
        }}
        aria-hidden="true"
      />
      <ScrollArea className="h-full">
        {children}
      </ScrollArea>
    </div>
  )
} 