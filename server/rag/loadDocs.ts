import fs from 'node:fs/promises';
import path from 'node:path';

import { chunkTextByParagraphs } from './chunk.js';
import type { SourceChunk } from './types.js';

const DOC_EXTS = new Set(['.md', '.txt']);

async function listFilesRecursive(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await listFilesRecursive(p)));
    } else if (e.isFile()) {
      if (DOC_EXTS.has(path.extname(e.name).toLowerCase())) out.push(p);
    }
  }
  return out;
}

export async function loadRagChunks(params: { dataDir: string }): Promise<SourceChunk[]> {
  const { dataDir } = params;
  const abs = path.resolve(dataDir);
  const files = await listFilesRecursive(abs);

  const chunks: SourceChunk[] = [];
  for (const f of files) {
    const content = await fs.readFile(f, 'utf8');
    const rel = path.relative(process.cwd(), f).replace(/\\/g, '/');
    chunks.push(
      ...chunkTextByParagraphs({
        file: rel,
        content,
        maxChars: 1200,
        overlapChars: 120,
      })
    );
  }
  return chunks;
}

