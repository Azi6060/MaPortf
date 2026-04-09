import crypto from 'node:crypto';

import type { SourceChunk } from './types.js';

function stableId(input: string) {
  return crypto.createHash('sha1').update(input).digest('hex').slice(0, 16);
}

export function chunkTextByParagraphs(params: {
  file: string;
  content: string;
  maxChars?: number;
  overlapChars?: number;
}): SourceChunk[] {
  const { file, content, maxChars = 1200, overlapChars = 120 } = params;

  // Preserve line numbers for citations.
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const paras: { startLine: number; endLine: number; text: string }[] = [];

  let start = 1;
  let buf: string[] = [];

  const flush = (endLine: number) => {
    const text = buf.join('\n').trimEnd();
    if (text.trim().length === 0) return;
    paras.push({ startLine: start, endLine, text });
  };

  for (let i = 0; i < lines.length; i++) {
    const lineNo = i + 1;
    const line = lines[i];
    const isBlank = line.trim().length === 0;
    buf.push(line);
    if (isBlank) {
      flush(lineNo);
      buf = [];
      start = lineNo + 1;
    }
  }
  flush(lines.length);

  // Merge/split paragraphs into chunks by char budget.
  const chunks: SourceChunk[] = [];
  let current = '';
  let currentStart = 1;
  let currentEnd = 1;

  const pushChunk = () => {
    const text = current.trim();
    if (!text) return;
    const id = stableId(`${file}:${currentStart}-${currentEnd}:${text.slice(0, 200)}`);
    chunks.push({ id, file, startLine: currentStart, endLine: currentEnd, text });
  };

  for (const p of paras) {
    const candidate = current ? `${current}\n\n${p.text}` : p.text;
    if (candidate.length <= maxChars) {
      if (!current) currentStart = p.startLine;
      current = candidate;
      currentEnd = p.endLine;
      continue;
    }

    // Current is full; push it.
    pushChunk();

    // Start new chunk with overlap from previous.
    const overlap = current ? current.slice(Math.max(0, current.length - overlapChars)) : '';
    current = overlap ? `${overlap}\n\n${p.text}` : p.text;
    currentStart = p.startLine;
    currentEnd = p.endLine;

    // If a single paragraph is huge, hard-split it.
    while (current.length > maxChars) {
      const part = current.slice(0, maxChars);
      const id = stableId(`${file}:${currentStart}-${currentEnd}:${part.slice(0, 200)}`);
      chunks.push({ id, file, startLine: currentStart, endLine: currentEnd, text: part.trim() });
      current = current.slice(maxChars - overlapChars);
    }
  }

  pushChunk();
  return chunks;
}

