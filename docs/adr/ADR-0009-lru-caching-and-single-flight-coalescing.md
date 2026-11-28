# ADR-0009: High-Throughput Thread-Safe LRU Caching & SingleFlight Request Coalescing

## Status
Accepted

## Context
Under high concurrent traffic (breaking CVE announcements, major framework releases), multiple clients and autonomous agents simultaneously query the same graph entities, blast radius models, and verification records. Without request coalescing and low-latency in-memory caching, the database pool and graph traversal engine suffer from cache stampedes (the "thundering herd" problem), driving tail latencies above whitepaper SLA thresholds ($P_{95} > 180\text{ms}$).

## Decision
We implement **Thread-Safe In-Memory LRU Caching** and a **SingleFlight Coalescing Engine** (`@kenora/observability`):

1. **Thread-Safe LRU Cache with TTL (`LRUCache`)**:
   - $O(1)$ lookup and insertion with capacity eviction and sliding expiration.
   - Accelerates repetitive LPKG node queries down to sub-millisecond latencies ($< 1\text{ms}$) while tracking real-time hit/miss ratios.
2. **SingleFlight Request Coalescing (`SingleFlight`)**:
   - Coalesces concurrent duplicate asynchronous queries with the same execution key into a single shared in-flight Promise.
   - When 50 concurrent requests arrive for the blast radius of a deprecated runtime, only 1 actual graph traversal runs; the other 49 await and resolve with the same coalesced result.
3. **Production SLA Percentile Monitor (`SLAMonitor`)**:
   - Collects sliding-window nanosecond latency metrics and checks compliance against:
     - $P_{50} \le 45\text{ms}$
     - $P_{95} \le 180\text{ms}$
     - $P_{99} \le 450\text{ms}$
     - Error rate $\le 0.01\%$

## Consequences
- **Positive**: Eradicates cache stampedes, preserves database thread pools, guarantees sub-45ms $P_{50}$ latency.
- **Negative**: In-memory caching requires memory bounds; managed by strict capacity caps (default: 1,000 entries).
