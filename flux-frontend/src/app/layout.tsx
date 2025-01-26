import { type ReactNode } from "react"
import "./globals.css"
import { Providers } from "./providers"
import { LayoutContent } from "./layout-client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Flux - AGI-Powered Workspace',
  description: 'Self-evolving AGI made of agents that collaborate, and build new agents as needed, in order to complete tasks for a user.',
  metadataBase: new URL('https://fluxai.xyz'),
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/icon-512.png',
        color: '#000000',
      },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    url: 'https://fluxai.xyz',
    title: 'Flux - AGI-Powered Workspace',
    description: 'Self-evolving AGI made of agents that collaborate, and build new agents as needed, in order to complete tasks for a user.',
    siteName: 'Flux AI',
    images: [
      {
        url: '/icons/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Flux AI Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flux - AGI-Powered Workspace',
    description: 'Self-evolving AGI made of agents that collaborate, and build new agents as needed, in order to complete tasks for a user.',
    site: '@fluxai',
    creator: '@fluxai',
    images: [
      {
        url: '/icons/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Flux AI Logo',
      },
    ],
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