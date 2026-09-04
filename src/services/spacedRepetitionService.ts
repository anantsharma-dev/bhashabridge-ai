export interface SpacedRepetitionRecord {
  cardId: string;
  intervalDays: number;
  repetitions: number;
  easeFactor: number;
  lastReviewedAt: number;
  nextReviewAt: number;
  masteryScore: number; // 0-100
}

const STORAGE_KEY = 'bhashabridge_spaced_repetition';

class SpacedRepetitionService {
  private records: Map<string, SpacedRepetitionRecord> = new Map();

  constructor() {
    this.loadRecords();
  }

  private loadRecords() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: SpacedRepetitionRecord[] = JSON.parse(raw);
        parsed.forEach((r) => this.records.set(r.cardId, r));
      }
    } catch {
      // ignore
    }
  }

  private saveRecords() {
    if (typeof window === 'undefined') return;
    try {
      const arr = Array.from(this.records.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch {
      // ignore
    }
  }

  public getRecord(cardId: string): SpacedRepetitionRecord {
    const existing = this.records.get(cardId);
    if (existing) return existing;

    const initial: SpacedRepetitionRecord = {
      cardId,
      intervalDays: 1,
      repetitions: 0,
      easeFactor: 2.5,
      lastReviewedAt: 0,
      nextReviewAt: Date.now(),
      masteryScore: 0,
    };
    this.records.set(cardId, initial);
    return initial;
  }

  /**
   * SuperMemo SM-2 Spaced Repetition calculation
   * quality: 0 (blackout) to 5 (perfect recall)
   */
  public reviewCard(cardId: string, quality: 0 | 1 | 2 | 3 | 4 | 5): SpacedRepetitionRecord {
    const prev = this.getRecord(cardId);
    let interval: number;
    let repetitions: number;
    let easeFactor: number;

    if (quality >= 3) {
      if (prev.repetitions === 0) {
        interval = 1;
      } else if (prev.repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(prev.intervalDays * prev.easeFactor);
      }
      repetitions = prev.repetitions + 1;
    } else {
      repetitions = 0;
      interval = 1;
    }

    // Ease factor formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    easeFactor = prev.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    const now = Date.now();
    const nextReviewAt = now + interval * 86400000;
    const masteryScore = Math.min(100, Math.round(repetitions * 20 + quality * 4));

    const updated: SpacedRepetitionRecord = {
      cardId,
      intervalDays: interval,
      repetitions,
      easeFactor: Number(easeFactor.toFixed(2)),
      lastReviewedAt: now,
      nextReviewAt,
      masteryScore,
    };

    this.records.set(cardId, updated);
    this.saveRecords();
    return updated;
  }

  public getDueCardsCount(): number {
    const now = Date.now();
    let count = 0;
    this.records.forEach((r) => {
      if (r.nextReviewAt <= now) count++;
    });
    return count;
  }

  public isCardDue(cardId: string): boolean {
    const record = this.records.get(cardId);
    if (!record) return true;
    return record.nextReviewAt <= Date.now();
  }
}

export const spacedRepetitionService = new SpacedRepetitionService();
export default spacedRepetitionService;
