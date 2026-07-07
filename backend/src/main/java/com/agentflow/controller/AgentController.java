package com.agentflow.controller;

import com.agentflow.engine.*;
import com.agentflow.registry.ToolExecutor;
import com.agentflow.registry.ToolDefinition;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/agents")
public class AgentController {
    private final ToolExecutor toolExecutor;
    private final AgentOrchestrator orchestrator;

    public AgentController(ToolExecutor toolExecutor, AgentOrchestrator orchestrator) {
        this.toolExecutor = toolExecutor;
        this.orchestrator = orchestrator;

        toolExecutor.register(new ToolDefinition("calculator", "Perform math calculations (+, -, *, /)",
            Map.of("type", "object", "properties", Map.of(
                "a", Map.of("type", "number"), "b", Map.of("type", "number"),
                "operator", Map.of("type", "string", "enum", List.of("+", "-", "*", "/"))
            ))));
        toolExecutor.register(new ToolDefinition("echo", "Echo a message back",
            Map.of("type", "object", "properties", Map.of("message", Map.of("type", "string")))));
        toolExecutor.register(new ToolDefinition("currentTime", "Get current date and time",
            Map.of("type", "object", "properties", Map.of())));
        toolExecutor.register(new ToolDefinition("randomNumber", "Generate a random number",
            Map.of("type", "object", "properties", Map.of())));
    }

    @PostMapping("/run")
    public Map<String, Object> run(@RequestBody Map<String, String> req) {
        String input = req.get("input");
        AgentResult result = orchestrator.execute("AgentFlow", input);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("output", result.getOutput());
        response.put("steps", result.getSteps());
        response.put("metadata", result.getMetadata());
        return response;
    }

    @GetMapping("/tools")
    public List<ToolDefinition> listTools() { return toolExecutor.listTools(); }

    @PostMapping("/tools/register")
    public String register(@RequestBody ToolDefinition tool) {
        toolExecutor.register(tool);
        return "Registered: " + tool.getName();
    }
}
