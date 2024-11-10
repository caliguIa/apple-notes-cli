import { NoteViewData, ViewResult } from "../schemas/viewSchemas.ts";
import { BaseView } from "./BaseView.ts";

export class JsonView extends BaseView {
  public render(data: NoteViewData): ViewResult {
    const validatedData = this.validateViewData(data);
    return this.createResult(JSON.stringify(validatedData.notes, null, 2));
  }

  public formatError(error: Error): string {
    return JSON.stringify(
      {
        error: {
          message: error.message,
          name: error.name,
        },
      },
      null,
      2,
    );
  }
}
