import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ApiService, ChatChannel, ChatMessage, ChatServer, getAccessToken, WS_URL } from '../services/api';
import '../styles/community-chat.css';
import { VoiceRoomDialog } from '../components/voice/VoiceRoomDialog';

type Props = { userName?: string; onToast?: (message: string) => void };

export const CommunityChatView: React.FC<Props> = ({ userName = 'You', onToast }) => {
  const [servers, setServers] = useState<ChatServer[]>([]);
  const [serverId, setServerId] = useState('');
  const [channelId, setChannelId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [newServer, setNewServer] = useState('');
  const [newChannel, setNewChannel] = useState('');
  const [showServerForm, setShowServerForm] = useState(false);
  const [showChannelForm, setShowChannelForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeVoiceRoom, setActiveVoiceRoom] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const currentServer = servers.find(s => s.id === serverId);
  const currentChannel = currentServer?.channels.find(c => c.id === channelId);
  const notify = (message: string) => onToast ? onToast(message) : window.alert(message);

  const loadServers = useCallback(async () => {
    try {
      const data = await ApiService.listServers();
      setServers(data);
      setServerId(current => data.some(s => s.id === current) ? current : (data[0]?.id || ''));
      const selected = data.find(s => s.id === serverId) || data[0];
      if (selected && !selected.channels.some(c => c.id === channelId)) {
        setChannelId(selected.channels.find(c => c.type === 'TEXT')?.id || '');
      }
      setError('');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not load communities.'); }
    finally { setLoading(false); }
  }, [serverId, channelId]);

  const loadMessages = useCallback(async () => {
    if (!channelId) { setMessages([]); return; }
    try { setMessages(await ApiService.getMessages(channelId)); setError(''); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not load messages.'); }
  }, [channelId]);

  useEffect(() => { void loadServers(); }, []);
  useEffect(() => {
    void loadMessages();
    const timer = window.setInterval(() => void loadMessages(), 15000);
    if (!channelId || !getAccessToken()) return () => window.clearInterval(timer);
    const socket = new WebSocket(WS_URL, ['v12.stomp']);
    let subscribed = false;
    socket.onopen = () => socket.send(`CONNECT\naccept-version:1.2\nheart-beat:10000,10000\nAuthorization:Bearer ${getAccessToken()}\n\n\0`);
    socket.onmessage = (event) => {
      const frames = String(event.data).split('\0').filter(Boolean);
      frames.forEach((frame) => {
        if (frame.startsWith('CONNECTED') && !subscribed) { subscribed = true; socket.send(`SUBSCRIBE\nid:channel-${channelId}\ndestination:/topic/channels/${channelId}\nack:auto\n\n\0`); }
        if (frame.startsWith('MESSAGE')) {
          const bodyStart = frame.indexOf('\n\n');
          if (bodyStart >= 0) { try { const incoming = JSON.parse(frame.slice(bodyStart + 2)) as ChatMessage; setMessages(old => old.some(m => m.id === incoming.id) ? old : [...old, incoming]); } catch { /* ignore malformed broker frame */ } }
        }
      });
    };
    return () => { window.clearInterval(timer); if (socket.readyState === WebSocket.OPEN) socket.send('DISCONNECT\n\n\0'); socket.close(); };
  }, [channelId, loadMessages]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  const filtered = useMemo(() => messages.filter(m => !search || m.content.toLowerCase().includes(search.toLowerCase()) || m.senderName.toLowerCase().includes(search.toLowerCase())), [messages, search]);
  const chooseServer = (server: ChatServer) => { setServerId(server.id); setChannelId(server.channels.find(c => c.type === 'TEXT')?.id || ''); };
  const send = async (event: React.FormEvent) => {
    event.preventDefault(); const content = draft.trim(); if (!content || !channelId || sending) return;
    setSending(true);
    try { const saved = await ApiService.sendMessage(channelId, content); setMessages(old => [...old.filter(m => m.id !== saved.id), saved]); setDraft(''); }
    catch (e) { notify(e instanceof Error ? e.message : 'Message could not be sent.'); }
    finally { setSending(false); }
  };
  const createServer = async (event: React.FormEvent) => {
    event.preventDefault(); if (!newServer.trim()) return;
    try { const created = await ApiService.createServer(newServer.trim()); setServers(old => [...old, created]); setServerId(created.id); setChannelId(created.channels.find(c => c.type === 'TEXT')?.id || ''); setNewServer(''); setShowServerForm(false); notify('Community created on the server.'); }
    catch (e) { notify(e instanceof Error ? e.message : 'Could not create community.'); }
  };
  const createChannel = async (event: React.FormEvent) => {
    event.preventDefault(); if (!newChannel.trim() || !serverId) return;
    try { const created = await ApiService.createChannel(serverId, newChannel.trim()); setServers(old => old.map(s => s.id === serverId ? { ...s, channels: [...s.channels, created] } : s)); setChannelId(created.id); setNewChannel(''); setShowChannelForm(false); }
    catch (e) { notify(e instanceof Error ? e.message : 'Could not create channel.'); }
  };
  const removeMessage = async (id: string) => { try { await ApiService.deleteMessage(id); setMessages(old => old.filter(m => m.id !== id)); } catch (e) { notify(e instanceof Error ? e.message : 'Could not delete message.'); } };
  const joinVoice = (channel: ChatChannel) => { setActiveVoiceRoom(channel.id); };

  if (loading) return <div className="cb-shell cb-loading">Connecting to EduBridge communities…</div>;
  return <div className="cb-shell">
    <aside className="cb-servers"><button className="cb-home" title="EduBridge">E</button><div className="cb-serverline" />{servers.map(server => <button key={server.id} title={server.name} className={`cb-server ${server.id === serverId ? 'active' : ''}`} onClick={() => chooseServer(server)}><span>{server.name.slice(0, 1).toUpperCase()}</span></button>)}<button className="cb-addserver" title="Create community" onClick={() => setShowServerForm(true)}>＋</button></aside>
    <aside className="cb-channelbar"><div className="cb-serverhead"><span>{currentServer?.name || 'Communities'}</span><button onClick={() => setShowChannelForm(true)} title="Create channel" disabled={!serverId}>＋</button></div>
      <div className="cb-category"><span>TEXT CHANNELS</span><button onClick={() => setShowChannelForm(true)} disabled={!serverId}>＋</button></div>
      {currentServer?.channels.filter(c => c.type === 'TEXT' || c.type === 'ANNOUNCEMENT' || c.type === 'FORUM').map(c => <button key={c.id} onClick={() => setChannelId(c.id)} className={`cb-channel ${channelId === c.id ? 'selected' : ''}`}><span>#</span>{c.name}</button>)}
      <div className="cb-category"><span>VOICE CHANNELS</span></div>
      {currentServer?.channels.filter(c => c.type === 'VOICE').map(c => <button key={c.id} onClick={() => void joinVoice(c)} className="cb-channel"><span>◖</span>{c.name}</button>)}
      <div className="cb-profile"><div className="cb-avatar">{userName.slice(0,1).toUpperCase()}</div><div><strong>{userName}</strong><small>Signed in</small></div></div>
    </aside>
    <section className="cb-main"><header className="cb-topbar"><div className="cb-top-title"><strong># {currentChannel?.name || 'Select a channel'}</strong><span>Live community conversation</span></div><div className="cb-top-actions"><label className="cb-search">⌕ <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages" /></label></div></header>
      {error && <div className="cb-error" role="alert">{error} — check that the Spring Boot API is running and you are signed in.</div>}
      {!currentChannel ? <div className="cb-empty"><h2>Welcome to EduBridge Communities</h2><p>Create a community or select one to begin.</p><button className="cb-primary" onClick={() => setShowServerForm(true)}>Create community</button></div> : <>
        <div className="cb-messages">{filtered.length === 0 ? <div className="cb-empty"><h2>Welcome to #{currentChannel.name}</h2><p>This is the beginning of this channel. Send the first message.</p></div> : filtered.map(message => <article key={message.id} className="cb-message"><div className="cb-avatar">{message.senderName.slice(0,1).toUpperCase()}</div><div className="cb-message-body"><div className="cb-message-meta"><strong>{message.senderName}</strong><time>{new Date(message.createdAt).toLocaleString()}</time>{message.editedAt && <small>(edited)</small>}</div><p>{message.content}</p><button className="cb-delete" title="Delete your message" onClick={() => void removeMessage(message.id)}>Delete</button></div></article>)}<div ref={bottomRef}/></div>
        <form className="cb-composer-wrap" onSubmit={send}><div className="cb-composer"><button type="button" title="Attachments" onClick={() => notify('File uploads will be enabled after object storage is configured.')}>＋</button><input value={draft} onChange={e => setDraft(e.target.value)} placeholder={`Message #${currentChannel.name}`} maxLength={4000} /><button type="submit" disabled={!draft.trim() || sending}>{sending ? '…' : 'Send'}</button></div><small>Messages are stored in PostgreSQL. Updates are refreshed every 3 seconds in this build.</small></form>
      </>}
    </section>
    {activeVoiceRoom && <VoiceRoomDialog room={activeVoiceRoom} onClose={() => setActiveVoiceRoom(null)} />}
    {showServerForm && <div className="cb-modal-backdrop"><form className="cb-modal" onSubmit={createServer}><button type="button" className="cb-modal-close" onClick={() => setShowServerForm(false)}>×</button><h2>Create a community</h2><p>Start a public space for students to learn and collaborate.</p><label>COMMUNITY NAME</label><input value={newServer} onChange={e => setNewServer(e.target.value)} maxLength={80} required autoFocus/><button className="cb-primary" type="submit">Create community</button></form></div>}
    {showChannelForm && <div className="cb-modal-backdrop"><form className="cb-modal" onSubmit={createChannel}><button type="button" className="cb-modal-close" onClick={() => setShowChannelForm(false)}>×</button><h2>Create a text channel</h2><p>Add a discussion area to {currentServer?.name}.</p><label>CHANNEL NAME</label><input value={newChannel} onChange={e => setNewChannel(e.target.value)} maxLength={80} required autoFocus/><button className="cb-primary" type="submit">Create channel</button></form></div>}
  </div>;
};
