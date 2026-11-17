import React, { useState } from 'react';
import { StudyGroup } from '../types';

interface GroupsViewProps {
  initialGroups: StudyGroup[];
  onToast: (msg: string) => void;
}

export const GroupsView: React.FC<GroupsViewProps> = ({ initialGroups, onToast }) => {
  const [groups, setGroups] = useState<StudyGroup[]>(initialGroups);
  const [newGroupName, setNewGroupName] = useState('');

  const handleToggleJoin = (id: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const next = !g.isJoined;
          onToast(next ? `Joined squad: "${g.name}" 🚀` : `Left group "${g.name}".`);
          return {
            ...g,
            isJoined: next,
            members: next ? g.members + 1 : g.members - 1,
          };
        }
        return g;
      })
    );
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGroup: StudyGroup = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      members: 1,
      isJoined: true,
      category: 'Student Initiative',
    };

    setGroups([newGroup, ...groups]);
    setNewGroupName('');
    onToast(`Study group "${newGroup.name}" created!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)] logo-font">
          Collaborative Study Groups
        </h2>
        <p className="text-sm opacity-75 mt-0.5">
          Studying together produces higher retention. Join dedicated study squads or start your own peer cohort.
        </p>
      </div>

      {/* Create Group Box */}
      <div className="eb-card">
        <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-2">
          Start a New Study Squad
        </h3>
        <form onSubmit={handleCreateGroup} className="flex gap-2">
          <input
            type="text"
            placeholder="Squad name (e.g., NEET 2025 Fast-Track Revisions)"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="eb-input py-2 text-sm flex-1"
          />
          <button type="submit" className="eb-btn red text-sm font-bold whitespace-nowrap">
            + Create Squad
          </button>
        </form>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map((g) => (
          <div
            key={g.id}
            className={`eb-card flex flex-col justify-between transition-all ${
              g.isJoined ? 'border-2 border-[var(--chilli)]' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="eb-tag text-xs font-bold bg-[var(--mango)]">
                  {g.category}
                </span>
                {g.isJoined && (
                  <span className="text-[11px] font-bold text-[var(--chilli)]">
                    ✓ Member
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-lg text-[var(--ink)] mb-1">
                {g.name}
              </h3>
              <p className="text-xs opacity-75 mb-4">
                {g.members} active students collaborating
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--ink)]/15 flex items-center justify-between">
              <span className="text-xs opacity-60">Daily active discussions</span>
              <button
                onClick={() => handleToggleJoin(g.id)}
                className={`eb-btn sm text-xs ${
                  g.isJoined ? 'eb-btn ghost font-bold text-[var(--chilli)]' : 'eb-btn font-bold'
                }`}
              >
                {g.isJoined ? 'Joined ✓' : 'Join Squad'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
