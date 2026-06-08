import { z } from 'zod';

export const PlatformRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  matches: z.array(z.string()),
  redirect: z.array(
    z.object({
      fromRegex: z.string(),
      to: z.string(),         // JS String.replace style ($1)
      dnrTo: z.string().optional(), // DNR regexSubstitution style (\1), falls back to `to` if absent
    })
  ).optional(),
  blockUrls: z.array(z.string()).optional(),
  hideSelectors: z.array(z.string()),
  // Individual short/reel items, used to count "removed from feed" (scale
  // metric). Distinct from hideSelectors, which also cover shelves and nav.
  countSelectors: z.array(z.string()).optional(),
});

export type PlatformRule = z.infer<typeof PlatformRuleSchema>;
