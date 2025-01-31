"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Star, Clock, Pin, Bot, Hammer, Crown, Brain, CircleDot } from "lucide-react"
import { type Agent } from "@/lib/services/agent.service"
import { Window } from "./window"

interface AgentSidebarProps {
  agents: Agent[]
  selectedAgent: Agent | null
  onSelectAgent: (agent: Agent) => void
  className?: string
}

interface FavoriteGroup {
  id: string
  name: string
  agents: Agent[]
}

const agentIcons = {
  assistant: Bot,
  coordinator: Crown,
  architect: Hammer,
  engineer: Brain,
  researcher: CircleDot
} as const;

export function AgentSidebar({
  agents,
  selectedAgent,
  onSelectAgent,
  className
}: AgentSidebarProps) {
  const [recentAgents, setRecentAgents] = React.useState<Agent[]>([])
  const [favoriteGroups, setFavoriteGroups] = React.useState<FavoriteGroup[]>([])
  const [isPinned, setIsPinned] = React.useState(true)

  // Update recents when an agent is selected
  const updateRecents = React.useCallback((agent: Agent) => {
    setRecentAgents(prev => {
      const newRecents = [agent, ...prev.filter(a => a.id !== agent.id)].slice(0, 5)
      localStorage.setItem('recentAgents', JSON.stringify(newRecents.map(a => a.id)))
      return newRecents
    })
  }, [])

  const handleSelectAgent = React.useCallback((agent: Agent) => {
    onSelectAgent(agent)
    updateRecents(agent)
  }, [onSelectAgent, updateRecents])

  // Load favorites and recents from localStorage on mount
  React.useEffect(() => {
    const savedRecents = localStorage.getItem('recentAgents')
    if (savedRecents) {
      const parsed = JSON.parse(savedRecents)
      const validRecents = parsed.filter((id: string) => 
        agents.some(agent => agent.id === id)
      ).map((id: string) => agents.find(agent => agent.id === id))
      setRecentAgents(validRecents.filter(Boolean).slice(0, 5))
    }

    const savedFavorites = localStorage.getItem('favoriteGroups')
    if (savedFavorites) {
      setFavoriteGroups(JSON.parse(savedFavorites))
    }
  }, [agents])

  // Add keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Number keys 1-9 for quick switching
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1
        if (agents[index]) {
          handleSelectAgent(agents[index])
        }
      }

      // Alt/Option + number for favorite groups
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1
        if (favoriteGroups[index]) {
          handleSelectAgent(favoriteGroups[index].agents[0])
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [agents, favoriteGroups, handleSelectAgent])

  return (
    <Window 
      className={cn(
        "fixed left-4 top-4 bottom-4 w-64 flex flex-col p-0",
        !isPinned && "w-16",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className={cn("font-medium", !isPinned && "hidden")}>Agents</h3>
        <button
          onClick={() => setIsPinned(prev => !prev)}
          className="p-1.5 rounded-lg hover:bg-white/5 text-stone-600 dark:text-stone-400"
        >
          <Pin className={cn("w-4 h-4", isPinned && "text-primary")} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-4">
        {recentAgents.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-2">
              <Clock className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              {isPinned && <span className="text-sm text-stone-600 dark:text-stone-400">Recent</span>}
            </div>
            {recentAgents.map((agent, index) => (
              <button
                key={agent.id}
                onClick={() => handleSelectAgent(agent)}
                className={cn(
                  "w-full flex items-center gap-2 p-2 rounded-lg transition-colors",
                  selectedAgent?.id === agent.id 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-white/5",
                  !isPinned && "justify-center"
                )}
              >
                {React.createElement(agentIcons[agent.type], { 
                  className: "w-5 h-5"
                })}
                {isPinned && (
                  <div className="flex items-center justify-between flex-1">
                    <span>{agent.name}</span>
                    <kbd className="px-2 py-0.5 text-xs bg-white/5 rounded">
                      {index + 1}
                    </kbd>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 px-2">
            <Star className="w-4 h-4 text-stone-600 dark:text-stone-400" />
            {isPinned && <span className="text-sm text-stone-600 dark:text-stone-400">Favorites</span>}
          </div>
          {favoriteGroups.map((group, index) => (
            <div key={group.id} className="space-y-1">
              {isPinned && (
                <div className="px-2 text-sm font-medium text-stone-900 dark:text-white flex items-center justify-between">
                  <span>{group.name}</span>
                  <kbd className="px-2 py-0.5 text-xs bg-white/5 rounded">
                    ⌥{index + 1}
                  </kbd>
                </div>
              )}
              {group.agents.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => handleSelectAgent(agent)}
                  className={cn(
                    "w-full flex items-center gap-2 p-2 rounded-lg transition-colors",
                    selectedAgent?.id === agent.id 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-white/5",
                    !isPinned && "justify-center"
                  )}
                >
                  {React.createElement(agentIcons[agent.type], { 
                    className: "w-5 h-5"
                  })}
                  {isPinned && <span>{agent.name}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 px-2">
            <div className="w-4 h-4" />
            {isPinned && <span className="text-sm text-stone-600 dark:text-stone-400">All Agents</span>}
          </div>
          {agents.map((agent, index) => (
            <button
              key={agent.id}
              onClick={() => handleSelectAgent(agent)}
              className={cn(
                "w-full flex items-center gap-2 p-2 rounded-lg transition-colors",
                selectedAgent?.id === agent.id 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-white/5",
                !isPinned && "justify-center"
              )}
            >
              {React.createElement(agentIcons[agent.type], { 
                className: "w-5 h-5"
              })}
              {isPinned && (
                <div className="flex items-center justify-between flex-1">
                  <span>{agent.name}</span>
                  <kbd className="px-2 py-0.5 text-xs bg-white/5 rounded">
                    {index + 1}
                  </kbd>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </Window>
  )
} 
