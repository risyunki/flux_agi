import { useState } from "react"

export function useTask() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitTask = async (task: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit task")
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    submitTask,
    isLoading,
    error,
  }
} 