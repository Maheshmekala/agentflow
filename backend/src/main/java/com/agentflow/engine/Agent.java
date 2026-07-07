package com.agentflow.engine;

public interface Agent {
    String getName();
    String getDescription();
    AgentResult execute(AgentContext context, String input);
}
