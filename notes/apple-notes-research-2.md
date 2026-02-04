# Apple Notes Format Research - Complete Documentation

[Previous content sections 1-5 remain exactly the same through "5.4 State Flags"]

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

## 7. Knowledge Gaps

### 7.1 Critical Gaps
1. Core Fields
   - Purpose of field 2.1 and 2.2 (always 0)
   - Full understanding of the varying values in field 4's structure

2. Format Markers
   - Type code 32's specific purpose
   - Significance of format_position values in field 3.2
   - Reason for optional format_flag (field 4:1)

3. Metadata System
   - Field 5 variations beyond basic states
   - Relationship between multiple metadata blocks
   - Correlation between fields 5.1 and type codes

### 7.2 Secondary Gaps
1. Position System
   - Calculation method for overlapping format positions
   - Pattern significance in position values

2. Format States
   - Complete range of valid state combinations
   - Purpose of different format state values

## 8. Implementation Notes

### 8.1 Format Processing
1. Decompress content
2. Parse base structure
3. Process format segments
4. Apply formatting
5. Handle metadata

### 8.2 Special Cases
1. Unicode handling
2. Multi-byte characters
3. Format combinations
4. Style variations
5. Block formats

### 8.3 Format Rules
1. Format boundary handling
2. Nesting management
3. Position calculation
4. Sequence preservation
5. Metadata application

## 9. Edge Cases and Limitations

### 9.1 Known Limitations
1. Format nesting depth
2. Style combinations
3. Unicode coverage
4. Block format interactions
5. Position precision
6. No support for nested blockquotes
7. No support for inline code in checklists
8. No support for custom list styles (alpha, roman)
9. No support for inline checklists
10. Format combinations have specific restrictions

### 9.2 Special Considerations
1. Zero-width markers
2. Multi-byte characters
3. Format inheritance
4. Style overrides
5. Block boundaries

## 10. Verified Behaviors
1. Universal format block contains constant magic number
2. Blockquotes use flat structure
3. Checklists require special metadata
4. Position tracking is character-precise
5. Format states are preserved through metadata

## 11. Future Research Areas

### 11.1 Format Mapping
1. Complete block quote analysis
2. List format variations
3. Style combination limits
4. Format interaction rules
5. Edge case documentation

### 11.2 Implementation
1. Block format support
2. Style variation handling
3. Unicode processing
4. Format combination rules
5. Position calculation

### 11.3 Test Cases
1. Complex Format Tests:
```
> Blockquote with **bold** and `code`
> • List inside quote
>
> 1. Numbered sub-item
>
>    ```
>    Code block inside
>    nested list in quote
>    ```
```

2. Font Variation Tests:
```
Normal text
𝗕𝗼𝗹𝗱 𝗠𝗮𝘁𝗵 font
𝘐𝘵𝘢𝘭𝘪𝘤 𝘔𝘢𝘵𝘩 font
𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎 font
```

3. Edge Case Tests:
- Format boundary interactions
- Unicode handling
- Multi-byte character positioning
- Style inheritance chains
- Format state transitions

