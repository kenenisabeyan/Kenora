# ADR-0003: Living Professional Knowledge Graph (LPKG)

## Status
Accepted

## Context
Traditional knowledge graphs in technical documentation and enterprise search treat facts as static, timeless vertices ($V$) and edges ($E$). In fast-evolving domains such as full-stack web development and AI infrastructure, technical concepts undergo continuous supersession: CommonJS was superseded by native ESM, REST was complemented and superseded in certain paradigms by GraphQL and React Server Components (RSC), and TCP transport was superseded by QUIC/UDP in HTTP/3 (RFC 9114).

Deleting superseded nodes or mutating entities in-place causes historical blind spots, breaks backward compatibility for legacy stacks, and prevents temporal reasoning.

## Decision
We implement the **Living Professional Knowledge Graph (LPKG)** with the following architectural invariants:

1. **Immutable Non-Destructive Temporal Modeling**:
   - Entities are never deleted. When an entity is updated or superseded, its historical state is preserved in an immutable `KnowledgeEvolutionTimeline` record, and a new active entity is generated.
   - Entities and relations define strict `validityInterval: { validFrom: string, validTo?: string }`.
2. **Semantic Supersession Edges**:
   - Direct `supersedes` relations link newer paradigm nodes to their historical predecessors, annotated with an explicit `supersessionReason` (e.g., "Streaming server component model reduces client JS payload by 65%").
3. **Epistemic Confidence Weights**:
   - Every graph edge carries a calibrated float weight in $[0.0, 1.0]$ derived from Bayesian verification scores.
4. **Time-Travel Graph Queries**:
   - Graph queries support point-in-time projection (`asOfTimestamp`), reconstructing the exact epistemic state of the graph at any historical moment.

## Consequences
- **Positive**: Complete auditability, backward compatibility for legacy software analysis, and explicit evolutionary reasoning for developers.
- **Negative**: Storage overhead increases linearly with version history, mitigated by PostgreSQL `pgvector` indexing and partitioned temporal tables.
