import sys
from pathlib import Path

import pytest

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))


class FakeFunction:
    def __init__(self, name, arguments=None):
        self.name = name
        self.arguments = arguments if arguments is not None else {}


class FakeToolCall:
    def __init__(self, name, arguments=None):
        self.function = FakeFunction(name, arguments)


class FakeMessage:
    def __init__(self, content="", tool_calls=None):
        self.content = content
        self.tool_calls = tool_calls


class FakeResponse:
    def __init__(self, message):
        self.message = message


def make_tool_response(name, arguments=None):
    return FakeResponse(FakeMessage("", [FakeToolCall(name, arguments)]))


def make_text_response(content):
    return FakeResponse(FakeMessage(content, None))


@pytest.fixture
def tool_response():
    return make_tool_response


@pytest.fixture
def text_response():
    return make_text_response
