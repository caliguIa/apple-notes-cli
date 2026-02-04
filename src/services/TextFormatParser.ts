import { z } from "zod";

const FORMAT_HEADERS = {
  STANDARD: new Uint8Array([0x18, 0x01, 0x4a, 0x10]),
  ALTERNATE: new Uint8Array([0x14, 0x18, 0x01, 0x4a, 0x10]),
};

const formatBlockSchema = z.object({
  type: z.enum(["header", "format", "marker"]),
  value: z.number(),
  position: z.number(),
  raw: z.instanceof(Uint8Array),
});

const formatMetadataSchema = z.object({
  header: z.instanceof(Uint8Array),
  formatBlocks: z.array(formatBlockSchema),
  rawBytes: z.instanceof(Uint8Array),
});

type FormatBlock = z.infer<typeof formatBlockSchema>;
type FormatMetadata = z.infer<typeof formatMetadataSchema>;

export class TextFormatParser {
  constructor(private data: Uint8Array) {}

  public parse(): FormatMetadata {
    const blocks: FormatBlock[] = [];
    let pos = 0;

    // Find and validate header
    const header = this.findHeader();
    pos = header.length;

    // Process remaining bytes
    while (pos < this.data.length) {
      const byte = this.data[pos];

      if (byte === 0xfd) {
        // Skip escape sequences
        pos++;
        continue;
      }

      // Look for known format markers
      if (this.isFormatMarker(byte)) {
        const block = this.parseFormatBlock(this.data.slice(pos));
        if (block) {
          blocks.push(block);
          pos += block.raw.length;
        } else {
          pos++;
        }
      } else {
        pos++;
      }
    }

    return formatMetadataSchema.parse({
      header,
      formatBlocks: blocks,
      rawBytes: this.data,
    });
  }

  private findHeader(): Uint8Array {
    // Check for both header types
    for (const [_, header] of Object.entries(FORMAT_HEADERS)) {
      if (this.startsWith(header)) {
        return header;
      }
    }
    throw new Error("Invalid format header");
  }

  private startsWith(prefix: Uint8Array): boolean {
    return prefix.every((byte, i) => this.data[i] === byte);
  }

  private isFormatMarker(byte: number): boolean {
    // Known format marker bytes from our samples
    return [0x2e, 0x0f, 0x3f, 0x59].includes(byte);
  }

  private parseFormatBlock(data: Uint8Array): FormatBlock | null {
    if (data.length < 3) return null;

    // Look for format patterns we identified
    if (this.matchesPattern(data, [0x2e, 0x41, 0x40])) {
      return {
        type: "format",
        value: data[0],
        position: 0,
        raw: data.slice(0, 3),
      };
    }
    if (this.matchesPattern(data, [0x0f, 0x3c, 0x4f])) {
      return {
        type: "format",
        value: data[0],
        position: 0,
        raw: data.slice(0, 3),
      };
    }
    if (this.matchesPattern(data, [0x3f, 0x73, 0x4b])) {
      return {
        type: "format",
        value: data[0],
        position: 0,
        raw: data.slice(0, 3),
      };
    }

    return null;
  }

  private matchesPattern(data: Uint8Array, pattern: number[]): boolean {
    return pattern.every((byte, i) => {
      const dataByte = data[i];
      return dataByte === byte || dataByte === 0xfd;
    });
  }

  public static parseHexString(hexString: string): FormatMetadata {
    const bytes = new Uint8Array(
      hexString.split(" ")
        .map((hex) => parseInt(hex, 16)),
    );
    const parser = new TextFormatParser(bytes);
    return parser.parse();
  }

  public static formatToString(metadata: FormatMetadata): string {
    let output = "Format Header: ";
    output += Array.from(metadata.header)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");
    output += "\n\nFormat Blocks:\n";

    metadata.formatBlocks.forEach((block, i) => {
      output += `${i + 1}. Type: ${block.type}, Value: 0x${
        block.value.toString(16)
      }\n`;
      output += `   Raw: ${
        Array.from(block.raw).map((b) => b.toString(16).padStart(2, "0")).join(
          " ",
        )
      }\n`;
    });

    return output;
  }
}
