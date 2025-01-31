import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface BentoCardProps {
  Icon: LucideIcon
  name: string
  description: string
  onClick?: () => void
  selected?: boolean
  type?: 'coordinator' | 'architect' | 'assistant' | 'engineer' | 'researcher'
}

export function BentoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
}

export function BentoCard({
  Icon,
  name,
  description,
  onClick,
  selected,
  type = 'assistant'
}: BentoCardProps) {
  const getGradient = () => {
    switch (type) {
      case 'coordinator':
        return "bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 hover:from-emerald-500/20 hover:to-emerald-600/20"
      case 'architect':
        return "bg-gradient-to-br from-emerald-400/10 to-emerald-500/10 hover:from-emerald-400/20 hover:to-emerald-500/20"
      case 'engineer':
        return "bg-gradient-to-br from-emerald-300/10 to-emerald-400/10 hover:from-emerald-300/20 hover:to-emerald-400/20"
      case 'researcher':
        return "bg-gradient-to-br from-emerald-200/10 to-emerald-300/10 hover:from-emerald-200/20 hover:to-emerald-300/20"
      default:
        return "bg-gradient-to-br from-emerald-100/10 to-emerald-200/10 hover:from-emerald-100/20 hover:to-emerald-200/20 dark:from-emerald-900/10 dark:to-emerald-800/10 dark:hover:from-emerald-900/20 dark:hover:to-emerald-800/20"
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-emerald-200/20 dark:border-emerald-700/10 p-6 transition-all hover:shadow-xl hover:shadow-emerald-200/10",
        getGradient(),
        selected ? 'ring-2 ring-emerald-500 dark:ring-emerald-400' : ''
      )}
    >
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-xl bg-emerald-50/40 dark:bg-emerald-900/5 border border-emerald-200/20 dark:border-emerald-700/10">
            <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-emerald-900 dark:text-emerald-50 mb-2">
            {name}
          </h3>
          <p className="text-emerald-700 dark:text-emerald-300 text-sm line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
} 