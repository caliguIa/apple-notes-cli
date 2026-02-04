# Apple Notes Format Research - Current State and Next Steps

## 1. Basic Structure

### 1.1 Content Layout
1. Content is gzip compressed
2. First level contains main content block in field 2
3. Main content block contains field 3 messages with content and metadata
4. UTF-8 encoded content

### 1.2 Core Fields
```protobuf
Root {
  1: 0  // Root identifier
  2: {  // Main content container
    1: 0
    2: 0
    3: [  // Content messages array
      {
        2: "actual text content"
        3: [format_segments]
        4: [format_blocks]
        5: [metadata_blocks]
      }
    ]
  }
}
```

### 1.3 Format Segment Structure
```protobuf
FormatSegment {
  1: {
    1: segment_type (0 = root, 1 = formatted)
    2: offset_position
  }
  2: content_or_format_type
  3: {
    1: format_type (1 = active)
    2: format_position
  }
  4: format_flag (optional, 1 = active)
  5: sequence_id
}
```

## 2. Format Type Codes

### 2.1 Confirmed Codes
```
0: Root/container segment
1: Format boundary marker
2: Text content container
3: Format block marker
4: Format sequence start
5: Format delimiter
8: Bold text
9: Format separator
10: Format chunk marker
15: Unicode/special char marker
16: Formatting container
29: Combined format marker
32: Termination marker
```

### 2.2 Partially Understood Codes
```
6-7: Nested format markers (exact purpose unclear)
11-14: Possibly related to lists/headings
17-28: Various formatting markers (need verification)
```

## 3. Metadata Structure

### 3.1 Basic Structure
```protobuf
MetadataBlock {
  1: format_type
  2: {
    3: state_flag (1 = active)
    9: format_data (binary blob)
  }
  5: format_parameter (optional)
  6: format_layer (optional)
  7: format_stack (optional)
  13: timestamp
}
```

### 3.2 Format Parameters
```
0: Default state
1: Primary format
2: Secondary format
3: Tertiary format/combined
```

## 4. Position Tracking

### 4.1 Core Concepts
1. Character-level precision
2. Zero-width format boundaries
3. Multi-byte character support
4. Nested format support

### 4.2 Position Rules
1. Each format has three position components:
   - Base position (location in text)
   - Length (character count)
   - Format position (format chain position)
2. Overlapping formats use separate segments
3. Format positions track layering
4. Sequence IDs maintain order

## 5. Current Understanding

### 5.1 Confirmed Behaviors
1. Multiple formats can overlap
2. Format boundaries are explicitly marked
3. Unicode characters are properly handled
4. Format order is preserved
5. Nested formats are supported

### 5.2 Known Features
1. Basic formatting (bold, italic, underline)
2. Lists (bulleted, numbered)
3. Text content blocks
4. Format transitions
5. Metadata tracking

## 6. Outstanding Questions

### 6.1 Critical Questions
1. Complete metadata format_data structure (field 2.9)
   - Purpose of binary data
   - Additional format information
   - Special attributes

2. Complete format type code mapping
   - List-related codes
   - Heading-related codes
   - Special format types

### 6.2 Secondary Questions
1. Maximum format combinations supported
2. Format stack limitations
3. Format type precedence rules
4. Special case handling
5. Edge case behaviors

## 7. Next Test Cases

### 7.1 Format Types Test
```
Heading 1
Heading 2
Heading 3

• Bullet list item
   • Nested bullet
      • Deep nested bullet

- Dash list item
   - Nested dash
      - Deep nested dash

1. Numbered list
   1. Nested number
      1. Deep nested number

• Mixed bullet
   - With dash
      1. And number

- Mixed dash
   • With bullet
      1. And number

1. Mixed number
   • With bullet
      - And dash
```

Purpose:
1. Map list-related format codes
2. Understand nesting behavior
3. Document mixed list handling
4. Verify hierarchy preservation
5. Identify format type differences

### 7.2 Metadata Content Test
```
Text with color
Text with background color
Text with different font size
Text with different font family
```

Purpose:
1. Decode metadata format_data field
2. Map additional format attributes
3. Understand style information storage
4. Document metadata patterns

## 8. Implementation Strategy

### 8.1 Current Approach
1. Decompress content
2. Parse main structure
3. Extract text content
4. Process format segments
5. Apply formatting
6. Handle metadata

### 8.2 Required Improvements
1. Complete format type mapping
2. Metadata field decoding
3. List handling implementation
4. Style processing
5. Edge case handling

## 9. Next Steps

1. Execute Format Types test case
2. Analyze list formatting patterns
3. Document metadata structure
4. Map remaining format codes
5. Verify handling of all cases
6. Create comprehensive format map
7. Document edge cases
8. Develop parser improvements

## 10. Research Methods

1. Test case execution
2. Protobuf analysis
3. Pattern identification
4. Format mapping
5. Metadata decoding
6. Implementation verification

This document represents our current understanding and research plan. The next instance should continue with the Format Types test case and focus on mapping list-related format codes and metadata structure.

End of research state document.
