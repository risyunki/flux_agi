"use client"

import React from 'react'
import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bot, Hammer, Crown, Send, CircleDot } from "lucide-react"
import { Agent } from "@/lib/services/agent.service"
import { Task } from '@/lib/services/task.service'
import { websocketService, type WebSocketMessage, type AgentActivity, type TaskProgress } from '@/lib/services/websocket.service'
import { toast } from 'sonner'

type AgentType = 'assistant' | 'coordinator' | 'architect'

const agentIcons = {
  assistant: Bot,
  coordinator: Crown,
  architect: Hammer,
} as const

interface TaskWithDetails extends Task {
  currentAction?: string | null;
  progress?: number;
  agentActivity?: string;
  agent_id?: string;
}

export default function TasksPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [tasks, setTasks] = useState<TaskWithDetails[]>([])
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('http://localhost:8000/agents')
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
        const response = await fetch('http://localhost:8000/tasks')
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
      if (message.type === 'task_update' && 'status' in message.data) {
        const updatedTask = message.data as Task
        if (updatedTask.status === 'completed') {
          toast.success(`Task completed: ${updatedTask.description}`)
        }
        setTasks(prev => {
          const index = prev.findIndex(task => task.id === updatedTask.id)
          if (index === -1) {
            return [...prev, updatedTask as TaskWithDetails]
          }
          const newTasks = [...prev]
          newTasks[index] = { ...newTasks[index], ...updatedTask }
          return newTasks
        })
      }
      else if (message.type === 'agent_activity') {
        const activity = message.data as AgentActivity
        setTasks(prev => {
          const index = prev.findIndex(task => task.agent_id === activity.agent_id)
          if (index !== -1) {
            const newTasks = [...prev]
            newTasks[index] = { 
              ...newTasks[index], 
              agentActivity: activity.activity 
            }
            return newTasks
          }
          return prev
        })
      }
      else if (message.type === 'task_progress') {
        const progress = message.data as TaskProgress
        setTasks(prev => {
          const index = prev.findIndex(task => task.id === progress.task_id)
          if (index !== -1) {
            const newTasks = [...prev]
            newTasks[index] = { 
              ...newTasks[index], 
              progress: progress.progress,
              currentAction: progress.current_action 
            }
            return newTasks
          }
          return prev
        })
      }
    }

    websocketService.addMessageHandler(handleMessage)

    return () => {
      websocketService.removeMessageHandler(handleMessage)
      websocketService.disconnect()
    }
  }, [])

  const createTask = async () => {
    if (!description.trim() || !selectedAgent) return
    
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          agent_id: selectedAgent.id,
        }),
      })

      if (!response.ok) throw new Error('Failed to create task')
      
      const newTask = await response.json()
      setTasks(prev => [...prev, newTask])
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
          <form onSubmit={createTask} className="flex gap-4">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your task description..."
              className="flex-1"
              disabled={isLoading}
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
                    {task.agentActivity && (
                      <p className="text-sm text-blue-500">
                        <CircleDot className="w-4 h-4 inline mr-1 animate-pulse" />
                        {task.agentActivity}
                      </p>
                    )}
                    {task.currentAction && (
                      <p className="text-sm text-stone-600">
                        Current Action: {task.currentAction}
                      </p>
                    )}
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
                
                {task.progress !== undefined && (
                  <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${task.progress * 100}%` }}
                    />
                  </div>
                )}

                {task.result && (
                  <div className="mt-2 p-2 bg-stone-50 dark:bg-stone-900 rounded">
                    <p className="text-sm whitespace-pre-wrap">{task.result}</p>
                  </div>
                )}
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