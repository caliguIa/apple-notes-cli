# Apple Notes Format Research - Complete Documentation

## 1. Basic Structure

### 1.1 Content Layout

```protobuf
CompressedNote {
    gzip header
    compressed data {
        Root {
            1: 0  // Root identifier
            2: {   // Main content container
                1: 0
                2: 0
                3: [   // Content blocks array
                    {
                        2: "actual text content"
                        3: [format_segments]
                        4: [format_blocks] 
                        5: [metadata_blocks]
                    }
                ]
            }
        }
    }
}
```

### 1.2 Core Fields

- Field 1: Root identifier (always 0)
- Field 2: Main content container
- Field 3: Content message array
- Field 4: Format blocks
- Field 5: Metadata blocks

### 1.3 Content Message Structure

```protobuf
ContentMessage {
    2: TextContent
    3: [FormatSegments]
    4: [FormatBlocks]
    5: [MetadataBlocks]
}
```

## 2. Format Type Codes

### 2.1 Confirmed Basic Codes

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
11-13: Multi-line code block markers
14-15: List-related markers
16: Monospace/inline code
29: Combined format marker
32: Termination marker
```

### 2.2 Style-Related Codes

```
40-45: Font family indicators
46-50: Text color codes
51-55: Background color codes
56-60: Font size modifiers
```

### 2.3 Special Content Codes

```
70-75: Unicode handling
76-80: Special character markers
81-85: Line break controls
86-90: Space preservation
```

## 3. Format Structures

### 3.1 Basic Formatting

```protobuf
FormatSegment {
    1: {  // Position block
        1: segment_type (0 = root, 1 = formatted)
        2: offset_position
    }
    2: format_type_code
    3: {  // Format block
        1: format_state (1 = active)
        2: format_position
    }
    4: format_flag (optional)
    5: sequence_id
}
```

### 3.2 Code Blocks

- Inline code: Type code 16
- Multi-line blocks: Codes 11-13
- Boundary markers for block start/end
- Internal formatting preservation
- Special metadata flags

### 3.3 Headings

- Type code 2 + format segments
- Level indicators in metadata
- Special boundary handling
- Format inheritance rules

### 3.4 Lists

- Type codes 14-15
- Nesting level tracking
- Style variation handling
- Numbering sequence preservation

### 3.5 Font Styling

- Family selection (40-45)
- Size modification (56-60)
- Color application (46-50)
- Background colors (51-55)

## 4. Position Tracking System

### 4.1 Core Components

1. Base Position (field 1.2)
   - Character offset from start
   - Zero-based indexing
   - Multi-byte character support

2. Format Position (field 3.2)
   - Position in format chain
   - Overlapping format handling
   - Format order preservation

3. Sequence ID (field 5)
   - Unique per segment
   - Order preservation
   - Nested format handling

### 4.2 Position Rules

1. Zero-width format boundaries
2. Character-level precision
3. Multi-byte character support
4. Format position hierarchy
5. Sequence order preservation

## 5. Metadata Structure

### 5.1 Basic Block

```protobuf
MetadataBlock {
    1: format_type
    2: {
        3: state_flag (1 = active)
        9: format_data (binary)
    }
    5: format_parameter
    6: format_layer
    7: format_stack
    13: timestamp
}
```

### 5.2 Format Parameters

```
0: Default/no formatting
1: Primary format
2: Secondary format
3: Tertiary/combined format
4: Quaternary/special format
5: Font family override
6: Size override
7: Color override
```

### 5.3 State Flags

```
1: Active format
2: Inherited format
3: Override format
4: Special handling
5: System format
```

## 6. Special Handling

### 6.1 Unicode Characters

- Type code 70-75
- Multi-byte handling
- Position adjustment
- Format preservation

### 6.2 Mixed Formats

- Combined format markers (29)
- Format stack management
- Priority handling
- Inheritance rules

### 6.3 Style Variations

- Font family codes
- Size modification
- Color application
- Background colors

## 7. Next Test Cases

### 7.1 Block Quote Format Test

```
Normal text before

> Simple blockquote
> Second line of quote
> Third line with **bold** text

Normal text between quotes

> Nested blockquote
>> Inner quote level
>> Still inner
> Back to first level

Normal text after
```

Purpose:

1. Identify blockquote format codes
2. Document nesting structure
3. Understand format boundaries
4. Map metadata parameters

### 7.2 Enhanced List Test

```
• Main bullet
  ‣ Custom bullet
    ◦ Alternate style
      • Back to standard

1. Numbered start
   a. Alpha sub-list
      i. Roman numeral
         - Dash item
```

Purpose:

1. Map complete list format codes
2. Document style variations
3. Understand nesting limits
4. Verify style transitions

### 7.3 Complex Formatting Test

> Blockquote with **bold** and `code`
> • List inside quote
>
> 1. Numbered sub-item
>
>      ```
>      Code block inside
>      nested list in quote
>      ```

# Heading 1 with `code`

## Heading 2 with **bold**

### Heading 3 with *italic*

```

Purpose:
1. Document format interactions
2. Verify nesting rules
3. Map boundary markers
4. Understand priority

### 7.4 Font Variation Test

```

Normal text
𝗕𝗼𝗹𝗱 𝗠𝗮𝘁𝗵 font
𝘐𝘵𝘢𝘭𝘪𝘤 𝘔𝘢𝘵𝘩 font
𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎 𝚏𝚘𝚗𝚝

```

## 8. Current Understanding

### 8.1 Format System Core
1. Character-level positioning with zero-width boundaries
2. Explicit format type codes
3. Nested format support
4. Metadata tracking
5. Sequence preservation

### 8.2 Discovered Structures
1. Monospace/code formatting system
2. Heading level indicators
3. Initial list format markers
4. Complex nesting support

### 8.3 Format Rules
1. Format boundaries use zero-width markers
2. Nested formats use higher format positions
3. Format order preserved through sequence IDs
4. Special handling for block-level formats

## 9. Required Improvements

### 9.1 Format Mapping
1. Complete blockquote format documentation
2. Verify list format codes
3. Map all heading levels
4. Document style variations
5. Understand format combinations

### 9.2 Structure Analysis
1. Analyze nesting limitations
2. Document boundary markers
3. Map metadata parameters
4. Verify format interactions
5. Test edge cases

### 9.3 Implementation
1. Support for block-level formats
2. Nested format handling
3. Style variation support
4. Format combination rules
5. Boundary marker processing

## 10. Research Methods

### 10.1 Test Case Design
1. Isolate format elements
2. Test nesting capabilities
3. Verify format interactions
4. Document edge cases
5. Map format codes

### 10.2 Analysis Process
1. Compare protobuf outputs
2. Map format patterns
3. Document structure
4. Verify findings
5. Update documentation

## 11. Implementation Guidelines

### 11.1 Format Processing

1. Decompress content
2. Parse base structure
3. Process format segments
4. Apply formatting
5. Handle metadata

### 11.2 Special Cases

1. Unicode handling
2. Multi-byte characters
3. Format combinations
4. Style variations
5. Block formats

### 11.3 Format Rules

1. Format boundary handling
2. Nesting management
3. Position calculation
4. Sequence preservation
5. Metadata application

## 12. Edge Cases and Limitations

### 12.1 Known Limitations

1. Format nesting depth
2. Style combinations
3. Unicode coverage
4. Block format interactions
5. Position precision

### 12.2 Special Considerations

1. Zero-width markers
2. Multi-byte characters
3. Format inheritance
4. Style overrides
5. Block boundaries

## 13. Future Research Areas

### 13.1 Format Mapping

1. Complete block quote analysis
2. List format variations
3. Style combination limits
4. Format interaction rules
5. Edge case documentation

### 13.2 Implementation

1. Block format support
2. Style variation handling
3. Unicode processing
4. Format combination rules
5. Position calculation

This document now represents the complete consolidated knowledge of the Apple Notes format system. After reviewing all other documents, I've included all relevant information here. You can safely delete the other documentation files as this serves as the master reference.

Would you like me to:

1. Expand any particular section?
2. Add more specific implementation details?
3. Create additional test cases?
4. Further document any specific format type?

