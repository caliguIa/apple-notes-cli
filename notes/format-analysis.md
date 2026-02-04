# Apple Notes Format Analysis State (2024-11-10)

## Data Structure Patterns
1. Format metadata appears as Unicode strings in note content
2. Two observed header patterns:
   - `14 18 01 4a 10`
   - `18 01 4a 10`

## Format Signatures
1. Bold:
```
14 18 01 4a 10 2e fffd fffd 41 fffd fffd 40 6b fffd fffd 26 48 fffd
Key markers: 2e, 41, 40, 6b
```

2. Italic:
```
18 01 4a 10 0f fffd fffd fffd 3c fffd 4f fffd fffd 7b 43 fffd fffd fffd 6c 55
Key markers: 0f, 3c, 4f, 7b
```

3. Underline:
```
18 01 4a 10 3f fffd fffd 73 3bb 4b fffd fffd fffd fffd 6f 00 fffd 64 2d
Key markers: 3f, 73, 4b, 6f
```

4. Mixed Formats:
```
18 01 4a 10 fffd 59 fffd fffd 34 5e 45 fffd fffd 3c fffd fffd fffd 4e 51 0c
Key markers: 59, 34, 5e, 45
```

## Key Observations
1. `fffd` appears frequently - likely escape/delimiter
2. Format metadata missing in some cases (Test 10, combined formats)
3. Each format type has unique byte patterns
4. Metadata appears at end of note content
5. Multiple format strings can appear in sequence

## Current Understanding
1. Format info stored as binary data in protobuf-like structure
2. Appears to use custom encoding for format positions
3. May use variable-length encoding
4. Format data might be compressed or encrypted
5. Position information possibly encoded in patterns

## Open Questions
1. How are combined formats encoded?
2. What determines presence/absence of format metadata?
3. Purpose of duplicate format strings
4. Meaning of varying header types (14 vs 18)
5. Role of repeated fffd patterns

## Failed Approaches
1. Simple protobuf message parsing
2. Fixed-length format block parsing
3. Nested message structure assumptions

## Next Steps
1. Investigate byte patterns between format markers
2. Analyze position encoding in format blocks
3. Study relationship between text length and format data
4. Examine multiple format combination encoding
5. Map fffd patterns to text structure

## Test Cases Status
- Single formats working
- Combined formats need investigation
- Length variations need study
- Position encoding unclear
- Header validation needs refinement

## Raw Data Preservation
Full test outputs and patterns stored in chat history for reference.
