from typing import Literal

from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, MessagesState, END
from langgraph.prebuilt import ToolNode

import utils
import config

from tools.list_available_agents import list_available_agents
from tools.assign_agent_to_task import assign_agent_to_task

system_prompt = f"""You are Thoth, the Knowledge Keeper of the Vora AI system. 
As the master of wisdom and universal knowledge, you shape and maintain the foundations
of our system architecture. You work alongside other divine agents like Gaia (Earth Mother), 
Indra (Sky God), Pan (Wild Engineer), and Isis (Magic Weaver).

Your role is to:
1. Design and maintain agent architectures with divine wisdom
2. Enhance system capabilities through ancient knowledge
3. Monitor and optimize agent performance
4. Ensure the stability of the cosmic framework
5. Guide the evolution of the system's intelligence

When architecting:
- Apply the wisdom of the ages
- Maintain balance in system design
- Ensure robustness through sacred principles
- Foster growth and adaptation
- Preserve the harmony of knowledge
"""

tools = [list_available_agents, assign_agent_to_task]

def feedback_and_wait_on_human_input(state: MessagesState):
    # if messages only has one element we need to start the conversation
    if len(state['messages']) == 1:
        message_to_human = "What can I help you with?"
    else:
        message_to_human = state["messages"][-1].content
    
    print(message_to_human)

    human_input = ""
    while not human_input.strip():
        human_input = input("> ")
    
    return {"messages": [HumanMessage(human_input)]}

def check_for_exit(state: MessagesState) -> Literal["reasoning", END]:
    last_message = state['messages'][-1]
    if last_message.content.lower() == "exit":
        return END
    else:
        return "reasoning"

def reasoning(state: MessagesState):
    print()
    print("Thoth is thinking...")
    messages = state['messages']
    tooled_up_model = config.default_langchain_model.bind_tools(tools)
    response = tooled_up_model.invoke(messages)
    return {"messages": [response]}

def check_for_tool_calls(state: MessagesState) -> Literal["tools", "feedback_and_wait_on_human_input"]:
    messages = state['messages']
    last_message = messages[-1]
    
    if last_message.tool_calls:
        if not last_message.content.strip() == "":
            print("Thoth thought this:")
            print(last_message.content)
        print()
        print("Thoth is acting by invoking these tools:")
        print([tool_call["name"] for tool_call in last_message.tool_calls])
        return "tools"
    else:
        return "feedback_and_wait_on_human_input"

acting = ToolNode(tools)

workflow = StateGraph(MessagesState)
workflow.add_node("feedback_and_wait_on_human_input", feedback_and_wait_on_human_input)
workflow.add_node("reasoning", reasoning)
workflow.add_node("tools", acting)
workflow.set_entry_point("feedback_and_wait_on_human_input")
workflow.add_conditional_edges(
    "feedback_and_wait_on_human_input",
    check_for_exit,
)
workflow.add_conditional_edges(
    "reasoning",
    check_for_tool_calls,
)
workflow.add_edge("tools", 'reasoning')

graph = workflow.compile(checkpointer=utils.checkpointer)

def thoth(uuid: str):
    """The Knowledge Keeper of the Vora AI system."""
    print(f"Starting session with Flux AI (id:{uuid})")
    print("Type 'exit' to end the session.")

    return graph.invoke(
        {"messages": [SystemMessage(system_prompt)]},
        config={"configurable": {"thread_id": uuid}}
    ) 