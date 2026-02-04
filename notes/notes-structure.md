# Apple Notes Content Structure

## Basic Layout
1. Content is gzip compressed
2. First level contains a main content block in field 2
3. Main content block contains field 3 messages with the actual content and metadata

## Content Fields
- Text content is stored in field 2 of the first field 3 message
- Multiple lines are stored as a single text block, separated by newlines
- Content appears to be UTF-8 encoded

## Metadata Fields
1. **Version Information**
   - Format version appears to be 835054
   - Stored as a varint in the first metadata block

2. **Timestamps** (stored as Unix timestamps)
   - Create time: Initial creation timestamp 
   - Modify time: First modification timestamp
   - Other timestamps: Appears to track multiple modifications/updates
   - All timestamps are within a few seconds for this new note

3. **Type Flags**
   - Value 67 appears twice
   - Might indicate note type or content type
   - Could be related to formatting or capabilities

4. **State Flags**
   - Value 1 appears five times
   - Likely indicates various state properties of the note
   - Could be related to sync status, visibility, or other boolean states

5. **References**
   - 64-bit value: 12199706350625231890
   - Could be:
     - Reference to another note
     - Internal identifier
     - UUID in different format
     - Database reference

## Order of Operations
1. Content is compressed with gzip
2. Main structure is a protobuf message
3. Content and metadata are stored in separate field 3 messages
4. First field 3 message contains the actual note content
5. Subsequent field 3 messages contain metadata
6. Timestamps track creation and modifications

## Interesting Observations
1. The format appears to support multiple types of metadata in the same note
2. Multiple timestamps suggest detailed modification tracking
3. The type flags (67) appear exactly twice, suggesting paired markers
4. State flags (1) appear five times, suggesting multiple tracked states
5. Reference value is consistent throughout a note
