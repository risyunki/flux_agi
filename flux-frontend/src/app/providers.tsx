"use client"

import { ThemeProvider } from "next-themes"
import type { PropsWithChildren } from "react"

export function Providers({ children }: PropsWithChildren) {
  const props = {
    attribute: "class",
    defaultTheme: "system",
    enableSystem: true,
    disableTransitionOnChange: true,
  } as const

  return <ThemeProvider {...props}>{children}</ThemeProvider>
} 