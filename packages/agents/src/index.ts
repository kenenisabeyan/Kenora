/**
 * Core Agent Specifications & Lifecycle Abstractions
 */

export interface AgentContext {
  tenantId: string;
  agentId: string;
  correlationId: string;
  permissions: string[];
}

export interface AgentTask<TInput = unknown, TOutput = unknown> {
  taskId: string;
  taskType: string;
  input: TInput;
  status: "pending" | "in_progress" | "completed" | "failed";
  result?: TOutput;
  error?: string;
  createdAt: string;
}

export interface IAgent {
  readonly id: string;
  readonly name: string;
  readonly capabilities: string[];
  executeTask<TInput, TOutput>(
    context: AgentContext,
    task: AgentTask<TInput, TOutput>,
  ): Promise<AgentTask<TInput, TOutput>>;
}
