import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useSession } from '../session.jsx';

export default function VoteButton({ launch, onChange }) {
  const { user } = useSession();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!user) return navigate('/signin');
    setBusy(true);
    try {
      onChange((await api.vote(launch.slug)).launch);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      className={`vote ${launch.voted ? 'voted' : ''}`}
      onClick={toggle}
      disabled={busy}
      aria-pressed={launch.voted}
      aria-label={`${launch.voted ? 'Remove boost from' : 'Boost'} ${launch.name}`}
    >
      <span className="vote-arrow">▲</span>
      <span>{launch.votes}</span>
    </button>
  );
}
