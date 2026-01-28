import { describe, it, expect } from 'vitest';
import { MemoryStorageAdapter } from '../../src/lib/adapters/storage.memory.js';

const month = '2026-01';

describe('memory storage adapter', () => {
	it('creates people and codes', async () => {
		expect.assertions(2);
		const storage = new MemoryStorageAdapter();
		await storage.createPerson({ name: 'Ada', email: 'ada@example.com', referredBy: null });
		await storage.createCode({ month, code: 'JAN-1', category: 'points' });

		const people = await storage.listPeople();
		const codes = await storage.listCodes(month);
		expect(people.length).toBe(1);
		expect(codes.length).toBe(1);
	});

	it('updates assignments', async () => {
		expect.assertions(1);
		const storage = new MemoryStorageAdapter();
		const person = await storage.createPerson({ name: 'Ada', email: 'ada@example.com', referredBy: null });
		const code = await storage.createCode({ month, code: 'JAN-2', category: 'wheel_spin' });
		await storage.setAssignment({ personId: person.id, codeId: code.id, used: true, resultAmount: 12 });

		const assignments = await storage.listAssignments(month);
		expect(assignments[0].used).toBe(true);
	});
});
