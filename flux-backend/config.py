import os
from dotenv import load_dotenv

# Import LangChain chat models
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic

# Load environment variables from a .env file if present
load_dotenv()

# -------------------------------------------------------------------
# Configuration & Defaults
# -------------------------------------------------------------------
default_model_temperature = int(os.getenv("DEFAULT_MODEL_TEMPERATURE", "0"))
default_model_provider = os.getenv("DEFAULT_MODEL_PROVIDER", "OPENAI").upper()
default_model_name = os.getenv("DEFAULT_MODEL_NAME", "gpt-4")

# -------------------------------------------------------------------
# Choose a model based on provider
# -------------------------------------------------------------------
if default_model_provider == "OPENAI":
    default_langchain_model = ChatOpenAI(
        model_name=default_model_name,
        temperature=default_model_temperature
    )
elif default_model_provider == "ANTHROPIC":
    default_langchain_model = ChatAnthropic(
        model_name=default_model_name,
        temperature=default_model_temperature
    )
elif default_model_provider == "OLLAMA":
    # OLLAMA is used as an example of a custom base. Provide a dummy key.
    default_langchain_model = ChatOpenAI(
        model_name=default_model_name,
        temperature=default_model_temperature,
        openai_api_key="ollama",  
        openai_api_base="http://IPADDRESS:11434/v1",  # Replace with actual host if needed
    )
else:
    raise ValueError(f"Unsupported model provider: {default_model_provider}")
