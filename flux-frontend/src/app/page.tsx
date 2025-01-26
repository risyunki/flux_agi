"use client"

import React from 'react'
import { 
  Bot,
  Hammer,
  Crown,
  X,
  Brain,
  CircleDot
} from "lucide-react"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { type Agent } from "@/lib/services/agent.service"
import { Task, taskService } from '@/lib/services/task.service';
import { websocketService, type WebSocketMessage } from '@/lib/services/websocket.service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { config } from '@/lib/config'
import { Window } from "@/components/ui/window"

type AgentType = 'assistant' | 'coordinator' | 'architect' | 'engineer' | 'researcher';

const agentIcons = {
  assistant: Bot,
  coordinator: Crown,
  architect: Hammer,
  engineer: Brain,
  researcher: CircleDot
} as const;

const agentDetails = {
  assistant: {
    title: "Bragi - The AI Assistant",
    description: "A wise and eloquent AI assistant that can help with various tasks, from answering questions to helping with complex problems.",
    features: [
      "Natural Language Understanding",
      "Task Processing",
      "Information Retrieval",
      "Problem Solving",
      "Real-time Responses"
    ],
    role: "Your primary interface for task execution and problem-solving. Bragi understands natural language and can help with a wide range of tasks, speaking with the wisdom of the gods."
  },
  coordinator: {
    title: "Odin - The Coordinator",
    description: "The wise overseer of all operations and strategic planning.",
    features: [
      "Strategic Planning",
      "Resource Management",
      "Agent Coordination",
      "Task Prioritization",
      "System Optimization"
    ],
    role: "The all-father of operations, Odin oversees and coordinates all agents, making strategic decisions and ensuring optimal resource allocation for maximum efficiency."
  },
  architect: {
    title: "Thor - The Architect",
    description: "The master builder and maintainer of the system's agents.",
    features: [
      "Agent Creation",
      "System Architecture",
      "Capability Enhancement",
      "Performance Testing",
      "Agent Maintenance"
    ],
    role: "The mighty architect who forges and maintains agents, ensuring they are equipped with the right tools and capabilities to handle any challenge."
  },
  engineer: {
    title: "Software Engineer",
    description: "Implements and maintains software solutions.",
    features: [
      "Code Development",
      "Bug Fixing",
      "Code Review",
      "Testing",
      "Technical Implementation"
    ],
    role: "Handles the technical implementation of solutions, writing code and ensuring software quality."
  },
  researcher: {
    title: "AI Researcher",
    description: "Conducts research and analysis in artificial intelligence.",
    features: [
      "Data Analysis",
      "Research Planning",
      "Experiment Design",
      "Literature Review",
      "Innovation Discovery"
    ],
    role: "Explores cutting-edge AI technologies and methodologies to advance our capabilities and knowledge."
  }
} as const;


export default function Home() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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
        setIsLoading(false)
      }
    }

    // Initial data fetch
    fetchAgents()
    fetchTasks()

    // Set up WebSocket connection for real-time updates
    const handleWebSocketMessage = (data: WebSocketMessage) => {
      if (data.type === 'task_update' && !isLoading) {
        const updatedTask = data.data as Task
        if (updatedTask.status === 'completed') {
          toast.success(`Task completed: ${updatedTask.description}`)
        }
        setTasks(prev => {
          if (!Array.isArray(prev)) return [updatedTask]
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

    const ws = websocketService.connect()
    if (ws) {
      websocketService.addMessageHandler(handleWebSocketMessage)
    }

    return () => {
      if (ws) {
        websocketService.removeMessageHandler(handleWebSocketMessage)
        websocketService.disconnect()
      }
    }
  }, [isLoading])

  const handleCreateTask = async () => {
    if (!selectedAgent) {
      toast.error('Please select an agent first')
      return
    }

    router.push('/tasks')
  }

  const inProgressTasks = tasks?.filter?.(task => task?.status === 'in_progress') || []

  return (
    <Window className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-stone-900 dark:text-white">AI Agents</h1>
            <p className="text-stone-600 dark:text-stone-400 mt-1">Select an agent to begin your task</p>
          </div>
        </div>

        <BentoGrid>
          {agents.map((agent) => (
            <BentoCard
              key={agent.id}
              Icon={agentIcons[agent.type as AgentType] || Bot}
              name={agent.name}
              description={agent.description}
              onClick={() => setSelectedAgent(agent)}
              selected={selectedAgent?.id === agent.id}
              type={agent.type as AgentType}
            />
          ))}
        </BentoGrid>
      </div>

      {selectedAgent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedAgent(null)}
        >
          <Window
            thickness="thick"
            className="relative max-w-lg w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 text-stone-800 dark:text-stone-200">
                    {agentIcons[selectedAgent.type as AgentType] && 
                      React.createElement(agentIcons[selectedAgent.type as AgentType])}
                  </div>
                  <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
                    {selectedAgent.name}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedAgent(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-4 space-y-4">
                <p className="text-stone-600 dark:text-stone-400">
                  {agentDetails[selectedAgent.type as AgentType]?.description}
                </p>
              </div>

              <div className="mt-6 space-y-4 p-4 rounded-2xl bg-stone-50/50 dark:bg-white/5 border border-stone-200/20 dark:border-white/10">
                <h3 className="font-medium text-stone-900 dark:text-white">Role</h3>
                <p className="text-stone-600 dark:text-stone-400">
                  {agentDetails[selectedAgent.type as AgentType]?.role}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-stone-900 dark:text-white mb-3">Features</h3>
                <ul className="space-y-2">
                  {agentDetails[selectedAgent.type as AgentType]?.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex justify-end">
                <Button onClick={handleCreateTask}>
                  Create Task with {selectedAgent.name}
                </Button>
              </div>
            </div>
          </Window>
        </motion.div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-stone-900 dark:text-white">Recent Tasks</h2>
        <div className="grid gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : inProgressTasks.length > 0 ? (
            inProgressTasks.map((task) => (
              <Card key={task.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-stone-900 dark:text-white">{task.description}</p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">In Progress</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-stone-500 dark:text-stone-400 text-center p-4">No tasks in progress</p>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-semibold text-stone-900 dark:text-white">Getting Started with Flux</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-stone-900/50">
            <h3 className="text-lg font-semibold mb-3 text-stone-900 dark:text-white">1. Choose Your Agent</h3>
            <p className="text-stone-600 dark:text-stone-400">
              Select from our specialized AI agents, each designed for specific tasks. From Odin&apos;s strategic oversight to Thor&apos;s architectural prowess.
            </p>
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-stone-900/50">
            <h3 className="text-lg font-semibold mb-3 text-stone-900 dark:text-white">2. Describe Your Task</h3>
            <p className="text-stone-600 dark:text-stone-400">
              Don&apos;t worry about complex requirements - our agents understand natural language and can break them down.
            </p>
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-stone-900/50">
            <h3 className="text-lg font-semibold mb-3 text-stone-900 dark:text-white">3. Watch the Magic</h3>
            <p className="text-stone-600 dark:text-stone-400">
              Our agents work together seamlessly to complete your task, providing real-time updates.
            </p>
          </Card>
        </div>

        <Card className="p-8 backdrop-blur-sm bg-white/50 dark:bg-stone-900/50">
          <h3 className="text-xl font-semibold mb-4 text-stone-900 dark:text-white">Why Choose Flux?</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium text-stone-900 dark:text-white">Advanced AI Capabilities</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                  <CircleDot className="w-4 h-4" />
                  Multi-agent collaboration for complex tasks
                </li>
                <li className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                  <CircleDot className="w-4 h-4" />
                  Self-evolving system that learns and improves
                </li>
                <li className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                  <CircleDot className="w-4 h-4" />
                  Real-time task updates and progress tracking
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-stone-900 dark:text-white">User Experience</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                  <CircleDot className="w-4 h-4" />
                  Intuitive interface for seamless interaction
                </li>
                <li className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                  <CircleDot className="w-4 h-4" />
                  Natural language task description
                </li>
                <li className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                  <CircleDot className="w-4 h-4" />
                  Transparent agent communication
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </Window>
  )
}