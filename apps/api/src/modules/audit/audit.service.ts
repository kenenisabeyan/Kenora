import { Injectable } from "@nestjs/common";
import { AuditLogger, AuditEventPayload } from "@kenora/security";
import { PaginatedResult } from "@kenora/types";

export interface QueryAuditLogsOptions {
  eventType?: string;
  outcome?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AuditService {
  async listAuditLogs(
    organizationId: string,
    options: QueryAuditLogsOptions = {},
  ): Promise<PaginatedResult<AuditEventPayload>> {
    const allEvents = AuditLogger.getEvents(organizationId);

    const filtered = allEvents.filter((event) => {
      if (options.eventType && event.eventType !== options.eventType) {
        return false;
      }
      if (options.outcome && event.outcome !== options.outcome) {
        return false;
      }
      return true;
    });

    const page = options.page || 1;
    const limit = options.limit || 20;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit) || 1,
    };
  }

  logEvent(event: AuditEventPayload): AuditEventPayload {
    return AuditLogger.log(event);
  }
}
