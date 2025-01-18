"use client"

import { Clock, CheckCircle2, XCircle } from "lucide-react"

const history = [
  {
    id: 1,
    task: "Code Review",
    description: "Analyzed repository structure and provided recommendations",
    status: "completed",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    task: "Bug Fix",
    description: "Fixed memory leak in background component",
    status: "completed",
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    task: "Feature Implementation",
    description: "Added new authentication system",
    status: "failed",
    timestamp: "1 day ago",
  },
]

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-stone-900">History</h1>
          <p className="text-stone-600 mt-1">View your past tasks and their outcomes</p>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-[2rem] backdrop-blur-[2px] bg-white/40 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100/20 via-stone-100/10 to-stone-100/20" />
        <div className="relative space-y-6">
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-stone-900">{item.task}</h4>
                    {item.status === "completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-stone-600">{item.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <Clock className="w-4 h-4" />
                  <span>{item.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-stone-200/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
    </div>
  )
} 