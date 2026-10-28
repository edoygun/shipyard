import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api.js';
import LaunchCard from '../components/LaunchCard.jsx';

export default function MakerPage() {
  const { handle } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('launches');

  useEffect(() => {
    api.maker(handle).then(setData).catch((e) => setError(e.message));
  }, [handle]);

  function replace(updated) {
    const swap = (list) => list.map((l) => (l.id === updated.id ? updated : l));
    setData((d) => ({ ...d, launches: swap(d.launches), upvoted: swap(d.upvoted) }));
  }

  if (error) return <p className="empty">{error}</p>;
  if (!data) return <p className="empty">Loading…</p>;
  const list = data[tab];

  return (
    <div className="detail">
      <div className="card profile">
        <span className="avatar large">{data.maker.name[0]}</span>
        <div>
          <h1>{data.maker.name}</h1>
          <p className="muted">@{data.maker.handle}</p>
          {data.maker.bio && <p>{data.maker.bio}</p>}
        </div>
      </div>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'launches'} className={tab === 'launches' ? 'active' : ''} onClick={() => setTab('launches')}>
          Launches ({data.launches.length})
        </button>
        <button role="tab" aria-selected={tab === 'upvoted'} className={tab === 'upvoted' ? 'active' : ''} onClick={() => setTab('upvoted')}>
          Boosted ({data.upvoted.length})
        </button>
      </div>
      {list.length === 0 && <p className="empty">Nothing here yet.</p>}
      {list.map((launch) => <LaunchCard key={launch.id} launch={launch} onChange={replace} />)}
    </div>
  );
}
