import { z } from "zod";
import { Database } from "@db/sqlite";
import { SearchParams, searchParamsSchema } from "../schemas/noteSchemas.ts";
import { ValidationError } from "../utils/error.ts";
import { Note } from "./Note.ts";

export class NoteRepository {
  private db: Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
  }

  public findById(id: number): Note | null {
    try {
      const result = this.db.prepare(`
        SELECT 
          cs.Z_PK as id,
          cs.ZTITLE1 as title,
          cs.ZSNIPPET as snippet,
          cs.ZIDENTIFIER as identifier,
          datetime(cs.ZMODIFICATIONDATE1 + 978307200, 'unixepoch', 'localtime') as modified_date,
          nd.ZDATA as content,
          cs.ZHASCHECKLIST as has_checklist
        FROM ZICCLOUDSYNCINGOBJECT cs
        LEFT JOIN ZICNOTEDATA nd ON cs.Z_PK = nd.ZNOTE
        WHERE cs.Z_PK = ? AND (cs.ZMARKEDFORDELETION = 0 OR cs.ZMARKEDFORDELETION IS NULL)
      `).get([id]);

      return result ? Note.create(result) : null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError("Invalid note data from database", error);
      }
      throw error;
    }
  }

  public search(params: SearchParams): Note[] {
    try {
      const validated = searchParamsSchema.parse(params);

      const results = this.db.prepare(`
        SELECT 
          cs.Z_PK as id,
          cs.ZTITLE1 as title,
          cs.ZSNIPPET as snippet,
          cs.ZIDENTIFIER as identifier,
          datetime(cs.ZMODIFICATIONDATE1 + 978307200, 'unixepoch', 'localtime') as modified_date,
          nd.ZDATA as content,
          cs.ZHASCHECKLIST as has_checklist
        FROM ZICCLOUDSYNCINGOBJECT cs
        LEFT JOIN ZICNOTEDATA nd ON cs.Z_PK = nd.ZNOTE
        WHERE 
          (cs.ZMARKEDFORDELETION = 0 OR cs.ZMARKEDFORDELETION IS NULL)
          AND (
            LOWER(cs.ZTITLE1) LIKE LOWER('%' || ? || '%')
            OR LOWER(cs.ZSNIPPET) LIKE LOWER('%' || ? || '%')
          )
        ORDER BY cs.ZMODIFICATIONDATE1 DESC
        LIMIT ? OFFSET ?
      `).all([
        validated.term,
        validated.term,
        validated.limit,
        validated.offset,
      ]);

      return results.map((result) => Note.create(result));
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(
          "Invalid search parameters or note data",
          error,
        );
      }
      throw error;
    }
  }

  public count(searchTerm: string = ""): number {
    const result = this.db.prepare(`
      SELECT COUNT(*) as total
      FROM ZICCLOUDSYNCINGOBJECT cs
      WHERE 
        (cs.ZMARKEDFORDELETION = 0 OR cs.ZMARKEDFORDELETION IS NULL)
        AND (
          LOWER(cs.ZTITLE1) LIKE LOWER('%' || ? || '%')
          OR LOWER(cs.ZSNIPPET) LIKE LOWER('%' || ? || '%')
        )
    `).get<{ total: number }>([searchTerm, searchTerm]);

    return result?.total ?? 0;
  }
}
