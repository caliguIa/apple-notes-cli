# Apple Notes Format Research - Current State and Next Steps

[Previous content remains unchanged until Format Type Codes section]

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
15: Unicode/special char marker
16: Monospace/inline code
29: Combined format marker
32: Termination marker
```

### 2.2 Newly Discovered Codes
```
11-13: Multi-line code block markers
14-15: List-related format indicators (needs verification)
16: Monospace/inline code text
```

### 2.3 Position/Structure Related
```
1: Format boundary (zero-width)
2: Content block start
3: Block marker
4: Sequence start marker
5: Format delimiter
```

## 3. Format Structures

### 3.1 Code Blocks
- Inline code uses type code 16
- Multi-line code blocks use sequence of 11-13 type codes
- Code blocks maintain internal formatting
- Special boundary markers for block start/end

### 3.2 Headings
- Use type code 2 followed by format segments
- Distinct metadata structure
- Level indicators in format parameters
- Special boundary handling

### 3.3 Lists (Partial Understanding)
- Type codes 14-15 appear related to list structures
- Special handling for nested levels
- Format parameters indicate level depth
- Specific metadata for list types

[Previous sections on Position Tracking System, Metadata Structure remain unchanged]

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
```
> Blockquote with **bold** and `code`
> • List inside quote
>   1. Numbered sub-item
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

[Previous sections remain unchanged]

This document will continue to be updated as new findings emerge from our ongoing research, particularly after analyzing the blockquote test results and conducting additional format tests.
