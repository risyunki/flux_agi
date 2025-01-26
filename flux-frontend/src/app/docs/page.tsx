"use client"

import { Card } from "@/components/ui/card"

export default function DocsPage() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-8">Flux Documentation</h1>
        <p className="text-lg mb-8">
          Welcome to Flux&apos;s documentation. This guide will help you understand how to interact with our AI agents and make the most of their capabilities.
        </p>
      </div>

      <div className="grid gap-8">
        <Card className="p-8 backdrop-blur-sm bg-white/50 dark:bg-stone-900/50">
          <h2 className="text-2xl font-semibold mb-6">System Architecture</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Flux represents a significant step towards Artificial General Intelligence (AGI) through its unique multi-agent architecture. 
              Unlike traditional AI systems that rely on a single large language model, Flux implements a distributed cognitive architecture 
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

            <h3 className="text-xl font-semibold mt-6 mb-4">System Components</h3>
            <div className="mt-4 p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
              <h4 className="font-medium mb-3">Core Services</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[120px]">Agent Service:</span>
                  <span>Manages agent lifecycle, coordination, and communication</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[120px]">Task Service:</span>
                  <span>Handles task queuing, distribution, and execution tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[120px]">Memory Service:</span>
                  <span>Manages persistent storage and retrieval of agent knowledge</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[120px]">Learning Service:</span>
                  <span>Coordinates model training and optimization</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
              <h4 className="font-medium mb-3">Infrastructure</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[120px]">Load Balancer:</span>
                  <span>NGINX with custom routing for WebSocket and HTTP traffic</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[120px]">Message Queue:</span>
                  <span>Redis pub/sub for real-time event distribution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[120px]">Cache Layer:</span>
                  <span>Redis for high-speed data access and session management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[120px]">Storage:</span>
                  <span>PostgreSQL for relational data, MinIO for object storage</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-8 backdrop-blur-sm bg-white/50 dark:bg-stone-900/50">
          <h2 className="text-2xl font-semibold mb-6">Technical Implementation</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              The Flux system is built on a modern tech stack designed for scalability, reliability, and real-time collaboration:
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-4">Frontend Architecture</h3>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Next.js 14:</strong> Server-side rendering and static site generation for optimal performance
              </li>
              <li>
                <strong>TailwindCSS:</strong> Utility-first CSS framework for responsive and maintainable styling
              </li>
              <li>
                <strong>WebSocket Integration:</strong> Real-time communication with agents and live updates
              </li>
              <li>
                <strong>State Management:</strong> React Context and hooks for efficient state handling
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-4">Backend Services</h3>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>FastAPI:</strong> High-performance Python web framework for the API layer
              </li>
              <li>
                <strong>WebSocket Server:</strong> Asynchronous WebSocket server for real-time agent communication
              </li>
              <li>
                <strong>Task Queue:</strong> Distributed task processing with Redis and Celery
              </li>
              <li>
                <strong>Database:</strong> PostgreSQL for persistent storage with SQLAlchemy ORM
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-4">API Endpoints</h3>
            <div className="mt-4 p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
              <h4 className="font-medium mb-3">Agents</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-sm bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">GET /agents</code> - List all available agents</li>
                <li><code className="text-sm bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">GET /agents/{"{agent_id}"}</code> - Get specific agent details</li>
                <li><code className="text-sm bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">POST /agents</code> - Deploy a new agent</li>
              </ul>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
              <h4 className="font-medium mb-3">Tasks</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-sm bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">GET /tasks</code> - List all tasks</li>
                <li><code className="text-sm bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">POST /tasks</code> - Create a new task</li>
                <li><code className="text-sm bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">GET /tasks/{"{task_id}"}</code> - Get task details</li>
                <li><code className="text-sm bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">PUT /tasks/{"{task_id}"}</code> - Update task status</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-8 backdrop-blur-sm bg-white/50 dark:bg-stone-900/50">
          <h2 className="text-2xl font-semibold mb-6">Deployment Guide</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Flux can be deployed in various environments, from development to production. Here are the recommended deployment methods:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-4">Docker Deployment</h3>
            <div className="mt-4 p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
              <h4 className="font-medium mb-3">Quick Start with Docker Compose</h4>
              <pre className="text-sm bg-stone-200 dark:bg-stone-700 p-3 rounded overflow-x-auto">
{`# Clone the repository
git clone https://github.com/fluxai/flux
cd flux

# Start the services
docker-compose up -d

# Check the status
docker-compose ps`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-4">Kubernetes Deployment</h3>
            <div className="mt-4 p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
              <h4 className="font-medium mb-3">Deploy with Helm</h4>
              <pre className="text-sm bg-stone-200 dark:bg-stone-700 p-3 rounded overflow-x-auto">
{`# Add the Flux Helm repository
helm repo add flux https://charts.flux.ai
helm repo update

# Install Flux
helm install flux flux/flux-agi --namespace flux-system`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-4">Environment Variables</h3>
            <div className="mt-4 p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
              <h4 className="font-medium mb-3">Required Configuration</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <code className="text-sm bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded min-w-[200px]">FLUX_API_KEY</code>
                  <span>Your Flux API key for authentication</span>
                </li>
                <li className="flex items-start gap-2">
                  <code className="text-sm bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded min-w-[200px]">POSTGRES_URL</code>
                  <span>PostgreSQL connection string</span>
                </li>
                <li className="flex items-start gap-2">
                  <code className="text-sm bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded min-w-[200px]">REDIS_URL</code>
                  <span>Redis connection string</span>
                </li>
                <li className="flex items-start gap-2">
                  <code className="text-sm bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded min-w-[200px]">MODEL_PROVIDER</code>
                  <span>AI model provider (openai/anthropic)</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-8 backdrop-blur-sm bg-white/50 dark:bg-stone-900/50">
          <h2 className="text-2xl font-semibold mb-6">Security</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Security is a top priority in Flux. Here are the key security features and best practices:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-4">Authentication</h3>
            <div className="mt-4 p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
              <h4 className="font-medium mb-3">API Authentication</h4>
              <pre className="text-sm bg-stone-200 dark:bg-stone-700 p-3 rounded overflow-x-auto">
{`# API request with authentication
curl -X GET https://api.flux.ai/agents \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-4">Security Features</h3>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Rate Limiting:</strong> Prevents abuse through IP-based and token-based rate limiting
              </li>
              <li>
                <strong>Input Validation:</strong> Strict validation of all API inputs using Pydantic models
              </li>
              <li>
                <strong>Audit Logging:</strong> Comprehensive logging of all system actions and agent operations
              </li>
              <li>
                <strong>Data Encryption:</strong> All sensitive data is encrypted at rest and in transit
              </li>
            </ul>

            <div className="mt-4 p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
              <h4 className="font-medium mb-3">Security Headers</h4>
              <pre className="text-sm bg-stone-200 dark:bg-stone-700 p-3 rounded overflow-x-auto">
{`Content-Security-Policy: default-src 'self';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin`}
              </pre>
            </div>
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
                <div className="mt-3 p-3 bg-stone-100 dark:bg-stone-800 rounded-lg">
                  <h5 className="font-medium mb-2">Technical Capabilities:</h5>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Multi-agent task orchestration</li>
                    <li>Dynamic resource allocation</li>
                    <li>Real-time performance monitoring</li>
                    <li>Adaptive load balancing</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold">Thor - The Architect</h4>
                <p className="mt-2">
                  Represents the system&apos;s self-modification capability, crucial for AGI development. Thor can analyze, modify, 
                  and create new agents, implementing a form of recursive self-improvement that&apos;s essential for achieving 
                  artificial general intelligence.
                </p>
                <div className="mt-3 p-3 bg-stone-100 dark:bg-stone-800 rounded-lg">
                  <h5 className="font-medium mb-2">Technical Capabilities:</h5>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Agent architecture design</li>
                    <li>Neural network optimization</li>
                    <li>Model fine-tuning</li>
                    <li>Performance benchmarking</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold">Bragi - The Assistant</h4>
                <p className="mt-2">
                  Serves as the primary interface for human-AI interaction, employing advanced natural language processing 
                  and contextual understanding. Bragi demonstrates fluid intelligence by adapting its communication style 
                  and problem-solving approach based on user interaction patterns.
                </p>
                <div className="mt-3 p-3 bg-stone-100 dark:bg-stone-800 rounded-lg">
                  <h5 className="font-medium mb-2">Technical Capabilities:</h5>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Natural language understanding</li>
                    <li>Context-aware responses</li>
                    <li>Multi-modal interaction</li>
                    <li>Adaptive communication</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 backdrop-blur-sm bg-white/50 dark:bg-stone-900/50">
          <h2 className="text-2xl font-semibold mb-6">Advanced Usage</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Advanced features and configurations for power users:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-4">Custom Agent Development</h3>
            <div className="mt-4 p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
              <h4 className="font-medium mb-3">Agent Template</h4>
              <pre className="text-sm bg-stone-200 dark:bg-stone-700 p-3 rounded overflow-x-auto">
{`from flux.core import Agent

class CustomAgent(Agent):
    def __init__(self, config: dict):
        super().__init__(config)
        self.capabilities = ["custom_task"]

    async def process_task(self, task: dict) -> dict:
        # Custom task processing logic
        result = await self.execute(task)
        return {"status": "completed", "result": result}`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-4">Performance Tuning</h3>
            <div className="mt-4 p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
              <h4 className="font-medium mb-3">Configuration Options</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <code className="text-sm bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded min-w-[200px]">MAX_CONCURRENT_TASKS</code>
                  <span>Maximum number of concurrent tasks per agent</span>
                </li>
                <li className="flex items-start gap-2">
                  <code className="text-sm bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded min-w-[200px]">MEMORY_CACHE_SIZE</code>
                  <span>Size of the in-memory cache for agent state</span>
                </li>
                <li className="flex items-start gap-2">
                  <code className="text-sm bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded min-w-[200px]">BATCH_SIZE</code>
                  <span>Batch size for model inference</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-8 backdrop-blur-sm bg-white/50 dark:bg-stone-900/50">
          <h2 className="text-2xl font-semibold mb-6">Troubleshooting</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Common issues and their solutions:
            </p>

            <div className="mt-4 space-y-6">
              <div className="p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
                <h4 className="font-medium mb-3">Connection Issues</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <strong className="block mb-1">WebSocket Connection Failed</strong>
                    <p>Check if the WebSocket server is running and accessible:</p>
                    <pre className="text-sm bg-stone-200 dark:bg-stone-700 p-2 rounded mt-2">
{`# Check WebSocket server status
curl -N -H "Connection: Upgrade" \\
     -H "Upgrade: websocket" \\
     -H "Host: api.flux.ai" \\
     -H "Origin: https://flux.ai" \\
     https://api.flux.ai/ws`}
                    </pre>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
                <h4 className="font-medium mb-3">Agent Issues</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <strong className="block mb-1">Agent Not Responding</strong>
                    <p>Check agent logs and restart if necessary:</p>
                    <pre className="text-sm bg-stone-200 dark:bg-stone-700 p-2 rounded mt-2">
{`# View agent logs
kubectl logs -n flux-system deployment/agent-pod

# Restart agent
kubectl rollout restart -n flux-system deployment/agent-pod`}
                    </pre>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
                <h4 className="font-medium mb-3">Performance Issues</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <strong className="block mb-1">High Latency</strong>
                    <p>Monitor system metrics:</p>
                    <pre className="text-sm bg-stone-200 dark:bg-stone-700 p-2 rounded mt-2">
{`# Check system metrics
curl https://api.flux.ai/metrics \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                    </pre>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 backdrop-blur-sm bg-white/50 dark:bg-stone-900/50">
          <h2 className="text-2xl font-semibold mb-6">WebSocket Events</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Real-time communication between clients and agents is handled through WebSocket events:
            </p>
            
            <div className="mt-4 p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
              <h4 className="font-medium mb-3">Task Updates</h4>
              <pre className="text-sm bg-stone-200 dark:bg-stone-700 p-3 rounded overflow-x-auto">
{`interface TaskUpdate {
  type: 'task_update';
  data: {
    id: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    progress?: number;
    result?: string;
  };
}`}
              </pre>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
              <h4 className="font-medium mb-3">Agent Status</h4>
              <pre className="text-sm bg-stone-200 dark:bg-stone-700 p-3 rounded overflow-x-auto">
{`interface AgentStatus {
  type: 'agent_status';
  data: {
    id: string;
    status: 'active' | 'inactive';
    load: number;
  };
}`}
              </pre>
            </div>
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

            <div className="mt-6 p-4 rounded-lg bg-stone-100 dark:bg-stone-800">
              <h4 className="font-medium mb-3">Quick Start Commands</h4>
              <pre className="text-sm bg-stone-200 dark:bg-stone-700 p-3 rounded overflow-x-auto">
{`# Get agent details
> agent info <agent_name>

# Direct agent collaboration
> collaborate odin thor "Design a new agent architecture"

# System diagnostics
> system status
> system metrics`}
              </pre>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}   
