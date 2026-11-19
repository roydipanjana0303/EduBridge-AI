import React, { useEffect, useRef, useState } from 'react';
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import { ApiService, WS_URL, getAccessToken } from '../../services/api';

type Props = { room: string; onClose: () => void };

interface RemotePeer {
  id: string;
  name: string;
  stream: MediaStream;
  pc: RTCPeerConnection;
}

export const VoiceRoomDialog: React.FC<Props> = ({ room, onClose }) => {
  const [credentials, setCredentials] = useState<{ url: string; token: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // WebRTC Mesh State
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remotePeers, setRemotePeers] = useState<RemotePeer[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting to study room…');

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const peersRef = useRef<Map<string, RemotePeer>>(new Map());
  const myIdRef = useRef<string>('');
  const myNameRef = useRef<string>('You');
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);

  // 1. Fetch Room Credentials
  useEffect(() => {
    let active = true;
    ApiService.getVoiceToken(room)
      .then((data) => {
        if (!active) return;
        setCredentials(data);
        if (data.token.includes(':')) {
          const parts = data.token.split(':');
          myIdRef.current = parts[0] || Math.random().toString(36).slice(2);
          myNameRef.current = parts.slice(1).join(':') || 'Participant';
        } else {
          myIdRef.current = Math.random().toString(36).slice(2);
          myNameRef.current = 'Participant';
        }
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : 'Could not join voice room.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [room]);

  // 2. Setup Local Media & WebSocket Signaling if using WebRTC Mesh
  useEffect(() => {
    if (!credentials || credentials.url.startsWith('ws://') || credentials.url.startsWith('wss://')) {
      return;
    }

    let isSubscribed = true;
    const rtcConfig: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' },
      ],
    };

    // Acquire Local Media (Camera + Mic)
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: { width: { ideal: 640 }, height: { ideal: 360 } } })
      .then((stream) => {
        if (!isSubscribed) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setConnectionStatus('Connected to live room');
        initSignaling(stream);
      })
      .catch(() => {
        // Fallback to audio-only if camera is absent or denied
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((audioStream) => {
            if (!isSubscribed) {
              audioStream.getTracks().forEach((t) => t.stop());
              return;
            }
            setLocalStream(audioStream);
            setIsVideoMuted(true);
            setConnectionStatus('Connected (Audio only)');
            initSignaling(audioStream);
          })
          .catch(() => {
            setConnectionStatus('Connected (Listen mode)');
            initSignaling(null);
          });
      });

    function initSignaling(stream: MediaStream | null) {
      const token = getAccessToken();
      const ws = new WebSocket(WS_URL, ['v12.stomp']);
      socketRef.current = ws;

      const sendSignal = (body: Record<string, unknown>) => {
        if (ws.readyState === WebSocket.OPEN) {
          const payload = JSON.stringify(body);
          ws.send(
            `SEND\ndestination:/topic/voice/${room}\ncontent-type:application/json\n\n${payload}\0`
          );
        }
      };

      ws.onopen = () => {
        ws.send(
          `CONNECT\naccept-version:1.2\nheart-beat:10000,10000\nAuthorization:Bearer ${token}\n\n\0`
        );
      };

      ws.onmessage = (event) => {
        const frames = String(event.data).split('\0').filter(Boolean);
        frames.forEach((frame) => {
          if (frame.startsWith('CONNECTED')) {
            ws.send(
              `SUBSCRIBE\nid:voice-${room}\ndestination:/topic/voice/${room}\nack:auto\n\n\0`
            );
            // Announce presence to existing peers
            setTimeout(() => {
              sendSignal({
                type: 'join',
                senderId: myIdRef.current,
                senderName: myNameRef.current,
              });
            }, 300);
          }

          if (frame.startsWith('MESSAGE')) {
            const bodyIdx = frame.indexOf('\n\n');
            if (bodyIdx === -1) return;
            try {
              const msg = JSON.parse(frame.slice(bodyIdx + 2).trim());
              handleSignalMessage(msg, stream, sendSignal);
            } catch {
              // Ignore non-json frames
            }
          }
        });
      };
    }

    function createPeerConnection(
      peerId: string,
      peerName: string,
      stream: MediaStream | null,
      sendSignal: (b: Record<string, unknown>) => void
    ): RTCPeerConnection {
      const pc = new RTCPeerConnection(rtcConfig);

      if (stream) {
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignal({
            type: 'ice',
            candidate: event.candidate,
            targetId: peerId,
            senderId: myIdRef.current,
          });
        }
      };

      pc.ontrack = (event) => {
        const remoteStream = event.streams[0] || new MediaStream([event.track]);
        const peerObj: RemotePeer = { id: peerId, name: peerName, stream: remoteStream, pc };
        peersRef.current.set(peerId, peerObj);
        setRemotePeers(Array.from(peersRef.current.values()));
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
          peersRef.current.delete(peerId);
          setRemotePeers(Array.from(peersRef.current.values()));
        }
      };

      return pc;
    }

    async function handleSignalMessage(
      msg: { type: string; senderId: string; senderName?: string; targetId?: string; sdp?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit },
      stream: MediaStream | null,
      sendSignal: (b: Record<string, unknown>) => void
    ) {
      if (msg.senderId === myIdRef.current) return;

      if (msg.type === 'join') {
        // Someone joined: initiate WebRTC Offer
        const pc = createPeerConnection(msg.senderId, msg.senderName || 'Peer', stream, sendSignal);
        const peerObj: RemotePeer = { id: msg.senderId, name: msg.senderName || 'Peer', stream: new MediaStream(), pc };
        peersRef.current.set(msg.senderId, peerObj);
        setRemotePeers(Array.from(peersRef.current.values()));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendSignal({
          type: 'offer',
          sdp: offer,
          targetId: msg.senderId,
          senderId: myIdRef.current,
          senderName: myNameRef.current,
        });
      }

      if (msg.type === 'offer' && msg.targetId === myIdRef.current) {
        // Received Offer: create Answer
        const pc = createPeerConnection(msg.senderId, msg.senderName || 'Peer', stream, sendSignal);
        const peerObj: RemotePeer = { id: msg.senderId, name: msg.senderName || 'Peer', stream: new MediaStream(), pc };
        peersRef.current.set(msg.senderId, peerObj);
        setRemotePeers(Array.from(peersRef.current.values()));

        if (msg.sdp) {
          await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          sendSignal({
            type: 'answer',
            sdp: answer,
            targetId: msg.senderId,
            senderId: myIdRef.current,
          });
        }
      }

      if (msg.type === 'answer' && msg.targetId === myIdRef.current) {
        const peer = peersRef.current.get(msg.senderId);
        if (peer && msg.sdp) {
          await peer.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        }
      }

      if (msg.type === 'ice' && msg.targetId === myIdRef.current) {
        const peer = peersRef.current.get(msg.senderId);
        if (peer && msg.candidate) {
          try {
            await peer.pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
          } catch {
            // Ignore candidate errors
          }
        }
      }

      if (msg.type === 'leave') {
        const peer = peersRef.current.get(msg.senderId);
        if (peer) {
          peer.pc.close();
          peersRef.current.delete(msg.senderId);
          setRemotePeers(Array.from(peersRef.current.values()));
        }
      }
    }

    return () => {
      isSubscribed = false;
      // Notify peers that we are leaving
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          `SEND\ndestination:/topic/voice/${room}\ncontent-type:application/json\n\n${JSON.stringify({
            type: 'leave',
            senderId: myIdRef.current,
          })}\0`
        );
        socketRef.current.close();
      }
      // Stop media tracks
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
      // Close peer connections
      peersRef.current.forEach((peer) => peer.pc.close());
      peersRef.current.clear();
    };
  }, [credentials, room]);

  // Audio Toggle
  const toggleAudio = () => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioMuted(!audioTrack.enabled);
    }
  };

  // Video Toggle
  const toggleVideo = () => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoMuted(!videoTrack.enabled);
    }
  };

  // Screen Share Toggle
  const toggleScreenShare = async () => {
    if (isScreenSharing && screenTrackRef.current) {
      screenTrackRef.current.stop();
      screenTrackRef.current = null;
      setIsScreenSharing(false);
      return;
    }

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const track = displayStream.getVideoTracks()[0];
      screenTrackRef.current = track;
      setIsScreenSharing(true);

      peersRef.current.forEach((peer) => {
        const sender = peer.pc.getSenders().find((s) => s.track?.kind === 'video');
        if (sender) {
          void sender.replaceTrack(track);
        }
      });

      track.onended = () => {
        setIsScreenSharing(false);
        screenTrackRef.current = null;
        if (localStream) {
          const origVideo = localStream.getVideoTracks()[0];
          peersRef.current.forEach((peer) => {
            const sender = peer.pc.getSenders().find((s) => s.track?.kind === 'video');
            if (sender && origVideo) {
              void sender.replaceTrack(origVideo);
            }
          });
        }
      };
    } catch {
      setIsScreenSharing(false);
    }
  };

  // Render LiveKit if configured with cloud server URL
  const isLiveKitCloud = credentials && (credentials.url.startsWith('ws://') || credentials.url.startsWith('wss://'));

  return (
    <div className="ev-overlay" role="dialog" aria-modal="true" aria-label="Voice and video room">
      <section className="ev-dialog flex flex-col h-[82vh] max-h-[820px] bg-[#0E1522] border-2 border-[var(--chilli)] shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <header className="ev-header flex items-center justify-between px-6 py-4 bg-[#141C2E] border-b border-gray-700">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <strong className="text-lg font-black text-white capitalize">{room.replace(/-/g, ' ')}</strong>
              <small className="block text-xs text-cyan-300 font-semibold">{connectionStatus}</small>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Leave room"
            className="text-gray-400 hover:text-white text-2xl font-black px-2 py-1 transition-colors"
          >
            ×
          </button>
        </header>

        {loading && <p className="ev-state p-8 text-center text-gray-300">Connecting securely to study space…</p>}
        {error && <p className="ev-error p-8 text-center text-rose-400">{error}</p>}

        {/* LiveKit Cloud Mode */}
        {isLiveKitCloud && (
          <div className="flex-1 min-h-0 bg-black">
            <LiveKitRoom
              token={credentials.token}
              serverUrl={credentials.url}
              connect
              audio
              video
              onDisconnected={onClose}
              data-lk-theme="default"
              style={{ height: '100%' }}
            >
              <RoomAudioRenderer />
              <VideoConference />
            </LiveKitRoom>
          </div>
        )}

        {/* WebRTC Multi-User Mesh Mode */}
        {!isLiveKitCloud && credentials && (
          <div className="flex-1 flex flex-col min-h-0 bg-[#0B0F19]">
            {/* Participant Video Tiles Grid */}
            <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
              {/* Local User Tile */}
              <div className="relative rounded-xl overflow-hidden bg-[#182234] border border-cyan-500/30 flex items-center justify-center min-h-[220px]">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isVideoMuted ? 'hidden' : 'block'}`}
                />
                {isVideoMuted && (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                      {myNameRef.current.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-300 font-bold">Camera Off</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded-md text-xs font-bold text-white flex items-center gap-1.5 border border-white/10">
                  <span>{myNameRef.current} (You)</span>
                  {isAudioMuted && <span className="text-rose-400">🔇</span>}
                </div>
              </div>

              {/* Remote Participants Tiles */}
              {remotePeers.map((peer) => (
                <RemoteVideoTile key={peer.id} peer={peer} />
              ))}

              {/* Empty state hint when alone in room */}
              {remotePeers.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/40 p-6 flex flex-col items-center justify-center text-center text-gray-400">
                  <span className="text-3xl mb-2">🎧</span>
                  <b className="text-sm text-gray-200">You are the first one in this study room!</b>
                  <p className="text-xs mt-1 max-w-xs text-gray-400">
                    Open another browser window or invite a study partner with a different account to join this room together.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Call Controls Toolbar */}
            <footer className="p-4 bg-[#141C2E] border-t border-gray-800 flex items-center justify-center gap-3">
              <button
                onClick={toggleAudio}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  isAudioMuted
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                }`}
              >
                <span>{isAudioMuted ? '🔇 Unmute' : '🎙️ Mute'}</span>
              </button>

              <button
                onClick={toggleVideo}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  isVideoMuted
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                }`}
              >
                <span>{isVideoMuted ? '📷 Start Video' : '📹 Stop Video'}</span>
              </button>

              <button
                onClick={toggleScreenShare}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  isScreenSharing
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                }`}
              >
                <span>{isScreenSharing ? '🖥️ Stop Share' : '🖥️ Share Screen'}</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-black text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-all"
              >
                🔴 Leave Room
              </button>
            </footer>
          </div>
        )}
      </section>
    </div>
  );
};

// Helper component for remote peer video
const RemoteVideoTile: React.FC<{ peer: RemotePeer }> = ({ peer }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && peer.stream) {
      videoRef.current.srcObject = peer.stream;
    }
  }, [peer.stream]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-[#182234] border border-emerald-500/30 flex items-center justify-center min-h-[220px]">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded-md text-xs font-bold text-white flex items-center gap-1.5 border border-white/10">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span>{peer.name}</span>
      </div>
    </div>
  );
};
