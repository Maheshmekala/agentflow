package com.agentflow.engine;

import java.util.*;

public class SimpleAgent implements Agent {
    private final String name;
    private final String description;
    private final String systemPrompt;

    public SimpleAgent(String name, String description, String systemPrompt) {
        this.name = name; this.description = description; this.systemPrompt = systemPrompt;
    }

    @Override
    public String getName() { return name; }

    @Override
    public String getDescription() { return description; }

    @Override
    public AgentResult execute(AgentContext context, String input) {
        List<AgentStep> steps = new ArrayList<>();
        context.addMessage("user", input);
        steps.add(new AgentStep("THOUGHT", "Processing: " + input, Map.of("agent", name)));
        String response = "Agent '" + name + "' is processing. Use the orchestrator for full AI capabilities.";
        steps.add(new AgentStep("RESPONSE", response, Map.of("agent", name)));
        context.addMessage("assistant", response);
        return new AgentResult(response, steps, Map.of("agent", name, "steps", steps.size()));
    }
}
