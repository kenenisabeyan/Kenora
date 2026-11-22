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
 * Living Professional Knowledge Graph (LPKG) Store
 * Provides temporal entity-relation storage, evolution tracking,
 * and time-travel snapshot querying without destructive overwrites.
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

    // Create the updated entity record linked to the previous
    const updatedEntityId = `lpkg-ent-${crypto.randomUUID()}`;
    const updatedEntity: LPKGEntity = {
      ...previous,
      ...updatedData,
      id: updatedEntityId,
      tenantId,
      status: "active",
      validityInterval: {
        validFrom: now,
        validTo: undefined,
      },
      createdAt: now,
      updatedAt: now,
    };
    this.entities.set(updatedEntityId, updatedEntity);

    // Record relation that updatedEntity supersedes supersededEntity
    const relationId = `lpkg-rel-${crypto.randomUUID()}`;
    const supersedesRelation: LPKGRelation = {
      id: relationId,
      tenantId,
      sourceEntityId: updatedEntityId,
      targetEntityId: existingEntityId,
      relationType: "supersedes",
      validityInterval: { validFrom: now },
      status: "current",
      confidenceScore: 98,
      evidenceItemIds: [],
      createdAt: now,
    };
    this.relations.set(relationId, supersedesRelation);

    // Update timeline
    const timeline = this.timelines.get(existingEntityId) || {
      entityId: existingEntityId,
      tenantId,
      versions: [],
    };

    const nextVersionNumber = timeline.versions.length + 1;
    timeline.versions.push({
      version: nextVersionNumber,
      timestamp: now,
      data: { ...updatedEntity },
      supersededBy: updatedEntityId,
      supersedingReason: reason,
    });
    this.timelines.set(existingEntityId, timeline);
    this.timelines.set(updatedEntityId, timeline);

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

  async getSnapshot(
    tenantId: string,
    asOfTimestamp?: string,
  ): Promise<LPKGGraphSnapshot> {
    const targetTime = asOfTimestamp ? new Date(asOfTimestamp).getTime() : Date.now();
    const activeEntities: LPKGEntity[] = [];
    const activeRelations: LPKGRelation[] = [];

    for (const entity of this.entities.values()) {
      if (entity.tenantId !== tenantId) continue;
      const validFrom = new Date(entity.validityInterval.validFrom).getTime();
      const validTo = entity.validityInterval.validTo
        ? new Date(entity.validityInterval.validTo).getTime()
        : Infinity;

      if (validFrom <= targetTime && targetTime < validTo) {
        activeEntities.push(entity);
      }
    }

    for (const relation of this.relations.values()) {
      if (relation.tenantId !== tenantId) continue;
      const validFrom = new Date(relation.validityInterval.validFrom).getTime();
      const validTo = relation.validityInterval.validTo
        ? new Date(relation.validityInterval.validTo).getTime()
        : Infinity;

      if (validFrom <= targetTime && targetTime < validTo) {
        activeRelations.push(relation);
      }
    }

    return {
      entities: activeEntities,
      relations: activeRelations,
      asOfTimestamp: asOfTimestamp || new Date().toISOString(),
    };
  }

  async getEvolutionTimeline(
    tenantId: string,
    entityId: string,
  ): Promise<KnowledgeEvolutionTimeline> {
    const timeline = this.timelines.get(entityId);
    if (!timeline || timeline.tenantId !== tenantId) {
      return {
        entityId,
        tenantId,
        versions: [],
      };
    }
    return timeline;
  }

  async findEntityByName(tenantId: string, name: string): Promise<LPKGEntity | null> {
    const lower = name.toLowerCase();
    for (const entity of this.entities.values()) {
      if (entity.tenantId === tenantId && entity.name.toLowerCase() === lower && entity.status === "active") {
        return entity;
      }
    }
    return null;
  }
}
