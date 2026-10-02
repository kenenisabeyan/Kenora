/**
 * Domain Events & NATS JetStream Event Backbone
 */

export const EventTopics = {
  KNOWLEDGE_ITEM_DISCOVERED: "knowledge.item.discovered",
  KNOWLEDGE_ITEM_NORMALIZED: "knowledge.item.normalized",
  KNOWLEDGE_ITEM_DEDUPLICATED: "knowledge.item.deduplicated",
  KNOWLEDGE_ITEM_VERIFIED: "knowledge.item.verified",
  KNOWLEDGE_ENTITY_CREATED: "knowledge.entity.created",
  KNOWLEDGE_RELATIONSHIP_CREATED: "knowledge.relationship.created",
  BRIEFING_GENERATED: "briefing.generated",
  AGENT_TASK_CREATED: "agent.task.created",
  AGENT_TASK_COMPLETED: "agent.task.completed",
} as const;

export type EventTopic = (typeof EventTopics)[keyof typeof EventTopics];

export interface BaseDomainEvent<T = unknown> {
  eventId: string;
  topic: EventTopic;
  tenantId: string;
  timestamp: string;
  correlationId?: string;
  payload: T;
}

export interface DomainEventPublisher {
  publish<T>(
    topic: EventTopic,
    tenantId: string,
    payload: T,
    correlationId?: string,
  ): Promise<void>;
}

export interface DomainEventConsumer {
  subscribe<T>(
    topic: EventTopic,
    handler: (event: BaseDomainEvent<T>) => Promise<void>,
  ): Promise<void>;
}
