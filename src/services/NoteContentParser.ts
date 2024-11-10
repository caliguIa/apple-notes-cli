import { NoteItem, noteItemSchema } from "../schemas/noteSchemas.ts";
import { ValidationError } from "../utils/error.ts";
import { gunzip } from "@deno-library/compress";
import { z } from "zod";

// Validation schemas
const metadataBlockSchema = z.object({
  identifiers: z.array(z.number()),
  flags: z.array(z.number()),
  timestamps: z.array(z.number()),
  reference: z.bigint().optional(),
  formatData: z.instanceof(Uint8Array).optional(),
});

const parsedContentSchema = z.object({
  textContent: z.string(),
  checklistStates: z.array(z.boolean()),
  nestingLevels: z.array(z.number()),
  metadataBlocks: z.array(metadataBlockSchema),
});

const noteMetadataSchema = z.object({
  blocks: z.array(metadataBlockSchema),
  analysis: z.object({
    formatVersion: z.number().optional(),
    timestamps: z.object({
      create: z.number().optional(),
      modify: z.number().optional(),
      other: z.array(z.number()),
    }),
    flags: z.object({
      typeFlags: z.array(z.number()),
      stateFlags: z.array(z.number()),
    }),
    references: z.array(z.bigint()),
  }),
});

type MetadataBlock = z.infer<typeof metadataBlockSchema>;
type ParsedContent = z.infer<typeof parsedContentSchema>;
type NoteMetadata = z.infer<typeof noteMetadataSchema>;

export class NoteContentParser {
  private textDecoder = new TextDecoder();

  public parse(data: Uint8Array): NoteItem[] {
    try {
      // Handle gzip compression
      if (data[0] === 0x1f && data[1] === 0x8b) {
        data = gunzip(data);
      }

      // Extract and validate content
      const parsedContent = parsedContentSchema.parse(
        this.extractContent(data),
      );

      // Analyze and validate metadata
      const metadata = noteMetadataSchema.parse(
        this.analyzeMetadata(parsedContent.metadataBlocks),
      );

      this.logMetadata(metadata);

      // Process and validate note items
      return this.processNoteItems(
        parsedContent.textContent,
        parsedContent.checklistStates,
        parsedContent.nestingLevels,
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError("Invalid note content structure", error);
      }
      throw error;
    }
  }

  private logMetadata(metadata: NoteMetadata): void {
    console.error("Note Metadata Analysis:");
    console.error("Format Version:", metadata.analysis.formatVersion);
    console.error("Timestamps:", {
      create: metadata.analysis.timestamps.create
        ? new Date(metadata.analysis.timestamps.create * 1000)
        : undefined,
      modify: metadata.analysis.timestamps.modify
        ? new Date(metadata.analysis.timestamps.modify * 1000)
        : undefined,
      other: metadata.analysis.timestamps.other.map((ts) =>
        new Date(ts * 1000)
      ),
    });
    console.error("Type Flags:", metadata.analysis.flags.typeFlags);
    console.error("State Flags:", metadata.analysis.flags.stateFlags);
    console.error("References:", metadata.analysis.references);
  }

  private extractContent(data: Uint8Array): ParsedContent {
    let pos = 0;
    let mainContent: Uint8Array | null = null;

    // Find the main content block (field 2)
    while (pos < data.length) {
      const tag = this.readVarint(data, pos);
      pos += this.getVarintSize(tag);

      const wireType = tag & 0x7;
      const fieldNumber = tag >> 3;

      if (fieldNumber === 2 && wireType === 2) {
        const length = this.readVarint(data, pos);
        pos += this.getVarintSize(length);
        mainContent = data.slice(pos, pos + length);
        break;
      } else {
        pos = this.skipField(data, pos, wireType);
      }
    }

    if (!mainContent) {
      return {
        textContent: "",
        checklistStates: [],
        nestingLevels: [],
        metadataBlocks: [],
      };
    }

    // Parse the content from field 3 in the main content block
    pos = 0;
    let textContent = "";
    const checklistStates: boolean[] = [];
    const nestingLevels: number[] = [];
    const metadataBlocks: MetadataBlock[] = [];

    while (pos < mainContent.length) {
      const tag = this.readVarint(mainContent, pos);
      pos += this.getVarintSize(tag);

      const wireType = tag & 0x7;
      const fieldNumber = tag >> 3;

      if (fieldNumber === 3 && wireType === 2) {
        const length = this.readVarint(mainContent, pos);
        pos += this.getVarintSize(length);
        const contentBlock = mainContent.slice(pos, pos + length);

        // Process the content block
        let innerPos = 0;
        const block = this.initMetadataBlock();

        while (innerPos < contentBlock.length) {
          const innerTag = this.readVarint(contentBlock, innerPos);
          innerPos += this.getVarintSize(innerTag);

          const innerWireType = innerTag & 0x7;
          const innerFieldNumber = innerTag >> 3;

          switch (innerFieldNumber) {
            case 2: // Text content
              if (innerWireType === 2) {
                const textLength = this.readVarint(contentBlock, innerPos);
                innerPos += this.getVarintSize(textLength);
                const textChunk = contentBlock.slice(
                  innerPos,
                  innerPos + textLength,
                );
                const text = this.textDecoder.decode(textChunk);
                textContent += (textContent ? "\n" : "") + text;
                innerPos += textLength;
              }
              break;
            case 4: // Checklist state
              if (innerWireType === 0) {
                const value = this.readVarint(contentBlock, innerPos);
                innerPos += this.getVarintSize(value);
                checklistStates.push(Boolean(value));
              }
              break;
            case 5: // Nesting level
              if (innerWireType === 0) {
                const value = this.readVarint(contentBlock, innerPos);
                innerPos += this.getVarintSize(value);
                nestingLevels.push(Number(value));
              }
              break;
            default:
              // Collect metadata
              innerPos = this.processMetadataField(
                contentBlock,
                innerPos,
                innerWireType,
                block,
              );
          }
        }

        if (this.hasMetadata(block)) {
          metadataBlocks.push(block);
        }

        pos += length;
      } else {
        pos = this.skipField(mainContent, pos, wireType);
      }
    }

    return {
      textContent,
      checklistStates,
      nestingLevels,
      metadataBlocks,
    };
  }

  private initMetadataBlock(): MetadataBlock {
    return {
      identifiers: [],
      flags: [],
      timestamps: [],
    };
  }

  private hasMetadata(block: MetadataBlock): boolean {
    return block.identifiers.length > 0 ||
      block.flags.length > 0 ||
      block.timestamps.length > 0 ||
      block.reference !== undefined ||
      block.formatData !== undefined;
  }

  private processMetadataField(
    data: Uint8Array,
    pos: number,
    wireType: number,
    block: MetadataBlock,
  ): number {
    switch (wireType) {
      case 0: { // Varint
        const value = this.readVarint(data, pos);
        pos += this.getVarintSize(value);

        const categorized = this.categorizeVarint(value);
        switch (categorized.type) {
          case "identifier":
            block.identifiers.push(categorized.value);
            break;
          case "flag":
            block.flags.push(categorized.value);
            break;
          case "timestamp":
            block.timestamps.push(categorized.value);
            break;
        }
        break;
      }
      case 1: { // 64-bit
        block.reference = this.readFixed64(data, pos);
        pos += 8;
        break;
      }
      case 2: { // Length-delimited
        const length = this.readVarint(data, pos);
        pos += this.getVarintSize(length);
        block.formatData = data.slice(pos, pos + length);
        pos += length;
        break;
      }
      case 5: // 32-bit
        pos += 4;
        break;
      default:
        pos += 1;
    }
    return pos;
  }

  private categorizeVarint(
    value: number,
  ): { type: "identifier" | "flag" | "timestamp"; value: number } {
    if (value >= 1731185000 && value <= 1731186000) {
      return { type: "timestamp", value };
    } else if (value === 1 || value === 67) {
      return { type: "flag", value };
    } else {
      return { type: "identifier", value };
    }
  }

  private analyzeMetadata(rawBlocks: MetadataBlock[]): NoteMetadata {
    const metadata: NoteMetadata = {
      blocks: rawBlocks,
      analysis: {
        timestamps: { other: [] },
        flags: {
          typeFlags: [],
          stateFlags: [],
        },
        references: [],
      },
    };

    for (const block of rawBlocks) {
      // Process identifiers
      if (block.identifiers.length > 0) {
        if (!metadata.analysis.formatVersion) {
          metadata.analysis.formatVersion = block.identifiers[0];
        }
      }

      // Process flags
      block.flags.forEach((flag) => {
        if (flag === 67) {
          metadata.analysis.flags.typeFlags.push(flag);
        } else if (flag === 1) {
          metadata.analysis.flags.stateFlags.push(flag);
        }
      });

      // Process timestamps
      block.timestamps.forEach((ts) => {
        if (!metadata.analysis.timestamps.create) {
          metadata.analysis.timestamps.create = ts;
        } else if (!metadata.analysis.timestamps.modify) {
          metadata.analysis.timestamps.modify = ts;
        } else {
          metadata.analysis.timestamps.other.push(ts);
        }
      });

      // Process references
      if (block.reference) {
        metadata.analysis.references.push(block.reference);
      }
    }

    return metadata;
  }

  private processNoteItems(
    textContent: string,
    checklistStates: boolean[],
    nestingLevels: number[],
  ): NoteItem[] {
    const lines = textContent.split("\n");
    const items: NoteItem[] = [];
    let checklistIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        if (items.length > 0 && items[items.length - 1].text) {
          items.push(this.createNoteItem("", false, 0, false));
        }
        continue;
      }

      const level = nestingLevels[i] || 0;
      const isChecklistItem = checklistIndex < checklistStates.length;

      if (isChecklistItem) {
        const isChecked = checklistStates[checklistIndex];
        items.push(this.createNoteItem(line, isChecked, level, true));
        checklistIndex++;
      } else {
        items.push(this.createNoteItem(line, false, level, false));
      }
    }

    return items;
  }

  private createNoteItem(
    text: string,
    isChecked: boolean,
    level: number,
    isChecklistItem: boolean,
  ): NoteItem {
    return noteItemSchema.parse({
      text,
      isChecked,
      level,
      isChecklistItem,
    });
  }

  private skipField(data: Uint8Array, pos: number, wireType: number): number {
    switch (wireType) {
      case 0: // Varint
        return pos + this.getVarintSize(this.readVarint(data, pos));
      case 1: // 64-bit
        return pos + 8;
      case 2: { // Length-delimited
        const length = this.readVarint(data, pos);
        return pos + this.getVarintSize(length) + length;
      }
      case 5: // 32-bit
        return pos + 4;
      default:
        return pos + 1;
    }
  }

  private readFixed64(data: Uint8Array, pos: number): bigint {
    const view = new DataView(data.buffer, data.byteOffset + pos, 8);
    return view.getBigUint64(0, true);
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
