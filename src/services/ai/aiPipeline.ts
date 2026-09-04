export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

export class AiPipelineManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxRetries: number = 3;
  private baseBackoffMs: number = 500;

  // In-memory caching with Time-To-Live (TTL)
  public getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttlMs) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  public setInCache<T>(key: string, data: T, ttlMs: number = 1000 * 60 * 60 * 24): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttlMs });
  }

  // Resilient execution with exponential backoff retry
  public async executeWithRetry<T>(
    operation: () => Promise<T>,
    fallback: () => Promise<T> | T,
    operationName: string = 'AI operation'
  ): Promise<T> {
    let lastError: any = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (err: any) {
        lastError = err;
        if (attempt < this.maxRetries) {
          const delay = this.baseBackoffMs * Math.pow(2, attempt - 1);
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    }

    console.warn(`${operationName} failed after ${this.maxRetries} attempts, falling back:`, lastError);
    return fallback();
  }

  // Simulated chunk streaming reader for fast responsive UI
  public async streamTextResponse(
    fullText: string,
    onChunk: (accumulated: string, isDone: boolean) => void,
    chunkSizeChars: number = 6,
    delayMs: number = 25
  ): Promise<void> {
    let current = '';
    for (let i = 0; i < fullText.length; i += chunkSizeChars) {
      current += fullText.slice(i, i + chunkSizeChars);
      const isDone = current.length >= fullText.length;
      onChunk(current, isDone);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

export const aiPipeline = new AiPipelineManager();
export default aiPipeline;
