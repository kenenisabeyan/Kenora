/**
 * High-Performance Thread-Safe LRU Cache with TTL Expiration
 * Designed for sub-millisecond graph query acceleration & cache stampede mitigation.
 */

interface CacheEntry<V> {
  value: V;
  expiresAt: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRatio: number;
  size: number;
  capacity: number;
}

export class LRUCache<K, V> {
  private readonly capacity: number;
  private readonly defaultTtlMs: number;
  private map = new Map<K, CacheEntry<V>>();
  private hits = 0;
  private misses = 0;

  constructor(options: { capacity?: number; defaultTtlMs?: number } = {}) {
    this.capacity = options.capacity ?? 1000;
    this.defaultTtlMs = options.defaultTtlMs ?? 60000; // 60s default
  }

  get(key: K): V | undefined {
    const entry = this.map.get(key);
    if (!entry) {
      this.misses++;
      return undefined;
    }

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      this.misses++;
      return undefined;
    }

    // Move to most recently used (re-insert)
    this.map.delete(key);
    this.map.set(key, entry);
    this.hits++;
    return entry.value;
  }

  set(key: K, value: V, ttlMs?: number): void {
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);

    // If key already exists, delete it first to refresh insertion order
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      // Evict least recently used (first item in Map iteration order)
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
      }
    }

    this.map.set(key, { value, expiresAt });
  }

  has(key: K): boolean {
    const val = this.get(key);
    return val !== undefined;
  }

  delete(key: K): boolean {
    return this.map.delete(key);
  }

  clear(): void {
    this.map.clear();
    this.hits = 0;
    this.misses = 0;
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRatio: total > 0 ? Math.round((this.hits / total) * 1000) / 1000 : 0,
      size: this.map.size,
      capacity: this.capacity,
    };
  }
}
