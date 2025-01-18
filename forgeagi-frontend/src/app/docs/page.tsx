"use client"

import { Card } from "@/components/ui/card"

export default function DocsPage() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-8">Forge Documentation</h1>
        <p className="text-lg mb-12">
          Welcome to Forge&apos;s documentation. This guide will help you understand how to interact with our AI agents and make the most of their capabilities.
        </p>
      </div>

      <div className="grid gap-8">
        <Card className="p-8 backdrop-blur-sm bg-white/50 dark:bg-stone-900/50">
          <h2 className="text-2xl font-semibold mb-6">System Architecture</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Forge represents a significant step towards Artificial General Intelligence (AGI) through its unique multi-agent architecture. 
              Unlike traditional AI systems that rely on a single large language model, Forge implements a distributed cognitive architecture 
              that mirrors the modular and hierarchical nature of biological intelligence.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-4">Core Principles</h3>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Emergent Intelligence:</strong> Through the interaction of specialized agents, the system demonstrates emergent 
                problem-solving capabilities that exceed the sum of its individual components.
              </li>
              <li>
                <strong>Self-Evolution:</strong> The system can dynamically create and modify agents as needed, allowing it to adapt 
                and evolve its capabilities based on encountered challenges.
              </li>
              <li>
                <strong>Cognitive Hierarchy:</strong> Implements a three-tier architecture of executive function (Odin), 
                architectural development (Thor), and specialized task execution (Bragi).
              </li>
            </ul>
          </div>
        </Card>

        <Card className="p-8 backdrop-blur-sm bg-white/50 dark:bg-stone-900/50">
          <h2 className="text-2xl font-semibold mb-6">Agent Ecosystem</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              The system&apos;s approach to AGI is grounded in the principle of cognitive specialization and collaborative intelligence. 
              Each agent represents a specialized cognitive module that contributes to the system&apos;s overall intelligence:
            </p>
            
            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-lg font-semibold">Odin - The Coordinator</h4>
                <p className="mt-2">
                  As the executive function of the system, Odin implements advanced planning algorithms and resource allocation 
                  strategies. It utilizes meta-learning techniques to optimize agent collaboration and task distribution, 
                  demonstrating emergent strategic thinking capabilities.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold">Thor - The Architect</h4>
                <p className="mt-2">
                  Represents the system&apos;s self-modification capability, crucial for AGI development. Thor can analyze, modify, 
                  and create new agents, implementing a form of recursive self-improvement that&apos;s essential for achieving 
                  artificial general intelligence.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold">Bragi - The Assistant</h4>
                <p className="mt-2">
                  Serves as the primary interface for human-AI interaction, employing advanced natural language processing 
                  and contextual understanding. Bragi demonstrates fluid intelligence by adapting its communication style 
                  and problem-solving approach based on user interaction patterns.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 backdrop-blur-sm bg-white/50 dark:bg-stone-900/50">
          <h2 className="text-2xl font-semibold mb-6">AGI Progression</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              While Forge represents a significant step towards AGI, it&apos;s important to understand its current position on the 
              path to true artificial general intelligence:
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-4">Current Capabilities</h3>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Multi-Agent Collaboration:</strong> Demonstrates emergent problem-solving through agent interaction
              </li>
              <li>
                <strong>Adaptive Learning:</strong> Can modify its agent ecosystem based on new challenges
              </li>
              <li>
                <strong>Meta-Learning:</strong> Implements strategies for improving its own learning processes
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-4">Path to AGI</h3>
            <p>
              The system&apos;s architecture lays the groundwork for AGI through its implementation of key cognitive principles:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Recursive Self-Improvement:</strong> Through Thor&apos;s architectural capabilities
              </li>
              <li>
                <strong>Emergent Consciousness:</strong> Through multi-agent interaction and meta-cognition
              </li>
              <li>
                <strong>Distributed Intelligence:</strong> Through specialized cognitive modules working in concert
              </li>
            </ul>
          </div>
        </Card>

        <Card className="p-8 backdrop-blur-sm bg-white/50 dark:bg-stone-900/50">
          <h2 className="text-2xl font-semibold mb-6">Getting Started</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              To begin working with this advanced AI system:
            </p>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Select an agent appropriate for your task type</li>
              <li>Clearly articulate your objective or problem</li>
              <li>Allow the system to coordinate multiple agents if needed</li>
              <li>Provide feedback to help the system learn and adapt</li>
            </ol>
            <p className="mt-4">
              Remember that each interaction contributes to the system&apos;s learning and evolution towards more general intelligence.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}   
