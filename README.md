# 🧠 AgentFlow — Visual Multi-Agent Orchestration Platform

> **"A LangGraph-style agent orchestration platform with visual graph designer, real-time agent tracing, tool registry, and Groq LLM-powered intelligence."**

## 🎯 Overview

AgentFlow is a platform for designing, running, and monitoring AI agent workflows. It provides a **visual graph-based designer** (using ReactFlow) where users can construct agent pipelines — Input → LLM → Tool → Analysis → Output — and execute them with **real Groq Llama 3.3 AI**.

The platform demonstrates core **Agentic AI concepts**: tool registration with JSON Schema, tool calling via LLM function detection, real-time agent tracing with step-by-step visualization, and multi-agent topology patterns.

## ✨ Key Features

| Feature | Description | Real AI? |
|---------|-------------|----------|
| **🤖 Agent Runner** | Chat with an AI agent powered by Groq LLM — it understands, thinks, and responds | ✅ Groq Llama 3.3 |
| **🧬 Agent Studio** | Visual graph designer using ReactFlow — drag, connect, and configure agent nodes | ✅ Interactive |
| **🔧 Tool Registry** | Register tools with JSON Schema parameters — LLM discovers and calls them automatically | ✅ Dynamic |
| **📊 Agent Tracing** | Watch the agent think step-by-step: Thought → Tool Call → Result → Response | ✅ Real-time |
| **🧠 Multi-Agent Topologies** | Sequential chains, Supervisor/Worker, DAG execution patterns | ✅ Architecture |

## Agent Execution Flow

```
User: "What is 15 + 27?"

┌─────────────────────────────────────────────────────┐
│ 1. 🧠 THOUGHT: "User wants a calculation"           │
│ 2. 🔧 TOOL_CALL: calculator(15, 27, "+")           │
│ 3. 📊 TOOL_RESULT: "Result: 42"                     │
│ 4. 💬 RESPONSE: "The result of 15 + 27 is 42"      │
└─────────────────────────────────────────────────────┘
```

## 🏗️ Architecture

```
┌─────────────┐     ┌───────────────────┐     ┌─────────────────┐
│  React 19   │────▶│  Spring Boot 3    │────▶│  Agent Engine   │
│  TypeScript │     │  Java 21          │     │  • Context      │
│  ReactFlow  │◀────│  REST APIs        │◀────│  • Steps        │
└─────────────┘     └─────────┬─────────┘     │  • Results      │
                              │               └────────┬────────┘
                     ┌────────▼────────┐               │
                     │  Groq Llama 3.3 │               │
                     │  70B            │        ┌───────▼───────┐
                     └────────┬────────┘        │  Tool Registry │
                              │                 │  • Calculator  │
                     ┌────────▼────────┐        │  • Echo        │
                     │  Agent          │        │  • CurrentTime │
                     │  Orchestrator   │        │  • RandomNum   │
                     └─────────────────┘        └───────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Java 21+** (JDK)
- **Node.js 20+**
- **Docker Desktop** (or use Maven directly)
- **Groq API Key** (free — already configured)

### Run with Docker (One Command)

```bash
cd agentflow
docker compose up -d --build
```

### Run Locally (Two Terminals)

**Terminal 1 — Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Access
| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3002 | React UI (Agent Runner + Agent Studio) |
| **Backend API** | http://localhost:8082 | REST API endpoints |

## 💬 Try These Queries

Open the Agent Runner page and type:

| Query | What the Agent Does |
|-------|-------------------|
| *"Hello! What can you do?"* | LLM responds with capabilities and available tools |
| *"What is 15 + 27?"* | LLM calls `calculator()` tool → returns result → explains |
| *"Tell me about yourself"* | LLM generates a response about AgentFlow |
| *"What tools do you have?"* | LLM lists all registered tools and their usage |

## 🧬 Using Agent Studio

The Studio tab provides a **visual graph designer** for agent workflows:

- **📥 Input Node** — Starting point for user messages
- **🧠 LLM Node** — AI processing step
- **🔧 Tool Node** — Executes a registered tool
- **🤔 Analysis Node** — Evaluates tool results
- **📤 Output Node** — Final response

**How to use:**
1. Click a node → right panel shows details (ID, type, position)
2. Click **Delete** button or press `Delete/Backspace` key to remove
3. Drag between **handles** (small dots on node edges) to connect
4. Use the **Node Palette** on the right to add new nodes
5. **Scroll** to zoom, **drag** the canvas to pan
6. Hold **Shift** to select multiple nodes
7. Click **Reset** to restore the default graph

## 📡 API Endpoints

### Agent Control
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/agents/run` | Run an agent with input → returns output + trace |
| `GET` | `/api/agents/tools` | List all registered tools |
| `POST` | `/api/agents/tools/register` | Register a new tool |

## 🧪 Testing

```bash
# Test agent
curl -X POST http://localhost:8082/api/agents/run \
  -H "Content-Type: application/json" \
  -d '{"input":"Hello! What can you do?"}'

# List tools
curl http://localhost:8082/api/agents/tools

# Register a custom tool
curl -X POST http://localhost:8082/api/agents/tools/register \
  -H "Content-Type: application/json" \
  -d '{"name":"myTool","description":"My custom tool","parameters":{"type":"object","properties":{}}}'
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Java 21, Spring Boot 3.4, Agent Engine, Tool Registry |
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS 4, ReactFlow 11 |
| **AI/LLM** | Groq Llama 3.3 70B, Agent Orchestration, Tool Calling |
| **AI Pattern** | Agent Loop (Think → Act → Observe → Respond), Tool Registry |
| **Infrastructure** | Docker, Docker Compose, Maven |

## 📊 Interview Talking Points

> *"AgentFlow demonstrates my understanding of Agentic AI architectures. The platform implements the core agent loop pattern — the agent receives input, decides whether to call a tool, executes it, and formulates a response — all powered by Groq's Llama 3.3. The visual graph designer using ReactFlow allows users to see and modify agent pipelines visually, similar to LangGraph Studio. The Tool Registry with JSON Schema definition shows I understand function calling and structured outputs — core concepts for building production AI agents. This project showcases Java 21 with Spring Boot 3, React 19 with TypeScript, and advanced AI orchestration patterns."*

## 🔮 Future Enhancements

- **Multi-Agent Topologies** — Supervisor/Worker, Sequential Chain, Round-Robin patterns
- **Persistent Agent Memory** — Vector store integration for long-term context
- **MCP Server** — Model Context Protocol to expose agents to other AI systems
- **Agent Evaluation** — Eval datasets, scoring, regression tracking
- **Authentication** — JWT-based multi-tenant agent deployments

## 📝 License

MIT
