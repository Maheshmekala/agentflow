package com.agentflow.engine;

import java.time.Instant;
import java.util.Map;

public class AgentStep {
    private final String type; // THOUGHT, TOOL_CALL, TOOL_RESULT, RESPONSE
    private final String content;
    private final Map<String, Object> metadata;
    private final Instant timestamp;

    public AgentStep(String type, String content, Map<String, Object> metadata) {
        this.type = type; this.content = content; this.metadata = metadata;
        this.timestamp = Instant.now();
    }
    public String getType() { return type; }
    public String getContent() { return content; }
    public Map<String, Object> getMetadata() { return metadata; }
    public Instant getTimestamp() { return timestamp; }
}
