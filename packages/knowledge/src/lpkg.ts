import {
  LPKGEntity,
  LPKGRelation,
  LPKGGraphSnapshot,
  KnowledgeEvolutionTimeline,
  KnowledgeEvolutionTimelineVersion,
  ValidityInterval,
} from "@kenora/types";
import crypto from "node:crypto";

/**
 * Blast Radius Impact Assessment Result (Empowers AG-405 Code Impact Assessor)
 */
export interface BlastRadiusImpactResult {
  rootEntityId: string;
  rootEntityName: string;
  totalAffectedEntities: number;
  affectedEntities: Array<{
    entityId: string;
    entityName: string;
    depth: number;
    relationType: string;
  }>;
}

/**
 * Living Professional Knowledge Graph (LPKG) Store
 * Provides temporal entity-relation storage, evolution tracking,
 * time-travel snapshot querying, and advanced graph algorithms.
 */
export interface ILPKGStore {
  createEntity(
    tenantId: string,
    entity: Omit<LPKGEntity, "id" | "createdAt" | "updatedAt">,
  ): Promise<LPKGEntity>;
  
  supersedeEntity(
    tenantId: string,
    existingEntityId: string,
    updatedData: Partial<LPKGEntity>,
    reason: string,
  ): Promise<{ previousEntity: LPKGEntity; updatedEntity: LPKGEntity }>;

  createRelation(
    tenantId: string,
    relation: Omit<LPKGRelation, "id" | "createdAt">,
  ): Promise<LPKGRelation>;

  getSnapshot(tenantId: string, asOfTimestamp?: string): Promise<LPKGGraphSnapshot>;

  getEvolutionTimeline(
    tenantId: string,
    entityId: string,
  ): Promise<KnowledgeEvolutionTimeline>;

  findEntityByName(tenantId: string, name: string): Promise<LPKGEntity | null>;

  getSupersessionLineage(tenantId: string, entityId: string): Promise<LPKGEntity[]>;

  calculateBlastRadius(
    tenantId: string,
    entityId: string,
    maxDepth?: number,
  ): Promise<BlastRadiusImpactResult>;

  detectSupersessionCycles(tenantId: string): Promise<{ hasCycle: boolean; cyclePath?: string[] }>;
}

export class InMemoryLPKGStore implements ILPKGStore {
  private entities = new Map<string, LPKGEntity>(); // entityId -> LPKGEntity
  private relations = new Map<string, LPKGRelation>(); // relationId -> LPKGRelation
  private timelines = new Map<string, KnowledgeEvolutionTimeline>(); // entityId -> timeline

  async createEntity(
    tenantId: string,
    entityInput: Omit<LPKGEntity, "id" | "createdAt" | "updatedAt">,
  ): Promise<LPKGEntity> {
    const id = `lpkg-ent-${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    const entity: LPKGEntity = {
      ...entityInput,
      id,
      tenantId,
      createdAt: now,
      updatedAt: now,
    };

    this.entities.set(id, entity);

    // Initialize evolution timeline
    this.timelines.set(id, {
      entityId: id,
      tenantId,
      versions: [
        {
          version: 1,
          timestamp: now,
          data: { ...entity },
        },
      ],
    });

    return entity;
  }

  async supersedeEntity(
    tenantId: string,
    existingEntityId: string,
    updatedData: Partial<LPKGEntity>,
    reason: string,
  ): Promise<{ previousEntity: LPKGEntity; updatedEntity: LPKGEntity }> {
    const previous = this.entities.get(existingEntityId);
    if (!previous || previous.tenantId !== tenantId) {
      throw new Error(`Entity '${existingEntityId}' not found for tenant '${tenantId}'`);
    }

    const now = new Date().toISOString();

    // Mark previous entity's validity interval as ending now and status as superseded
    const supersededEntity: LPKGEntity = {
      ...previous,
      status: "superseded",
      validityInterval: {
        ...previous.validityInterval,
        validTo: now,
      },
      updatedAt: now,
    };
    this.entities.set(existingEntityId, supersededEntity);

    // Create the updated entity as a new generation or updated version
    const newEntityId = `lpkg-ent-${crypto.randomUUID()}`;
    const updatedEntity: LPKGEntity = {
      ...previous,
      ...updatedData,
      id: newEntityId,
      status: "active",
      validityInterval: {
        validFrom: now,
      },
      createdAt: now,
      updatedAt: now,
    };
    this.entities.set(newEntityId, updatedEntity);

    // Create automatic supersedes relation
    const relationId = `lpkg-rel-${crypto.randomUUID()}`;
    const supersedesRelation: LPKGRelation = {
      id: relationId,
      tenantId,
      sourceEntityId: newEntityId,
      targetEntityId: existingEntityId,
      relationType: "supersedes",
      validityInterval: { validFrom: now },
      status: "current",
      confidenceScore: 98,
      evidenceItemIds: [],
      createdAt: now,
    };
    this.relations.set(relationId, supersedesRelation);

    // Append to evolution timeline
    const timeline = this.timelines.get(existingEntityId) || {
      entityId: existingEntityId,
      tenantId,
      versions: [],
    };

    const nextVersionNum = timeline.versions.length + 1;
    timeline.versions.push({
      version: nextVersionNum,
      timestamp: now,
      supersededByEntityId: newEntityId,
      reason,
      data: { ...updatedEntity },
    });
    this.timelines.set(existingEntityId, timeline);

    return { previousEntity: supersededEntity, updatedEntity };
  }

  async createRelation(
    tenantId: string,
    relationInput: Omit<LPKGRelation, "id" | "createdAt">,
  ): Promise<LPKGRelation> {
    const id = `lpkg-rel-${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    const relation: LPKGRelation = {
      ...relationInput,
      id,
      tenantId,
      createdAt: now,
    };

    this.relations.set(id, relation);
    return relation;
  }

  async getSnapshot(tenantId: string, asOfTimestamp?: string): Promise<LPKGGraphSnapshot> {
    const targetDate = asOfTimestamp ? new Date(asOfTimestamp) : new Date();

    const activeEntities = Array.from(this.entities.values()).filter((e) => {
      if (e.tenantId !== tenantId) return false;
      const validFrom = new Date(e.validityInterval.validFrom);
      const validTo = e.validityInterval.validTo ? new Date(e.validityInterval.validTo) : null;
      return validFrom <= targetDate && (!validTo || targetDate < validTo);
    });

    const activeRelations = Array.from(this.relations.values()).filter((r) => {
      if (r.tenantId !== tenantId) return false;
      const validFrom = new Date(r.validityInterval.validFrom);
      const validTo = r.validityInterval.validTo ? new Date(r.validityInterval.validTo) : null;
      return validFrom <= targetDate && (!validTo || targetDate < validTo);
    });

    return {
      asOfTimestamp: targetDate.toISOString(),
      entities: activeEntities,
      relations: activeRelations,
    };
  }

  async getEvolutionTimeline(
    tenantId: string,
    entityId: string,
  ): Promise<KnowledgeEvolutionTimeline> {
    const timeline = this.timelines.get(entityId);
    if (!timeline || timeline.tenantId !== tenantId) {
      throw new Error(`Timeline for entity '${entityId}' not found for tenant '${tenantId}'`);
    }
    return timeline;
  }

  async findEntityByName(tenantId: string, name: string): Promise<LPKGEntity | null> {
    for (const entity of this.entities.values()) {
      if (entity.tenantId === tenantId && entity.name.toLowerCase() === name.toLowerCase()) {
        return entity;
      }
    }
    return null;
  }

  /**
   * Traces the linear and branched supersession ancestry of an entity
   */
  async getSupersessionLineage(tenantId: string, entityId: string): Promise<LPKGEntity[]> {
    const lineage: LPKGEntity[] = [];
    let currentId: string | undefined = entityId;
    const visited = new Set<string>();

    while (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      const entity = this.entities.get(currentId);
      if (!entity || entity.tenantId !== tenantId) break;
      lineage.push(entity);

      // Find relation where currentId is the target of a "supersedes" relation
      const supersedingRel = Array.from(this.relations.values()).find(
        (r) => r.tenantId === tenantId && r.targetEntityId === currentId && r.relationType === "supersedes",
      );

      currentId = supersedingRel?.sourceEntityId;
    }

    return lineage;
  }

  /**
   * Calculates blast radius / downstream dependencies using BFS graph traversal
   * (Directly empowers AG-405 Code Impact Assessor)
   */
  async calculateBlastRadius(
    tenantId: string,
    entityId: string,
    maxDepth: number = 3,
  ): Promise<BlastRadiusImpactResult> {
    const root = this.entities.get(entityId);
    if (!root || root.tenantId !== tenantId) {
      throw new Error(`Root entity '${entityId}' not found`);
    }

    const affected: BlastRadiusImpactResult["affectedEntities"] = [];
    const visited = new Set<string>([entityId]);
    const queue: Array<{ id: string; depth: number }> = [{ id: entityId, depth: 0 }];

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      if (depth >= maxDepth) continue;

      // Find all relations originating from or targeting this entity
      const connectedRels = Array.from(this.relations.values()).filter(
        (r) => r.tenantId === tenantId && (r.sourceEntityId === id || r.targetEntityId === id),
      );

      for (const rel of connectedRels) {
        const neighborId = rel.sourceEntityId === id ? rel.targetEntityId : rel.sourceEntityId;
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          const neighborEntity = this.entities.get(neighborId);
          if (neighborEntity) {
            affected.push({
              entityId: neighborEntity.id,
              entityName: neighborEntity.name,
              depth: depth + 1,
              relationType: rel.relationType,
            });
            queue.push({ id: neighborId, depth: depth + 1 });
          }
        }
      }
    }

    return {
      rootEntityId: entityId,
      rootEntityName: root.name,
      totalAffectedEntities: affected.length,
      affectedEntities: affected,
    };
  }

  /**
   * Cycle Detection: Guarantees that supersedes relations never form circular loops
   */
  async detectSupersessionCycles(tenantId: string): Promise<{ hasCycle: boolean; cyclePath?: string[] }> {
    const supersedesRels = Array.from(this.relations.values()).filter(
      (r) => r.tenantId === tenantId && r.relationType === "supersedes",
    );

    const adj = new Map<string, string[]>();
    for (const rel of supersedesRels) {
      const list = adj.get(rel.sourceEntityId) || [];
      list.push(rel.targetEntityId);
      adj.set(rel.sourceEntityId, list);
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();
    const path: string[] = [];

    const dfs = (node: string): boolean => {
      visited.add(node);
      recStack.add(node);
      path.push(node);

      const neighbors = adj.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        } else if (recStack.has(neighbor)) {
          path.push(neighbor);
          return true;
        }
      }

      recStack.delete(node);
      path.pop();
      return false;
    };

    for (const node of adj.keys()) {
      if (!visited.has(node)) {
        if (dfs(node)) {
          return { hasCycle: true, cyclePath: path };
        }
      }
    }

    return { hasCycle: false };
  }
}
