// Fictional starter data. Every product, maker and comment here is made up.
const HOUR = 60 * 60 * 1000;

const makers = [
  { handle: 'nadia', name: 'Nadia Okafor', bio: 'Building calm software for small teams.' },
  { handle: 'tomas', name: 'Tomás Rivera', bio: 'Infra nerd. Previously on-call forever.' },
  { handle: 'priya', name: 'Priya Natarajan', bio: 'Designer who ships code on weekends.' },
  { handle: 'kenji', name: 'Kenji Mori', bio: 'Local-first everything.' },
  { handle: 'amara', name: 'Amara Lindqvist', bio: 'Money tools for normal people.' },
  { handle: 'leo', name: 'Leo Brandt', bio: 'Data, dashboards and too much coffee.' },
];

const topics = [
  { slug: 'ai', name: 'AI' },
  { slug: 'developer-tools', name: 'Developer Tools' },
  { slug: 'productivity', name: 'Productivity' },
  { slug: 'design', name: 'Design' },
  { slug: 'finance', name: 'Finance' },
  { slug: 'analytics', name: 'Analytics' },
  { slug: 'home', name: 'Home' },
];

// [slug, name, tagline, maker, topics, hoursAgo, votes, color]
const rows = [
  ['tidepool', 'Tidepool', 'A shared inbox for tiny support teams', 'nadia', ['productivity'], 2, 184, '#0e9f8e'],
  ['stackfox', 'Stackfox', 'Preview environments for every pull request', 'tomas', ['developer-tools'], 3, 241, '#e8590c'],
  ['glyphsmith', 'Glyphsmith', 'Turn one rough sketch into a full icon set', 'priya', ['design', 'ai'], 5, 132, '#7048e8'],
  ['murmur', 'Murmur', 'Voice notes with on-device transcription', 'kenji', ['ai', 'productivity'], 7, 98, '#1c7ed6'],
  ['pebble-budget', 'Pebble Budget', 'Envelope budgeting built for couples', 'amara', ['finance'], 27, 156, '#f08c00'],
  ['cartograph', 'Cartograph', 'Self-hosted analytics in a single SQL file', 'leo', ['analytics', 'developer-tools'], 29, 203, '#2f9e44'],
  ['lumen-deck', 'Lumen Deck', 'Slides straight from your markdown notes', 'priya', ['design', 'productivity'], 31, 77, '#d6336c'],
  ['brightline', 'Brightline', 'Uptime alerts written in plain English', 'tomas', ['developer-tools', 'ai'], 50, 119, '#f59f00'],
  ['fernwatch', 'Fernwatch', 'Plant care reminders that learn your home', 'nadia', ['home'], 53, 88, '#37b24d'],
  ['quillmark', 'Quillmark', 'Annotate PDFs together in real time', 'kenji', ['productivity'], 55, 64, '#495057'],
  ['ledgerlight', 'Ledgerlight', 'Receipts in, tidy books out', 'amara', ['finance', 'ai'], 74, 142, '#0b7285'],
  ['tally-board', 'Tally Board', 'Live KPI wallboards from any spreadsheet', 'leo', ['analytics'], 78, 59, '#5f3dc4'],
];

export function seed() {
  const now = Date.now();
  const launches = rows.map(([slug, name, tagline, maker, launchTopics, hoursAgo, votes, color], i) => ({
    id: `l${i + 1}`,
    slug,
    name,
    tagline,
    description: `${name} is a fictional demo product made for the Shipyard sample app. ${tagline}.`,
    url: `https://example.com/${slug}`,
    maker,
    topics: launchTopics,
    color,
    launchedAt: new Date(now - hoursAgo * HOUR).toISOString(),
    voters: Array.from({ length: votes }, (_, n) => `fan${n}`),
  }));

  const comments = [
    { id: 'c1', launchId: 'l1', author: 'tomas', body: 'Finally a shared inbox that does not need a sales call.', createdAt: new Date(now - HOUR).toISOString() },
    { id: 'c2', launchId: 'l1', author: 'priya', body: 'Love the keyboard shortcuts. Any plans for a mobile app?', createdAt: new Date(now - HOUR / 2).toISOString() },
    { id: 'c3', launchId: 'l2', author: 'leo', body: 'We tried this on our monorepo and builds were ready in under two minutes.', createdAt: new Date(now - 2 * HOUR).toISOString() },
    { id: 'c4', launchId: 'l6', author: 'kenji', body: 'Single file is such a nice constraint. Congrats on the launch!', createdAt: new Date(now - 26 * HOUR).toISOString() },
  ];

  return { makers, topics, launches, comments };
}
