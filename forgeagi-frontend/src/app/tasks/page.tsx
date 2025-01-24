"use client"

import React from 'react'
import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Bot, Hammer, Crown, Send } from "lucide-react"
import { Agent } from "@/lib/services/agent.service"
import { Task, taskService } from '@/lib/services/task.service'
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
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [input, setInput] = useState('')

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
        const fetchedTasks = await taskService.getTasks()
        setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : [])
      } catch (error) {
        console.error('Error fetching tasks:', error)
        setTasks([])
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchTasks()
    fetchAgents()

    // Start polling for updates
    taskService.startPolling((updatedTasks) => {
      setTasks(Array.isArray(updatedTasks) ? updatedTasks : [])
      setLoading(false)
    })

    // Cleanup
    return () => {
      taskService.stopPolling()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      setIsSubmitting(true)
      await taskService.createTask(input, selectedAgent?.id || 'assistant')
      setInput('')
      const updatedTasks = await taskService.getTasks()
      setTasks(Array.isArray(updatedTasks) ? updatedTasks : [])
      toast.success('Task created successfully')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading && tasks.length === 0) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-stone-900 dark:text-white">Tasks</h1>
        <p className="text-stone-600 dark:text-stone-400 mt-1">Create and manage your AI tasks</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr,300px]">
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Textarea
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e as unknown as React.FormEvent)
                }
              }}
              placeholder="Enter your task description..."
              className="flex-1 min-h-[100px] resize-none"
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>

          <div className="space-y-4">
            {tasks.length > 0 ? tasks.map((task) => (
              <Card key={task.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="font-medium text-stone-900 dark:text-white">{task.description}</p>
                    <div className="flex items-center gap-2">
                      {task.status === 'in_progress' && (
                        <>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          <span className="text-sm text-stone-500 dark:text-stone-400">Processing...</span>
                        </>
                      )}
                      {task.status === 'completed' && (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm text-stone-500 dark:text-stone-400">Completed</span>
                        </>
                      )}
                    </div>
                    {task.result && (
                      <div className="mt-2 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-md">
                        <p className="text-sm text-stone-600 dark:text-stone-300 whitespace-pre-wrap">
                          {task.result}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )) : (
              <p className="text-center text-stone-500 dark:text-stone-400">No tasks yet</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-white">Available Agents</h2>
          {agents.length > 0 ? agents.map((agent) => {
            const Icon = agentIcons[agent.type as AgentType] || Bot
            return (
              <Card 
                key={agent.id}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedAgent?.id === agent.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'hover:border-blue-300'
                }`}
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-stone-900 dark:text-white">{agent.name}</p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">{agent.description}</p>
                  </div>
                </div>
              </Card>
            )
          }) : (
            <p className="text-center text-stone-500 dark:text-stone-400">No agents available</p>
          )}
        </div>
      </div>
    </div>
  )
} 