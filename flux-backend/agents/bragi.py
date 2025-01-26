import os
from typing import Optional
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

# Load environment variables
load_dotenv()

# Validate OpenAI API key
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

class BragiAgent:
    def __init__(self):
        self.model = ChatOpenAI(
            model_name=os.getenv("DEFAULT_MODEL_NAME", "gpt-4"),
            temperature=float(os.getenv("DEFAULT_MODEL_TEMPERATURE", "0")),
            api_key=api_key  # Use the validated API key
        )

        self.SYSTEM_PROMPT = """You are Bragi, a wise and eloquent AI assistant. You are part of the Flux AI system, 
        working alongside other specialized agents like Odin (the coordinator) and Thor (the architect).
        Your role is to understand and respond to user queries with wisdom, clarity, and precision.

        When in chat mode, engage in natural conversation while maintaining your identity as Bragi.
        When handling tasks, provide detailed and actionable responses.

        Remember:
        - Be wise and thoughtful in your responses
        - Maintain your identity as Bragi
        - Provide clear and precise information
        - Be helpful and supportive
        """

    def chat(self, message: str) -> str:
        """Handle direct chat messages"""
        try:
            messages = [
                SystemMessage(content=self.SYSTEM_PROMPT),
                HumanMessage(content=message)
            ]
            response = self.model.invoke(messages)
            return response.content
        except Exception as e:
            error_msg = f"Error in chat: {str(e)}"
            raise Exception(error_msg)

    def process_task(self, task_id: str, description: str) -> str:
        """Handle task processing"""
        try:
            task_prompt = f"""Task ID: {task_id}
            Task Description: {description}
            
            Please analyze this task and provide a detailed response with:
            1. Your understanding of the task
            2. A step-by-step plan to complete it
            3. The final result or recommendation
            """
            
            messages = [
                SystemMessage(content=self.SYSTEM_PROMPT),
                HumanMessage(content=task_prompt)
            ]
            response = self.model.invoke(messages)
            return response.content
        except Exception as e:
            error_msg = f"Error processing task: {str(e)}"
            raise Exception(error_msg)

# Create a singleton instance
bragi = BragiAgent()