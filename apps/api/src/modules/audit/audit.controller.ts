import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { AuditService } from "./audit.service.js";
import { AuditEventPayload, Permissions } from "@kenora/security";
import { PaginatedResult, APIResponse } from "@kenora/types";
import {
  CurrentTenant,
  SessionAuthGuard,
  PermissionsGuard,
  RequirePermission,
} from "../../common/index.js";

@ApiTags("Audit & Transparency Ledger")
@ApiBearerAuth()
@UseGuards(SessionAuthGuard, PermissionsGuard)
@Controller("audit-logs")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @RequirePermission(Permissions.SETTINGS_READ)
  @ApiOperation({
    summary: "Retrieve immutable compliance audit ledger events for active organization",
  })
  @ApiQuery({ name: "eventType", required: false, description: "Filter by audit event type" })
  @ApiQuery({ name: "outcome", required: false, enum: ["success", "denied", "error"] })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async listLogs(
    @CurrentTenant() tenantId: string,
    @Query("eventType") eventType?: string,
    @Query("outcome") outcome?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ): Promise<APIResponse<PaginatedResult<AuditEventPayload>>> {
    const data = await this.auditService.listAuditLogs(tenantId, {
      eventType,
      outcome,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });

    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: "v1",
      },
    };
  }

  @Get("integrity")
  @RequirePermission(Permissions.SETTINGS_READ)
  @ApiOperation({
    summary: "Cryptographic Tamper-Evidence Verification of Audit Ledger",
    description: "Verifies the cryptographic hash-chain integrity of the audit ledger from Genesis to Tip.",
  })
  async verifyIntegrity() {
    const report = this.auditService.verifyLedgerIntegrity();
    return {
      success: true,
      data: report,
      meta: {
        timestamp: new Date().toISOString(),
        version: "v1",
      },
    };
  }
}
