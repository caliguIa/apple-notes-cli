import { NoteRepository } from "../models/NoteRepo.ts";
import { searchParamsSchema } from "../schemas/noteSchemas.ts";
import { BaseView } from "../views/BaseView.ts";
import { ViewFactory, ViewType } from "../views/ViewFactory.ts";

export class NoteController {
  private repository: NoteRepository;
  private view: BaseView;

  constructor(repository: NoteRepository, viewType: ViewType = "pretty") {
    this.repository = repository;
    this.view = ViewFactory.createView(viewType);
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
      const totalCount = this.repository.count(params.term);

      const result = this.view.render({
        notes: notes.map((note) => note.toJSON()),
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
        notes: [note.toJSON()],
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
}
