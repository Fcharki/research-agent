from ollama import chat

MODEL = "qwen3:0.6b"


def chat_with_llm(messages: list, tools: list | None = None):
    kwargs = {
        "model": MODEL,
        "messages": messages,
        "options": {
            "temperature": 0.2,
            "num_ctx": 8192,
        },
    }

    if tools:
        kwargs["tools"] = tools

    return chat(**kwargs)
