import { SetMetadata } from "@nestjs/common";

export interface RateLimitOptions {
  keyPrefix?: string;
  limit: number;
  windowMs: number;
  keyExtractor?: (req: any) => string;
}

export const RATE_LIMIT_KEY = "rateLimitOptions";
export const RateLimit = (options: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_KEY, options);
