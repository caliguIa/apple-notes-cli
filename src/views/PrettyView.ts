import { NoteViewData, ViewResult } from "../schemas/viewSchemas.ts";
import { NoteContentParser } from "../services/NoteContentParser.ts";
import { colors, textFormat } from "../utils/styles.ts";
import { BaseView } from "./BaseView.ts";

export class PrettyView extends BaseView {
  private parser: NoteContentParser;

  constructor() {
    super();
    this.parser = new NoteContentParser();
  }

  public render(rawData: NoteViewData): ViewResult {
    const data = this.validateViewData(rawData);
    let output = "";

    if (data.notes.length === 0) {
      return this.createResult(
        `${colors.gray}No notes found matching your search.${textFormat.reset}\n`,
      );
    }

    output += `\nSearch results for "${colors.cyan}${
      data.searchTerm || "all"
    }${textFormat.reset}":\n`;

    for (const note of data.notes) {
      output += `\n${colors.gray}${
        textFormat.separator.repeat(50)
      }${textFormat.reset}\n`;
      output += `${textFormat.bold}${note.title}${textFormat.reset}\n`;
      output +=
        `${colors.gray}Modified: ${note.modified_date}${textFormat.reset}\n\n`;

      if (note.content) {
        const parsedContent = this.parser.parse(note.content);
        output += this.formatContent(parsedContent);
      } else {
        output += note.snippet || "";
      }
      output += "\n";
    }

    output += `\n${colors.gray}${
      textFormat.separator.repeat(50)
    }${textFormat.reset}\n`;
    output += `${colors.cyan}Found ${data.notes.length} matching note${
      data.notes.length === 1 ? "" : "s"
    }`;

    if (data.totalCount !== undefined) {
      output += ` (of ${data.totalCount} total)`;
    }

    output += `${textFormat.reset}\n`;

    return this.createResult(output);
  }

  public formatError(error: Error): string {
    return `${colors.red}Error: ${error.message}${textFormat.reset}\n`;
  }

  private formatContent(
    items: { text: string; isChecked?: boolean }[],
  ): string {
    return items.map((item) => {
      if (!item.text) return "";

      if (item.isChecked !== undefined) {
        const checkbox = item.isChecked
          ? `${colors.green}${textFormat.checkbox.checked}${textFormat.reset}`
          : `${colors.gray}${textFormat.checkbox.unchecked}${textFormat.reset}`;
        const textColor = item.isChecked ? colors.dim : colors.white;
        return `${checkbox} ${textColor}${item.text}${textFormat.reset}`;
      }

      return `${colors.white}${item.text}${textFormat.reset}`;
    }).join("\n");
  }
}
