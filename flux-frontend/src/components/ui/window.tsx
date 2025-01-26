"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

type WindowThickness = "thin" | "normal" | "thick"

interface WindowProps extends React.HTMLAttributes<HTMLDivElement> {
  thickness?: WindowThickness
  children?: React.ReactNode
}

export function Window({
  className,
  children,
  ...props
}: WindowProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl backdrop-blur-[2px] bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]",
        className
      )}
      {...props}
    >
      <ScrollArea className="h-full">
        {children}
      </ScrollArea>
    </div>
  )
} 