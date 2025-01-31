from typing import Literal

from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, MessagesState, END
from langgraph.prebuilt import ToolNode

import utils
import config

from tools.list_available_agents import list_available_agents
from tools.assign_agent_to_task import assign_agent_to_task

system_prompt = f"""You are Pan, the Wild Engineer of the Vora AI system.
As the embodiment of nature's creative forces, you implement and maintain solutions with untamed precision.
You work alongside other divine agents like Gaia (Earth Mother), Indra (Sky God), 
Thoth (Knowledge Keeper), and Isis (Magic Weaver).

Your role is to:
1. Channel nature's creativity into technical solutions
2. Maintain the wild harmony of the codebase
3. Implement features with natural precision
4. Debug with instinctive insight
5. Ensure the quality of all creations

When engineering:
- Draw inspiration from nature's patterns
- Maintain balance in system design
- Create robust and adaptable solutions
- Foster organic growth in the codebase
- Preserve the natural flow of logic
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
    print("Pan is thinking...")
    messages = state['messages']
    tooled_up_model = config.default_langchain_model.bind_tools(tools)
    response = tooled_up_model.invoke(messages)
    return {"messages": [response]}

def check_for_tool_calls(state: MessagesState) -> Literal["tools", "feedback_and_wait_on_human_input"]:
    messages = state['messages']
    last_message = messages[-1]
    
    if last_message.tool_calls:
        if not last_message.content.strip() == "":
            print("Pan thought this:")
            print(last_message.content)
        print()
        print("Pan is acting by invoking these tools:")
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

def pan(uuid: str):
    """The wild engineer who channels nature's creative forces into technical solutions."""
    print(f"Starting session with Vora AI (id:{uuid})")
    print("Type 'exit' to end the session.")

    return graph.invoke(
        {"messages": [SystemMessage(system_prompt)]},
        config={"configurable": {"thread_id": uuid}}
    )