# InsightFlow — Enterprise Intelligence System

A Bloomberg-style business intelligence platform that combines interactive analytics dashboards with a multi-agent AI analysis engine. Built on a FastAPI backend and React frontend, running fully local with no external AI API dependencies.

---

## Overview

| | |
|---|---|
| **Frontend** | React 18 + Vite + Recharts |
| **Backend** | FastAPI + Python 3.8+ |
| **AI Agents** | CrewAI + Ollama (Mistral) |
| **ML Model** | scikit-learn (`revenue_predictor.pkl`) |
| **Data** | 12 JSON datasets · 358 records · Q1 2024 |
| **API Version** | 3.0.0 |

---

## How the system works
 
InsightFlow is built around a single idea: business questions rarely have a single cause. A revenue decline might trace back to an operational incident, a partner churn spike, and a competitor campaign all happening at the same time. No single analyst looking at one dataset would catch all three. InsightFlow solves this by routing every question through four specialised AI agents, each reading a different slice of the data, then synthesising the findings into one coherent answer.
 
### The four pages
 
**Dashboard** is the traditional analytics layer. It loads all 12 datasets on startup, applies any active filters, and renders everything live. The Financial Overview tab is the most data-dense — it shows revenue vs cost vs profit as a trend line, forecast variance bars (so you can see which periods underperformed expectations at a glance), and side-by-side horizontal bar charts for revenue by region and by product. The other tabs (Incident Analysis, Partner Scorecard, Competitive Events) each drill into a specific domain. The About tab shows live backend health, a full data inventory, and a quick-reference guide.
 
**AI Intelligence** is the natural language question-answering engine. When you submit a question, it does not go straight to the LLM. First, `custom_tools_simple.py` queries all 12 JSON files, filters the records most relevant to your question using keyword matching, computes aggregate summaries (total revenue, avg churn, incident counts), and converts the raw JSON into plain-text briefings. These briefings are passed to three specialist agents running sequentially via CrewAI. The Financial Analyst reads the revenue and cost briefing, the Client & Partner Analyst reads the client metrics and partner records, and the Operations Analyst reads the incident and infrastructure data. Each produces a domain-specific findings report. Finally, the Executive Synthesizer reads all three reports and writes a single flowing prose response that tells the complete story — from root cause to business impact to recommendations.
 
**Revenue Predictor** lets you stress-test decisions before making them. It uses a trained **Gradient Boosting Regressor** with 24 input features spanning client metrics (churn rate, LTV, satisfaction score), operational metrics (uptime, response time, CPU/memory utilisation), cost variables (marketing spend, partner commission, operational overhead), and categorical context (product, region, segment, partner channel, incident severity, competitive event type). Each of the 8 scenarios modifies a specific subset of these features from a fixed baseline, runs the model, and reports the predicted revenue change as both a dollar figure and a percentage, alongside a labelled impact level (Minimal / Moderate / High / Severe / Exceptional).
 
**Analysis History** stores every AI analysis result in the browser's `localStorage` under the key `insightflow_history`. The current active page is also persisted under `insightflow_page`. Both survive page reloads. The history panel shows each past analysis in a collapsible row — click to expand the full response, or download it as a plain-text report.
 
### Why data is pre-processed before reaching the LLM
 
Small local models like Mistral can misread deeply nested JSON and hallucinate values. Rather than passing raw JSON to the agents, `enterprise_intelligence_simple.py` runs three pre-processing functions that flatten the data into labelled plain-text lines — for example `APAC: $7,165,788` and `Incident: inc-20240102-0002 | Critical | 270 min | Revenue impact: $170,000`. The agents work with structured prose rather than raw JSON, which produces accurate, data-grounded responses instead of hallucinated summaries.
 
### How the datasets are linked
 
The 12 JSON files are not independent. Revenue records contain a `linked_events` field referencing specific incident IDs and deployment IDs. Incident records contain a `linked_financial_impact` field with the estimated revenue loss. This cross-referencing is what allows the agents to trace a revenue variance in one dataset back to a specific operational event in another — the multi-hop reasoning that makes the analysis genuinely useful.

---

## Features

**Dashboard** — Live KPI tracking (revenue, cost, profit, margin), revenue vs cost trend, regional and product breakdowns, forecast variance, incident impact analysis, partner scorecards, and competitive event monitoring. All charts respond to region / product / segment filters.

**AI Intelligence** — Ask business questions in plain English. Four specialised AI agents analyse data across all 12 datasets and return a detailed cross-domain report covering financial findings, client and partner metrics, operational incidents, and executive recommendations.

**Revenue Predictor** — 8 pre-built risk and opportunity scenarios run through a trained scikit-learn ML model to forecast revenue impact before decisions are made.

**Analysis History** — Every AI analysis is automatically saved to `localStorage` and persists across page reloads. Browse, expand, and download past reports.

---

## Project structure

```
InsightFlow_Intelligence_system_demo/
└── insightflow_testsprite/
    └── demo/
        │
        ├── Data/                                        # 12 JSON datasets (do not move)
        │   ├── revenue_decomposition_EXPANDED.json
        │   ├── cost_analysis_EXPANDED.json
        │   ├── client_intelligence_EXPANDED.json
        │   ├── partner_intelligence_EXPANDED.json
        │   ├── incident_reports_EXPANDED.json
        │   ├── margin_optimisation_EXPANDED.json
        │   ├── competitive_intelligence_EXPANDED.json
        │   ├── forecast_accuracy_EXPANDED.json
        │   ├── infrastructure_resource_utilization_EXPANDED.json
        │   ├── system_uptime_monitoring_EXPANDED.json
        │   ├── deployment_and_release_reports_EXPANDED.json
        │   └── trading_engine_performance_logs_EXPANDED.json
        │
        ├── enterprise_intelligence_simple.py            # CrewAI agent definitions + orchestration
        ├── custom_tools_simple.py                       # Data query functions used by agents
        ├── revenue_predictor.pkl                        # Trained ML model
        ├── verify_setup.py                              # Pre-flight setup checker
        ├── test_system_simple.py                        # Data access tests
        ├── test_ollama_connection.py                    # Ollama connectivity test
        │
        └── insightflow_react/insightflow/
            ├── backend/
            │   ├── main.py                              # FastAPI — all 15 API routes
            │   ├── requirements.txt                     # Python dependencies
            │   └── start.sh                             # Convenience startup script
            └── frontend/
                ├── src/
                │   ├── App.jsx                          # Root — routing + localStorage state
                │   ├── index.css                        # Global CSS variables (dark theme)
                │   ├── components/
                │   │   ├── Sidebar.jsx / .css
                │   │   ├── KpiCard.jsx / .css
                │   │   ├── PageHeader.jsx / .css
                │   │   └── DataTable.jsx / .css
                │   ├── pages/
                │   │   ├── Dashboard.jsx / .css
                │   │   ├── AIIntelligence.jsx / .css
                │   │   ├── RevenuePredictor.jsx / .css
                │   │   └── AnalysisHistory.jsx / .css
                │   └── lib/api.js                       # Axios → /api
                ├── vite.config.js                       # Proxies /api → localhost:8000
                └── package.json                         # React 18, Recharts, Axios
```

---

## Setup

### Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- [Ollama](https://ollama.ai) installed

### Step 1 — Verify your setup

Run this first to catch any missing dependencies before starting:

```bash
cd demo
python verify_setup.py
```

### Step 2 — Install Ollama and pull the model

```bash
# Install Ollama from https://ollama.ai, then:
ollama pull mistral
```

### Step 3 — Start Ollama

Open a terminal and keep it running:

```bash
ollama serve
```

### Step 4 — Install and start the backend

```bash
cd demo/insightflow_react/insightflow/backend
pip install -r requirements.txt

# Run from the insightflow/ directory (one level above backend/)
# so the backend can locate Data/ and revenue_predictor.pkl
cd ..
uvicorn backend.main:app --reload --port 8000
```

Alternatively, use the convenience script:

```bash
cd demo/insightflow_react/insightflow
bash backend/start.sh
```

### Step 5 — Install and start the frontend

Open a new terminal:

```bash
cd demo/insightflow_react/insightflow/frontend
```

**If you have the `node_modules.zip` file** (provided separately due to size), extract it directly inside the `frontend/` folder so the structure looks like:

```
frontend/
└── node_modules/    ← extract node_modules.zip contents here
```

Then start the dev server:

```bash
npm run dev
```

**If you do not have the zip**, install dependencies first:

```bash
npm install
npm run dev
```

The app opens at **http://localhost:3000**

The Vite dev server automatically proxies all `/api` requests to `http://localhost:8000` — no CORS configuration needed.

---

## Running — quick reference

You need three things running simultaneously in separate terminals:

| Terminal | Command | Run from |
|---|---|---|
| 1 | `ollama serve` | anywhere |
| 2 | `uvicorn backend.main:app --reload --port 8000` | `insightflow/` |
| 3 | `npm run dev` | `frontend/` |

---

## API endpoints

All dashboard POST endpoints accept an optional `Filters` body:

```json
{
  "regions": ["APAC", "EU"],
  "products": ["DerivBot", "DTrader"],
  "client_segments": ["Retail"],
  "partner_types": null
}
```

Pass `null` for any field to include all values.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Backend status, files loaded, model loaded |
| GET | `/api/filters` | Available regions, products, segments |
| POST | `/api/dashboard/kpis` | Revenue, cost, profit, margin |
| POST | `/api/dashboard/cost-trend` | Revenue + cost + profit per period |
| POST | `/api/dashboard/revenue-by-region` | Revenue aggregated by region |
| POST | `/api/dashboard/revenue-by-product` | Revenue aggregated by product |
| POST | `/api/dashboard/cost-breakdown` | Marketing / Ops / Commission split |
| POST | `/api/dashboard/forecast-variance` | Avg variance from forecast per period |
| POST | `/api/dashboard/incidents` | Incidents linked to revenue records |
| POST | `/api/dashboard/partners` | Partner scorecard with performance scores |
| POST | `/api/dashboard/competitive` | Competitive events and market impact |
| GET | `/api/predictor/scenarios` | All 8 ML prediction scenarios |
| POST | `/api/predictor/predict` | Run ML model for a named scenario |
| POST | `/api/ai/analyze` | Run 4-agent AI analysis pipeline |

---

## AI agent pipeline

```
User question
      ↓
custom_tools_simple.py
Pre-fetches and pre-processes data from all 12 JSON files into readable briefings
      ↓
┌─────────────────────┐  ┌──────────────────────────┐  ┌───────────────────────┐
│  Financial Analyst  │  │  Client/Partner Analyst   │  │  Operations Analyst   │
│  Revenue, costs,    │  │  Churn, LTV, satisfaction,│  │  Incidents, severity, │
│  margins, variance  │  │  partner performance      │  │  infra, root causes   │
└─────────────────────┘  └──────────────────────────┘  └───────────────────────┘
                                      ↓
                           Executive Synthesizer
                     Cross-domain narrative + recommendations
                                      ↓
                      Plain prose response displayed in UI
                         Auto-saved to Analysis History
```

Typical runtime: **45–90 seconds** depending on hardware and model.

---

## Revenue predictor scenarios

**Risk scenarios** — model the impact of adverse events:

| Scenario | Description |
|---|---|
| Key Partner Leaves | IB partner exits, acquisition drops 40% |
| Critical System Outage | 4-hour platform downtime, satisfaction collapses |
| Competitor Promotion | Aggressive competitor campaign steals market share |
| Infrastructure Overload | CPU/memory critical, performance degrades |

**Opportunity scenarios** — model the upside of strategic moves:

| Scenario | Description |
|---|---|
| Competitor Exits Market | Major competitor leaves — 12K clients displaced |
| Service Improvement | Reliability & UX upgrade improves retention 40% |
| Premium Product Launch | DerivX targeting high-value segment, higher LTV |
| Regional Expansion | New LATAM market entry with heavy investment |

---

## Data

All 12 datasets cover **Q1 2024 (January–March)**. Records are interlinked via `record_id`, `partner_id`, and `linked_events` fields — incidents reference the revenue records they affected, and revenue records reference the incidents that caused variance.

| Dataset | Records | Domain |
|---|---|---|
| Revenue Decomposition | 75 | Financial |
| Cost Analysis | 75 | Financial |
| Client Intelligence | 45 | Clients |
| Margin Optimisation | 35 | Financial |
| System Uptime Monitoring | 32 | Operations |
| Infrastructure Utilization | 24 | Operations |
| Deployment & Release Reports | 20 | Operations |
| Forecast Accuracy | 18 | Financial |
| Partner Intelligence | 10 | Partners |
| Incident Reports | 10 | Operations |
| Trading Engine Performance | 9 | Operations |
| Competitive Intelligence | 5 | Market |

---

## Testing

```bash
# Check all components are configured correctly
python verify_setup.py

# Test data file access and query functions
python test_system_simple.py

# Test Ollama connection and model availability
python test_ollama_connection.py
```

---

## Configuration

### Change the AI model

Edit `enterprise_intelligence_simple.py`:

```python
llm = LLM(
    model="ollama/mistral",           # change to llama3.1:8b, gemma3:4b, etc.
    base_url="http://localhost:11434",
    temperature=0.7
)
```

Mistral is recommended. Smaller models like `gemma3:4b` may hallucinate or ignore the data context provided to them.

### Change ports

- **Backend port**: change `--port 8000` in the uvicorn command and update the `proxy` target in `vite.config.js`
- **Frontend port**: change `server.port` in `vite.config.js`

---

## Troubleshooting

**Blank or black page on Analysis History**
Clear `localStorage` for `localhost:3000` in your browser dev tools (`Application → Local Storage → Clear`) and reload. A corrupted history entry from an older session can crash the page.

**"Could not initialize Ollama"**
Make sure `ollama serve` is running in a separate terminal before starting the backend. Run `ollama list` to confirm the model is installed.

**AI response contains wrong numbers or says "no data"**
Switch to Mistral — smaller models frequently ignore the pre-processed data context and hallucinate. Mistral is the recommended and tested model.

**Backend cannot find `Data/` or `revenue_predictor.pkl`**
Always start uvicorn from the `insightflow/` directory (one level above `backend/`), not from inside `backend/`. The backend searches upward from its own path to find these files automatically.

**Analysis takes more than 2 minutes**
Check `ollama serve` logs for errors. The model may have stalled. Restart Ollama and try again, or switch to a lighter model.

**Frontend shows stale data after backend restart**
Hard refresh the browser (`Ctrl+Shift+R` on Windows/Linux, `Cmd+Shift+R` on Mac).

---

## Version

**v3.0.0** · React + FastAPI · March 2026 · Internal use only