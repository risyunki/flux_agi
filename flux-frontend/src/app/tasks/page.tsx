"use client"

import React from 'react'
import { useState, useEffect } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Bot, Hammer, Crown, Send, Archive, RotateCcw } from "lucide-react"
import { Agent } from "@/lib/services/agent.service"
import { Task, TaskService } from '@/lib/services/task.service'
import { toast } from 'sonner'
import { config } from '@/lib/config'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Window } from "@/components/ui/window"

type AgentType = 'assistant' | 'coordinator' | 'architect'

const agentIcons = {
  assistant: Bot,
  coordinator: Crown,
  architect: Hammer,
} as const

const taskService = new TaskService()

export default function TasksPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [activeTasks, setActiveTasks] = useState<Task[]>([])
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active')
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
        const response = await fetch(`${config.apiUrl}/tasks`, {
          credentials: 'include'
        })
        if (!response.ok) throw new Error('Failed to fetch tasks')
        const data = await response.json()
        
        // Ensure we always have arrays, even if empty
        const active = Array.isArray(data.active) ? data.active : []
        const archived = Array.isArray(data.archived) ? data.archived : []
        
        setActiveTasks(active)
        setArchivedTasks(archived)
      } catch (error) {
        console.error('Error fetching tasks:', error)
        toast.error('Failed to load tasks')
        // Initialize with empty arrays on error
        setActiveTasks([])
        setArchivedTasks([])
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchTasks()
    fetchAgents()

    // Start polling for updates
    taskService.startPolling((updatedTasks) => {
      setActiveTasks(Array.isArray(updatedTasks) ? updatedTasks : [])
      setLoading(false)
    })

    // Also fetch archived tasks once
    taskService.getTasks(true).then(setArchivedTasks)

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
      setActiveTasks(Array.isArray(updatedTasks) ? updatedTasks : [])
      toast.success('Task created successfully')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleArchive = async (taskId: string) => {
    try {
      await taskService.archiveTask(taskId)
      toast.success('Task archived')
      
      // Update both lists
      const task = activeTasks.find(t => t.id === taskId)
      if (task) {
        setArchivedTasks(prev => [...prev, { ...task, archived: true }])
        setActiveTasks(prev => prev.filter(t => t.id !== taskId))
      }
    } catch {
      toast.error('Failed to archive task')
    }
  }

  const handleUnarchive = async (taskId: string) => {
    try {
      await taskService.unarchiveTask(taskId)
      toast.success('Task unarchived')
      
      // Update both lists
      const task = archivedTasks.find(t => t.id === taskId)
      if (task) {
        setActiveTasks(prev => [...prev, { ...task, archived: false }])
        setArchivedTasks(prev => prev.filter(t => t.id !== taskId))
      }
    } catch {
      toast.error('Failed to unarchive task')
    }
  }

  const TaskList = ({ tasks, showArchiveButton }: { tasks: Task[], showArchiveButton: boolean }) => {
    const tasksList = Array.isArray(tasks) ? tasks : []
    
    return (
      <div className="space-y-4">
        {tasksList.length === 0 ? (
          <div className="text-center p-8 text-stone-500 dark:text-stone-400">
            No tasks found
          </div>
        ) : (
          tasksList.map((task) => (
            <Window
              key={task.id}
              thickness={task.status === 'completed' ? 'normal' : 'thick'}
              className={`backdrop-blur-sm ${
                task.status === 'completed' 
                  ? 'bg-white/50 dark:bg-stone-900/50' 
                  : 'bg-stone-900/5 dark:bg-white/5'
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === 'completed' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'
                      }`} />
                      <span className="text-xs text-stone-500 dark:text-stone-400">
                        {task.status === 'completed' ? 'Completed' : 'Processing...'}
                      </span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 whitespace-pre-wrap">
                      {task.description}
                    </p>
                    {task.result && (
                      <Window 
                        className="bg-stone-50/50 dark:bg-stone-800/50 backdrop-blur-sm"
                      >
                        <div className="p-4">
                          <p className="text-stone-600 dark:text-stone-400 whitespace-pre-wrap">
                            {task.result}
                          </p>
                        </div>
                      </Window>
                    )}
                  </div>
                  {task.status === 'completed' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => showArchiveButton ? handleArchive(task.id) : handleUnarchive(task.id)}
                      className="flex-shrink-0"
                    >
                      {showArchiveButton ? (
                        <Archive className="h-4 w-4" />
                      ) : (
                        <RotateCcw className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Window>
          ))
        )}
      </div>
    )
  }

  if (loading && activeTasks.length === 0) return (
    <Window className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </Window>
  )

  return (
    <Window className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-stone-900 dark:text-white">Tasks</h1>
            <p className="text-stone-600 dark:text-stone-400 mt-1">Create and manage your AI tasks</p>
          </div>
        </div>

        <Window thickness="thick" className="bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              {agents.map((agent) => (
                <Button
                  key={agent.id}
                  variant={selectedAgent?.id === agent.id ? "default" : "ghost"}
                  className="flex items-center gap-2"
                  onClick={() => setSelectedAgent(agent)}
                >
                  {agent.type in agentIcons && React.createElement(agentIcons[agent.type as AgentType], { className: "w-4 h-4" })}
                  {agent.name}
                </Button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Describe your task for ${selectedAgent?.name || 'AI'}...`}
                className="min-h-[100px] bg-white dark:bg-stone-900 resize-none"
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !input.trim() || !selectedAgent}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Create Task
                </Button>
              </div>
            </form>
          </div>
        </Window>

        <Window>
          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'active' | 'archived')} className="w-full">
            <div className="border-b dark:border-stone-800 px-4">
              <TabsList className="h-14">
                <TabsTrigger value="active" className="data-[state=active]:text-stone-900 dark:data-[state=active]:text-white">
                  Active Tasks
                </TabsTrigger>
                <TabsTrigger value="archived" className="data-[state=active]:text-stone-900 dark:data-[state=active]:text-white">
                  Archived Tasks
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="active">
                <TaskList tasks={activeTasks} showArchiveButton={true} />
              </TabsContent>

              <TabsContent value="archived">
                <TaskList tasks={archivedTasks} showArchiveButton={false} />
              </TabsContent>
            </div>
          </Tabs>
        </Window>
      </div>
    </Window>
  )
} 