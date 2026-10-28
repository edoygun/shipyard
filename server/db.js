import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { seed } from './seed.js';

const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data');
const dbFile = path.join(dataDir, 'db.json');

// Loads the JSON database, creating it from seed data on first run.
// Delete server/data/ to reset everything.
export function load() {
  if (!fs.existsSync(dbFile)) {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(dbFile, JSON.stringify(seed(), null, 2));
  }
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}

export function save(db) {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}
