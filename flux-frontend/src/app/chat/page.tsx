"use client"

import { useState, useEffect, useCallback } from 'react'
import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Bot, Hammer, Crown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Agent } from "@/lib/services/agent.service"
import { config } from '@/lib/config'
import { websocketService, WebSocketMessage } from "@/lib/services/websocket.service"
import { Window } from "@/components/ui/window"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type AgentType = 'assistant' | 'coordinator' | 'architect'

const agentIcons = {
  assistant: Bot,
  coordinator: Crown,
  architect: Hammer,
} as const

const getInitialMessage = (agent: Agent) => {
  switch (agent.type as AgentType) {
    case 'coordinator':
      return "Greetings, I am Odin, the wise overseer of all operations. I coordinate our agents and ensure optimal resource allocation for your tasks. How may I assist you today?"
    case 'architect':
      return "Hail! I am Thor, the master builder of this realm. I forge and maintain our agents, ensuring they are equipped with the right tools. What shall we build together?"
    case 'assistant':
    default:
      return "Hi! I'm Bragi, your AI assistant. I can help you with various tasks, from answering questions to solving complex problems. What can I help you with?"
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const scrollToBottom = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/agents`)
        if (!response.ok) throw new Error('Failed to fetch agents')
        const data = await response.json()
        setAgents(data.agents || [])
        if (data.agents?.length > 0) {
          const initialAgent = data.agents[0]
          setSelectedAgent(initialAgent)
          // Set initial message based on the first agent
          setMessages([{
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content: getInitialMessage(initialAgent),
            timestamp: new Date()
          }])
        }
      } catch (error) {
        console.error('Error fetching agents:', error)
        setAgents([])
      }
    }
    fetchAgents()
  }, [])

  useEffect(() => {
    // Connect to WebSocket and set up message handler
    websocketService.connect()
    
    const messageHandler = (data: WebSocketMessage) => {
      if (data.type === 'task_update' && typeof data.data === 'object' && data.data && 'result' in data.data) {
        setMessages(prev => [...prev, {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: String(data.data.result),
          timestamp: new Date()
        }])
        setIsLoading(false)
      }
    }

    websocketService.addMessageHandler(messageHandler)
    setIsConnected(true)

    return () => {
      websocketService.removeMessageHandler(messageHandler)
      websocketService.disconnect()
      setIsConnected(false)
    }
  }, [])

  // Add effect to change message when agent changes
  useEffect(() => {
    if (selectedAgent && messages.length === 0) {
      setMessages([{
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: getInitialMessage(selectedAgent),
        timestamp: new Date()
      }])
    }
  }, [selectedAgent, messages.length])

  const sendMessage = async () => {
    if (!input.trim() || !isConnected || isLoading) return

    const userMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'user' as const,
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`${config.apiUrl}/tasks`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: input
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error:', error)
      setIsLoading(false)
    }
  }

  return (
    <Window className="flex flex-col h-screen">
      <div className="border-b dark:border-stone-800 p-4">
        <div className="flex items-center gap-4">
          {agents.map((agent) => (
            <Button
              key={agent.id}
              variant={selectedAgent?.id === agent.id ? "default" : "ghost"}
              className="flex items-center gap-2"
              onClick={() => {
                setSelectedAgent(agent)
                setMessages([{
                  id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                  role: 'assistant',
                  content: getInitialMessage(agent),
                  timestamp: new Date()
                }])
              }}
            >
              {agent.type in agentIcons && React.createElement(agentIcons[agent.type as AgentType], { className: "w-4 h-4" })}
              {agent.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <Window 
                    thickness={message.role === 'user' ? 'thick' : 'normal'}
                    className={`max-w-[80%] p-4 ${
                      message.role === 'user' 
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' 
                        : 'bg-white dark:bg-stone-800'
                    }`}
                  >
                    {message.role === 'assistant' && selectedAgent && (
                      <div className="flex items-center gap-2 mb-2 text-sm text-stone-500 dark:text-stone-400">
                        {selectedAgent.type in agentIcons && React.createElement(agentIcons[selectedAgent.type as AgentType], { className: "w-4 h-4" })}
                        {selectedAgent.name}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <div className="text-xs mt-2 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </Window>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <Window className="max-w-[80%] p-4 bg-white dark:bg-stone-800">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </Window>
                </motion.div>
              )}
              <div ref={scrollToBottom} />
            </AnimatePresence>
          </div>
      
      <div className="sticky bottom-0 p-4 border-t dark:border-stone-800 bg-white/50 dark:bg-stone-950/50 backdrop-blur-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="flex space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${selectedAgent?.name || 'AI'}...`}
            disabled={!isConnected || isLoading}
            className="flex-1 bg-white dark:bg-stone-900"
          />
          <Button 
            type="submit"
            disabled={!isConnected || isLoading || !input.trim()}
            variant="default"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Window>
  )
} 