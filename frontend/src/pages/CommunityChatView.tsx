import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ApiService, ChatChannel, ChatMessage, ChatServer, getAccessToken, WS_URL } from '../services/api';
import '../styles/community-chat.css';
import { VoiceRoomDialog } from '../components/voice/VoiceRoomDialog';

type Props = {
  userName?: string;
  userRole?: string;
  onToast?: (message: string) => void;
};

export const CommunityChatView: React.FC<Props> = ({ userName = 'You', userRole = 'Student', onToast }) => {
  const [servers, setServers] = useState<ChatServer[]>([]);
  const [serverId, setServerId] = useState('');
  const [channelId, setChannelId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [newServer, setNewServer] = useState('');
  const [newChannel, setNewChannel] = useState('');
  const [channelType, setChannelType] = useState<'TEXT' | 'VOICE'>('TEXT');
  const [showServerForm, setShowServerForm] = useState(false);
  const [showChannelForm, setShowChannelForm] = useState(false);
  const [showLiveStreamModal, setShowLiveStreamModal] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeVoiceRoom, setActiveVoiceRoom] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentServer = servers.find((s) => s.id === serverId);
  const currentChannel = currentServer?.channels.find((c) => c.id === channelId);
  const isMentor = userRole === 'Mentor' || userRole === 'TEACHER' || userRole === 'ADMIN';

  const notify = (message: string) => (onToast ? onToast(message) : window.alert(message));

  const loadServers = useCallback(async () => {
    try {
      const data = await ApiService.listServers();
      setServers(data);
      setServerId((current) => (data.some((s) => s.id === current) ? current : data[0]?.id || ''));
      const selected = data.find((s) => s.id === serverId) || data[0];
      if (selected && !selected.channels.some((c) => c.id === channelId)) {
        setChannelId(selected.channels.find((c) => c.type === 'TEXT')?.id || '');
      }
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load communities.');
    } finally {
      setLoading(false);
    }
  }, [serverId, channelId]);

  const loadMessages = useCallback(async () => {
    if (!channelId) {
      setMessages([]);
      return;
    }
    try {
      setMessages(await ApiService.getMessages(channelId));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load messages.');
    }
  }, [channelId]);

  useEffect(() => {
    void loadServers();
  }, []);

  useEffect(() => {
    void loadMessages();
    const timer = window.setInterval(() => void loadMessages(), 15000);
    if (!channelId || !getAccessToken()) return () => window.clearInterval(timer);

    const socket = new WebSocket(WS_URL, ['v12.stomp']);
    let subscribed = false;

    socket.onopen = () =>
      socket.send(`CONNECT\naccept-version:1.2\nheart-beat:10000,10000\nAuthorization:Bearer ${getAccessToken()}\n\n\0`);

    socket.onmessage = (event) => {
      const frames = String(event.data).split('\0').filter(Boolean);
      frames.forEach((frame) => {
        if (frame.startsWith('CONNECTED') && !subscribed) {
          subscribed = true;
          socket.send(`SUBSCRIBE\nid:channel-${channelId}\ndestination:/topic/channels/${channelId}\nack:auto\n\n\0`);
        }
        if (frame.startsWith('MESSAGE')) {
          const bodyStart = frame.indexOf('\n\n');
          if (bodyStart >= 0) {
            try {
              const incoming = JSON.parse(frame.slice(bodyStart + 2)) as ChatMessage;
              setMessages((old) => (old.some((m) => m.id === incoming.id) ? old : [...old, incoming]));
            } catch {
              /* ignore */
            }
          }
        }
      });
    };

    return () => {
      window.clearInterval(timer);
      if (socket.readyState === WebSocket.OPEN) socket.send('DISCONNECT\n\n\0');
      socket.close();
    };
  }, [channelId, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const filtered = useMemo(
    () =>
      messages.filter(
        (m) =>
          !search ||
          m.content.toLowerCase().includes(search.toLowerCase()) ||
          m.senderName.toLowerCase().includes(search.toLowerCase())
      ),
    [messages, search]
  );

  const chooseServer = (server: ChatServer) => {
    setServerId(server.id);
    setChannelId(server.channels.find((c) => c.type === 'TEXT')?.id || '');
  };

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || !channelId || sending) return;
    setSending(true);
    try {
      const saved = await ApiService.sendMessage(channelId, content);
      setMessages((old) => [...old.filter((m) => m.id !== saved.id), saved]);
      setDraft('');
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Message could not be sent.');
    } finally {
      setSending(false);
    }
  };

  const createServer = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newServer.trim()) return;
    try {
      const created = await ApiService.createServer(newServer.trim());
      setServers((old) => [...old, created]);
      setServerId(created.id);
      setChannelId(created.channels.find((c) => c.type === 'TEXT')?.id || '');
      setNewServer('');
      setShowServerForm(false);
      notify('Community created successfully! 🎉');
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Could not create community.');
    }
  };

  const createChannel = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newChannel.trim() || !serverId) return;
    try {
      const created = await ApiService.createChannel(serverId, newChannel.trim(), channelType);
      setServers((old) =>
        old.map((s) => (s.id === serverId ? { ...s, channels: [...s.channels, created] } : s))
      );
      if (created.type === 'VOICE') {
        setActiveVoiceRoom(created.id);
      } else {
        setChannelId(created.id);
      }
      setNewChannel('');
      setShowChannelForm(false);
      notify(`${channelType === 'VOICE' ? 'Voice & Video study room' : 'Text channel'} created! 🚀`);
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Could not create channel.');
    }
  };

  const startMentorStream = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = streamTitle.trim() || `${userName}'s Live Class`;
    try {
      if (serverId) {
        const streamChannel = await ApiService.createChannel(serverId, `🔴 ${title}`, 'VOICE');
        setServers((old) =>
          old.map((s) => (s.id === serverId ? { ...s, channels: [...s.channels, streamChannel] } : s))
        );
        setActiveVoiceRoom(streamChannel.id);
      } else {
        setActiveVoiceRoom(`live-${Date.now().toString(36)}`);
      }
      setShowLiveStreamModal(false);
      setStreamTitle('');
      notify('Live broadcast started! Share your screen and camera with students. 🎥');
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Could not launch live stream.');
    }
  };

  const removeMessage = async (id: string) => {
    try {
      await ApiService.deleteMessage(id);
      setMessages((old) => old.filter((m) => m.id !== id));
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Could not delete message.');
    }
  };

  const joinVoice = (channel: ChatChannel) => {
    setActiveVoiceRoom(channel.id);
  };

  if (loading) return <div className="cb-shell cb-loading">Connecting to EduBridge communities…</div>;

  return (
    <div className="cb-shell">
      {/* 1. Communities / Servers List */}
      <aside className="cb-servers">
        <button className="cb-home" title="EduBridge Main">
          E
        </button>
        <div className="cb-serverline" />
        {servers.map((server) => (
          <button
            key={server.id}
            title={server.name}
            className={`cb-server ${server.id === serverId ? 'active' : ''}`}
            onClick={() => chooseServer(server)}
          >
            <span>{server.name.slice(0, 1).toUpperCase()}</span>
          </button>
        ))}
        <button className="cb-addserver" title="Create community" onClick={() => setShowServerForm(true)}>
          ＋
        </button>
      </aside>

      {/* 2. Channels Sidebar */}
      <aside className="cb-channelbar">
        <div className="cb-serverhead">
          <span className="truncate">{currentServer?.name || 'Communities'}</span>
          <button
            onClick={() => {
              setChannelType('TEXT');
              setShowChannelForm(true);
            }}
            title="Create room / channel"
            disabled={!serverId}
          >
            ＋
          </button>
        </div>

        {/* Text Channels Section */}
        <div className="cb-category">
          <span>TEXT CHANNELS</span>
          <button
            onClick={() => {
              setChannelType('TEXT');
              setShowChannelForm(true);
            }}
            title="Add text channel"
            disabled={!serverId}
          >
            ＋
          </button>
        </div>
        {currentServer?.channels
          .filter((c) => c.type === 'TEXT' || c.type === 'ANNOUNCEMENT' || c.type === 'FORUM')
          .map((c) => (
            <button
              key={c.id}
              onClick={() => setChannelId(c.id)}
              className={`cb-channel ${channelId === c.id ? 'selected' : ''}`}
            >
              <span>#</span>
              <span className="truncate">{c.name}</span>
            </button>
          ))}

        {/* Voice & Video Study Rooms Section */}
        <div className="cb-category">
          <span>VOICE & VIDEO ROOMS</span>
          <button
            onClick={() => {
              setChannelType('VOICE');
              setShowChannelForm(true);
            }}
            title="Add voice/video study room"
            disabled={!serverId}
          >
            ＋
          </button>
        </div>
        {currentServer?.channels
          .filter((c) => c.type === 'VOICE')
          .map((c) => (
            <button key={c.id} onClick={() => void joinVoice(c)} className="cb-channel">
              <span>◖</span>
              <span className="truncate">{c.name}</span>
            </button>
          ))}

        {/* User Profile Bar */}
        <div className="cb-profile">
          <div className="cb-avatar">{userName.slice(0, 1).toUpperCase()}</div>
          <div className="min-w-0">
            <strong className="block truncate">{userName}</strong>
            <small>{isMentor ? '🎓 Mentor' : '🎒 Student'}</small>
          </div>
        </div>
      </aside>

      {/* 3. Main Chat View */}
      <section className="cb-main">
        <header className="cb-topbar">
          <div className="cb-top-title">
            <strong># {currentChannel?.name || 'Select a channel'}</strong>
            <span>Live community discussion & study exchange</span>
          </div>

          <div className="cb-top-actions">
            {/* Mentor Streaming Button */}
            <button
              className="cb-stream-btn"
              onClick={() => setShowLiveStreamModal(true)}
              title="Start a live video stream & broadcast your screen"
            >
              🔴 Go Live
            </button>

            <label className="cb-search">
              ⌕{' '}
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages"
              />
            </label>
          </div>
        </header>

        {error && (
          <div className="cb-error" role="alert">
            {error} — ensure the Spring Boot API is running and you are signed in.
          </div>
        )}

        {!currentChannel ? (
          <div className="cb-empty">
            <h2>Welcome to EduBridge Communities</h2>
            <p>Create a community or select one to begin collaborating with peers and mentors.</p>
            <button className="cb-primary" onClick={() => setShowServerForm(true)}>
              Create community
            </button>
          </div>
        ) : (
          <>
            <div className="cb-messages">
              {filtered.length === 0 ? (
                <div className="cb-empty">
                  <h2>Welcome to #{currentChannel.name}</h2>
                  <p>This is the start of this channel. Say hello or ask a question!</p>
                </div>
              ) : (
                filtered.map((message) => (
                  <article key={message.id} className="cb-message">
                    <div className="cb-avatar">{message.senderName.slice(0, 1).toUpperCase()}</div>
                    <div className="cb-message-body">
                      <div className="cb-message-meta">
                        <strong>{message.senderName}</strong>
                        <time>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
                        {message.editedAt && <small>(edited)</small>}
                      </div>
                      <p>{message.content}</p>
                      <button
                        className="cb-delete"
                        title="Delete your message"
                        onClick={() => void removeMessage(message.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            <form className="cb-composer-wrap" onSubmit={send}>
              <div className="cb-composer">
                <button
                  type="button"
                  title="Upload attachment"
                  onClick={() => notify('File attachment support will be enabled with S3 storage.')}
                >
                  ＋
                </button>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Message #${currentChannel.name}…`}
                  maxLength={4000}
                />
                <button type="submit" disabled={!draft.trim() || sending}>
                  {sending ? '…' : 'Send'}
                </button>
              </div>
              <small>Real-time encrypted messaging via Spring Boot STOMP WebSocket broker.</small>
            </form>
          </>
        )}
      </section>

      {/* 4. Active Voice & Video Room Dialog (Mesh WebRTC) */}
      {activeVoiceRoom && (
        <VoiceRoomDialog room={activeVoiceRoom} onClose={() => setActiveVoiceRoom(null)} />
      )}

      {/* 5. Create Community Modal */}
      {showServerForm && (
        <div className="cb-modal-backdrop">
          <form className="cb-modal" onSubmit={createServer}>
            <button type="button" className="cb-modal-close" onClick={() => setShowServerForm(false)}>
              ×
            </button>
            <h2>Create a Community</h2>
            <p>Start a shared space for students and mentors to collaborate.</p>
            <label>COMMUNITY NAME</label>
            <input
              value={newServer}
              onChange={(e) => setNewServer(e.target.value)}
              placeholder="e.g. Physics Honors 2026"
              maxLength={80}
              required
              autoFocus
            />
            <button className="cb-primary" type="submit">
              Create Community
            </button>
          </form>
        </div>
      )}

      {/* 6. Create Channel / Room Modal (Supports Text or Voice) */}
      {showChannelForm && (
        <div className="cb-modal-backdrop">
          <form className="cb-modal" onSubmit={createChannel}>
            <button type="button" className="cb-modal-close" onClick={() => setShowChannelForm(false)}>
              ×
            </button>
            <h2>Create a Room</h2>
            <p>Add a study channel or voice room to {currentServer?.name}.</p>

            <label>ROOM TYPE</label>
            <div className="cb-type-selector">
              <button
                type="button"
                className={`cb-type-tab ${channelType === 'TEXT' ? 'active' : ''}`}
                onClick={() => setChannelType('TEXT')}
              >
                💬 Text Channel
              </button>
              <button
                type="button"
                className={`cb-type-tab ${channelType === 'VOICE' ? 'active' : ''}`}
                onClick={() => setChannelType('VOICE')}
              >
                ◖ Voice & Video Room
              </button>
            </div>

            <label>ROOM NAME</label>
            <input
              value={newChannel}
              onChange={(e) => setNewChannel(e.target.value)}
              placeholder={channelType === 'TEXT' ? 'e.g. homework-help' : 'e.g. Study Lounge #1'}
              maxLength={80}
              required
              autoFocus
            />
            <button className="cb-primary" type="submit">
              {channelType === 'VOICE' ? 'Create Voice Room' : 'Create Channel'}
            </button>
          </form>
        </div>
      )}

      {/* 7. Mentor Live Stream Broadcast Modal */}
      {showLiveStreamModal && (
        <div className="cb-modal-backdrop">
          <form className="cb-modal" onSubmit={startMentorStream}>
            <button type="button" className="cb-modal-close" onClick={() => setShowLiveStreamModal(false)}>
              ×
            </button>
            <h2>🔴 Mentor Live Broadcast</h2>
            <p>Broadcast your camera, audio, and screen live to all students in this community.</p>

            <label>STREAM / LECTURE TITLE</label>
            <input
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              placeholder="e.g. Calculus Q&A + Screen Walkthrough"
              maxLength={80}
              autoFocus
            />
            <div className="text-xs text-[var(--ink)] opacity-75 my-2">
              💡 Tip: Click <strong>"Share Screen"</strong> inside the room to present your slides, whiteboard, or code editor directly to participants.
            </div>
            <button className="cb-primary" type="submit">
              Start Broadcasting Live →
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
