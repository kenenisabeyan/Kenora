import { describe, it, expect } from "vitest";
import { KenoraAgentClusterOrchestrator, KENORA_28_AGENTS } from "./cluster";

describe("Kenora 28-Agent Cluster Architecture", () => {
  const orchestrator = new KenoraAgentClusterOrchestrator();

  it("should contain exactly 28 cooperating specialized agents", () => {
    expect(KENORA_28_AGENTS.length).toBe(28);
  });

  it("should correctly partition agents into 5 functional clusters", () => {
    const statuses = orchestrator.getAllClustersStatus();
    expect(statuses.length).toBe(5);

    const acq = statuses.find((s) => s.cluster === "acquisition");
    const und = statuses.find((s) => s.cluster === "understanding");
    const ver = statuses.find((s) => s.cluster === "verification");
    const del = statuses.find((s) => s.cluster === "delivery");
    const gov = statuses.find((s) => s.cluster === "governance");

    expect(acq?.totalAgents).toBe(6);
    expect(und?.totalAgents).toBe(6);
    expect(ver?.totalAgents).toBe(6);
    expect(del?.totalAgents).toBe(5);
    expect(gov?.totalAgents).toBe(5);
  });

  it("should retrieve specific agent specs by ID", () => {
    const nineQuestionsAgent = orchestrator.getAgent("agent-del-nine-questions");
    expect(nineQuestionsAgent).toBeDefined();
    expect(nineQuestionsAgent?.name).toBe("Nine-Question Decision Analyzer Agent");
    expect(nineQuestionsAgent?.capabilities).toContain("nine_question_generation");

    const benchmarkAgent = orchestrator.getAgent("agent-ver-benchmark");
    expect(benchmarkAgent).toBeDefined();
    expect(benchmarkAgent?.capabilities).toContain("reproduction_audit");
  });
});
