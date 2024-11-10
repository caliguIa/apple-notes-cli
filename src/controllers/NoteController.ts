import { NoteRepository } from "../models/NoteRepo.ts";
import { searchParamsSchema } from "../schemas/noteSchemas.ts";
import { BaseView } from "../views/BaseView.ts";
import { ViewFactory, ViewType } from "../views/ViewFactory.ts";
import { ProcessedNote } from "../schemas/viewSchemas.ts";
import { Note } from "../models/Note.ts";

export class NoteController {
  private repository: NoteRepository;
  private view: BaseView;

  constructor(repository: NoteRepository, viewType: ViewType = "json") {
    this.repository = repository;
    this.view = ViewFactory.createView(viewType);
  }

  private processNote(note: Note): ProcessedNote {
    const data = note.getData();

    console.error("Raw note data:");
    console.error("Content type:", data.content ? typeof data.content : "null");
    console.error("Content length:", data.content ? data.content.length : 0);

    const parsedContent = note.parseContent();
    console.error("Parsed content length:", parsedContent.length);

    return {
      ...data,
      content: parsedContent,
    };
  }

  public search(
    term: string,
    limit?: number,
    offset?: number,
  ): number {
    try {
      const params = searchParamsSchema.parse({
        term,
        limit: limit || 20,
        offset: offset || 0,
      });

      const notes = this.repository.search(params);
      // console.error(`Found ${notes.length} notes`);

      const totalCount = this.repository.count(params.term);

      const result = this.view.render({
        notes: notes.map((note) => this.processNote(note)),
        searchTerm: params.term,
        totalCount,
      });

      console.log(result.content);
      return result.exitCode;
    } catch (error) {
      const result = this.view.createErrorResult(
        error instanceof Error ? error : new Error(String(error)),
      );
      console.error(result.content);
      return result.exitCode;
    }
  }

  public getById(id: number): number {
    try {
      const note = this.repository.findById(id);
      if (!note) {
        throw new Error(`Note with ID ${id} not found`);
      }

      const result = this.view.render({
        notes: [this.processNote(note)],
      });

      // console.log(result.content);
      return result.exitCode;
    } catch (error) {
      const result = this.view.createErrorResult(
        error instanceof Error ? error : new Error(String(error)),
      );
      console.error(result.content);
      return result.exitCode;
    }
  }
}
