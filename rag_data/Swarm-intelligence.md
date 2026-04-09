# Swarm Rescue v2 — Decentralised Swarm Intelligence

> V Hack 2026 · Case Study 3 · Team WeHack · SDG 9 & SDG 3

A decentralised drone swarm system for search-and-rescue operations. Each drone operates autonomously, coordinates peer-to-peer, and self-heals when teammates fail — no central controller required.

---

## Demo

```
Launch → 5 drones scatter autonomously → P2P coordination → survivors found → mission debrief
```

Key things to try during a demo:
- Type `Scan the south-east quadrant` in the Mission Command box mid-mission
- Click **⚡ Fail Drone** to kill a random drone and watch the swarm redistribute
- Click **NO-GO MODE** then mark cells red before launch — drones avoid them automatically
- Click **⚡ Override Mode** then click any grid cell to redirect a drone step-by-step

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    HUMAN OPERATOR                        │
│         (Natural language commands / Override)           │
└─────────────────────────┬───────────────────────────────┘
                          │ MCP Tools
┌─────────────────────────▼───────────────────────────────┐
│                  COMMANDER AI (Gemini)                   │
│   list_drones() → get_swarm_status() → override_move_to  │
│              Optional — swarm works without it           │
└─────────────────────────┬───────────────────────────────┘
                          │ MCP Server
┌─────────────────────────▼───────────────────────────────┐
│                    MCP SERVER                            │
│   list_drones · get_swarm_status · override_move_to      │
│   add_nogo_zone · remove_nogo_zone · get_bus_messages    │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│              P2P SWARMBUS (Pub/Sub Mesh)                  │
│  sector.claimed · sector.scanned · survivor.found        │
│  drone.status · drone.offline · mission.complete         │
└──────┬──────────┬──────────┬──────────┬─────────────────┘
       │          │          │          │
   ┌───▼──┐   ┌───▼──┐   ┌───▼──┐   ┌───▼──┐   ...
   │ALPHA │   │BRAVO │   │CHARLIE│  │DELTA │
   │ Own  │   │ Own  │   │ Own  │   │ Own  │
   │ loop │   │ loop │   │ loop │   │ loop │
   └──────┘   └──────┘   └──────┘   └──────┘
```

### Key Design Principles

**Decentralised** — No drone waits for orders. Each runs its own decision loop: check battery → find uncovered sector → claim it → move → scan → repeat.

**Peer-to-Peer** — Drones communicate via SwarmBus directly. When ALPHA claims sector (3,4), every other drone immediately marks it as taken in their own local map.

**Self-Healing** — When a drone goes offline it broadcasts `drone.offline`. All others release its claimed sectors and redistribute automatically.

**MCP Interface** — All Commander-to-drone communication goes through MCP tools. The Commander never hardcodes drone IDs — it calls `list_drones()` first to discover the active fleet dynamically.

---

## Project Structure

```
swarm-v2/
├── main.py                  # FastAPI backend — all HTTP endpoints
├── requirements.txt
│
├── swarm/
│   ├── bus.py               # P2P SwarmBus — pub/sub mesh simulation
│   └── sector_map.py        # SharedSectorMap — distributed grid knowledge
│                              with no-go zones and visit heatmap
│
├── drone/
│   └── agent.py             # DroneAgent — fully autonomous decision loop
│                              with step-by-step override navigation
│
├── simulation/
│   └── world.py             # World state — survivors, drones, event log
│
├── mcp_server/
│   └── server.py            # FastMCP server — drone tools exposed via MCP
│
├── agent/
│   └── commander.py         # Commander AI — natural language mission planning
│                              real-time tool discovery, Gemini API
│
└── frontend/
    └── index.html           # Tactical dashboard — grid, fleet, bus, log panels
```

---

## Setup

### Prerequisites
- Python 3.10+
- A Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### Install

```bash
git clone <repo>
cd swarm-v2
pip install -r requirements.txt
```

### Configure API Key

Open `agent/commander.py` and replace the placeholder:

```python
GEMINI_API_KEY = "YOUR_GEMINI_KEY_HERE"
```

### Run

```bash
python main.py
```

Open [http://localhost:8000](http://localhost:8000)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/state` | Full world snapshot (polled every 1.2s) |
| POST | `/api/mission/start` | Launch the swarm |
| GET | `/api/mission/status` | Running / complete status |
| POST | `/api/override/move` | Set drone waypoint (step-by-step navigation) |
| POST | `/api/command` | Natural language mission command |
| POST | `/api/nogo/add` | Mark a cell as no-go zone |
| POST | `/api/nogo/remove` | Remove a no-go zone |
| GET | `/api/nogo` | List all no-go zones |
| POST | `/api/drone/kill` | Simulate random drone failure |
| GET | `/api/mission/debrief` | AI-generated mission debrief |
| POST | `/api/mission/reset` | Reset world state |

---

## MCP Tools

The MCP server exposes these tools — callable by the Commander AI or any MCP-compatible client:

| Tool | Description |
|------|-------------|
| `list_drones()` | Discover active fleet dynamically — never hardcoded |
| `get_swarm_status()` | Full snapshot including coverage, survivors, heatmap |
| `override_move_to(drone_id, x, y)` | Set step-by-step navigation waypoint |
| `override_recall(drone_id)` | Force drone to return to base |
| `add_nogo_zone(x, y)` | Mark danger zone — drones avoid automatically |
| `remove_nogo_zone(x, y)` | Clear a no-go zone |
| `get_nogo_zones()` | List all current no-go zones |
| `get_bus_messages()` | Recent P2P SwarmBus messages |

---

## Features

### Autonomous Swarm
- 5 drones operate independently in parallel threads
- Each drone has its own local `SharedSectorMap` — synced via P2P
- Nearest-uncovered-sector algorithm with Manhattan distance sorting
- Battery management — autonomous recall at 20%, recharge, redeploy

### Real-Time Tool Discovery
- Commander always calls `list_drones()` first — never assumes drone IDs
- Adapts plan to whatever fleet is currently active
- Satisfies the case study requirement explicitly

### Natural Language Mission Planning
- Type commands mid-mission: `"Scan the north-east quadrant"`, `"Focus on the south edge"`
- Commander decomposes into MCP tool calls: list → status → override ×N
- Full reasoning visible in Mission Log

### Human Override
- Click Override Mode → click any cell → pick a drone
- Drone navigates step-by-step (visible on grid, no teleportation)
- On arrival: scans the area, checks if already covered, resumes autonomously

### Self-Healing
- Click ⚡ Fail Drone to simulate mid-mission failure
- Offline drone broadcasts `drone.offline` to SwarmBus
- Remaining drones automatically release and redistribute its sectors

### No-Go Zones
- Click NO-GO MODE → mark cells red before or during mission
- Persists across mission resets
- Drones skip no-go cells in their sector planning
- Also exposed as MCP tools for Commander use

### Coverage Heatmap
- Cells darken green based on visit count
- Immediately shows if swarm is being efficient or redundant

### Mission Debrief
- AI-generated summary after every mission
- Stat cards: survivors, duration, coverage, overrides, top drone
- Falls back to rule-based debrief if API unavailable

---

## How Drone Decision Loop Works

```python
while mission_running:
    # Check for human override waypoint first
    if waypoint set:
        navigate step-by-step to waypoint
        scan on arrival
        if area already covered → find nearest uncovered cell
        resume autonomous loop

    # Normal autonomous logic
    if battery <= 20% → return to base, recharge, redeploy
    target = find nearest uncovered sector
    claim target via SwarmBus broadcast
    move to target
    scan target
    broadcast scan result to all drones
```

---

## SDG Alignment

**SDG 9 — Industry, Innovation and Infrastructure**
Resilient, decentralised infrastructure that keeps functioning under failure conditions. MCP as a standardised interface for AI-to-device communication.

**SDG 3 — Good Health and Well-Being**
Faster survivor location in disaster scenarios. Human-in-the-loop override for directing drones toward known survivor locations.

---

## Team

**WeHack** · V Hack 2026 · Case Study 3
