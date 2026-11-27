import { describe, it, expect } from "vitest";
import { AutonomousNoiseIdentifier } from "./ani";

describe("Autonomous Noise Identification (ANI) Engine", () => {
  const ani = new AutonomousNoiseIdentifier();

  it("should accept high-signal technical content with formal RFC citations and code", () => {
    const text = `
      RFC 9114 formally standardizes HTTP/3 over QUIC transport protocol.
      Unlike HTTP/2 over TCP, QUIC streams are independently multiplexed over UDP datagrams:
      \`\`\`typescript
      import { createQuicSocket } from "node:net";
      const socket = createQuicSocket({ endpoint: "localhost:4433" });
      \`\`\`
      This eliminates head-of-line blocking stalls during packet drops on lossy wireless networks.
    `;
    const title = "RFC 9114 HTTP/3 Specification Finalized";

    const result = ani.evaluate(text, title);

    expect(result.isAccepted).toBe(true);
    expect(result.signalScore).toBeGreaterThanOrEqual(80);
    expect(result.metrics.hasFormalCitations).toBe(true);
    expect(result.metrics.hasCodeArtifacts).toBe(true);
    expect(result.rejectionReasons.length).toBe(0);
  });

  it("should reject superficial promotional marketing and clickbait churn", () => {
    const text = `
      Top 10 reasons why this revolutionary new framework is a total game changer for 10x engineers!
      You won't believe the secret sauce behind this disruptive tech. Smash that like button and subscribe!
    `;
    const title = "Mind-Blowing Secret Tool";

    const result = ani.evaluate(text, title);

    expect(result.isAccepted).toBe(false);
    expect(result.metrics.hasPromotionalMarkers).toBe(true);
    expect(result.signalScore).toBeLessThan(50);
    expect(result.rejectionReasons.some((r) => r.includes("promotional"))).toBe(true);
  });

  it("should reject insufficient or stub content", () => {
    const text = "New release available now.";
    const result = ani.evaluate(text);

    expect(result.isAccepted).toBe(false);
    expect(result.rejectionReasons.some((r) => r.includes("Insufficient"))).toBe(true);
  });
});
