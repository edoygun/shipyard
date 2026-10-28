import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useSession } from '../session.jsx';

export default function SubmitPage() {
  const { user, ready } = useSession();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [form, setForm] = useState({ name: '', tagline: '', description: '', url: '', topics: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    api.topics().then((data) => setTopics(data.topics));
  }, []);

  if (ready && !user) return <Navigate to="/signin" />;

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  function toggleTopic(slug) {
    const has = form.topics.includes(slug);
    setForm({ ...form, topics: has ? form.topics.filter((t) => t !== slug) : [...form.topics, slug] });
  }

  async function submit(event) {
    event.preventDefault();
    try {
      const { launch } = await api.submit(form);
      navigate(`/launches/${launch.slug}`);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h1>Launch something</h1>
      <label>
        Name
        <input value={form.name} onChange={update('name')} required maxLength={40} />
      </label>
      <label>
        Tagline
        <input value={form.tagline} onChange={update('tagline')} required maxLength={80} placeholder="One line that sells it" />
      </label>
      <label>
        Website
        <input type="url" value={form.url} onChange={update('url')} placeholder="https://" />
      </label>
      <label>
        Description
        <textarea value={form.description} onChange={update('description')} rows={5} />
      </label>
      <fieldset>
        <legend>Topics</legend>
        <div className="chips">
          {topics.map((t) => (
            <button
              type="button"
              key={t.slug}
              className={`chip ${form.topics.includes(t.slug) ? 'selected' : ''}`}
              onClick={() => toggleTopic(t.slug)}
            >
              {t.name}
            </button>
          ))}
        </div>
      </fieldset>
      {error && <p className="error">{error}</p>}
      <button className="button">Launch 🚀</button>
    </form>
  );
}
