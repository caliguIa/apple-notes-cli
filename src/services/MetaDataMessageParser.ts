import { z } from "zod";

const metadataMessageSchema = z.object({
  fieldNumber: z.number(),
  wireType: z.number(),
  value: z.union([
    z.number(),
    z.string(),
    z.instanceof(Uint8Array),
    z.array(z.number()),
  ]),
  length: z.number().optional(),
  raw: z.instanceof(Uint8Array),
  nestedMessages: z.array(z.any()).optional(),
});

type MetadataMessage = z.infer<typeof metadataMessageSchema>;

export class MetadataMessageParser {
  private pos = 0;

  constructor(private data: Uint8Array) {}

  public parse(): MetadataMessage[] {
    const messages: MetadataMessage[] = [];
    this.pos = 0;

    while (this.pos < this.data.length) {
      try {
        const message = this.parseNextMessage();
        if (message) {
          messages.push(message);
        }
      } catch (error) {
        console.error(
          "Error parsing message at position",
          this.pos,
          ":",
          error,
        );
        break;
      }
    }

    return messages;
  }

  private parseNextMessage(): MetadataMessage {
    const startPos = this.pos;
    const tag = this.readVarint();
    const wireType = tag & 0x7;
    const fieldNumber = tag >> 3;

    let value: number | string | Uint8Array | number[];
    let length: number | undefined;
    let nestedMessages: MetadataMessage[] | undefined;

    switch (wireType) {
      case 0: // Varint
        value = this.readVarint();
        break;
      case 1: // 64-bit
        value = this.readFixed64();
        break;
      case 2: { // Length-delimited
        length = this.readVarint();
        const bytes = this.data.slice(this.pos, this.pos + length);
        this.pos += length;

        // Try parsing as nested message first
        try {
          const nestedParser = new MetadataMessageParser(bytes);
          nestedMessages = nestedParser.parse();
          value = bytes;
        } catch {
          // If not a valid nested message, try as UTF-8 string
          try {
            value = new TextDecoder().decode(bytes);
          } catch {
            // If not valid UTF-8, keep as bytes
            value = bytes;
          }
        }
        break;
      }
      case 5: // 32-bit
        value = this.readFixed32();
        break;
      default:
        throw new Error(`Unknown wire type: ${wireType}`);
    }

    const endPos = this.pos;
    const raw = this.data.slice(startPos, endPos);

    const message = metadataMessageSchema.parse({
      fieldNumber,
      wireType,
      value,
      length,
      raw,
      ...(nestedMessages && { nestedMessages }),
    });

    // Add hex representation of raw bytes for analysis
    Object.defineProperty(message, "rawHex", {
      value: Array.from(raw).map((b) => b.toString(16).padStart(2, "0")).join(
        " ",
      ),
      enumerable: true,
    });

    return message;
  }

  private readVarint(): number {
    let result = 0;
    let shift = 0;

    while (this.pos < this.data.length) {
      const byte = this.data[this.pos++];
      result |= (byte & 0x7F) << shift;

      if ((byte & 0x80) === 0) {
        return result;
      }

      shift += 7;
      if (shift >= 64) {
        throw new Error("Varint too long");
      }
    }

    throw new Error("Unexpected end of data");
  }

  private readFixed32(): number {
    if (this.pos + 4 > this.data.length) {
      throw new Error("Not enough bytes for fixed32");
    }

    const view = new DataView(
      this.data.buffer,
      this.data.byteOffset + this.pos,
      4,
    );
    this.pos += 4;
    return view.getUint32(0, true);
  }

  private readFixed64(): number {
    if (this.pos + 8 > this.data.length) {
      throw new Error("Not enough bytes for fixed64");
    }

    const view = new DataView(
      this.data.buffer,
      this.data.byteOffset + this.pos,
      8,
    );
    this.pos += 8;

    const low = view.getUint32(0, true);
    const high = view.getUint32(4, true);
    return (high * Math.pow(2, 32)) + low;
  }

  public static parseHexString(input: string): MetadataMessage[] {
    // Convert string like "\u0018\u0001J\u0010..." to Uint8Array
    const bytes = new Uint8Array(
      input.split("")
        .map((char) => char.charCodeAt(0)),
    );

    const parser = new MetadataMessageParser(bytes);
    return parser.parse();
  }
}
