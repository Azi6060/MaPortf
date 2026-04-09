# Portfolio Landing Page

professional portfolio with modern design. Everything in English language.

## AI Assistant (RAG, Groq)

This project includes a small **RAG-powered assistant** that answers **only** from files you provide (resume, bio, project READMEs).

### 1) Add your documents

Put your content in `rag_data/` (Markdown or text):
- `rag_data/resume.md`
- `rag_data/bio.md`
- `rag_data/projects/<project>.md` (paste each project README)

The assistant will refuse to answer if nothing relevant is found.

### 2) Add your Groq API key (server-side)

Create a `.env` file in the project root (same folder as `package.json`) and add:

```
GROQ_API_KEY=YOUR_KEY_HERE
PORT=8787
RAG_DATA_DIR=rag_data
GROQ_MODEL=llama-3.1-70b-versatile
```

Important: **Do not put the key in frontend code**.

### 3) Run locally

Terminal A (assistant server):

```
npm run dev:server
```

Terminal B (frontend):

```
npm run dev
```

The frontend proxies `/api/*` to `http://localhost:8787`.

### 4) Deploy to Render

- **Environment Variables**: set `GROQ_API_KEY` (and optionally `GROQ_MODEL`)
- Ensure your Render service runs `npm run start` for the API server.

Health check endpoint:
- `GET /api/rag/health`

