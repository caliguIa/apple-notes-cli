# Apple Notes Format Analysis - Complex Test Results

## 1. Field Type Code Mapping (Field 2 in segments)

Confirmed codes from test outputs:
```
0: Root/container segment
1: Format boundary marker  
2: Text content container
3: Format block marker
4: Format sequence start
5: Format delimiter
6-7: Nested format markers
8: Bold text
9: Format separator
10: Format chunk marker
15: Unicode/special char marker
16: Formatting container
29: Combined format marker
32: Termination marker
```

## 2. Position Structure Discovery
Each format segment uses a consistent structure:
```protobuf
Segment {
  1: {
    1: segment_type (0 = root, 1 = format)
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

## 3. Format Layering System

### Test C1 (Mixed Formats) reveals:
1. Each format gets its own sequential segments
2. Overlapping formats use shared position references
3. Sequence IDs (field 5) maintain format order
4. Field 4 (format_flag) marks active formatting

### Test C2 (Boundaries) shows:
1. Zero-width markers between formats
2. Clear format transition points
3. Position tracking for adjacent formats
4. Format stack management

### Test C4 (Unicode/Special) demonstrates:
1. Special character handling with type 15
2. Multi-byte character position tracking
3. Line break preservation
4. Tab character handling

### Test C5 (Maximum Formats) reveals:
1. Multiple concurrent formats supported
2. Format layering with type 29
3. Complex position tracking
4. Format termination with type 32

## 4. Metadata Block Structure

```protobuf
MetadataBlock {
  1: format_type
  2: {
    3: state_flag (1 = active)
    9: format_data (binary)
  }
  5: format_parameter (optional)
  6: format_layer (optional)
  7: format_stack (optional)
  13: timestamp
}
```

### Parameter Values (Field 5):
```
1: Primary format
2: Secondary format
3: Tertiary format/combined
```

## 5. Key Implementation Rules

1. Format Boundaries:
   - Always marked with type 1 segments
   - Have zero width (offset = 0)
   - Maintain sequence order

2. Format Layering:
   - Each format gets unique segments
   - Layer order tracked by sequence IDs
   - Combined formats use type 29

3. Position Tracking:
   - Character-level precision
   - Handles multi-byte characters
   - Maintains format boundaries
   - Supports nested formats

4. Special Cases:
   - Unicode: Uses type 15 marker
   - Line breaks: Preserved in position data
   - Tabs: Treated as single characters
   - Empty formats: Valid but zero width

## 6. Format Application Order

1. Base format segments created
2. Format boundaries marked
3. Format layers applied
4. Position references updated
5. Metadata blocks added
6. Sequence IDs assigned

## 7. Validation Requirements

1. Format segments must have:
   - Valid position data
   - Format type code
   - Sequence ID
   - Format flag if active

2. Format boundaries require:
   - Zero width markers
   - Clear transitions
   - Proper sequence

3. All formats need:
   - Metadata blocks
   - State flags
   - Format parameters
   - Timestamps

## Outstanding Questions

1. Maximum format combinations supported
2. Purpose of some format type codes (6,7)
3. Complete metadata format_data structure
4. Format stack limitations
5. Format type precedence rules

Would you like me to focus on any particular aspect for additional testing, or should we design more targeted test cases to resolve the remaining questions?