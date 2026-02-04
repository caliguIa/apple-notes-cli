# Apple Notes Format Analysis - Series 1 Results

## Format Type Codes (Field 2 in segments)

Discovered patterns from each test:
```
0: Base text/no format
1: Format boundary marker
2-7: Control sequences
8: Bold text segment
9: Unknown/separator
10: Unknown/control
16: Format block marker
```

## Position Structure

### Position Block Pattern:
```protobuf
Position {
  1: {
    1: segment_type (0 = root, 1 = formatted)
    2: offset_position
  }
  2: content_length
  3: {
    1: format_type
    2: format_position
  }
  4: format_flag (optional)
  5: sequence_id
}
```

### Key Findings:
1. Every format has three position components:
   - Base position (where in the text)
   - Length (how many characters)
   - Format position (where in the format chain)

2. Overlapping formats use multiple segments with different format positions
   - Test A1 shows bold+italic overlap
   - Each format gets its own segment
   - Format positions track layering

3. Zero-width boundaries are marked explicitly
   - Field 2 = 1 for boundaries
   - Used between format transitions

## Metadata Structure

### Metadata Block Pattern:
```protobuf
MetadataBlock {
  1: format_type
  2: {
    3: state_flag (consistently 1)
    9: format_data (binary blob)
  }
  5: format_parameter (optional)
  13: timestamp (optional)
}
```

### Format Parameters (Field 5):
```
0: Default state
1: Primary format
2: Secondary format
3: Tertiary format/combined
```

## Test Case Analysis

### Test A1 (Overlapping Bold/Italic)
- Bold and italic each get separate segments
- Overlapping region has both format types
- Format positions preserve order of application

### Test A2 (Triple Format)
- Each format type gets unique identifier
- Format parameters track layering (1,2,3)
- Timestamps track application order

### Test A3 (Format Boundaries)
- Zero-width markers between formats
- Clean separation between format types
- No overlap handling needed

### Test A4 (Mid-word Formatting)
- Position tracking handles sub-word chunks
- Format boundaries can split words
- Character-level precision in position data

### Test A5 (Nested Formats)
- Outer format wraps completely
- Inner format has higher format position
- Clean nesting in metadata structure

## Format Resolution Rules

1. Base Text Segmentation:
   ```
   Text -> Base Segments -> Format Application
   ```

2. Format Application:
   ```
   Format -> Position Block -> Metadata Block
   ```

3. Format Layering:
   ```
   Primary (1) -> Secondary (2) -> Tertiary (3)
   ```

## Validation Rules

1. Every format segment requires:
   - Valid position block
   - Format type code
   - Sequence ID

2. Format boundaries must:
   - Have zero width
   - Mark transitions
   - Maintain sequence

3. Metadata must have:
   - Format type
   - State flag
   - Format data
   - Parameter (optional)

## Complete Picture

The format system uses:
1. Character-level positioning
2. Explicit format boundaries
3. Layered format application
4. Metadata tracking
5. Sequence preservation

Next Steps:
1. Test complex combinations
2. Verify edge cases
3. Document all format codes
4. Map metadata parameters
5. Test non-text content

Would you like me to design any specific test cases to verify these findings or explore any particular aspect in more detail?