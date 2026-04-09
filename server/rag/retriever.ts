import { pipeline, env } from '@xenova/transformers';

import type { RetrievalHit, SourceChunk } from './types.js';

// Don't download model files that aren't needed
env.allowLocalModels = false;

export type Retriever = {
  search(query: string, k?: number): Promise<RetrievalHit[]>;
  chunkCount: number;
};

let embedder: Awaited<ReturnType<typeof pipeline>> | null = null;

async function getEmbedder() {
  if (!embedder) {
    // all-MiniLM-L6-v2: 22MB, fast, free, runs fully in Node via ONNX
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      quantized: true,
    });
  }
  return embedder;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function embed(texts: string[]): Promise<number[][]> {
  const model = await getEmbedder();
  const results: number[][] = [];
  for (const text of texts) {
    // Cast options to any to avoid @xenova/transformers overload conflicts
    const output = await model(text, { pooling: 'mean', normalize: true } as any);
    // Output is a Tensor — access raw float data via .data
    const tensor = output as unknown as { data: Float32Array };
    results.push(Array.from(tensor.data));
  }
  return results;
}

export async function buildEmbeddingRetriever(chunks: SourceChunk[]): Promise<Retriever> {
  console.log('[rag] embedding', chunks.length, 'chunks with all-MiniLM-L6-v2...');

  // Embed in batches to avoid memory spikes
  const BATCH = 32;
  const allVecs: number[][] = [];
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH).map((c) => c.text);
    const vecs  = await embed(batch);
    allVecs.push(...vecs);
    process.stdout.write(`\r[rag] embedded ${Math.min(i + BATCH, chunks.length)}/${chunks.length}`);
  }
  console.log('\n[rag] embedding complete');

  const search = async (query: string, k = 6): Promise<RetrievalHit[]> => {
    const q = query.replace(/\s+/g, ' ').trim().slice(0, 2000);
    if (!q) return [];

    const [qVec] = await embed([q]);

    const scored = allVecs.map((vec, i) => ({
      chunk: chunks[i],
      score: cosineSimilarity(qVec, vec),
    }));

    return scored
      .filter((h) => h.score > 0.05)
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  };

  return { search, chunkCount: chunks.length };
}
