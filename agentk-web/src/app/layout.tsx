import { type ReactNode } from "react"
import "./globals.css"
import { Providers } from "./providers"
import { LayoutContent } from "./layout-client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Forge - AGI-Powered Workspace',
  description: 'Self-evolving AGI made of agents that collaborate, and build new agents as needed, in order to complete tasks for a user.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Forge - AGI-Powered Workspace',
    description: 'Self-evolving AGI made of agents that collaborate, and build new agents as needed, in order to complete tasks for a user.',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forge - AGI-Powered Workspace',
    description: 'Self-evolving AGI made of agents that collaborate, and build new agents as needed, in order to complete tasks for a user.',
    images: ['/logo.png'],
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
