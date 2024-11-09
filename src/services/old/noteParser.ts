import { gunzip } from "jsr:@deno-library/compress";
import {
  NoteItemSchema,
  protobufParsingResultSchema,
  validateNoteItems,
} from "../types/index.ts";

export class NoteParser {
  private textDecoder = new TextDecoder();

  public parseNote(data: Uint8Array): NoteItemSchema[] {
    try {
      const decompressed = gunzip(data);
      const items = this.parseProtobuf(decompressed);
      return validateNoteItems(items);
    } catch (error) {
      console.error("Error parsing note:", error);
      return [];
    }
  }

  private parseProtobuf(data: Uint8Array): NoteItemSchema[] {
    const items: NoteItemSchema[] = [];
    const result = this.extractContentAndStates(data);

    // Validate protobuf parsing result
    const validated = protobufParsingResultSchema.parse(result);
    if (!validated.content) return [];

    const text = this.textDecoder.decode(validated.content).replace(
      /\u0001/g,
      "",
    );
    const lines = text.split("\n");
    let checklistIndex = 0;

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed) {
        if (items.length > 0 && items[items.length - 1].text) {
          items.push(this.createNoteItem("", false, false));
        }
        continue;
      }

      if (trimmed.startsWith("some ")) {
        items.push(this.createNoteItem(trimmed, false, false));
        continue;
      }

      const isChecked = checklistIndex < validated.checklistStates.length
        ? validated.checklistStates[checklistIndex]
        : false;
      checklistIndex++;

      items.push(this.createNoteItem(trimmed, true, isChecked));
    }

    return items;
  }

  private extractContentAndStates(data: Uint8Array): {
    content: Uint8Array | null;
    checklistStates: boolean[];
  } {
    let contentStart = -1;
    let contentLength = -1;
    const checklistStates: boolean[] = [];

    // Find content field
    for (let i = 0; i < data.length - 2; i++) {
      if (data[i] === 0x12) {
        const length = data[i + 1];
        if (length > 0 && length < 0xFF) {
          const peek = data.slice(i + 2, i + 7);
          const text = this.textDecoder.decode(peek);
          if (/[A-Za-z]/.test(text)) {
            contentStart = i + 2;
            contentLength = length;
            break;
          }
        }
      }
    }

    if (contentStart === -1) return { content: null, checklistStates };

    // Extract checklist states
    let i = contentStart + contentLength;
    let statesFound = 0;

    while (i < data.length - 8 && statesFound < 10) {
      if (
        data[i] === 0x1a && data[i + 1] === 0x10 &&
        data[i + 2] === 0x0a && data[i + 3] === 0x04 &&
        data[i + 4] === 0x08
      ) {
        checklistStates.push(data[i + 5] === 0x01);
        statesFound++;
        i += 16;
      } else {
        i++;
      }
    }

    return {
      content: data.slice(contentStart, contentStart + contentLength),
      checklistStates,
    };
  }

  private createNoteItem(
    text: string,
    isChecklistItem: boolean,
    isChecked: boolean,
  ): NoteItemSchema {
    return {
      text,
      isChecked,
      level: 0,
      isChecklistItem,
    };
  }
}
