import { z } from "zod";
import { serializableNoteSchema } from "./noteSchemas.ts";

export const noteViewDataSchema = z.object({
  notes: z.array(serializableNoteSchema),
  searchTerm: z.string().optional(),
  totalCount: z.number().int().positive().optional(),
});

export const viewResultSchema = z.object({
  content: z.string(),
  exitCode: z.number().int().min(0).max(1),
});

export type NoteViewData = z.infer<typeof noteViewDataSchema>;
export type ViewResult = z.infer<typeof viewResultSchema>;
