import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().min(1, "Name is required").max(100),
  organizationName: z.string().min(1, "Organization name is required").max(100),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const createOrgSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(100),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50)
    .toLowerCase(),
});

export type CreateOrgInput = z.infer<typeof createOrgSchema>;

export const switchOrgSchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID format"),
});

export type SwitchOrgInput = z.infer<typeof switchOrgSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const createSourceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  adapterType: z.string().min(1, "Adapter type is required"),
  url: z.string().url("Invalid URL format"),
  pollingIntervalSeconds: z.number().int().min(60).default(3600),
  metadata: z.record(z.unknown()).optional().default({}),
});

export type CreateSourceInput = z.infer<typeof createSourceSchema>;

export const queryKnowledgeSchema = z.object({
  query: z.string().optional(),
  contentType: z
    .enum(["article", "paper", "code", "video", "discussion", "advisory"])
    .optional(),
  verificationStatus: z
    .enum(["unverified", "verified", "refuted", "inconclusive"])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type QueryKnowledgeInput = z.infer<typeof queryKnowledgeSchema>;
