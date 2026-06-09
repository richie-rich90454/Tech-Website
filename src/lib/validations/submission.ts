import { z } from 'zod';

export const submissionSchema = z.object({
  techname: z.string().min(1, 'Tool name is required'),
  link: z.string().min(1, 'Link is required'),
  displaytext: z.string().min(1, 'Display text is required'),
  tl1_desc: z.string().optional().default(''),
  tl2_desc: z.string().optional().default(''),
  tl3_desc: z.string().optional().default(''),
  tl4_desc: z.string().optional().default(''),
  username: z.string().optional().default(''),
  contact: z.string().optional().default(''),
  // Domain checkboxes - these will come as string "true" or undefined
  R: z.string().optional(),
  TP: z.string().optional(),
  MT: z.string().optional(),
  AR: z.string().optional(),
  U: z.string().optional(),
  MDL: z.string().optional(),
  RA: z.string().optional(),
  RoTech: z.string().optional(),
  LS: z.string().optional(),
  RoThink: z.string().optional(),
  EoST: z.string().optional(),
  EF: z.string().optional(),
  RTE: z.string().optional(),
  DLoI: z.string().optional(),
  RaAoC: z.string().optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;