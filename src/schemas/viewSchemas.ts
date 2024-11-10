import { z } from "zod";
import { noteItemSchema } from "./noteSchemas.ts";

export const processedNoteSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  snippet: z.string().nullable(),
  identifier: z.string().uuid(),
  modified_date: z.string(),
  content: z.array(noteItemSchema),
  has_checklist: z.number().min(0).max(1),
});

export const noteViewDataSchema = z.object({
  notes: z.array(processedNoteSchema),
  searchTerm: z.string().optional(),
  totalCount: z.number().int().positive().optional(),
});

export const viewResultSchema = z.object({
  content: z.string(),
  exitCode: z.number().int().min(0).max(1),
});

export type ProcessedNote = z.infer<typeof processedNoteSchema>;
export type NoteViewData = z.infer<typeof noteViewDataSchema>;
export type ViewResult = z.infer<typeof viewResultSchema>;
