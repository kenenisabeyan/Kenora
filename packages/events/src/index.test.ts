import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryDomainEventBus, EventTopics } from "./index";

describe("Domain Event Bus & JetStream Backbone", () => {
  let eventBus: InMemoryDomainEventBus;
  const tenantId = "ten_event_test";

  beforeEach(() => {
    eventBus = new InMemoryDomainEventBus();
  });

  it("should publish domain event and dispatch to subscribed handler", async () => {
    let receivedPayload: any = null;

    eventBus.subscribe(EventTopics.KNOWLEDGE_ITEM_VERIFIED, (event) => {
      receivedPayload = event.payload;
    });

    await eventBus.publish(EventTopics.KNOWLEDGE_ITEM_VERIFIED, tenantId, {
      itemId: "ki-100",
      status: "verified",
      confidenceScore: 98,
    });

    expect(receivedPayload).toBeDefined();
    expect(receivedPayload.itemId).toBe("ki-100");
    expect(receivedPayload.status).toBe("verified");
  });

  it("should dispatch events to wildcard topic subscribers", async () => {
    const receivedEvents: string[] = [];

    eventBus.subscribe("knowledge.*", (event) => {
      receivedEvents.push(event.topic);
    });

    await eventBus.publish(EventTopics.KNOWLEDGE_ITEM_DISCOVERED, tenantId, { id: 1 });
    await eventBus.publish(EventTopics.KNOWLEDGE_ITEM_NORMALIZED, tenantId, { id: 2 });
    await eventBus.publish(EventTopics.BENCHMARK_VERIFIED, tenantId, { id: 3 }); // Not matching knowledge.*

    expect(receivedEvents).toContain(EventTopics.KNOWLEDGE_ITEM_DISCOVERED);
    expect(receivedEvents).toContain(EventTopics.KNOWLEDGE_ITEM_NORMALIZED);
    expect(receivedEvents).not.toContain(EventTopics.BENCHMARK_VERIFIED);
  });

  it("should unsubscribe cleanly when unregister function is called", async () => {
    let callCount = 0;

    const unsubscribe = eventBus.subscribe(EventTopics.DAILY_INTELLIGENCE_SYNTHESIZED, () => {
      callCount++;
    });

    await eventBus.publish(EventTopics.DAILY_INTELLIGENCE_SYNTHESIZED, tenantId, {});
    expect(callCount).toBe(1);

    unsubscribe();

    await eventBus.publish(EventTopics.DAILY_INTELLIGENCE_SYNTHESIZED, tenantId, {});
    expect(callCount).toBe(1); // Unsubscribed, should not increment
  });
});
