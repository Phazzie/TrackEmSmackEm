import { env } from '$env/dynamic/private';
import { createClient } from '@supabase/supabase-js';
import type { StoragePort } from '../ports/storage.port.js';
import { MemoryStorageAdapter } from '../adapters/storage.memory.js';
import { SupabaseStorageAdapter } from '../adapters/storage.supabase.js';
import { loadStorageFixture } from '../mocks/storage.mock.js';

function requireEnv(name: string) {
	const value = env[name];
	if (!value) throw new Error(`Missing ${name} environment variable`);
	return value;
}

async function createStorage(): Promise<StoragePort> {
	const mode = env.STORAGE_MODE ?? 'memory';
	if (mode === 'supabase') {
		const url = requireEnv('SUPABASE_URL');
		const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
		const client = createClient(url, key, { auth: { persistSession: false } });
		return new SupabaseStorageAdapter(client);
	}

	const seed = env.STORAGE_SEED ?? 'sample';
	if (seed === 'sample') {
		const snapshot = await loadStorageFixture('sample');
		return new MemoryStorageAdapter(snapshot);
	}

	return new MemoryStorageAdapter();
}

const storagePromise = createStorage();

export async function getStorage(): Promise<StoragePort> {
	return storagePromise;
}
