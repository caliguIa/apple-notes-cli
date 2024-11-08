import { Database } from "jsr:@db/sqlite@0.12";
import { gunzip } from "jsr:@deno-library/compress";

function extractNoteContent(decompressedData: string, title: string): string {
  // Escape special characters in the title for regex
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Look for content between the title and the next control character
  const match = decompressedData.match(
    new RegExp(`${escapedTitle}\\n([\\s\\S]*?)(?:\\u001a|\\u0012|$)`),
  );
  if (match && match[1]) {
    return match[1].trim();
  }

  // If no match with title, try to find any content between markers
  const basicMatch = decompressedData.match(/\n([\s\S]*?)(?:\u001a|\u0012|$)/);
  if (basicMatch && basicMatch[1]) {
    return basicMatch[1].trim();
  }

  return "Content extraction failed";
}

function searchNotes(dbPath: string, searchTerm: string = "") {
  try {
    const db = new Database(dbPath);

    const notes = db.prepare(`
      SELECT 
        cs.Z_PK as id,
        cs.ZTITLE1 as title,
        cs.ZSNIPPET as snippet,
        cs.ZIDENTIFIER as identifier,
        datetime(cs.ZMODIFICATIONDATE1 + 978307200, 'unixepoch', 'localtime') as modified_date,
        nd.ZDATA as content
      FROM ZICCLOUDSYNCINGOBJECT cs
      LEFT JOIN ZICNOTEDATA nd ON cs.Z_PK = nd.ZNOTE
      WHERE 
        (cs.ZMARKEDFORDELETION = 0 OR cs.ZMARKEDFORDELETION IS NULL)
        AND (
          LOWER(cs.ZTITLE1) LIKE LOWER('%' || ? || '%')
          OR LOWER(cs.ZSNIPPET) LIKE LOWER('%' || ? || '%')
        )
      ORDER BY cs.ZMODIFICATIONDATE1 DESC
      LIMIT 20
    `).all([searchTerm, searchTerm]);

    // Process each note's content
    const processedNotes = notes.map((note) => {
      const result = {
        title: note.title,
        snippet: note.snippet,
        modified_date: note.modified_date,
        content: null as string | null,
      };

      if (note.content) {
        try {
          const decompressed = gunzip(new Uint8Array(note.content));
          const decompressedText = new TextDecoder().decode(decompressed);
          result.content = extractNoteContent(decompressedText, note.title);
        } catch (e) {
          console.error("Processing error:", e);
          result.content = null;
        }
      }

      return result;
    });

    if (processedNotes.length === 0) {
      console.log("\x1b[33mNo notes found matching your search.\x1b[0m");
      return;
    }

    console.log(
      `\nSearch results for "\x1b[36m${searchTerm || "all"}\x1b[0m":`,
    );
    processedNotes.forEach((note, index) => {
      console.log("\n\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m");
      console.log(`\x1b[1m${note.title}\x1b[0m`);
      console.log(`\x1b[90mModified: ${note.modified_date}\x1b[0m`);
      console.log("\n\x1b[37m" + (note.content || note.snippet) + "\x1b[0m");
    });

    console.log("\n\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m");
    console.log(
      `\x1b[32mFound ${notes.length} matching note${
        notes.length === 1 ? "" : "s"
      }\x1b[0m\n`,
    );
  } catch (error) {
    console.error("\x1b[31mError accessing database:", error, "\x1b[0m");
  }
}

const dbPath =
  "/Users/caligula/Library/Group Containers/group.com.apple.notes/NoteStore.sqlite";

if (import.meta.main) {
  const searchTerm = Deno.args[0] || "";
  searchNotes(dbPath, searchTerm);
}
