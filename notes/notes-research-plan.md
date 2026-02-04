# Apple Notes Format Research Plan

## Current Knowledge Gaps

### 1. Format Type Codes
- We've identified some codes (8=Bold, 11=Italic, 15=Underline)
- Missing:
  - Strikethrough code
  - Monospace/code formatting
  - Heading levels
  - List types (bullet vs numbered)
  - Table formatting
  - Color codes (text and background)
  - Link formatting

### 2. Position Calculation
- Unclear how positions are calculated for:
  - Overlapping formats
  - Format boundaries
  - Unicode characters
  - Line breaks
  - List indentation

### 3. Metadata Structure
- Uncertain about:
  - Purpose of field 5 values
  - Meaning of different state flags
  - Format-specific data in field 2.9
  - Relationship between timestamps

### 4. Special Content Types
- Limited understanding of:
  - Checklist structure
  - Table format
  - Code blocks
  - Quote blocks
  - Attachments
  - Links
  - Images

## Proposed Test Cases

### Series 1: Basic Format Combinations
```
Test A1: Overlapping bold and italic
Text: "This is **bo*ld and ita*lic**"

Test A2: Triple format
Text: "This is ***bold, italic, and underlined***"

Test A3: Format boundaries
Text: "**Bold** *right* next to each other"
```

### Series 2: Unicode and Special Characters
```
Test B1: Unicode formatting
Text: "Unicode: **漢字** and *емоджи* test"

Test B2: Emoji in formats
Text: "Emoji test: **🌟 Star** and *🌍 Globe*"

Test B3: Special characters
Text: "Special: **\n\t** chars"
```

### Series 3: Lists and Structure
```
Test C1: Bullet list with formatting
• **Bold item**
• *Italic item*
  • Nested item

Test C2: Numbered list with mixed formats
1. **First** item
2. *Second* item
   1. Nested **bold**
   
Test C3: Mixed list types
• Bullet 1
1. Number 1
  • Nested bullet
```

### Series 4: Complex Structures
```
Test D1: Table with formatting
| **Header 1** | *Header 2* |
| Cell 1       | Cell 2     |

Test D2: Code block with inline formats
```code
**Bold** in code
```

Test D3: Quote block
> Quote with **bold** and *italic*
```

### Series 5: Special Content
```
Test E1: Checklist with formats
☐ **Unchecked bold**
☑ *Checked italic*

Test E2: Links
[**Bold link**](http://example.com)
Regular [*italic link*](http://example.com)

Test E3: Mixed content
• List with [link](http://example.com)
> Quote with checklist
☐ **Task in quote**
```

## Data Collection Requirements

For each test case we need:
1. Raw protobuf binary data
2. Location of format markers
3. All metadata blocks
4. Timestamp patterns
5. State flags used

## Analysis Approach

1. For each test case:
   - Create note with exact content
   - Export protobuf data
   - Decode using existing tools
   - Document all field values
   - Note any new patterns

2. Cross-reference between tests:
   - Compare format codes
   - Check position calculations
   - Verify metadata patterns
   - Document new findings

3. Focus on discrepancies:
   - Unexpected field values
   - New format codes
   - Position calculation anomalies
   - Metadata variations

## Success Criteria

We'll consider our understanding complete when we can:
1. Predict format codes for all styles
2. Explain position calculation logic
3. Understand all metadata fields
4. Parse complex mixed content
5. Explain timestamp patterns

## Next Steps

1. Create all Series 1 test cases
2. Document raw protobuf for each
3. Analyze patterns
4. Update our format hypothesis
5. Move to next series if patterns confirmed

Would you like me to prepare any specific series of these test cases first?
