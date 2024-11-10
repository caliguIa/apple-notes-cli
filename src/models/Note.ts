import { NoteItem, noteSchema, NoteType } from "../schemas/noteSchemas.ts";
import { NoteContentParser } from "../services/NoteContentParser.ts";

export class Note {
  private static parser = new NoteContentParser();
  private constructor(private data: NoteType) {}

  public static create(data: unknown): Note {
    const validated = noteSchema.parse(data);
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
    if (!this.content) {
      console.error("No content to parse");
      return [];
    }
    // console.error("Content buffer length:", this.content.length);
    return Note.parser.parse(this.content);
  }

  public getData(): NoteType {
    return { ...this.data };
  }
}
