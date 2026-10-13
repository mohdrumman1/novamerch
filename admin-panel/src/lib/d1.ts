import { getCloudflareContext } from "@opennextjs/cloudflare";

type D1DatabaseLike = {
  prepare: (query: string) => { bind: (...values: unknown[]) => {
    first: <T = unknown>() => Promise<T | null>;
    all: <T = unknown>() => Promise<{ results: T[] }>;
    run: () => Promise<unknown>;
  } };
};

export function getDatabase(): D1DatabaseLike | null {
  try {
    const env = getCloudflareContext().env as unknown as { DB?: D1DatabaseLike };
    return env.DB ?? null;
  } catch {
    return null;
  }
}
