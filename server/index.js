import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { load, save } from './db.js';

const PORT = process.env.PORT || 3001;
const distDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const db = load();
const app = express();
app.use(express.json());

// --- helpers ---------------------------------------------------------------

// Demo-only auth: the signed-in handle lives in a plain cookie.
function currentUser(req) {
  const match = /(?:^|;\s*)sy_user=([^;]+)/.exec(req.headers.cookie || '');
  if (!match) return null;
  return db.makers.find((m) => m.handle === decodeURIComponent(match[1])) || null;
}

function requireUser(req, res, next) {
  req.user = currentUser(req);
  if (!req.user) return res.status(401).json({ error: 'Sign in first.' });
  next();
}

function findLaunch(req, res, next) {
  req.launch = db.launches.find((l) => l.slug === req.params.slug);
  if (!req.launch) return res.status(404).json({ error: 'Launch not found.' });
  next();
}

function maker(handle) {
  return db.makers.find((m) => m.handle === handle) || { handle, name: handle, bio: '' };
}

function presentLaunch(launch, user) {
  const { voters, ...rest } = launch;
  return {
    ...rest,
    votes: voters.length,
    voted: user ? voters.includes(user.handle) : false,
    commentCount: db.comments.filter((c) => c.launchId === launch.id).length,
    maker: maker(launch.maker),
  };
}

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// --- session ---------------------------------------------------------------

app.get('/api/session', (req, res) => {
  res.json({ user: currentUser(req) });
});

app.post('/api/session', (req, res) => {
  const handle = slugify(req.body.handle || '');
  if (!handle) return res.status(400).json({ error: 'Pick a handle.' });
  let user = db.makers.find((m) => m.handle === handle);
  if (!user) {
    user = { handle, name: (req.body.name || handle).trim(), bio: '' };
    db.makers.push(user);
    save(db);
  }
  res.cookie('sy_user', handle, { httpOnly: true, sameSite: 'lax' });
  res.json({ user });
});

app.delete('/api/session', (req, res) => {
  res.clearCookie('sy_user');
  res.json({ user: null });
});

// --- topics ----------------------------------------------------------------

app.get('/api/topics', (req, res) => {
  res.json({
    topics: db.topics.map((t) => ({
      ...t,
      count: db.launches.filter((l) => l.topics.includes(t.slug)).length,
    })),
  });
});

// --- launches --------------------------------------------------------------

app.get('/api/launches', (req, res) => {
  const user = currentUser(req);
  const { topic, q } = req.query;
  const query = (q || '').toLowerCase();
  const launches = db.launches
    .filter((l) => !topic || l.topics.includes(topic))
    .filter((l) => !query || `${l.name} ${l.tagline}`.toLowerCase().includes(query))
    .sort((a, b) => b.launchedAt.localeCompare(a.launchedAt))
    .map((l) => presentLaunch(l, user));
  res.json({ launches });
});

app.post('/api/launches', requireUser, (req, res) => {
  const { name, tagline, description, url, topics = [] } = req.body;
  if (!name?.trim() || !tagline?.trim()) {
    return res.status(400).json({ error: 'Name and tagline are required.' });
  }
  let slug = slugify(name);
  if (db.launches.some((l) => l.slug === slug)) slug = `${slug}-${Date.now().toString(36)}`;

  const launch = {
    id: crypto.randomUUID(),
    slug,
    name: name.trim(),
    tagline: tagline.trim(),
    description: (description || '').trim(),
    url: (url || '').trim(),
    maker: req.user.handle,
    topics: topics.filter((t) => db.topics.some((known) => known.slug === t)),
    color: `hsl(${Math.floor(Math.random() * 360)} 65% 45%)`,
    launchedAt: new Date().toISOString(),
    voters: [req.user.handle],
  };
  db.launches.push(launch);
  save(db);
  res.status(201).json({ launch: presentLaunch(launch, req.user) });
});

app.get('/api/launches/:slug', findLaunch, (req, res) => {
  const user = currentUser(req);
  const comments = db.comments
    .filter((c) => c.launchId === req.launch.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((c) => ({ ...c, author: maker(c.author) }));
  res.json({ launch: presentLaunch(req.launch, user), comments });
});

app.post('/api/launches/:slug/vote', requireUser, findLaunch, (req, res) => {
  const { voters } = req.launch;
  const index = voters.indexOf(req.user.handle);
  if (index === -1) voters.push(req.user.handle);
  else voters.splice(index, 1);
  save(db);
  res.json({ launch: presentLaunch(req.launch, req.user) });
});

app.post('/api/launches/:slug/comments', requireUser, findLaunch, (req, res) => {
  const body = (req.body.body || '').trim();
  if (!body) return res.status(400).json({ error: 'Comment cannot be empty.' });
  const comment = {
    id: crypto.randomUUID(),
    launchId: req.launch.id,
    author: req.user.handle,
    body,
    createdAt: new Date().toISOString(),
  };
  db.comments.push(comment);
  save(db);
  res.status(201).json({ comment: { ...comment, author: req.user } });
});

// --- makers ----------------------------------------------------------------

app.get('/api/makers/:handle', (req, res) => {
  const user = currentUser(req);
  const profile = db.makers.find((m) => m.handle === req.params.handle);
  if (!profile) return res.status(404).json({ error: 'Maker not found.' });
  const byNewest = (a, b) => b.launchedAt.localeCompare(a.launchedAt);
  res.json({
    maker: profile,
    launches: db.launches.filter((l) => l.maker === profile.handle).sort(byNewest).map((l) => presentLaunch(l, user)),
    upvoted: db.launches.filter((l) => l.voters.includes(profile.handle)).sort(byNewest).map((l) => presentLaunch(l, user)),
  });
});

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

// --- production build ------------------------------------------------------

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res) => res.sendFile(path.join(distDir, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Shipyard API listening on http://localhost:${PORT}`);
});
