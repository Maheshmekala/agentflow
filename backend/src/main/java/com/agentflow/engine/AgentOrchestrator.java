package com.agentflow.engine;

import com.agentflow.ai.GroqClient;
import com.agentflow.registry.ToolExecutor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AgentOrchestrator {
    private final GroqClient groqClient;
    private final ToolExecutor toolExecutor;

    public AgentOrchestrator(GroqClient groqClient, ToolExecutor toolExecutor) {
        this.groqClient = groqClient;
        this.toolExecutor = toolExecutor;
    }

    public AgentResult execute(String agentName, String input) {
        List<AgentStep> steps = new ArrayList<>();
        List<Map<String, String>> history = new ArrayList<>();

        steps.add(new AgentStep("THOUGHT", "🤔 Agent initialized. Processing user input...", Map.of("agent", agentName)));
        history.add(Map.of("role", "user", "content", input));

        String systemPrompt = getSystemPrompt(agentName) + "\n\n" + getToolDefinitions();

        // First LLM call — decide if tool is needed
        steps.add(new AgentStep("THOUGHT", "🧠 Calling Groq LLM to analyze request...", Map.of("agent", agentName)));
        String response = groqClient.chatWithHistory(systemPrompt, history);

        // Check if LLM returned a TOOL_CALL
        if (response != null && response.contains("TOOL_CALL:")) {
            String[] lines = response.split("\n");
            for (String line : lines) {
                if (line.contains("TOOL_CALL:")) {
                    String toolName = line.replace("TOOL_CALL:", "").trim()
                        .replace("()", "").trim();
                    steps.add(new AgentStep("TOOL_CALL", "🔧 Executing tool: " + toolName + "()", Map.of("tool", toolName)));

                    Map<String, Object> result = toolExecutor.execute(toolName, Map.of());
                    String resultStr = result.get("result").toString();
                    steps.add(new AgentStep("TOOL_RESULT", "📊 Result: " + resultStr, result));

                    // Add tool result to conversation context
                    history.add(Map.of("role", "assistant", "content",
                        "I called the " + toolName + " tool and got: " + resultStr));
                }
            }

            // Second LLM call — generate final response with tool results
            steps.add(new AgentStep("THOUGHT", "🧠 Formulating final response with tool data...", Map.of("agent", agentName)));
            String finalPrompt = "Based on the tool results, provide a clear and helpful response to the user. Be concise.";
            response = groqClient.chatWithHistory(finalPrompt, history);
        }

        steps.add(new AgentStep("RESPONSE", "💬 " + response, Map.of("agent", agentName)));
        return new AgentResult(response, steps, Map.of("agent", agentName, "steps", steps.size()));
    }

    private String getSystemPrompt(String agentName) {
        return "You are " + agentName + ", an intelligent AI agent powered by Groq's Llama 3.3 70B model. " +
            "Your goal is to help users by answering questions and using available tools when needed. " +
            "Think step by step. If you need data or calculations, use a tool. " +
            "Call tools by responding with EXACTLY:\nTOOL_CALL: toolName()\n\n" +
            "Then after getting the result, provide a final response.";
    }

    private String getToolDefinitions() {
        return "\n\nAVAILABLE TOOLS:\n" +
            "1. calculator() - Perform math calculations (+, -, *, /)\n" +
            "2. echo(message) - Echo back a message\n" +
            "3. currentTime() - Get the current date and time\n" +
            "4. randomNumber(min, max) - Get a random number between min and max\n\n" +
            "To call a tool, respond with: TOOL_CALL: toolName()\n" +
            "Then after getting the result, provide your final response.";
    }
}
