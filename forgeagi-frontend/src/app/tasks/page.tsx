"use client"

import React from 'react'
import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bot, Hammer, Crown, Send } from "lucide-react"
import { Agent } from "@/lib/services/agent.service"
import { Task } from '@/lib/services/task.service'
import { websocketService, type WebSocketMessage } from '@/lib/services/websocket.service'
import { toast } from 'sonner'
import { config } from '@/lib/config'

type AgentType = 'assistant' | 'coordinator' | 'architect'

const agentIcons = {
  assistant: Bot,
  coordinator: Crown,
  architect: Hammer,
} as const

export default function TasksPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/agents`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) throw new Error('Failed to fetch agents')
        const data = await response.json()
        const agentsList = Array.isArray(data.agents) ? data.agents : []
        setAgents(agentsList)
        // Find and select Odin by default
        const odin = agentsList.find((agent: Agent) => agent.type === 'coordinator')
        if (odin) {
          setSelectedAgent(odin)
        }
      } catch (error) {
        console.error('Error fetching agents:', error)
        toast.error('Failed to load agents')
        setAgents([])
      }
    }

    const fetchTasks = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/tasks`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) throw new Error('Failed to fetch tasks')
        const data = await response.json()
        const tasksList = Array.isArray(data.tasks) ? data.tasks : []
        setTasks(tasksList)
      } catch (error) {
        console.error('Error fetching tasks:', error)
        toast.error('Failed to load tasks')
        setTasks([])
      }
    }

    fetchAgents()
    fetchTasks()

    // Set up WebSocket connection for real-time updates
    websocketService.connect()
    const handleMessage = (message: WebSocketMessage) => {
      if (message.type === 'task_update') {
        // Type guard to check if data is a Task
        const isTask = (data: unknown): data is Task => {
          return typeof data === 'object' && 
                 data !== null && 
                 'id' in data && 
                 'description' in data && 
                 'status' in data;
        };

        if (isTask(message.data)) {
          const updatedTask = message.data;
          if (updatedTask.status === 'completed') {
            toast.success(`Task completed: ${updatedTask.description}`)
          }
          setTasks(prev => {
            const index = prev.findIndex(task => task.id === updatedTask.id)
            if (index === -1) {
              return [...prev, updatedTask]
            }
            const newTasks = [...prev]
            newTasks[index] = updatedTask
            return newTasks
          })
        }
      }
    }

    websocketService.addMessageHandler(handleMessage)

    return () => {
      websocketService.removeMessageHandler(handleMessage)
      websocketService.disconnect()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) {
      toast.error('Please enter a task description')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${config.apiUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      })

      if (!response.ok) throw new Error('Failed to create task')
      
      setDescription('')
      toast.success('Task created successfully')
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Failed to create task')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-stone-900 dark:text-white">Tasks</h1>
        <p className="text-stone-600 dark:text-stone-400 mt-1">Create and manage your AI tasks</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr,300px]">
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your task description..."
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>

          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-stone-900 dark:text-white">{task.description}</p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      {task.status === 'completed' ? 'Completed' : 'In Progress'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === 'in_progress' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    )}
                    {task.status === 'completed' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-white">Available Agents</h2>
          <div className="grid gap-4">
            {agents.map((agent) => (
              <Card
                key={agent.id}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedAgent?.id === agent.id
                    ? 'border-stone-400 dark:border-stone-600 ring-2 ring-stone-400 dark:ring-stone-600'
                    : 'hover:border-stone-400 dark:hover:border-stone-600'
                }`}
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 text-stone-800 dark:text-stone-200">
                    {React.createElement(agentIcons[agent.type as AgentType] || Bot)}
                  </div>
                  <div>
                    <h3 className="font-medium text-stone-900 dark:text-white">{agent.name}</h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400">{agent.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 