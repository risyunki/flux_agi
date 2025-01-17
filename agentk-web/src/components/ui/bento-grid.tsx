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
        return "bg-gradient-to-br from-stone-500/20 to-amber-500/20 hover:from-stone-500/30 hover:to-amber-500/30"
      case 'architect':
        return "bg-gradient-to-br from-amber-500/20 to-stone-500/20 hover:from-amber-500/30 hover:to-stone-500/30"
      case 'engineer':
        return "bg-gradient-to-br from-stone-400/20 to-amber-400/20 hover:from-stone-400/30 hover:to-amber-400/30"
      case 'researcher':
        return "bg-gradient-to-br from-amber-400/20 to-stone-400/20 hover:from-amber-400/30 hover:to-stone-400/30"
      default:
        return "bg-stone-50/40 dark:bg-white/5 hover:bg-stone-100/60 dark:hover:bg-white/10"
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-stone-200/20 dark:border-white/10 p-6 transition-all hover:shadow-xl hover:shadow-stone-200/10",
        getGradient(),
        selected ? 'ring-2 ring-stone-400 dark:ring-stone-600' : ''
      )}
    >
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-xl bg-stone-100/40 dark:bg-white/5 border border-stone-200/20 dark:border-white/10">
            <Icon className="w-6 h-6 text-stone-700 dark:text-stone-300" />
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