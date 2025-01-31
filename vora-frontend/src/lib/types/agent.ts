export type AgentType = 'assistant' | 'coordinator' | 'architect' | 'engineer' | 'researcher';

export interface AgentDetails {
  title: string;
  description: string;
  features: string[];
  role: string;
}

export const agentDetails: Record<AgentType, AgentDetails> = {
  assistant: {
    title: "Hermes - The AI Assistant",
    description: "A powerful AI assistant that can help with various tasks, from answering questions to helping with complex problems.",
    features: [
      "Natural Language Understanding",
      "Task Processing",
      "Information Retrieval",
      "Problem Solving",
      "Real-time Responses"
    ],
    role: "Your primary interface for task execution and problem-solving. Hermes understands natural language and can help with a wide range of tasks."
  },
  coordinator: {
    title: "Project Coordinator",
    description: "Coordinates and manages project workflows and team communication.",
    features: [
      "Task Management",
      "Resource Allocation",
      "Timeline Planning",
      "Team Coordination",
      "Progress Tracking"
    ],
    role: "Specializes in organizing and managing complex projects, ensuring smooth collaboration and efficient task execution."
  },
  architect: {
    title: "System Architect",
    description: "Designs and plans system architecture and infrastructure.",
    features: [
      "System Design",
      "Architecture Planning",
      "Technical Documentation",
      "Performance Optimization",
      "Infrastructure Planning"
    ],
    role: "Focuses on designing robust and scalable system architectures, ensuring optimal performance and maintainability."
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