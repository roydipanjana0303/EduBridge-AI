import React, { useState } from 'react';
import { VoiceRoom } from '../types';
import { AppIcon } from '../components/Icons';
import { VoiceRoomDialog } from '../components/voice/VoiceRoomDialog';

interface VoiceViewProps {
  rooms: VoiceRoom[];
  userName: string;
  onToast: (msg: string) => void;
}

const AVATAR_COLORS = ['#B9E4E8', '#9ED5DC', '#D3EEF1', '#B9E4E8', '#9ED5DC'];

export const VoiceView: React.FC<VoiceViewProps> = ({ rooms, userName, onToast }) => {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [liveKitRoom, setLiveKitRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const handleJoin = (roomId: string, roomName: string) => {
    setActiveRoomId(roomId);
    // Build a valid LiveKit room name from the room name (alphanumeric + dash/underscore)
    const lkRoom = roomName.replace(/[^A-Za-z0-9_-]/g, '-').replace(/-+/g, '-').slice(0, 80);
    setLiveKitRoom(lkRoom);
    onToast(`Connecting to voice channel: ${roomName} 🎧`);
  };

  const handleLeave = () => {
    setActiveRoomId(null);
    setLiveKitRoom(null);
    onToast('Disconnected from voice channel.');
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    onToast(next ? 'Microphone muted 🔇' : 'Microphone unmuted 🎙️');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)] logo-font">
            Voice Study Rooms
          </h2>
          <p className="text-sm opacity-75 mt-0.5">
            Drop-in audio spaces for collective study sessions, peer problem-solving, and late-night doubt grinds.
          </p>
        </div>

        {activeRoomId && (
          <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-[var(--mango)] text-[#071B2B] text-xs font-bold border border-[var(--ink)]">
            <span className="live-dot" />
            <span>Connected: {rooms.find((r) => r.id === activeRoomId)?.name}</span>
            <button
              onClick={handleToggleMute}
              className="ml-2 eb-btn sm py-0.5 px-2 bg-white text-xs"
            >
              <AppIcon name={isMuted ? 'micOff' : 'mic'} className="w-3.5 h-3.5" />
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>
            <button
              onClick={handleLeave}
              className="eb-btn red sm py-0.5 px-2 text-xs"
            >
              Leave
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {rooms.map((room) => {
          const isUserInRoom = activeRoomId === room.id;
          return (
            <div
              key={room.id}
              className={`eb-card flex flex-col justify-between transition-all ${
                isUserInRoom
                  ? 'border-2 border-[var(--chilli)] bg-[var(--soft)]/50 shadow-md'
                  : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-lg text-[var(--ink)]">{room.name}</h3>
                  {room.isLive ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--chilli)]">
                      <span className="live-dot" />
                      Live session
                    </span>
                  ) : (
                    <span className="text-xs opacity-60">Quiet / Idle</span>
                  )}
                </div>

                <p className="text-xs opacity-75 mb-4">
                  Topic: <b>{room.topic || 'Open study discussion'}</b>
                </p>

                {/* Participant Avatars */}
                <div className="flex items-center gap-2 min-h-[42px] mb-4">
                  {room.participants.map((initial, idx) => (
                    <span
                      key={idx}
                      className="eb-avatar w-9 h-9 text-xs font-black shadow-sm"
                      style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                      title={`Student ${initial}`}
                    >
                      {initial}
                    </span>
                  ))}

                  {isUserInRoom && (
                    <span
                      className="eb-avatar w-9 h-9 text-xs font-black bg-[var(--chilli)] text-white ring-2 ring-[var(--ink)]"
                      title="You"
                    >
                      {userName.charAt(0)}
                    </span>
                  )}

                  {room.participants.length === 0 && !isUserInRoom && (
                    <span className="text-xs opacity-60 italic">Room is empty. Be the first to join!</span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--ink)]/15 flex items-center justify-between">
                <span className="text-xs opacity-70">
                  {room.participants.length + (isUserInRoom ? 1 : 0)} listening
                </span>

                {isUserInRoom ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleToggleMute}
                      className="eb-btn ghost sm text-xs"
                    >
                      <AppIcon name={isMuted ? 'micOff' : 'mic'} className="w-3.5 h-3.5" />
                      <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                    </button>
                    <button
                      onClick={handleLeave}
                      className="eb-btn red sm text-xs"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleJoin(room.id, room.name)}
                    className="eb-btn text-xs font-bold"
                  >
                    🎧 Join Room
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* LiveKit voice dialog — opens when a room is joined */}
      {liveKitRoom && (
        <VoiceRoomDialog
          room={liveKitRoom}
          onClose={() => {
            setLiveKitRoom(null);
            setActiveRoomId(null);
            onToast('Left voice room.');
          }}
        />
      )}
    </div>
  );
};
