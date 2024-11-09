import { gunzip } from "@deno-library/compress";
import { NoteItem, noteItemSchema } from "../schemas/noteSchemas.ts";
import { ValidationError } from "../utils/error.ts";
import { z } from "zod";

interface ProtobufParsingResult {
  content: Uint8Array | null;
  checklistStates: boolean[];
  nestingLevels: number[];
}

export class NoteContentParser {
  private textDecoder = new TextDecoder();

  public parse(data: Uint8Array): NoteItem[] {
    try {
      const decompressed = gunzip(data);
      const items = this.parseProtobuf(decompressed);
      const validatedItems: NoteItem[] = [];

      for (const item of items) {
        try {
          const validatedItem = noteItemSchema.parse(item);
          validatedItems.push(validatedItem);
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new ValidationError("Invalid note item format", error);
          }
          console.error("Unexpected error validating note item:", error);
        }
      }

      return validatedItems;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error("Error parsing note content:", error);
      return [];
    }
  }

  private parseProtobuf(data: Uint8Array): NoteItem[] {
    try {
      const items: NoteItem[] = [];
      const result = this.extractContentAndStates(data);
      if (!result.content) return [];

      const text = this.textDecoder.decode(result.content).replace(
        // deno-lint-ignore no-control-regex
        /\u0001/g,
        "",
      );
      const lines = text.split("\n");
      let checklistIndex = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (!trimmed) {
          // Add empty line if there's content before it
          if (items.length > 0 && items[items.length - 1].text) {
            items.push(this.createNoteItem("", false, 0, false));
          }
          continue;
        }

        const level = result.nestingLevels[i] || 0;
        const isChecklistItem = checklistIndex < result.checklistStates.length;

        if (isChecklistItem) {
          const isChecked = result.checklistStates[checklistIndex];
          items.push(this.createNoteItem(trimmed, isChecked, level, true));
          checklistIndex++;
        } else {
          items.push(this.createNoteItem(trimmed, false, level, false));
        }
      }

      return items;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError("Failed to parse protobuf content", error);
      }
      throw error;
    }
  }

  private extractContentAndStates(data: Uint8Array): ProtobufParsingResult {
    let pos = 0;
    const result: ProtobufParsingResult = {
      content: null,
      checklistStates: [],
      nestingLevels: [],
    };

    while (pos < data.length) {
      const tag = this.readVarint(data, pos);
      pos += this.getVarintSize(tag);

      const wireType = tag & 0x7;
      const fieldNumber = tag >> 3;

      switch (fieldNumber) {
        case 1: // Content field
          if (wireType === 2) { // Length-delimited
            const length = this.readVarint(data, pos);
            pos += this.getVarintSize(length);
            result.content = data.slice(pos, pos + length);
            pos += length;
          }
          break;

        case 2: // Checklist states
          if (wireType === 2) { // Length-delimited
            const length = this.readVarint(data, pos);
            pos += this.getVarintSize(length);
            const endPos = pos + length;

            while (pos < endPos) {
              const value = this.readVarint(data, pos);
              pos += this.getVarintSize(value);
              result.checklistStates.push(Boolean(value));
            }
          }
          break;

        case 3: // Nesting levels
          if (wireType === 2) { // Length-delimited
            const length = this.readVarint(data, pos);
            pos += this.getVarintSize(length);
            const endPos = pos + length;

            while (pos < endPos) {
              const value = this.readVarint(data, pos);
              pos += this.getVarintSize(value);
              result.nestingLevels.push(Number(value));
            }
          }
          break;

        default:
          // Skip unknown fields
          switch (wireType) {
            case 0: // Varint
              this.readVarint(data, pos);
              pos += this.getVarintSize(this.readVarint(data, pos));
              break;
            case 1: // 64-bit
              pos += 8;
              break;
            case 2: { // Length-delimited
              const length = this.readVarint(data, pos);
              pos += this.getVarintSize(length) + length;
              break;
            }
            case 5: // 32-bit
              pos += 4;
              break;
          }
      }
    }

    return result;
  }

  private createNoteItem(
    text: string,
    isChecked: boolean,
    level: number,
    isChecklistItem: boolean,
  ): NoteItem {
    return {
      text,
      isChecked,
      level,
      isChecklistItem,
    };
  }

  private readVarint(data: Uint8Array, pos: number): number {
    let result = 0;
    let shift = 0;

    while (true) {
      if (pos >= data.length) {
        throw new Error("Incomplete varint");
      }

      const byte = data[pos];
      result |= (byte & 0x7F) << shift;

      if ((byte & 0x80) === 0) {
        return result;
      }

      shift += 7;
      pos++;

      if (shift >= 64) {
        throw new Error("Varint too long");
      }
    }
  }

  private getVarintSize(n: number): number {
    let size = 0;
    do {
      n >>= 7;
      size++;
    } while (n !== 0);
    return size;
  }
}
