import { z } from "zod";

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
