/*
 * Purpose: Run all probe files under /probes using tsx.
 * Usage: npm run probes
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PROBES_DIR = path.join(ROOT, 'probes');

if (!fs.existsSync(PROBES_DIR)) {
	console.log('No probes directory found.');
	process.exit(0);
}

const probeFiles = fs
	.readdirSync(PROBES_DIR)
	.filter((file) => file.endsWith('.probe.ts'))
	.map((file) => path.join(PROBES_DIR, file));

if (probeFiles.length === 0) {
	console.log('No probe files found.');
	process.exit(0);
}

for (const file of probeFiles) {
	console.log(`\n▶ Running probe: ${path.relative(ROOT, file)}`);
	const result = spawnSync('npx', ['tsx', file], { stdio: 'inherit' });
	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}
