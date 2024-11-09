import { NoteItem, ProcessedNote } from "../types/index.ts";
import { colors, textFormat } from "../utils/styles.ts";

export class NoteFormatter {
  public formatNoteContent(items: NoteItem[]): string {
    return items.map((item) => {
      if (!item.text) return "";

      if (item.isChecklistItem) {
        const checkbox = item.isChecked
          ? `${colors.green}${textFormat.checkbox.checked}${textFormat.reset}`
          : `${colors.gray}${textFormat.checkbox.unchecked}${textFormat.reset}`;
        const textColor = item.isChecked ? colors.dim : colors.white;
        return `${checkbox} ${textColor}${item.text}${textFormat.reset}`;
      }

      return `${colors.white}${item.text}${textFormat.reset}`;
    }).join("\n");
  }

  public formatSearchResults(notes: ProcessedNote[], searchTerm: string): void {
    if (notes.length === 0) {
      console.log(
        `${colors.gray}No notes found matching your search.${textFormat.reset}`,
      );
      return;
    }

    console.log(
      `\nSearch results for "${colors.cyan}${
        searchTerm || "all"
      }${textFormat.reset}":`,
    );

    notes.forEach((note) => {
      console.log(
        `\n${colors.gray}${textFormat.separator.repeat(50)}${textFormat.reset}`,
      );
      console.log(`${textFormat.bold}${note.title}${textFormat.reset}`);
      console.log(
        `${colors.gray}Modified: ${note.modified_date}${textFormat.reset}`,
      );
      console.log(
        `\n${note.content || note.snippet}`,
      );
    });

    console.log(
      `\n${colors.gray}${textFormat.separator.repeat(50)}${textFormat.reset}`,
    );
    console.log(
      `${colors.cyan}Found ${notes.length} matching note${
        notes.length === 1 ? "" : "s"
      }${textFormat.reset}\n`,
    );
  }
}
