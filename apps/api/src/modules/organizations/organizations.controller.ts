import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { OrganizationsService } from "./organizations.service.js";
import { OrganizationDTO, MembershipDTO, APIResponse } from "@kenora/types";
import { CreateOrgInput, InviteMemberInput } from "@kenora/api-contracts";

@ApiTags("Organizations")
@ApiBearerAuth()
@Controller("organizations")
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  @Get()
  @ApiOperation({
    summary: "List all organizations the authenticated user belongs to",
  })
  async listUserOrganizations(
    @Headers("authorization") authHeader?: string,
  ): Promise<APIResponse<OrganizationDTO[]>> {
    const token = this.extractToken(authHeader);
    const data = await this.orgsService.listUserOrganizations(token);
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
    @Headers("authorization") authHeader: string | undefined,
    @Body() input: CreateOrgInput,
  ): Promise<
    APIResponse<{ organization: OrganizationDTO; membership: MembershipDTO }>
  > {
    const token = this.extractToken(authHeader);
    const data = await this.orgsService.createOrganization(token, input);
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get organization details by ID" })
  async getOrganization(
    @Headers("authorization") authHeader: string | undefined,
    @Param("id") id: string,
  ): Promise<APIResponse<OrganizationDTO>> {
    const token = this.extractToken(authHeader);
    const data = await this.orgsService.getOrganization(token, id);
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Get(":id/members")
  @ApiOperation({
    summary: "List members of an organization (requires member:read permission)",
  })
  async listOrganizationMembers(
    @Headers("authorization") authHeader: string | undefined,
    @Param("id") id: string,
  ): Promise<APIResponse<MembershipDTO[]>> {
    const token = this.extractToken(authHeader);
    const data = await this.orgsService.listOrganizationMembers(token, id);
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  @Post(":id/members")
  @ApiOperation({
    summary: "Invite a new member to an organization (requires member:invite permission)",
  })
  async inviteMember(
    @Headers("authorization") authHeader: string | undefined,
    @Param("id") id: string,
    @Body() input: InviteMemberInput,
  ): Promise<APIResponse<MembershipDTO>> {
    const token = this.extractToken(authHeader);
    const data = await this.orgsService.inviteMember(token, id, input);
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    };
  }

  private extractToken(authHeader?: string): string {
    if (!authHeader) {
      throw new UnauthorizedException(
        "AUTH_MISSING_TOKEN: Authorization header required",
      );
    }
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      return parts[1];
    }
    return authHeader;
  }
}
