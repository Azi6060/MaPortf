/// <reference types="node" />
import { z } from 'zod';

const EnvSchema = z.object({
  GROQ_API_KEY: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(8787),
  RAG_DATA_DIR: z.string().default('rag_data'),
  GROQ_MODEL: z.string().default('llama-3.1-8b-instant'),
});

export type Env = z.infer<typeof EnvSchema>;

export function loadEnv(): Env {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid environment variables:\n${msg}`);
  }
  return parsed.data;
}

