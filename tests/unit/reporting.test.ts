import { describe, it, expect } from 'vitest';
import { getCodeUsage, getPersonTotal } from '../../src/lib/reporting/reporting.js';
import { loadStorageFixture } from '../../src/lib/mocks/storage.mock.js';

describe('reporting utilities', () => {
	it('sums totals per person', async () => {
		expect.assertions(1);
		const snapshot = await loadStorageFixture('sample');
		const total = getPersonTotal(snapshot.people[0].id, snapshot.assignments);
		expect(total).toBeGreaterThanOrEqual(0);
	});

	it('splits used vs unused', async () => {
		expect.assertions(2);
		const snapshot = await loadStorageFixture('sample');
		const usage = getCodeUsage(snapshot.codes[0].id, snapshot.people, snapshot.assignments);
		expect(usage.used.length).toBeGreaterThan(0);
		expect(usage.unused.length).toBeGreaterThanOrEqual(0);
	});
});
