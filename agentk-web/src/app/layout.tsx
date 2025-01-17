import { type ReactNode } from "react"
import "./globals.css"
import { Providers } from "./providers"
import { LayoutContent } from "./layout-client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Forge - AGI-Powered Workspace',
  description: 'Self-evolving AGI made of agents that collaborate, and build new agents as needed, in order to complete tasks for a user.',
  metadataBase: new URL('https://forgeagi.xyz'),
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/logo.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo.png', type: 'image/png', sizes: '192x192' },
      { url: '/logo.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/logo.png',
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/logo.png',
      },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    url: 'https://forgeagi.xyz',
    title: 'Forge - AGI-Powered Workspace',
    description: 'Self-evolving AGI made of agents that collaborate, and build new agents as needed, in order to complete tasks for a user.',
    siteName: 'Forge AI',
    images: [{
      url: '/logo.png',
      width: 512,
      height: 512,
      alt: 'Forge AI Logo'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forge - AGI-Powered Workspace',
    description: 'Self-evolving AGI made of agents that collaborate, and build new agents as needed, in order to complete tasks for a user.',
    site: '@forgeagi',
    creator: '@forgeagi',
    images: [{
      url: '/logo.png',
      width: 512,
      height: 512,
      alt: 'Forge AI Logo'
    }],
  },
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors">
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  )
}
