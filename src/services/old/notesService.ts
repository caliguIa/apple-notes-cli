import {
  DatabaseNoteSchema,
  ProcessedNoteSchema,
  validateProcessedNote,
} from "../types/index.ts";
import { colors, textFormat } from "../utils/styles.ts";
import { NotesDatabase } from "./database.ts";
import { NoteFormatter } from "./noteFormatter.ts";
import { NoteParser } from "./noteParser.ts";

export class NotesService {
  private database: NotesDatabase;
  private parser: NoteParser;
  private formatter: NoteFormatter;

  constructor(dbPath: string) {
    this.database = new NotesDatabase(dbPath);
    this.parser = new NoteParser();
    this.formatter = new NoteFormatter();
  }

  public searchNotes(searchTerm: string = ""): void {
    try {
      const notes = this.database.searchNotes(searchTerm);
      const processedNotes = this.processNotes(notes);
      this.formatter.formatSearchResults(processedNotes, searchTerm);
    } catch (error) {
      console.error(
        `${colors.red}Error searching notes:${textFormat.reset}`,
        error,
      );
    }
  }

  private processNotes(notes: DatabaseNoteSchema[]): ProcessedNoteSchema[] {
    return notes.map((note) => {
      try {
        const result: ProcessedNoteSchema = {
          title: note.title,
          snippet: note.snippet || "",
          modified_date: note.modified_date,
          content: null,
          has_checklist: note.has_checklist,
        };

        if (note.content) {
          const items = this.parser.parseNote(note.content);
          result.content = this.formatter.formatNoteContent(items);
        }

        return validateProcessedNote(result);
      } catch (error) {
        console.error(
          `${colors.red}Error processing note ${note.id}:${textFormat.reset}`,
          error,
        );

        return validateProcessedNote({
          title: note.title,
          snippet: "Error processing note content",
          modified_date: note.modified_date,
          content: null,
          has_checklist: note.has_checklist,
        });
      }
    });
  }
}
