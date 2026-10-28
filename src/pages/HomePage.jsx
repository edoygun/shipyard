import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import LaunchCard from '../components/LaunchCard.jsx';

const DAY = 24 * 60 * 60 * 1000;

function dayLabel(iso) {
  const date = new Date(iso);
  const diff = Math.round((new Date().setHours(0, 0, 0, 0) - new Date(iso).setHours(0, 0, 0, 0)) / DAY);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

// Launches arrive newest first; group them by local day and order each day.
function groupByDay(launches, sort) {
  const groups = [];
  for (const launch of launches) {
    const label = dayLabel(launch.launchedAt);
    if (groups.at(-1)?.label !== label) groups.push({ label, launches: [] });
    groups.at(-1).launches.push(launch);
  }
  if (sort === 'top') groups.forEach((g) => g.launches.sort((a, b) => b.votes - a.votes));
  return groups;
}

export default function HomePage() {
  const { topic } = useParams();
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [sort, setSort] = useState('top');
  const [launches, setLaunches] = useState(null);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    api.topics().then((data) => setTopics(data.topics));
  }, []);

  useEffect(() => {
    setLaunches(null);
    api.launches({ topic, q }).then((data) => setLaunches(data.launches));
  }, [topic, q]);

  function replace(updated) {
    setLaunches((list) => list.map((l) => (l.id === updated.id ? updated : l)));
  }

  const current = topics.find((t) => t.slug === topic);
  const title = q ? `Results for “${q}”` : current ? current.name : 'Fresh off the slipway';

  return (
    <div className="layout">
      <section>
        <div className="feed-head">
          <h1>{title}</h1>
          <div className="tabs" role="tablist">
            {['top', 'new'].map((s) => (
              <button key={s} role="tab" aria-selected={sort === s} className={sort === s ? 'active' : ''} onClick={() => setSort(s)}>
                {s === 'top' ? 'Most boosted' : 'Newest'}
              </button>
            ))}
          </div>
        </div>

        {!launches && <p className="empty">Loading launches…</p>}
        {launches?.length === 0 && <p className="empty">No launches match.</p>}
        {launches && groupByDay(launches, sort).map((group) => (
          <div key={group.label} className="day">
            <h2>{group.label}</h2>
            {group.launches.map((launch, i) => (
              <LaunchCard key={launch.id} launch={launch} rank={sort === 'top' ? i + 1 : null} onChange={replace} />
            ))}
          </div>
        ))}
      </section>

      <aside className="sidebar card">
        <h3>Topics</h3>
        <ul>
          <li><Link to="/" className={!topic ? 'active' : ''}>All launches</Link></li>
          {topics.map((t) => (
            <li key={t.slug}>
              <Link to={`/topics/${t.slug}`} className={topic === t.slug ? 'active' : ''}>
                {t.name} <span className="count">{t.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
