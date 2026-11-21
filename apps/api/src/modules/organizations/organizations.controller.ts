import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { OrganizationsService } from "./organizations.service.js";
import {
  OrganizationDTO,
  MembershipDTO,
  AuthSessionDTO,
  APIResponse,
} from "@kenora/types";
import { CreateOrgInput, InviteMemberInput } from "@kenora/api-contracts";
import { Permissions } from "@kenora/security";
import {
  SessionAuthGuard,
  PermissionsGuard,
  RequirePermission,
  CurrentSession,
} from "../../common/index.js";

@ApiTags("Organizations")
@ApiBearerAuth()
@UseGuards(SessionAuthGuard, PermissionsGuard)
@Controller("organizations")
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  @Get()
  @ApiOperation({
    summary: "List all organizations the authenticated user belongs to",
  })
  async listUserOrganizations(
    @CurrentSession() session: AuthSessionDTO,
  ): Promise<APIResponse<OrganizationDTO[]>> {
    const data = await this.orgsService.listUserOrganizations(session.sessionId);
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Post()
  @ApiOperation({
    summary: "Create a new organization (caller becomes OWNER)",
  })
  async createOrganization(
    @CurrentSession() session: AuthSessionDTO,
    @Body() input: CreateOrgInput,
  ): Promise<
    APIResponse<{ organization: OrganizationDTO; membership: MembershipDTO }>
  > {
    const data = await this.orgsService.createOrganization(
      session.sessionId,
      input,
    );
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get organization details by ID" })
  async getOrganization(
    @CurrentSession() session: AuthSessionDTO,
    @Param("id") id: string,
  ): Promise<APIResponse<OrganizationDTO>> {
    const data = await this.orgsService.getOrganization(session.sessionId, id);
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Get(":id/members")
  @RequirePermission(Permissions.MEMBER_READ)
  @ApiOperation({
    summary: "List members of an organization (requires member:read permission)",
  })
  async listOrganizationMembers(
    @CurrentSession() session: AuthSessionDTO,
    @Param("id") id: string,
  ): Promise<APIResponse<MembershipDTO[]>> {
    const data = await this.orgsService.listOrganizationMembers(
      session.sessionId,
      id,
    );
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Post(":id/members")
  @RequirePermission(Permissions.MEMBER_INVITE)
  @ApiOperation({
    summary: "Invite a new member to an organization (requires member:invite permission)",
  })
  async inviteMember(
    @CurrentSession() session: AuthSessionDTO,
    @Param("id") id: string,
    @Body() input: InviteMemberInput,
  ): Promise<APIResponse<MembershipDTO>> {
    const data = await this.orgsService.inviteMember(
      session.sessionId,
      id,
      input,
    );
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }
}
