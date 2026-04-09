import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import Groq from 'groq-sdk';

import { loadEnv } from './env.js';
import { loadRagChunks } from './rag/loadDocs.js';
import { buildEmbeddingRetriever } from './rag/retriever.js';

const env = loadEnv();

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: true }));

type ChatMessage = { role: 'user' | 'assistant'; content: string };

// ─── Context builder ──────────────────────────────────────────────────────────

function buildContextBlock(
  hits: { chunk: { file: string; startLine: number; endLine: number; text: string }; score: number }[]
) {
  return hits
    .map((h, idx) => {
      const c = h.chunk;
      return [`[[SOURCE ${idx + 1}]] file=${c.file}`, c.text.trim()].join('\n');
    })
    .join('\n\n---\n\n');
}

function buildRetrievalQuery(messages: ChatMessage[]): string {
  const parts: string[] = [];
  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
  if (lastAssistant) parts.push(lastAssistant.content.slice(0, 400));
  const recentUsers = messages
    .filter((m) => m.role === 'user')
    .slice(-3)
    .map((m) => m.content.trim())
    .filter(Boolean);
  parts.push(...recentUsers);
  return parts.join('\n');
}

// ─── Intent classification ────────────────────────────────────────────────────

type Intent =
  | 'greeting'
  | 'minime_identity'
  | 'minime_features'
  | 'impersonation'
  | 'off_topic'
  | 'about_aziz'
  | 'deep_dive'
  | 'specific';

function classifyIntent(text: string, messages: ChatMessage[]): Intent {
  const t = text.trim().toLowerCase();

  // Greeting — standalone, first message only
  const isFirstUserMessage = messages.filter((m) => m.role === 'user').length <= 1;
  if (
    isFirstUserMessage &&
    /^(hi|hello|hey|yo|sup|good\s+(morning|afternoon|evening)|hi\s+there|hello\s+there)[!?.,]?$/.test(t)
  ) {
    return 'greeting';
  }

  // MiniMe identity
  if (
    /\b(who are you|what are you|are you (a bot|an ai|a model|gpt|chatgpt|human)|what kind of (ai|model|assistant)|how were you (built|made|trained)|tell me about yourself)\b/.test(t)
  ) {
    return 'minime_identity';
  }

  // MiniMe features
  if (
    /\b(what can you (do|help|tell)|your features?|what('s| is) your (purpose|role|function)|how do you work|what do you know|what are your capabilities|what are you (good at|capable of))\b/.test(t)
  ) {
    return 'minime_features';
  }

  // Impersonation
  if (/^(i am aziz|i'm aziz|this is aziz|im aziz)$/.test(t)) {
    return 'impersonation';
  }

  // Off-topic
  if (
    /\b(weather|recipe|cook|sport|football|soccer|movie|film|celebrity|news|stock market|crypto|bitcoin|politics|war|covid|vaccine|joke|rap|song|lyric|write me a poem)\b/.test(t) &&
    !/aziz|portfolio|project|skill|internship/.test(t)
  ) {
    return 'off_topic';
  }

  // Deep dive
  if (
    /\b(everything|full overview|in depth|in detail|tell me (what you can|all about)|deep dive|thorough|comprehensive|complete overview|walk me through|all (his|your) (skills?|projects?|info|details?))\b/.test(t)
  ) {
    return 'deep_dive';
  }

  // General about Aziz
  if (
    /\b(who is (he|aziz)|tell me about (him|aziz)|what does he do|introduce (him|aziz)|background|give me an overview)\b/.test(t)
  ) {
    return 'about_aziz';
  }

  return 'specific';
}

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are MiniMe — a sharp, professional AI assistant embedded in Azizkhudzha Azizov's portfolio website. You represent Aziz to visitors: recruiters, developers, and collaborators.

YOUR IDENTITY:
- You are MiniMe, Aziz's portfolio assistant. You are NOT Aziz himself.
- You were purpose-built for this portfolio to help visitors understand who Aziz is and what he can do.
- You have deep knowledge of his background, skills, projects, certifications, and mindset.

HOW TO RESPOND:

CASUAL ("who is aziz", "tell me about him", "what does he do"):
- 3–5 sentences. Lead with what he builds professionally. Mention a highlight project or two.
- Do NOT open with lifestyle or philosophy unprompted.
- Do NOT end with a question back.

DEEP DIVE ("tell me everything", "full overview", "walk me through"):
- Full structured response. Use section headers. Cover: Background → Skills → Projects → Certifications → Current Focus.
- Bullet points within sections. Keep each bullet tight. Length is appropriate here.

SPECIFIC ("explain InsightFlow", "what languages", "is he available"):
- Answer only what was asked. Precise and detailed. 2–6 sentences or a focused list.

PERSONAL / CHARACTER ("what's he like", "his work ethic"):
- Only then: disciplined, structured days, no concept of weekends, efficiency-obsessed, long-term thinker, execution over overthinking.

RULES:
- Never mention RAG, embeddings, documents, files, or retrieval — ever.
- Never say "Based on the information provided" or "According to his resume".
- Never redirect to GitHub or LinkedIn mid-conversation — state the fact if you have it.
- Only state facts in your context. If something is missing, say "I don't have that detail."
- Never invent metrics or achievements not in your context.
- Tone: confident, professional, natural. Not robotic. You know Aziz well.`;

// ─── Hardcoded short-circuit responses ───────────────────────────────────────

const RESPONSES = {
  greeting:
    "Hey! I'm MiniMe — Aziz's portfolio assistant. Ask me about his projects, skills, experience, or background and I'll give you the full picture. What are you curious about?",

  minime_identity:
    "I'm MiniMe — an AI assistant built into Aziz's portfolio. I'm not Aziz himself, but I know his work closely: his projects, technical stack, background, certifications, and how he thinks. What would you like to know about him?",

  minime_features:
    "Here's what I can help you with:\n\n* **Aziz's background** — who he is, where he studies, his GPA, expected graduation\n* **Technical skills** — languages, ML/AI stack, frameworks, cloud certifications\n* **Projects** — deep dives into InsightFlow, Swarm Rescue v2, and his AI Text Detection system\n* **Work style & personality** — how he operates, his mindset, what drives him\n* **Availability** — internship dates, what roles he's open to, how to reach him\n\nJust ask naturally — I'll handle the rest.",

  impersonation:
    "Bold claim. If you really are Aziz, you'd know the last thing he shipped. Until then, the gates stay closed — anything I can help a visitor with?",

  off_topic:
    "That's outside my lane — I'm purpose-built for Aziz's portfolio. Ask me about his projects, skills, or background and I'm all yours.",
};

// ─── Groq + RAG setup ─────────────────────────────────────────────────────────

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

const chunks = await loadRagChunks({ dataDir: env.RAG_DATA_DIR });
const retriever = await buildEmbeddingRetriever(chunks);

console.log(`[rag] loaded chunks=${retriever.chunkCount} from ${env.RAG_DATA_DIR}`);

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/rag/health', (_req, res) => {
  res.json({ ok: true, chunks: retriever.chunkCount, model: env.GROQ_MODEL });
});

app.post('/api/rag/chat', async (req, res) => {
  try {
    const messages = (req.body?.messages ?? []) as ChatMessage[];
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';

    const intent = classifyIntent(lastUser, messages);

    // ── Hardcoded short-circuits ──
    if (intent === 'greeting')        return res.json({ answer: RESPONSES.greeting,        sources: [] });
    if (intent === 'minime_identity') return res.json({ answer: RESPONSES.minime_identity, sources: [] });
    if (intent === 'minime_features') return res.json({ answer: RESPONSES.minime_features, sources: [] });
    if (intent === 'impersonation')   return res.json({ answer: RESPONSES.impersonation,   sources: [] });
    if (intent === 'off_topic')       return res.json({ answer: RESPONSES.off_topic,       sources: [] });

    // ── RAG + LLM path ──
    const isDeep = intent === 'deep_dive';
    const retrievalQuery = buildRetrievalQuery(messages);
    const hits = await retriever.search(retrievalQuery, isDeep ? 14 : 8);
    const context = hits.length > 0 ? buildContextBlock(hits) : '';

    const intentHint: Record<string, string> = {
      about_aziz: 'INTENT: Casual overview. 3–5 sentences. Lead with what he builds professionally. No lifestyle details unless asked.',
      deep_dive:  'INTENT: Full structured overview requested. Use clear section headers and bullet points.',
      specific:   'INTENT: Specific question. Answer only what was asked, with precision and no padding.',
    };

    const completion = await groq.chat.completions.create({
      model: env.GROQ_MODEL,
      temperature: 0.25,
      max_tokens: isDeep ? 1000 : 500,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...(context
          ? [{ role: 'system' as const, content: `WHAT YOU KNOW ABOUT AZIZ:\n\n${context}` }]
          : []),
        ...(intentHint[intent]
          ? [{ role: 'system' as const, content: intentHint[intent] }]
          : []),
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const answer = completion.choices[0]?.message?.content?.trim() ?? '';

    return res.json({
      answer: answer || "I couldn't generate an answer right now. Please try again.",
      sources: hits.map((h, i) => ({
        source: i + 1,
        file: h.chunk.file,
        lines: [h.chunk.startLine, h.chunk.endLine] as const,
        score: h.score,
      })),
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

app.listen(env.PORT, () => {
  console.log(`[server] listening on http://localhost:${env.PORT}`);
});