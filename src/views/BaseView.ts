import {
  NoteViewData,
  noteViewDataSchema,
  ViewResult,
  viewResultSchema,
} from "../schemas/viewSchemas.ts";

export abstract class BaseView {
  protected validateViewData(data: unknown): NoteViewData {
    return noteViewDataSchema.parse(data);
  }

  protected validateResult(result: ViewResult): ViewResult {
    return viewResultSchema.parse(result);
  }

  protected createResult(content: string, exitCode: number = 0): ViewResult {
    return this.validateResult({
      content,
      exitCode,
    });
  }

  public createErrorResult(error: Error): ViewResult {
    return this.validateResult({
      content: this.formatError(error),
      exitCode: 1,
    });
  }

  abstract render(data: NoteViewData): ViewResult;
  abstract formatError(error: Error): string;
}
