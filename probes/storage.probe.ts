import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { MonthSnapshotSchema } from '../contracts/storage.contract.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const FIXTURE_PATH = path.join(ROOT, 'fixtures', 'storage', 'sample.json');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const probeMonth = process.env.PROBE_MONTH;

if (!supabaseUrl || !supabaseKey || !probeMonth) {
	throw new Error('Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or PROBE_MONTH for storage probe.');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
	auth: { persistSession: false }
});

const peopleResult = await supabase.from('people').select('*');
if (peopleResult.error) throw peopleResult.error;

const codesResult = await supabase.from('codes').select('*').eq('month', probeMonth);
if (codesResult.error) throw codesResult.error;

const codeIds = (codesResult.data ?? []).map((code) => code.id);
if (codeIds.length === 0) {
	throw new Error(`No codes found for month ${probeMonth}. Seed data before probing.`);
}

const assignmentsResult = await supabase.from('person_codes').select('*').in('code_id', codeIds);
if (assignmentsResult.error) throw assignmentsResult.error;

const snapshot = {
	month: probeMonth,
	people: peopleResult.data ?? [],
	codes: codesResult.data ?? [],
	assignments: assignmentsResult.data ?? []
};

MonthSnapshotSchema.parse(snapshot);
await fs.writeFile(FIXTURE_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf-8');
console.log(`Wrote fixture: ${path.relative(ROOT, FIXTURE_PATH)}`);
