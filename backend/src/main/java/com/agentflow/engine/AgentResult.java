package com.agentflow.engine;

import java.util.*;

public class AgentResult {
    private final String output;
    private final List<AgentStep> steps;
    private final Map<String, Object> metadata;

    public AgentResult(String output, List<AgentStep> steps, Map<String, Object> metadata) {
        this.output = output; this.steps = steps; this.metadata = metadata;
    }
    public String getOutput() { return output; }
    public List<AgentStep> getSteps() { return steps; }
    public Map<String, Object> getMetadata() { return metadata; }
}
