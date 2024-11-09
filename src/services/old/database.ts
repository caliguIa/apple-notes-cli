import { Database } from "@db/sqlite";
import {
  DatabaseNoteSchema,
  validateDatabaseNote,
  ValidationError,
} from "../types/index.ts";

export class NotesDatabase {
  private db: Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
  }

  public searchNotes(searchTerm: string = ""): DatabaseNoteSchema[] {
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
      LIMIT 20
    `).all([searchTerm, searchTerm]);

    return results.map((result) => {
      try {
        return validateDatabaseNote(result);
      } catch (error) {
        if (error instanceof ValidationError) {
          console.error(
            `Validation error for note ${result.id}:`,
            error.errors,
          );
          // Return a minimal valid note object
          return {
            id: result.id || 0,
            title: "Invalid Note",
            snippet: "This note failed validation",
            identifier: result.identifier || "",
            modified_date: new Date().toISOString(),
            content: null,
            has_checklist: 0,
          };
        }
        throw error;
      }
    });
  }
}
