import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../session.jsx';

export default function SignInPage() {
  const { signIn } = useSession();
  const navigate = useNavigate();
  const [handle, setHandle] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      await signIn(handle, name);
      navigate(-1);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <form className="card form narrow" onSubmit={submit}>
      <h1>Come aboard</h1>
      <p className="muted">Demo sign-in: pick any handle. No password, nothing leaves your machine.</p>
      <label>
        Handle
        <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="e.g. nadia" required />
      </label>
      <label>
        Display name <span className="muted">(new accounts only)</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="button">Sign in</button>
    </form>
  );
}
