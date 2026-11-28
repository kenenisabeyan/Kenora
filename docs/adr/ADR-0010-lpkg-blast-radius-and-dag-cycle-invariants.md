# ADR-0010: LPKG Blast Radius BFS Traversal & Directed Acyclic Graph (DAG) Invariant Enforcement

## Status
Accepted

## Context
When a programming runtime, protocol standard, or library API is deprecated or experiences a breaking vulnerability, software engineering leaders need to immediately know: *What downstream services, transitive dependencies, and implementations are impacted?* (Agent `AG-405` Code Impact Assessor). Additionally, in a continuously evolving knowledge graph, circular supersession paradoxes (e.g., $A$ supersedes $B$, $B$ supersedes $C$, $C$ supersedes $A$) must be mathematically impossible.

## Decision
We implement **BFS Blast Radius Analysis** and **DAG Invariant Cycle Detection** (`@kenora/knowledge/lpkg`):

1. **Breadth-First Blast Radius Calculation (`calculateBlastRadius`)**:
   - Explores downstream graph edges up to depth $N$ (default: 3 hops).
   - Categorizes impact severity across depth levels:
     - **Depth 1 (1-Hop)**: Direct consumers and runtime implementers.
     - **Depth 2 (2-Hops)**: Transitive microservices and integration libraries.
     - **Depth 3 (3-Hops)**: Downstream consumer applications and client SDKs.
2. **DAG Invariant & Cycle Detection (`detectSupersessionCycles`)**:
   - Executes $O(V + E)$ cycle detection traversal across all `supersedes` relations in the tenant's graph.
   - Guarantees the supersession timeline remains a strict Directed Acyclic Graph (DAG) with zero circular paradoxes.
3. **Non-Destructive Evolution Timelines**:
   - Superseding an entity preserves the original in `KnowledgeEvolutionTimeline` while creating the new generation version with an automated `supersedes` relation and epistemic justification.

## Consequences
- **Positive**: Enables instant architectural impact assessment for engineering teams; guarantees epistemic timeline consistency.
- **Negative**: Deep BFS traversals across large graph nodes can be CPU intensive; mitigated by LRU caching and SingleFlight coalescing (ADR-0009).
