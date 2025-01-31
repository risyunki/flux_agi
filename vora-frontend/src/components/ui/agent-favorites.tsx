"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Window } from "./window"
import { Button } from "./button"
import { Input } from "./input"
import { Plus, X } from "lucide-react"
import { type Agent } from "@/lib/services/agent.service"

interface AgentFavoritesProps {
  agents: Agent[]
  onClose: () => void
  className?: string
}

interface FavoriteGroup {
  id: string
  name: string
  agents: Agent[]
}

export function AgentFavorites({
  agents,
  onClose,
  className
}: AgentFavoritesProps) {
  const [groups, setGroups] = React.useState<FavoriteGroup[]>([])
  const [newGroupName, setNewGroupName] = React.useState("")
  const [selectedAgents, setSelectedAgents] = React.useState<Set<string>>(new Set())

  // Load saved groups on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('favoriteGroups')
    if (saved) {
      setGroups(JSON.parse(saved))
    }
  }, [])

  const saveGroups = React.useCallback((newGroups: FavoriteGroup[]) => {
    setGroups(newGroups)
    localStorage.setItem('favoriteGroups', JSON.stringify(newGroups))
  }, [])

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || selectedAgents.size === 0) return

    const newGroup: FavoriteGroup = {
      id: `group_${Date.now()}`,
      name: newGroupName.trim(),
      agents: agents.filter(agent => selectedAgents.has(agent.id))
    }

    saveGroups([...groups, newGroup])
    setNewGroupName("")
    setSelectedAgents(new Set())
  }

  const handleDeleteGroup = (groupId: string) => {
    saveGroups(groups.filter(g => g.id !== groupId))
  }

  return (
    <Window className={cn("w-full max-w-lg p-6 space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Favorite Agent Groups</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Create New Group</h3>
          <div className="flex gap-2">
            <Input
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="Group name"
              className="flex-1"
            />
            <Button onClick={handleCreateGroup}>
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {agents.map(agent => (
              <button
                key={agent.id}
                onClick={() => {
                  setSelectedAgents(prev => {
                    const next = new Set(prev)
                    if (next.has(agent.id)) {
                      next.delete(agent.id)
                    } else {
                      next.add(agent.id)
                    }
                    return next
                  })
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm transition-colors",
                  selectedAgents.has(agent.id)
                    ? "bg-primary/10 text-primary"
                    : "bg-white/5 hover:bg-white/10"
                )}
              >
                {agent.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Saved Groups</h3>
          <div className="space-y-2">
            {groups.map(group => (
              <div
                key={group.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5"
              >
                <div>
                  <div className="font-medium">{group.name}</div>
                  <div className="text-sm text-stone-600 dark:text-stone-400">
                    {group.agents.map(a => a.name).join(", ")}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteGroup(group.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {groups.length === 0 && (
              <div className="text-center text-stone-600 dark:text-stone-400 py-4">
                No saved groups yet
              </div>
            )}
          </div>
        </div>
      </div>
    </Window>
  )
} 