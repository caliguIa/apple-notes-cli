# Apple Notes Research Guide

## Further Analysis Techniques

### Metadata Pattern Analysis
1. **Data Collection**
   - Create a large dataset of notes with different:
     - Formatting (bold, italic, lists)
     - Types (text, checklists, attachments)
     - States (encrypted, shared, pinned)
   - Record all metadata for each note
   - Record all user actions that modify notes

2. **Pattern Identification**
   - Track format version changes across updates
   - Map type flags (67) to note capabilities
   - Map state flags (1) to note states
   - Track timestamp patterns
   - Analyze reference relationships

3. **Tools Needed**
   - Database for metadata collection
   - Pattern analysis software
   - Protobuf comparison tools
   - Timestamp correlation tools

### Tracking Metadata Changes
1. **Setup Required**
   - Create note snapshots before/after actions
   - Monitor database changes
   - Track sync operations

2. **Actions to Monitor**
   - Note creation
   - Content modifications
   - Format changes
   - Share operations
   - Sync operations
   - Deletion/recovery

3. **Data Points to Track**
   - Timestamp sequences
   - Flag changes
   - Reference modifications
   - Format version updates

### Understanding Flag Combinations
1. **Testing Methodology**
   - Create controlled test cases
   - Modify one attribute at a time
   - Record all flag changes
   - Map flags to UI states

2. **Key Areas to Test**
   - Note formatting options
   - Sharing states
   - Sync states
   - Attachment states
   - Protection states

3. **Analysis Tools Needed**
   - Flag combination tracker
   - State transition mapper
   - UI state correlator
   - Change validation tools

## Research Tools
1. **Required Software**
   - Protobuf decoder
   - Binary comparison tool
   - Database monitor
   - Pattern recognition software

2. **Development Tools**
   - Protocol buffer compiler
   - Binary analysis tools
   - Database inspection tools
   - Hex editor

3. **Testing Environment**
   - Multiple Apple devices
   - Different iOS/macOS versions
   - Various note types
   - Different sharing scenarios

## Documentation
1. **Record Keeping**
   - Document all test cases
   - Map flag combinations
   - Track version changes
   - Document correlations

2. **Pattern Documentation**
   - Flag patterns
   - Timestamp sequences
   - Reference relationships
   - Version changes
