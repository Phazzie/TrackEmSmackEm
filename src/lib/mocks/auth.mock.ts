import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AuthSessionSchema, type AuthSession } from '../../../contracts/auth.contract.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../../..');

function getFixturePath(scenario: 'sample' | 'fault') {
	return path.join(ROOT, 'fixtures', 'auth', `${scenario}.json`);
}

export async function loadAuthFixture(scenario: 'sample' | 'fault'): Promise<AuthSession> {
	const filePath = getFixturePath(scenario);
	const raw = await fs.readFile(filePath, 'utf-8');
	const parsed = JSON.parse(raw) as unknown;
	return AuthSessionSchema.parse(parsed);
}
