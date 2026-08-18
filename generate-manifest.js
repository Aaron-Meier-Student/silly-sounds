#!/usr/bin/env node

const fs = require('node:fs/promises');
const path = require('node:path');

const audioExtensions = new Set([
  '.aac',
  '.flac',
  '.m4a',
  '.mp3',
  '.ogg',
  '.opus',
  '.wav',
]);

async function main() {
  const folderArg = process.argv[2];

  if (!folderArg) {
    console.error('Usage: node generate-manifest.js <sound-folder>');
    process.exitCode = 1;
    return;
  }

  const folder = path.resolve(folderArg);
  const manifestPath = path.join(folder, 'manifest');
  const entries = await fs.readdir(folder, { withFileTypes: true });
  const sounds = entries
    .filter((entry) => entry.isFile() && audioExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  let title = `title: ${path.basename(folder)}`;
  let lineEnding = '\n';
  let finalNewline = '\n';
  try {
    const existingManifest = await fs.readFile(manifestPath, 'utf8');
    const existingTitle = existingManifest.split(/\r?\n/, 1)[0];
    if (existingTitle.startsWith('title:')) title = existingTitle;
    if (existingManifest.includes('\r\n')) lineEnding = '\r\n';
    finalNewline = existingManifest.endsWith(lineEnding) ? lineEnding : '';
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  await fs.writeFile(manifestPath, `${[title, ...sounds].join(lineEnding)}${finalNewline}`, 'utf8');
  console.log(`Wrote ${sounds.length} sound${sounds.length === 1 ? '' : 's'} to ${manifestPath}`);
}

main().catch((error) => {
  console.error(`Could not generate manifest: ${error.message}`);
  process.exitCode = 1;
});
