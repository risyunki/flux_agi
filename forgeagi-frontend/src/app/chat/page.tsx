"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import React from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Bot, Hammer, Crown, CircleDot } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Agent } from "@/lib/services/agent.service"

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  activity?: string
  progress?: number
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
  const [currentTask, setCurrentTask] = useState<string | null>(null)
  const ws = useRef<WebSocket | null>(null)
  const [mode, setMode] = useState<'chat' | 'task'>('chat')

  const scrollToBottom = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('http://localhost:8000/agents')
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
    // Connect to WebSocket
    ws.current = new WebSocket('ws://localhost:8000/ws')
    
    ws.current.onopen = () => {
      setIsConnected(true)
      console.log('Connected to WebSocket')
    }

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.type === 'chat_response' && selectedAgent?.id === data.data.agent_id) {
        setMessages(prev => [...prev, {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: data.data.message,
          timestamp: new Date()
        }])
        setIsLoading(false)
      }
      else if (data.type === 'task_update' && data.data.result) {
        setMessages(prev => [...prev, {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: data.data.result,
          timestamp: new Date()
        }])
        setIsLoading(false)
        setCurrentTask(null)
      }
      
      else if (data.type === 'agent_activity' && selectedAgent?.id === data.data.agent_id) {
        setMessages(prev => [...prev, {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'system',
          content: data.data.activity,
          timestamp: new Date(),
          activity: data.data.activity
        }])
      }
      
      else if (data.type === 'task_progress' && currentTask === data.data.task_id) {
        setMessages(prev => [...prev, {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'system',
          content: data.data.current_action || 'Processing...',
          timestamp: new Date(),
          progress: data.data.progress
        }])
      }
    }

    ws.current.onclose = () => {
      setIsConnected(false)
      console.log('Disconnected from WebSocket')
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [selectedAgent?.id, currentTask])

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
      if (mode === 'chat') {
        const response = await fetch('http://localhost:8000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: input,
            agent_id: selectedAgent?.id
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to send message')
        }
      } else {
        const response = await fetch('http://localhost:8000/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: input,
            agent_id: selectedAgent?.id
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to create task')
        }
        
        const data = await response.json()
        setCurrentTask(data.id)
      }
    } catch (error) {
      console.error('Error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b dark:border-stone-800 p-4">
        <div className="flex items-center justify-between">
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
          <div className="flex items-center gap-2">
            <Button
              variant={mode === 'chat' ? "default" : "ghost"}
              onClick={() => setMode('chat')}
              className="flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              Chat
            </Button>
            <Button
              variant={mode === 'task' ? "default" : "ghost"}
              onClick={() => setMode('task')}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Create Task
            </Button>
          </div>
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
              <Card 
                className={`max-w-[80%] p-4 ${
                  message.role === 'user' 
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' 
                    : message.role === 'system'
                    ? 'bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-700'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700'
                }`}
              >
                {message.role === 'assistant' && selectedAgent && (
                  <div className="flex items-center gap-2 mb-2 text-sm text-stone-500 dark:text-stone-400">
                    {selectedAgent.type in agentIcons && React.createElement(agentIcons[selectedAgent.type as AgentType], { className: "w-4 h-4" })}
                    {selectedAgent.name}
                  </div>
                )}
                
                {message.role === 'system' && message.activity && (
                  <div className="flex items-center gap-2 mb-2 text-sm text-blue-500 dark:text-blue-400">
                    <CircleDot className="w-4 h-4 animate-pulse" />
                    Activity Update
                  </div>
                )}
                
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                {message.progress !== undefined && (
                  <div className="mt-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${message.progress * 100}%` }}
                    />
                  </div>
                )}
                
                <div className="text-xs mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </Card>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <Card className="max-w-[80%] p-4 bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </Card>
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
            placeholder={mode === 'chat' ? `Chat with ${selectedAgent?.name || 'AI'}...` : `Create task for ${selectedAgent?.name || 'AI'}...`}
            disabled={!isConnected || isLoading}
            className="flex-1 bg-white dark:bg-stone-900"
          />
          <Button 
            type="submit"
            disabled={!isConnected || isLoading || !input.trim()}
            variant="default"
          >
            {mode === 'chat' ? <Bot className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
} 