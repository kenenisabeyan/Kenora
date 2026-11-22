import crypto from "node:crypto";

/**
 * Domain Events & Event Bus Abstractions
 * Aligned with NATS JetStream and High-Throughput Event Mesh Architecture
 */

export const EventTopics = {
  // Knowledge ingestion & processing lifecycle
  KNOWLEDGE_ITEM_DISCOVERED: "knowledge.item.discovered",
  KNOWLEDGE_ITEM_NORMALIZED: "knowledge.item.normalized",
  KNOWLEDGE_ITEM_DEDUPLICATED: "knowledge.item.deduplicated",
  KNOWLEDGE_ITEM_VERIFIED: "knowledge.item.verified",
  
  // Living Knowledge Graph (LPKG) events
  KNOWLEDGE_ENTITY_CREATED: "knowledge.entity.created",
  KNOWLEDGE_ENTITY_SUPERSEDED: "knowledge.entity.superseded",
  KNOWLEDGE_RELATIONSHIP_CREATED: "knowledge.relationship.created",
  
  // Verification & conflict resolution
  CONFLICT_ADJUDICATED: "conflict.adjudicated",
  BENCHMARK_VERIFIED: "benchmark.verified",
  
  // Delivery & Briefings
  BRIEFING_GENERATED: "briefing.generated",
  DAILY_INTELLIGENCE_SYNTHESIZED: "daily.intelligence.synthesized",
  
  // Agent task execution
  AGENT_TASK_CREATED: "agent.task.created",
  AGENT_TASK_COMPLETED: "agent.task.completed",
  AGENT_TASK_FAILED: "agent.task.failed",
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
  ): Promise<BaseDomainEvent<T>>;
}

export interface DomainEventConsumer {
  subscribe<T>(
    topic: EventTopic | string,
    handler: (event: BaseDomainEvent<T>) => Promise<void> | void,
  ): () => void; // Unsubscribe function
}

export class InMemoryDomainEventBus implements DomainEventPublisher, DomainEventConsumer {
  private handlers = new Map<
    string,
    Set<(event: BaseDomainEvent<any>) => Promise<void> | void>
  >();

  private publishedHistory: BaseDomainEvent<any>[] = [];

  async publish<T>(
    topic: EventTopic,
    tenantId: string,
    payload: T,
    correlationId?: string,
  ): Promise<BaseDomainEvent<T>> {
    const event: BaseDomainEvent<T> = {
      eventId: `evt-${crypto.randomUUID()}`,
      topic,
      tenantId,
      timestamp: new Date().toISOString(),
      correlationId: correlationId || `corr-${crypto.randomUUID()}`,
      payload,
    };

    this.publishedHistory.push(event);

    // Dispatch to direct topic subscribers
    const directHandlers = this.handlers.get(topic);
    if (directHandlers) {
      for (const handler of directHandlers) {
        try {
          await handler(event);
        } catch (err) {
          console.error(`[EventBus] Error handling event on topic '${topic}':`, err);
        }
      }
    }

    // Dispatch to wildcard subscribers (e.g., "knowledge.*")
    for (const [subscribedTopic, subscribers] of this.handlers.entries()) {
      if (subscribedTopic.endsWith(".*")) {
        const prefix = subscribedTopic.slice(0, -2);
        if (topic.startsWith(prefix)) {
          for (const handler of subscribers) {
            try {
              await handler(event);
            } catch (err) {
              console.error(`[EventBus] Error handling wildcard event on '${subscribedTopic}':`, err);
            }
          }
        }
      }
    }

    return event;
  }

  subscribe<T>(
    topic: EventTopic | string,
    handler: (event: BaseDomainEvent<T>) => Promise<void> | void,
  ): () => void {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, new Set());
    }

    this.handlers.get(topic)!.add(handler);

    return () => {
      const set = this.handlers.get(topic);
      if (set) {
        set.delete(handler);
      }
    };
  }

  getPublishedEvents(tenantId?: string): BaseDomainEvent<any>[] {
    if (tenantId) {
      return this.publishedHistory.filter((e) => e.tenantId === tenantId);
    }
    return [...this.publishedHistory];
  }

  clear(): void {
    this.publishedHistory = [];
    this.handlers.clear();
  }
}
