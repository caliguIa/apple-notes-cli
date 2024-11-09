import { z } from "zod";

export const databaseNoteSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  snippet: z.string().nullable(),
  identifier: z.string().uuid(),
  modified_date: z.string(), // SQLite datetime string
  content: z.instanceof(Uint8Array).nullable(),
  has_checklist: z.number().min(0).max(1),
});

// Serializable note schema (for JSON output)
export const serializableNoteSchema = databaseNoteSchema.extend({
  content: z.string().nullable(), // base64 encoded string
});

// Note item (parsed content) schema
export const noteItemSchema = z.object({
  text: z.string(),
  isChecked: z.boolean(),
  level: z.number().int().min(0),
  isChecklistItem: z.boolean(),
});

export const searchParamsSchema = z.object({
  term: z.string(),
  limit: z.number().int().positive().default(20),
  offset: z.number().int().min(0).default(0),
});

export type DatabaseNote = z.infer<typeof databaseNoteSchema>;
export type SerializableNote = z.infer<typeof serializableNoteSchema>;
export type NoteItem = z.infer<typeof noteItemSchema>;
export type SearchParams = z.infer<typeof searchParamsSchema>;
