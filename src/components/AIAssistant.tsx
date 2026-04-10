import { X, Send, Maximize2, Minimize2 } from 'lucide-react';
import React, { useMemo, useRef, useEffect, useState, Fragment } from 'react';

type ChatMsg = { role: 'user' | 'assistant'; content: string };

// ---------------------------------------------------------------------------
// Minimal markdown renderer — handles bold, inline code, bullet lists,
// numbered lists, and line breaks. No external deps.
// ---------------------------------------------------------------------------
function renderMarkdown(text: string): React.ReactNode {
  // Split into lines to handle block-level elements
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Bullet list item: starts with "* ", "- ", or "+ "
    if (/^[\*\-\+] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[\*\-\+] /.test(lines[i])) {
        items.push(lines[i].replace(/^[\*\-\+] /, ''));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} style={{ margin: '6px 0', paddingLeft: 18 }}>
          {items.map((item, j) => (
            <li key={j} style={{ marginBottom: 3, lineHeight: 1.65 }}>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list item: starts with "1. ", "2. " etc.
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} style={{ margin: '6px 0', paddingLeft: 20 }}>
          {items.map((item, j) => (
            <li key={j} style={{ marginBottom: 3, lineHeight: 1.65 }}>
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Blank line — small spacer
    if (line.trim() === '') {
      nodes.push(<div key={`br-${i}`} style={{ height: 6 }} />);
      i++;
      continue;
    }

    // Regular paragraph line
    nodes.push(
      <p key={`p-${i}`} style={{ margin: 0, lineHeight: 1.7 }}>
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <>{nodes}</>;
}

// Render inline markdown: **bold**, *italic*, `code`
function renderInline(text: string): React.ReactNode {
  // Pattern matches **bold**, *italic*, `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} style={{ color: 'rgba(255,255,255,0.97)', fontWeight: 650 }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 11,
              background: 'rgba(255,255,255,0.08)',
              padding: '1px 5px',
              borderRadius: 4,
              color: 'var(--accent)',
            }}>
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

// ---------------------------------------------------------------------------

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'assistant',
      content:
        "Hey! I'm MiniMe — Aziz's portfolio assistant. Ask me about his projects, skills, or background.",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const canSend = input.trim().length > 0 && !loading;
  const displayed = useMemo(() => messages.slice(-20), [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayed, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setLoading(true);

    const next: ChatMsg[] = [...messages, { role: 'user', content: text }];
    setMessages(next);

    try {
      const res = await fetch('/api/rag/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json()) as { answer?: string };
      const answer =
        data.answer ??
        "I couldn't generate an answer right now. Please try again.";
      setMessages((m) => [...m, { role: 'assistant', content: answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: 'The assistant server is not reachable. Please try again later.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', right: 'clamp(8px,3vw,18px)', bottom: 'clamp(8px,3vw,18px)', zIndex: 999 }}>
      {!open ? (
        <button
          className="btn-primary"
          onClick={() => setOpen(true)}
          style={{ padding: '11px 20px' }}
        >
          MiniMe
        </button>
      ) : (
        <div
          className="holo-card"
          style={{
            width: isExpanded ? 'calc(100vw - 16px)' : 'min(380px, calc(100vw - 16px))',
            height: isExpanded ? 'calc(100vh - 16px)' : 'min(480px, calc(100vh - 80px))',
            maxWidth: 'calc(100vw - 36px)',
            maxHeight: 'calc(100vh - 36px)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            resize: isExpanded ? 'none' : 'both',
            overflow: 'hidden',
            minWidth: 300,
            minHeight: 300,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 650, letterSpacing: '-0.01em', color: 'var(--foreground)', fontSize: 15 }}>
                MiniMe
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.50)', marginTop: 2 }}>
                Ask me about Aziz's projects &amp; skills
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label="Toggle expand"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.65)',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.10)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.95)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)';
                }}
              >
                {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.65)',
                cursor: 'pointer', flexShrink: 0,
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.10)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.95)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)';
              }}
            >
              <X size={14} />
            </button>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1, overflowY: 'auto', minHeight: 0,
              padding: '10px 12px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            {displayed.map((m, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                {/* Role label */}
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: m.role === 'user' ? 'var(--accent)' : 'rgba(255,255,255,0.38)',
                  marginBottom: 5,
                }}>
                  {m.role === 'user' ? 'You' : 'MiniMe'}
                </div>
                {/* Message body */}
                <div style={{
                  fontSize: 13.5,
                  color: m.role === 'user' ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.90)',
                }}>
                  {m.role === 'assistant'
                    ? renderMarkdown(m.content)
                    : m.content
                  }
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 5,
                }}>
                  MiniMe
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.40)' }}>
                  thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input
              className="input-neon"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects, skills, experience…"
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              style={{ flex: 1, minWidth: 0 }}
            />
            <button
              className="btn-primary"
              disabled={!canSend}
              onClick={send}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 14px', flexShrink: 0, minWidth: 44,
              }}
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
