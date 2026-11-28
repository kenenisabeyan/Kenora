# ADR-0008: Cryptographic Merkle Tree Inclusion Proofs for Audit Compliance

## Status
Accepted

## Context
While sequential hash-chaining (ADR-0006) provides tamper-evidence for an entire ledger tip, external compliance auditors (SOC 2 Type II, ISO 27001) require proving that a *specific* adjudication event, tenant boundary change, or trust score update was immutably recorded without disclosing the full ledger payload or leaking other tenants' confidential events.

## Decision
We implement a **SHA-256 Merkle Proof Engine** (`@kenora/security/merkle-tree`):

1. **Binary Merkle Tree Construction**:
   - Leaf nodes are constructed from the SHA-256 hashes of individual audit event blocks:
     $$H_{\text{leaf}} = \text{SHA256}(\text{payload})$$
   - Internal nodes are computed by pairwise hashing:
     $$H_{\text{parent}} = \text{SHA256}(H_{\text{left}} \;\|\; H_{\text{right}})$$
   - Odd leaf counts duplicate the last leaf to maintain a balanced binary tree.
2. **Logarithmic $O(\log N)$ Inclusion Proofs**:
   - `generateProof(leafHash)` produces an ordered list of sibling hashes with their directional positions (`left` | `right`).
   - `verifyProof(leafHash, proof, rootHash)` computes the path up to the root in $O(\log N)$ time, validating inclusion with zero exposure of adjacent leaves.

## Consequences
- **Positive**: Third-party auditor compliance verification without data leakage; enables decentralized attestation of fact adjudication integrity.
- **Negative**: Tree reconstruction takes $O(N)$ when new blocks are batched; mitigated by caching intermediate subtree roots.
