import { Link } from 'react-router-dom';
import LaunchTile from './LaunchTile.jsx';
import VoteButton from './VoteButton.jsx';

export default function LaunchCard({ launch, rank, onChange }) {
  return (
    <article className="card launch-card">
      {rank && <span className="rank">{rank}</span>}
      <LaunchTile launch={launch} />
      <div className="launch-body">
        <Link to={`/launches/${launch.slug}`} className="launch-name">{launch.name}</Link>
        <p className="tagline">{launch.tagline}</p>
        <div className="meta">
          {launch.topics.map((t) => (
            <Link key={t} to={`/topics/${t}`} className="chip">{t}</Link>
          ))}
          <span>💬 {launch.commentCount}</span>
          <span>by <Link to={`/makers/${launch.maker.handle}`}>{launch.maker.name}</Link></span>
        </div>
      </div>
      <VoteButton launch={launch} onChange={onChange} />
    </article>
  );
}
