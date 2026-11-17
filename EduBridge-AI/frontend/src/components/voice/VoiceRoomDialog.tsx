import React, { useEffect, useState } from 'react';
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import { ApiService } from '../../services/api';

type Props = { room: string; onClose: () => void };

export const VoiceRoomDialog: React.FC<Props> = ({ room, onClose }) => {
  const [credentials, setCredentials] = useState<{url:string;token:string}|null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    ApiService.getVoiceToken(room).then((data) => { if (active) setCredentials(data); })
      .catch((e) => { if (active) setError(e instanceof Error ? e.message : 'Could not join voice room.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [room]);
  return <div className="ev-overlay" role="dialog" aria-modal="true" aria-label="Voice and video room">
    <section className="ev-dialog">
      <header className="ev-header"><div><strong>{room.replace(/-/g, ' ')}</strong><small>EduBridge live room</small></div><button onClick={onClose} aria-label="Leave room">×</button></header>
      {loading && <p className="ev-state">Connecting securely to the voice service…</p>}
      {error && <p className="ev-error">{error}<br/>Check LiveKit configuration and your account permissions.</p>}
      {credentials && <LiveKitRoom token={credentials.token} serverUrl={credentials.url} connect audio video onDisconnected={onClose} data-lk-theme="default" style={{height:'min(76vh,760px)',background:'#111827'}}>
        <RoomAudioRenderer />
        <VideoConference />
      </LiveKitRoom>}
    </section>
  </div>;
};
