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
        return "bg-gradient-to-br from-sky-500/10 to-blue-500/10 hover:from-sky-500/20 hover:to-blue-500/20"
      case 'architect':
        return "bg-gradient-to-br from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20"
      case 'engineer':
        return "bg-gradient-to-br from-indigo-400/10 to-sky-400/10 hover:from-indigo-400/20 hover:to-sky-400/20"
      case 'researcher':
        return "bg-gradient-to-br from-sky-400/10 to-blue-400/10 hover:from-sky-400/20 hover:to-blue-400/20"
      default:
        return "bg-stone-50/40 dark:bg-white/5 hover:bg-stone-100/60 dark:hover:bg-white/10"
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/20 dark:border-white/10 p-6 transition-all hover:shadow-xl hover:shadow-stone-200/10",
        getGradient(),
        selected ? 'ring-2 ring-primary dark:ring-primary' : ''
      )}
    >
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10">
            <Icon className="w-6 h-6 text-primary dark:text-primary" />
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-stone-900 dark:text-white mb-2">
            {name}
          </h3>
          <p className="text-stone-600 dark:text-stone-400 text-sm line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
} 