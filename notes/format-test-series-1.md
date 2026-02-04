# Apple Notes Format Test Series - Basic Format Combinations

## Setup Instructions
1. Create each test in a fresh note
2. Don't add any extra spaces or lines beyond what's shown
3. Save each note immediately after creation
4. Title each note exactly as shown

## Test A1: Overlapping Bold/Italic
Title: "Format Test A1: Overlap"
Content:
```
This is **bo*ld and ita*lic**
```
Expected formatting:
- "bo" should be bold only
- "ld and ita" should be both bold and italic
- "lic" should be bold only

## Test A2: Triple Format
Title: "Format Test A2: Triple"
Content:
```
Normal ***triple formatted*** normal
```
Apply in this order:
1. First make the text bold
2. Then add italic
3. Finally add underline
Expected: "triple formatted" should have all three formats

## Test A3: Format Boundaries
Title: "Format Test A3: Boundaries"
Content:
```
**Bold** *italic* __underline__
```
No spaces between the formatted sections.
Expected: Three formatted sections directly adjacent

## Test A4: Mid-word Formatting
Title: "Format Test A4: Mid-word"
Content:
```
For**mat**ting mid*wo*rd under_li_ne
```
Expected: Format boundaries within words

## Test A5: Nested Formats
Title: "Format Test A5: Nested"
Content:
```
**Outer *inner* outer**
```
Expected: 
- "Outer" (both instances) should be bold only
- "inner" should be both bold and italic

## Data Collection
For each test case, we need:
1. Export the note data to capture protobuf structure
2. Document any UI anomalies or unexpected behavior
3. Note if any formats fail to apply as expected

## What We're Looking For
1. How format boundaries are marked in the protobuf
2. Whether overlapping formats use special indicators
3. Order dependency in format application
4. Position calculation for mid-word formatting
5. Treatment of zero-width boundaries between formats

Would you like me to prepare any of these tests in a different way or would you like additional test cases focusing on specific aspects?

Remember to test each case in isolation to keep the protobuf data clean and comparable. Let me know when you have the results and we can analyze the patterns.