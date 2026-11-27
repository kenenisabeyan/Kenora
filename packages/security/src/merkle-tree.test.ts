import { describe, it, expect } from "vitest";
import { MerkleTree } from "./merkle-tree";
import crypto from "node:crypto";

describe("Cryptographic Merkle Tree & Audit Proof Engine", () => {
  const sha256 = (str: string) =>
    crypto.createHash("sha256").update(str).digest("hex");

  it("should calculate a deterministic Merkle root from leaf hashes", () => {
    const leaves = ["block_0_genesis", "block_1_auth", "block_2_verify", "block_3_deploy"].map(
      sha256
    );

    const tree = new MerkleTree(leaves);
    const root = tree.getRoot();

    expect(root).toBeDefined();
    expect(root.length).toBe(64); // SHA-256 hex string
  });

  it("should generate and verify valid Merkle inclusion proofs", () => {
    const leaves = [
      "event_user_registered",
      "event_tenant_created",
      "event_claim_verified",
      "event_cve_mitigated",
      "event_benchmark_reproduced",
    ].map(sha256);

    const tree = new MerkleTree(leaves);

    // Test proof generation for leaf 2 ("event_claim_verified")
    const proof = tree.generateProof(2);
    expect(proof.leafIndex).toBe(2);
    expect(proof.leafHash).toBe(leaves[2]);
    expect(proof.rootHash).toBe(tree.getRoot());

    // Verify proof mathematically
    const isValid = MerkleTree.verifyProof(proof);
    expect(isValid).toBe(true);
  });

  it("should reject tampered or modified proofs", () => {
    const leaves = ["leaf_1", "leaf_2", "leaf_3", "leaf_4"].map(sha256);
    const tree = new MerkleTree(leaves);

    const proof = tree.generateProof(1);

    // Tamper with leaf hash
    const tamperedProof = {
      ...proof,
      leafHash: sha256("tampered_leaf_payload"),
    };

    const isValid = MerkleTree.verifyProof(tamperedProof);
    expect(isValid).toBe(false);
  });
});
