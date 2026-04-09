## RAG Knowledge Base (`rag_data/`)

This folder is the **only source of truth** for the AI assistant.
The assistant is designed to **answer strictly from the information in these files** (resume, bio, project docs). If the answer isn’t supported here, it should say it doesn’t know.

Supported formats:
- `.md`
- `.txt`

### Recommended structure

- `rag_data/resume.md`
  - Your resume converted to clean Markdown (best).
- `rag_data/bio.md`
  - Short personal/professional bio, routine, preferences, values.
- `rag_data/projects/<project-name>.md`
  - Paste each project README (or a curated “project brief”).
- `rag_data/projects/index.md`
  - Optional: 1-page index of all projects + links to the files above.
- `rag_data/faq.md`
  - Optional: common questions you want the assistant to answer consistently.

### What to include (for best answers)

- **Projects**
  - Problem → your role → solution → stack → measurable results
  - Key features and architecture (RAG, agents, pipelines, infra)
  - Links: GitHub repo, live demo, docs (only if real)
- **Experience**
  - Roles, dates, responsibilities, scope, achievements
- **Skills**
  - What you’re strong at + what you’re currently learning
- **Personal bio (optional)**
  - Communication style, routine, interests (only what you’re comfortable sharing)

### Formatting tips (helps retrieval)

- Use **clear headings** (`##`, `###`) and short paragraphs.
- Prefer **specific nouns** (project names, technologies, institutions).
- For each project, keep a section like:
  - `## <Project Name>`
  - `### Summary`
  - `### Tech stack`
  - `### What I built`
  - `### Results`
  - `### Links`

### Privacy & safety

- Don’t put secrets here (API keys, passwords, private tokens).
- If you add personal details, assume they can be shown to visitors.

### Quick checklist

- [ ] `resume.md` added
- [ ] `bio.md` added
- [ ] Project docs added to `projects/`
- [ ] Facts you care about (dates, metrics, links) are explicitly written


