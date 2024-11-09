import { Note } from "../models/Note.ts";
import { NoteViewData, ViewResult } from "../schemas/viewSchemas.ts";
import { BaseView } from "./BaseView.ts";

export class JsonView extends BaseView {
  public render(rawData: NoteViewData): ViewResult {
    const data = this.validateViewData({
      ...rawData,
      notes: rawData.notes.map((note) => Note.create(note).toJSON()),
    });

    return this.createResult(JSON.stringify(data, null, 2) + "\n");
  }

  public formatError(error: Error): string {
    return JSON.stringify(
      {
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
      },
      null,
      2,
    ) + "\n";
  }
}
