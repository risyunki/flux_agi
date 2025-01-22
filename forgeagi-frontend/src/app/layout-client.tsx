"use client"

import { type ReactNode } from "react"
import { useState, useEffect } from "react"
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar"
import { 
  CircleDot, 
  ListTodo, 
  FileText,
  Settings,
  MessageSquare,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Toaster } from "sonner"
import Image from "next/image"
import { usePathname } from 'next/navigation'
import { getCookie } from 'cookies-next'
import { useTheme } from 'next-themes'

interface LayoutContentProps {
  children: ReactNode
}

interface Link {
  label: string;
  href: string;
  icon: ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const [open, setOpen] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [hasEntered, setHasEntered] = useState(false)
  const pathname = usePathname()
  const token = getCookie('token')

  useEffect(() => {
    const entered = getCookie('entered')
    setHasEntered(!!entered)
  }, [])

  const links: Link[] = [
    {
      label: "AI Agents",
      href: "/",
      icon: <CircleDot className="h-5 w-5 flex-shrink-0 transition-colors dark:text-stone-400" />,
    },
    {
      label: "Chat",
      href: "/chat",
      icon: <MessageSquare className="h-5 w-5 flex-shrink-0 transition-colors dark:text-stone-400" />,
    },
    {
      label: "Tasks",
      href: "/tasks",
      icon: <ListTodo className="h-5 w-5 flex-shrink-0 transition-colors dark:text-stone-400" />,
    },
    {
      label: "Documentation",
      href: "/docs",
      icon: <FileText className="h-5 w-5 flex-shrink-0 transition-colors dark:text-stone-400" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5 flex-shrink-0 transition-colors dark:text-stone-400" />,
    },
  ]

  if (pathname === '/enter') {
    return children
  }

  if (!hasEntered) {
    return null
  }

  return (
    <div className="flex h-screen bg-white dark:bg-stone-950">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo isDark={isDark} isOpen={open} />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-stone-50 via-white to-stone-100/50 p-8 transition-colors dark:from-stone-950 dark:via-stone-900 dark:to-stone-950/50">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Toaster position="bottom-right" theme="dark" />
    </div>
  )
}

const Logo = ({ isDark, isOpen }: { isDark: boolean; isOpen: boolean }) => {
  return (
    <div className="flex items-center gap-2 px-2">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors overflow-hidden ${isDark ? 'bg-stone-800' : 'bg-stone-900'} p-1.5`}>
        <Image
          src="/logo.png"
          alt="Forge Logo"
          width={32}
          height={32}
          className="object-contain w-full h-full"
          priority
        />
      </div>
      {isOpen && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="font-semibold text-stone-900 transition-colors dark:text-white"
        >
          Forge
        </motion.span>
      )}
    </div>
  )
} 