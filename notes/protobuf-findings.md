# Apple Notes Content Structure Analysis

## Overview
The Apple Notes content is stored in a protobuf format with gzip compression. When fetched from the database, the note content needs to be decompressed before parsing.

## Basic Structure

1. **Compression Layer**
   - Content is gzip compressed
   - Identifiable by magic numbers: `0x1f, 0x8b` at start of data

2. **Top Level Message Structure**
   - Field 1 (tag 8): Varint, appears to be a header/metadata value
   - Field 2 (tag 18): Length-delimited, contains the main content block
   
3. **Main Content Block Structure**
   - Field 1 (tag 8): Varint, possibly a version or type indicator
   - Field 2 (tag 16): Varint, possibly a format indicator
   - Field 3 (tag 26): Length-delimited, contains the actual content/formatting

4. **Content Container (Field 3) Structure**
   - Field 2: Length-delimited, contains the actual text content
   - Multiple subsequent Field 3 messages: Possibly formatting or metadata
   - Field 4: Possibly checklist states when present
   - Field 5: Possibly nesting levels when present

## Example Byte Structure
```
[Gzip Header: 1f 8b ...]
  → [Decompressed: 08 00 12 ee 04 ...] (First 5 bytes)
    → Field 1: 08 00 (Header)
    → Field 2: 12 ee 04 (Main content block)
      → Field 3: 26 e7 04 (Content container)
        → Field 2: Text content
        → Multiple Field 3s: Formatting/metadata
```

## Key Findings

1. **Text Content Location**
   - Found in the first Field 2 within the Field 3 content container
   - Multiple lines are contained in a single text block
   - UTF-8 encoded

2. **Metadata Structure**
   - Multiple Field 3 messages follow the text content
   - Possibly contain formatting, attachments, or other metadata
   - Pattern suggests a repeated message type in the protobuf schema

3. **Additional Fields**
   - Field 4: Appears when note contains checklists
   - Field 5: Appears when note contains nested content

## Observed Patterns
- Basic notes contain minimal metadata messages
- Text content is always in the first Field 2 of the content container
- Field 3 messages after the text content appear to follow a pattern but purpose is still under investigation
- The structure suggests a focus on maintaining formatting and structure information separate from the main content

## Areas for Further Investigation
1. Purpose of multiple Field 3 messages after text content
2. Meaning of various varint values in header fields
3. Additional message types for attachments or special formatting
4. Structure variations for different note types (lists, tables, drawings, etc.)
