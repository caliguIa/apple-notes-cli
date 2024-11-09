import { encodeBase64 } from "@std/encoding";
import {
  DatabaseNote,
  databaseNoteSchema,
  NoteItem,
  SerializableNote,
} from "../schemas/noteSchemas.ts";
import { NoteContentParser } from "../services/NoteContentParser.ts";

export class Note {
  private static parser = new NoteContentParser();
  private constructor(private data: DatabaseNote) {}

  public static create(data: unknown): Note {
    const validated = databaseNoteSchema.parse(data);
    return new Note(validated);
  }

  public get id(): number {
    return this.data.id;
  }

  public get title(): string {
    return this.data.title;
  }

  public get snippet(): string | null {
    return this.data.snippet;
  }

  public get identifier(): string {
    return this.data.identifier;
  }

  public get modifiedDate(): string {
    return this.data.modified_date;
  }

  public get content(): Uint8Array | null {
    return this.data.content;
  }

  public get hasChecklist(): number {
    return this.data.has_checklist;
  }

  public parseContent(): NoteItem[] {
    if (!this.content) return [];
    return Note.parser.parse(this.content);
  }

  public toView(): DatabaseNote {
    return {
      ...this.data,
    };
  }

  public toJSON(): SerializableNote {
    return {
      ...this.data,
      content: this.data.content ? encodeBase64(this.data.content) : null,
    };
  }
}
