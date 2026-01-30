import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MonthSnapshotSchema, type MonthSnapshot } from '../../../contracts/storage.contract.js';
import { MemoryStorageAdapter } from '../adapters/storage.memory.js';
import type { StoragePort } from '../ports/storage.port.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../..');

function getFixturePath(scenario: 'sample' | 'fault') {
	return path.join(ROOT, 'fixtures', 'storage', `${scenario}.json`);
}

export async function loadStorageFixture(scenario: 'sample' | 'fault'): Promise<MonthSnapshot> {
	const filePath = getFixturePath(scenario);
	const raw = await fs.readFile(filePath, 'utf-8');
	const parsed = JSON.parse(raw) as unknown;
	return MonthSnapshotSchema.parse(parsed);
}

export async function createStorageMock(scenario: 'sample' | 'fault'): Promise<StoragePort> {
	const snapshot = await loadStorageFixture(scenario);
	return new MemoryStorageAdapter(snapshot);
}
