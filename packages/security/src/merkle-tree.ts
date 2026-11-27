import crypto from "node:crypto";

/**
 * Merkle Tree Proof Structure for Independent Third-Party Compliance Auditing
 * (Empowers SOC 2 Type II, ISO 27001, and GDPR Article 30 Zero-Knowledge Verification)
 */
export interface MerkleProofElement {
  hash: string;
  position: "left" | "right";
}

export interface MerkleProof {
  leafIndex: number;
  leafHash: string;
  rootHash: string;
  path: MerkleProofElement[];
}

export class MerkleTree {
  private leaves: string[];
  private layers: string[][];

  constructor(leafHashes: string[]) {
    if (leafHashes.length === 0) {
      throw new Error("Cannot construct a MerkleTree with zero leaves");
    }
    this.leaves = [...leafHashes];
    this.layers = this.buildLayers(this.leaves);
  }

  private sha256(data: string): string {
    return crypto.createHash("sha256").update(data, "utf8").digest("hex");
  }

  private combineHashes(left: string, right: string): string {
    return this.sha256(`${left}:${right}`);
  }

  private buildLayers(leaves: string[]): string[][] {
    const layers: string[][] = [leaves];
    let currentLayer = leaves;

    while (currentLayer.length > 1) {
      const nextLayer: string[] = [];
      for (let i = 0; i < currentLayer.length; i += 2) {
        const left = currentLayer[i];
        const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : left; // Duplicate last if odd
        nextLayer.push(this.combineHashes(left, right));
      }
      layers.push(nextLayer);
      currentLayer = nextLayer;
    }

    return layers;
  }

  getRoot(): string {
    const topLayer = this.layers[this.layers.length - 1];
    return topLayer[0];
  }

  generateProof(leafIndex: number): MerkleProof {
    if (leafIndex < 0 || leafIndex >= this.leaves.length) {
      throw new Error(`Leaf index ${leafIndex} out of bounds (0 - ${this.leaves.length - 1})`);
    }

    const path: MerkleProofElement[] = [];
    let currentIndex = leafIndex;

    for (let layerIdx = 0; layerIdx < this.layers.length - 1; layerIdx++) {
      const currentLayer = this.layers[layerIdx];
      const isRight = currentIndex % 2 === 1;
      const pairIndex = isRight ? currentIndex - 1 : currentIndex + 1;

      if (pairIndex < currentLayer.length) {
        path.push({
          hash: currentLayer[pairIndex],
          position: isRight ? "left" : "right",
        });
      } else {
        // Odd node paired with itself
        path.push({
          hash: currentLayer[currentIndex],
          position: "right",
        });
      }

      currentIndex = Math.floor(currentIndex / 2);
    }

    return {
      leafIndex,
      leafHash: this.leaves[leafIndex],
      rootHash: this.getRoot(),
      path,
    };
  }

  static verifyProof(proof: MerkleProof): boolean {
    let currentHash = proof.leafHash;
    const sha256 = (data: string) => crypto.createHash("sha256").update(data, "utf8").digest("hex");

    for (const elem of proof.path) {
      if (elem.position === "left") {
        currentHash = sha256(`${elem.hash}:${currentHash}`);
      } else {
        currentHash = sha256(`${currentHash}:${elem.hash}`);
      }
    }

    return currentHash === proof.rootHash;
  }
}
