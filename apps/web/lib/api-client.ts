/**
 * Kenora Professional Knowledge Infrastructure
 * Client-Side API SDK & Resilience Client
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export interface SlaResponse {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  availabilityPercentage: number;
  targetSla: string;
  meetsSla: boolean;
  uptimeSeconds: number;
}

export interface DegradationResponse {
  state: "NORMAL_OPERATION" | "DEGRADED_FALLBACK" | "EMERGENCY_READ_ONLY";
  activeDegradations: string[];
  services: Record<string, string>;
}

export interface AuditIntegrityResponse {
  isChainValid: boolean;
  blockCount: number;
  tipHash: string;
  genesisHash: string;
}

export class KenoraApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const correlationId = `web-sdk-${crypto.randomUUID()}`;
    const headers = new Headers(options.headers || {});
    headers.set("Content-Type", "application/json");
    headers.set("x-correlation-id", correlationId);

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "Unknown error");
      throw new Error(`API Error [${res.status}]: ${errorBody}`);
    }

    const data = await res.json();
    return data.data !== undefined ? data.data : data;
  }

  // --- Observability & Health Probes ---

  async getHealthLiveness(): Promise<{ status: string; uptimeSeconds: number }> {
    return this.request("/health/liveness");
  }

  async getSlaMetrics(): Promise<SlaResponse> {
    return this.request("/metrics/sla");
  }

  async getDegradationStatus(): Promise<DegradationResponse> {
    return this.request("/metrics/degradation");
  }

  async getAuditIntegrity(): Promise<AuditIntegrityResponse> {
    return this.request("/audit-logs/integrity");
  }

  // --- Knowledge & Search Engine ---

  async searchKnowledge(
    query: string,
    mode: "hybrid" | "semantic" | "lexical" = "hybrid"
  ): Promise<any> {
    return this.request(
      `/knowledge?search=${encodeURIComponent(query)}&mode=${mode}`
    );
  }

  async verifyKnowledgeItem(id: string): Promise<any> {
    return this.request(`/knowledge/${id}/verify`, { method: "POST" });
  }

  // --- Intelligence & 28-Agent Cluster Fleet ---

  async getDailyBriefing(): Promise<any> {
    return this.request("/intelligence/briefings/daily");
  }

  async forceGenerateDailyBriefing(): Promise<any> {
    return this.request("/intelligence/briefings/daily/generate", {
      method: "POST",
    });
  }

  async getGraphSnapshot(asOf?: string): Promise<any> {
    const query = asOf ? `?asOf=${encodeURIComponent(asOf)}` : "";
    return this.request(`/intelligence/graph/snapshot${query}`);
  }

  async getAgentsStatus(): Promise<any> {
    return this.request("/intelligence/agents/status");
  }

  async adjudicateConflict(
    claimId: string,
    stanceA: { claimText: string; evidence: any[] },
    stanceB: { claimText: string; evidence: any[] }
  ): Promise<any> {
    return this.request("/intelligence/conflicts/adjudicate", {
      method: "POST",
      body: JSON.stringify({ claimId, stanceA, stanceB }),
    });
  }
}

export const kenoraClient = new KenoraApiClient();
