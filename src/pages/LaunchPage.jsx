import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import LaunchTile from '../components/LaunchTile.jsx';
import VoteButton from '../components/VoteButton.jsx';
import { useSession } from '../session.jsx';

export default function LaunchPage() {
  const { slug } = useParams();
  const { user } = useSession();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');

  useEffect(() => {
    api.launch(slug).then(setData).catch((e) => setError(e.message));
  }, [slug]);

  async function addComment(event) {
    event.preventDefault();
    if (!user) return navigate('/signin');
    const { comment } = await api.comment(slug, draft);
    setData((d) => ({
      launch: { ...d.launch, commentCount: d.launch.commentCount + 1 },
      comments: [...d.comments, comment],
    }));
    setDraft('');
  }

  if (error) return <p className="empty">{error}</p>;
  if (!data) return <p className="empty">Loading…</p>;
  const { launch, comments } = data;

  return (
    <article className="detail">
      <div className="card detail-head">
        <LaunchTile launch={launch} size={88} />
        <div className="launch-body">
          <h1>{launch.name}</h1>
          <p className="tagline">{launch.tagline}</p>
          <div className="meta">
            {launch.topics.map((t) => <Link key={t} to={`/topics/${t}`} className="chip">{t}</Link>)}
            <span>launched {new Date(launch.launchedAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="detail-actions">
          {launch.url && <a className="button secondary" href={launch.url} target="_blank" rel="noreferrer">Visit</a>}
          <VoteButton launch={launch} onChange={(updated) => setData((d) => ({ ...d, launch: updated }))} />
        </div>
      </div>

      <div className="card">
        <p>{launch.description || 'No description yet.'}</p>
        <p className="muted">
          Made by <Link to={`/makers/${launch.maker.handle}`}>{launch.maker.name}</Link>
        </p>
      </div>

      <div className="card">
        <h2>Discussion ({comments.length})</h2>
        <form className="comment-form" onSubmit={addComment}>
          <textarea
            placeholder={user ? 'Say something nice…' : 'Sign in to join the discussion'}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
          />
          <button className="button" disabled={!draft.trim()}>Post</button>
        </form>
        <ul className="comments">
          {comments.map((c) => (
            <li key={c.id}>
              <Link to={`/makers/${c.author.handle}`} className="avatar small">{c.author.name[0]}</Link>
              <div>
                <strong>{c.author.name}</strong>
                <span className="muted"> · {new Date(c.createdAt).toLocaleString()}</span>
                <p>{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
