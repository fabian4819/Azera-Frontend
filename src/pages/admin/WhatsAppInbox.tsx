import { useEffect, useRef, useState } from 'react';
import { Send, Bot, BotOff, User, Users as UsersIcon } from 'lucide-react';
import api from '../../lib/api';

const f = "var(--font-display)";

interface WaContact {
  _id: string; jid: string; name?: string; botPaused: boolean;
  lastMessageAt: string; lastMessagePreview: string; unreadCount: number;
}
interface WaChatMessage {
  _id: string; jid: string; direction: 'in' | 'out'; text: string; createdAt: string;
}

function contactLabel(c: WaContact) {
  if (c.name) return c.name;
  const isGroup = c.jid.endsWith('@g.us');
  const raw = c.jid.split('@')[0];
  return isGroup ? `Grup ${raw}` : raw;
}

export default function WhatsAppInbox() {
  const [contacts, setContacts] = useState<WaContact[]>([]);
  const [selectedJid, setSelectedJid] = useState<string | null>(null);
  const [messages, setMessages] = useState<WaChatMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [actionError, setActionError] = useState('');
  const contactsPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchContacts = async () => {
    const res = await api.get('/admin/whatsapp/contacts');
    setContacts(res.data);
  };

  const fetchMessages = async (jid: string) => {
    const res = await api.get(`/admin/whatsapp/contacts/${encodeURIComponent(jid)}/messages`);
    setMessages(res.data);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void fetchContacts(); }, 0);
    contactsPollRef.current = setInterval(() => void fetchContacts(), 4000);
    return () => {
      window.clearTimeout(timeoutId);
      if (contactsPollRef.current) clearInterval(contactsPollRef.current);
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (!selectedJid) { setMessages([]); return; }
      void fetchMessages(selectedJid);
      api.post(`/admin/whatsapp/contacts/${encodeURIComponent(selectedJid)}/read`).then(() => void fetchContacts()).catch(() => {});
    }, 0);
    messagesPollRef.current = selectedJid ? setInterval(() => void fetchMessages(selectedJid), 3000) : null;
    return () => {
      window.clearTimeout(timeoutId);
      if (messagesPollRef.current) clearInterval(messagesPollRef.current);
    };
  }, [selectedJid]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const selected = contacts.find((c) => c.jid === selectedJid);

  const sendReply = async () => {
    if (!selectedJid || !replyText.trim()) return;
    setSending(true);
    setActionError('');
    try {
      await api.post(`/admin/whatsapp/contacts/${encodeURIComponent(selectedJid)}/reply`, { text: replyText });
      setReplyText('');
      await fetchMessages(selectedJid);
      await fetchContacts();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(message || 'Gagal mengirim balasan');
    } finally {
      setSending(false);
    }
  };

  const toggleBotPause = async () => {
    if (!selectedJid || !selected) return;
    try {
      await api.post(`/admin/whatsapp/contacts/${encodeURIComponent(selectedJid)}/bot-pause`, { paused: !selected.botPaused });
      await fetchContacts();
    } catch {
      setActionError('Gagal mengubah status bot');
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.3rem', color: '#191c20', marginBottom: '20px' }}>Inbox WhatsApp</h1>

      {actionError && (
        <div style={{ background: '#ffdad6', color: '#ba1a1a', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.82rem', fontFamily: f, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} style={{ background: 'none', border: 'none', color: '#ba1a1a', cursor: 'pointer', fontWeight: 700, fontFamily: f, flexShrink: 0 }}>✕</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '16px', height: 'calc(100vh - 160px)', minHeight: '480px' }}>
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e1e0ff', overflowY: 'auto' }}>
          {contacts.length === 0 && (
            <p style={{ padding: '20px', textAlign: 'center', color: '#8a8a99', fontFamily: f, fontSize: '0.82rem' }}>Belum ada percakapan.</p>
          )}
          {contacts.map((c) => {
            const active = c.jid === selectedJid;
            const isGroup = c.jid.endsWith('@g.us');
            return (
              <button
                key={c._id}
                onClick={() => setSelectedJid(c.jid)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '14px 16px',
                  border: 'none', borderBottom: '1px solid #f0f0f0', cursor: 'pointer',
                  background: active ? '#f0eeff' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', gap: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: f, fontWeight: 700, fontSize: '0.85rem', color: '#191c20', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {isGroup ? <UsersIcon size={13} style={{ flexShrink: 0 }} /> : <User size={13} style={{ flexShrink: 0 }} />}
                    {contactLabel(c)}
                  </span>
                  {c.unreadCount > 0 && (
                    <span style={{ flexShrink: 0, background: '#6728e4', color: 'white', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', fontFamily: f }}>
                      {c.unreadCount}
                    </span>
                  )}
                </div>
                <p style={{ fontFamily: f, fontSize: '0.78rem', color: '#777683', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.lastMessagePreview}
                </p>
              </button>
            );
          })}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e1e0ff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!selected ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a8a99', fontFamily: f, fontSize: '0.85rem' }}>
              Pilih percakapan untuk mulai.
            </div>
          ) : (
            <>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.9rem', color: '#191c20' }}>{contactLabel(selected)}</p>
                <button
                  onClick={toggleBotPause}
                  className={selected.botPaused ? 'btn-secondary' : 'btn-primary'}
                  style={{ padding: '7px 14px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {selected.botPaused ? <><BotOff size={13} /> Bot Nonaktif</> : <><Bot size={13} /> Bot Aktif</>}
                </button>
              </div>

              <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {messages.map((m) => (
                  <div key={m._id} style={{ display: 'flex', justifyContent: m.direction === 'out' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '70%', padding: '10px 14px', borderRadius: '14px', fontFamily: f, fontSize: '0.85rem', lineHeight: 1.5, whiteSpace: 'pre-wrap',
                      background: m.direction === 'out' ? '#6728e4' : '#f0eeff',
                      color: m.direction === 'out' ? 'white' : '#191c20',
                    }}>
                      {m.text}
                      <div style={{ fontSize: '0.65rem', opacity: 0.65, marginTop: '4px' }}>
                        {new Date(m.createdAt).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#8a8a99', fontFamily: f, fontSize: '0.82rem' }}>Belum ada pesan.</p>
                )}
              </div>

              <div style={{ padding: '14px 20px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '10px' }}>
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !sending) void sendReply(); }}
                  placeholder="Tulis balasan..."
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #e1e0ff', fontFamily: f, fontSize: '0.85rem' }}
                />
                <button
                  onClick={sendReply}
                  disabled={sending || !replyText.trim()}
                  className="btn-primary"
                  style={{ padding: '10px 18px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', opacity: sending || !replyText.trim() ? 0.6 : 1 }}
                >
                  <Send size={14} /> Kirim
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
