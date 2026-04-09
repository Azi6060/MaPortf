export type SourceChunk = {
  id: string;
  file: string;
  startLine: number;
  endLine: number;
  text: string;
};

export type RetrievalHit = {
  chunk: SourceChunk;
  score: number;
};

