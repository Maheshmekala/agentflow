package com.agentflow.engine;

import java.util.*;

public class AgentContext {
    private final String sessionId;
    private final List<Map<String, Object>> history = new ArrayList<>();
    private final Map<String, Object> memory = new HashMap<>();

    public AgentContext(String sessionId) { this.sessionId = sessionId; }
    public String getSessionId() { return sessionId; }
    public List<Map<String, Object>> getHistory() { return history; }
    public Map<String, Object> getMemory() { return memory; }

    public void addMessage(String role, String content) {
        Map<String, Object> msg = new LinkedHashMap<>();
        msg.put("role", role); msg.put("content", content);
        history.add(msg);
    }
}
