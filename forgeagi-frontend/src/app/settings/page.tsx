"use client"

import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [openAIKey, setOpenAIKey] = useState("")
  const [anthropicKey, setAnthropicKey] = useState("")
  const [isSavingOpenAI, setIsSavingOpenAI] = useState(false)
  const [isSavingAnthropic, setIsSavingAnthropic] = useState(false)

  useEffect(() => {
    // Check initial dark mode state
    const isDarkMode = document.documentElement.classList.contains('dark')
    setDarkMode(isDarkMode)
  }, [])

  const toggleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled)
    if (enabled) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const saveOpenAIKey = async () => {
    if (!openAIKey.trim()) {
      toast.error("Please enter your OpenAI API key")
      return
    }

    setIsSavingOpenAI(true)
    try {
      const response = await fetch('http://localhost:8000/settings/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_key: openAIKey }),
      })

      if (!response.ok) throw new Error('Failed to save OpenAI API key')
      
      setOpenAIKey("")
      toast.success("OpenAI API key saved successfully")
    } catch {
      toast.error("Failed to save OpenAI API key")
    } finally {
      setIsSavingOpenAI(false)
    }
  }

  const saveAnthropicKey = async () => {
    if (!anthropicKey.trim()) {
      toast.error("Please enter your Anthropic API key")
      return
    }

    setIsSavingAnthropic(true)
    try {
      const response = await fetch('http://localhost:8000/settings/anthropic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_key: anthropicKey }),
      })

      if (!response.ok) throw new Error('Failed to save Anthropic API key')
      
      setAnthropicKey("")
      toast.success("Anthropic API key saved successfully")
    } catch {
      toast.error("Failed to save Anthropic API key")
    } finally {
      setIsSavingAnthropic(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-stone-900 dark:text-white">Settings</h1>
          <p className="text-stone-600 dark:text-stone-400 mt-1">Customize your experience</p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="group relative overflow-hidden rounded-[2rem] backdrop-blur-[2px] bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-100/20 via-stone-100/10 to-stone-100/20 dark:from-white/5 dark:via-white/2.5 dark:to-white/0" />
          <div className="relative space-y-6">
            <h3 className="text-xl font-semibold text-stone-900 dark:text-white">General Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
                <div>
                  <h4 className="font-medium text-stone-900 dark:text-white">Notifications</h4>
                  <p className="text-sm text-stone-600 dark:text-stone-400">Receive updates about your tasks</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
                <div>
                  <h4 className="font-medium text-stone-900 dark:text-white">Auto-save</h4>
                  <p className="text-sm text-stone-600 dark:text-stone-400">Automatically save task progress</p>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
                <div>
                  <h4 className="font-medium text-stone-900 dark:text-white">Dark Mode</h4>
                  <p className="text-sm text-stone-600 dark:text-stone-400">Switch to dark theme</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-stone-200/30 dark:via-white/10 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
        </div>

        <div className="group relative overflow-hidden rounded-[2rem] backdrop-blur-[2px] bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-100/20 via-stone-100/10 to-stone-100/20 dark:from-white/5 dark:via-white/2.5 dark:to-white/0" />
          <div className="relative space-y-6">
            <h3 className="text-xl font-semibold text-stone-900 dark:text-white">Model Providers</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-stone-900 dark:text-white">OpenAI</h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400">Configure your OpenAI API key</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={openAIKey}
                    onChange={(e) => setOpenAIKey(e.target.value)}
                    placeholder="Enter your OpenAI API key"
                    className="flex-1"
                  />
                  <Button 
                    onClick={saveOpenAIKey}
                    disabled={isSavingOpenAI}
                  >
                    {isSavingOpenAI ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-stone-900 dark:text-white">Anthropic</h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400">Configure your Anthropic API key</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={anthropicKey}
                    onChange={(e) => setAnthropicKey(e.target.value)}
                    placeholder="Enter your Anthropic API key"
                    className="flex-1"
                  />
                  <Button 
                    onClick={saveAnthropicKey}
                    disabled={isSavingAnthropic}
                  >
                    {isSavingAnthropic ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-stone-200/30 dark:via-white/10 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
        </div>
      </div>
    </div>
  )
} 