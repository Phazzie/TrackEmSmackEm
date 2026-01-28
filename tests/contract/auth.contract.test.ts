import { describe, it, expect } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AuthSessionSchema } from '../../contracts/auth.contract.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

const samplePath = path.join(ROOT, 'fixtures', 'auth', 'sample.json');
const faultPath = path.join(ROOT, 'fixtures', 'auth', 'fault.json');

describe('auth contract fixtures', () => {
	it('accepts the sample session fixture', async () => {
		expect.assertions(1);
		const raw = await fs.readFile(samplePath, 'utf-8');
		const parsed = JSON.parse(raw) as unknown;
		expect(() => AuthSessionSchema.parse(parsed)).not.toThrow();
	});

	it('rejects the fault session fixture', async () => {
		expect.assertions(1);
		const raw = await fs.readFile(faultPath, 'utf-8');
		const parsed = JSON.parse(raw) as unknown;
		expect(() => AuthSessionSchema.parse(parsed)).toThrow();
	});
});
