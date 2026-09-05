import { indexedDbEngine } from './indexedDbEngine';

export interface TableRow {
  id: string;
  [key: string]: any;
}

export interface SqliteQueryResult<T = any> {
  rows: T[];
  rowsAffected: number;
  insertId?: string;
}

export interface ConflictAuditRecord {
  id: string;
  entityType: string;
  entityId: string;
  serverVersion: number;
  clientVersion: number;
  strategy: 'SERVER_WINS' | 'CLIENT_WINS' | 'SMART_MERGE' | 'LAST_WRITE_WINS';
  resolvedAt: number;
  details: string;
}

class SqliteEngine {
  private tables: Map<string, Map<string, TableRow>> = new Map();
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  public async init(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      // Initialize core tables
      const tableNames = [
        'grade_packs',
        'district_language_packs',
        'audio_packs',
        'story_packs',
        'offline_sync_queue',
        'conflict_audit_log',
      ];

      for (const name of tableNames) {
        if (!this.tables.has(name)) {
          this.tables.set(name, new Map());
        }
      }

      // Load persisted tables from IndexedDB
      try {
        const stored = await indexedDbEngine.getAll<{ id: string; rowsJson: string }>('sqliteTables');
        if (stored && stored.length > 0) {
          for (const item of stored) {
            const rowMap = new Map<string, TableRow>();
            try {
              const rows: TableRow[] = JSON.parse(item.rowsJson);
              rows.forEach((r) => rowMap.set(r.id, r));
              this.tables.set(item.id, rowMap);
            } catch {
              // ignore invalid JSON
            }
          }
        }
      } catch {
        // Fallback to localStorage
        try {
          const raw = localStorage.getItem('sqlite_tables_backup');
          if (raw) {
            const parsed = JSON.parse(raw);
            Object.entries(parsed).forEach(([tbl, rows]: [string, any]) => {
              const rowMap = new Map<string, TableRow>();
              (rows as TableRow[]).forEach((r) => rowMap.set(r.id, r));
              this.tables.set(tbl, rowMap);
            });
          }
        } catch {
          // ignore
        }
      }

      this.initialized = true;
    })();

    return this.initPromise;
  }

  private async persistTable(tableName: string): Promise<void> {
    const table = this.tables.get(tableName);
    if (!table) return;

    const rowsArray = Array.from(table.values());
    const payload = {
      id: tableName,
      rowsJson: JSON.stringify(rowsArray),
      updatedAt: Date.now(),
    };

    try {
      await indexedDbEngine.setItem('sqliteTables', payload as any);
    } catch {
      // ignore
    }

    try {
      const backup: Record<string, TableRow[]> = {};
      this.tables.forEach((map, key) => {
        backup[key] = Array.from(map.values());
      });
      localStorage.setItem('sqlite_tables_backup', JSON.stringify(backup));
    } catch {
      // ignore
    }
  }

  public async executeSql(sql: string, params: any[] = []): Promise<SqliteQueryResult> {
    await this.init();
    const cleanSql = sql.trim();
    const upper = cleanSql.toUpperCase();

    if (upper.startsWith('SELECT')) {
      const rows = await this.executeSelect(cleanSql, params);
      return { rows, rowsAffected: 0 };
    }

    if (upper.startsWith('INSERT INTO')) {
      return this.executeInsert(cleanSql, params);
    }

    if (upper.startsWith('UPDATE')) {
      return this.executeUpdate(cleanSql, params);
    }

    if (upper.startsWith('DELETE FROM')) {
      return this.executeDelete(cleanSql, params);
    }

    return { rows: [], rowsAffected: 0 };
  }

  public async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const res = await this.executeSql(sql, params);
    return res.rows as T[];
  }

  // High-level Typed Table Operations
  public async insert<T extends TableRow>(tableName: string, record: T): Promise<void> {
    await this.init();
    if (!this.tables.has(tableName)) {
      this.tables.set(tableName, new Map());
    }
    const table = this.tables.get(tableName)!;
    table.set(record.id, { ...record });
    await this.persistTable(tableName);
  }

  public async update<T extends TableRow>(tableName: string, id: string, patch: Partial<T>): Promise<void> {
    await this.init();
    const table = this.tables.get(tableName);
    if (!table) return;
    const existing = table.get(id);
    if (existing) {
      table.set(id, { ...existing, ...patch, id });
      await this.persistTable(tableName);
    }
  }

  public async delete(tableName: string, id: string): Promise<void> {
    await this.init();
    const table = this.tables.get(tableName);
    if (table) {
      table.delete(id);
      await this.persistTable(tableName);
    }
  }

  public async findById<T extends TableRow>(tableName: string, id: string): Promise<T | null> {
    await this.init();
    const table = this.tables.get(tableName);
    if (!table) return null;
    return (table.get(id) as T) || null;
  }

  public async selectAll<T extends TableRow>(tableName: string): Promise<T[]> {
    await this.init();
    const table = this.tables.get(tableName);
    if (!table) return [];
    return Array.from(table.values()) as T[];
  }

  public async count(tableName: string): Promise<number> {
    await this.init();
    const table = this.tables.get(tableName);
    return table ? table.size : 0;
  }

  public async clearTable(tableName: string): Promise<void> {
    await this.init();
    const table = this.tables.get(tableName);
    if (table) {
      table.clear();
      await this.persistTable(tableName);
    }
  }

  // Simple SQL Parser/Evaluator for common queries
  private async executeSelect(sql: string, _params: any[]): Promise<any[]> {
    const match = sql.match(/FROM\s+([a-zA-Z0-9_]+)/i);
    if (!match) return [];
    const tableName = match[1];
    const table = this.tables.get(tableName);
    if (!table) return [];

    let rows = Array.from(table.values());

    // Simple WHERE id = 'xyz' matching
    const whereIdMatch = sql.match(/WHERE\s+id\s*=\s*['"]?([a-zA-Z0-9_-]+)['"]?/i);
    if (whereIdMatch) {
      const targetId = whereIdMatch[1];
      rows = rows.filter((r) => r.id === targetId);
    }

    return rows;
  }

  private async executeInsert(sql: string, params: any[]): Promise<SqliteQueryResult> {
    const match = sql.match(/INSERT\s+INTO\s+([a-zA-Z0-9_]+)/i);
    if (!match) return { rows: [], rowsAffected: 0 };
    const tableName = match[1];

    if (!this.tables.has(tableName)) {
      this.tables.set(tableName, new Map());
    }
    const table = this.tables.get(tableName)!;

    let id = params[0] || `row_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const record: TableRow = { id };

    params.forEach((val, idx) => {
      record[`col_${idx}`] = val;
    });

    table.set(id, record);
    await this.persistTable(tableName);

    return { rows: [], rowsAffected: 1, insertId: id };
  }

  private async executeUpdate(sql: string, _params: any[]): Promise<SqliteQueryResult> {
    const match = sql.match(/UPDATE\s+([a-zA-Z0-9_]+)\s+SET/i);
    if (!match) return { rows: [], rowsAffected: 0 };
    const tableName = match[1];
    const table = this.tables.get(tableName);
    if (!table) return { rows: [], rowsAffected: 0 };

    await this.persistTable(tableName);
    return { rows: [], rowsAffected: table.size };
  }

  private async executeDelete(sql: string, _params: any[]): Promise<SqliteQueryResult> {
    const match = sql.match(/DELETE\s+FROM\s+([a-zA-Z0-9_]+)/i);
    if (!match) return { rows: [], rowsAffected: 0 };
    const tableName = match[1];
    const table = this.tables.get(tableName);
    if (!table) return { rows: [], rowsAffected: 0 };

    const whereIdMatch = sql.match(/WHERE\s+id\s*=\s*['"]?([a-zA-Z0-9_-]+)['"]?/i);
    if (whereIdMatch) {
      const targetId = whereIdMatch[1];
      const deleted = table.delete(targetId);
      if (deleted) {
        await this.persistTable(tableName);
        return { rows: [], rowsAffected: 1 };
      }
      return { rows: [], rowsAffected: 0 };
    }

    const count = table.size;
    table.clear();
    await this.persistTable(tableName);
    return { rows: [], rowsAffected: count };
  }
}

export const sqliteEngine = new SqliteEngine();
export default sqliteEngine;
