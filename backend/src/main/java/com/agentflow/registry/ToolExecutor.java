package com.agentflow.registry;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ToolExecutor {
    private final Map<String, ToolDefinition> tools = new ConcurrentHashMap<>();

    public void register(ToolDefinition tool) { tools.put(tool.getName(), tool); }

    public ToolDefinition getDefinition(String name) {
        if (!tools.containsKey(name)) throw new IllegalArgumentException("Unknown tool: " + name);
        return tools.get(name);
    }

    public Map<String, Object> execute(String name, Map<String, Object> args) {
        return switch (name) {
            case "calculator" -> {
                double a = ((Number) args.get("a")).doubleValue();
                double b = ((Number) args.get("b")).doubleValue();
                String op = (String) args.get("operator");
                double r = switch (op) { case "+" -> a+b; case "-" -> a-b; case "*" -> a*b; default -> a/b; };
                yield Map.of("result", r);
            }
            case "echo" -> Map.of("result", args.getOrDefault("message", ""));
            default -> Map.of("result", "Executed: " + name);
        };
    }

    public List<ToolDefinition> listTools() { return List.copyOf(tools.values()); }
}
