import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSession } from '../session.jsx';

export default function Header() {
  const { user, signOut } = useSession();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const navigate = useNavigate();

  function search(event) {
    event.preventDefault();
    navigate(query.trim() ? `/?q=${encodeURIComponent(query.trim())}` : '/');
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">⛵</span>
          Shipyard
        </Link>
        <form className="search" onSubmit={search} role="search">
          <input
            type="search"
            placeholder="Search launches…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        <nav className="header-actions">
          <Link to="/submit" className="button">Launch something</Link>
          {user ? (
            <>
              <Link to={`/makers/${user.handle}`} className="avatar" title={user.name}>
                {user.name[0]}
              </Link>
              <button className="link-button" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <Link to="/signin" className="link-button">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
