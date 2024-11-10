import { z } from "zod";

export const noteItemSchema = z.object({
  text: z.string(),
  isChecked: z.boolean(),
  level: z.number().int().min(0),
  isChecklistItem: z.boolean(),
});

export const noteSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  snippet: z.string().nullable(),
  identifier: z.string().uuid(),
  modified_date: z.string(), // SQLite datetime string
  content: z.instanceof(Uint8Array).nullable(),
  has_checklist: z.number().min(0).max(1),
});

export const searchParamsSchema = z.object({
  term: z.string(),
  limit: z.number().int().positive().default(20),
  offset: z.number().int().min(0).default(0),
});

export type NoteItem = z.infer<typeof noteItemSchema>;
export type NoteType = z.infer<typeof noteSchema>;
export type SearchParams = z.infer<typeof searchParamsSchema>;
