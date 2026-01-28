import { randomUUID } from 'node:crypto';
import type { StoragePort } from '../ports/storage.port.js';
import type {
	Assignment,
	Code,
	CreateCodeInput,
	CreatePersonInput,
	Month,
	MonthSnapshot,
	Person,
	SetAssignmentInput
} from '../../../contracts/storage.contract.js';

function nowIso() {
	return new Date().toISOString();
}

function byName(a: Person, b: Person) {
	return a.name.localeCompare(b.name);
}

export class MemoryStorageAdapter implements StoragePort {
	#people: Map<string, Person>;
	#codes: Map<string, Code>;
	#assignments: Map<string, Assignment>;

	constructor(seed?: MonthSnapshot) {
		this.#people = new Map();
		this.#codes = new Map();
		this.#assignments = new Map();

		if (seed) {
			seed.people.forEach((person) => this.#people.set(person.id, person));
			seed.codes.forEach((code) => this.#codes.set(code.id, code));
			seed.assignments.forEach((assignment) => this.#assignments.set(assignment.id, assignment));
		}
	}

	async getMonthSnapshot(month: Month): Promise<MonthSnapshot> {
		const codes = await this.listCodes(month);
		const assignments = await this.listAssignments(month);

		return {
			month,
			people: await this.listPeople(),
			codes,
			assignments
		};
	}

	async listPeople(): Promise<Person[]> {
		return Array.from(this.#people.values()).sort(byName);
	}

	async createPerson(input: CreatePersonInput): Promise<Person> {
		const timestamp = nowIso();
		const person: Person = {
			id: randomUUID(),
			name: input.name,
			email: input.email,
			referredBy: input.referredBy,
			createdAt: timestamp,
			updatedAt: timestamp
		};

		this.#people.set(person.id, person);
		return person;
	}

	async listCodes(month: Month): Promise<Code[]> {
		return Array.from(this.#codes.values()).filter((code) => code.month === month);
	}

	async createCode(input: CreateCodeInput): Promise<Code> {
		const existing = Array.from(this.#codes.values()).find(
			(code) => code.month === input.month && code.code === input.code
		);

		if (existing) {
			return existing;
		}

		const timestamp = nowIso();
		const code: Code = {
			id: randomUUID(),
			month: input.month,
			code: input.code,
			category: input.category,
			createdAt: timestamp
		};

		this.#codes.set(code.id, code);
		return code;
	}

	async listAssignments(month: Month): Promise<Assignment[]> {
		const codes = await this.listCodes(month);
		const codeIds = new Set(codes.map((code) => code.id));
		return Array.from(this.#assignments.values()).filter((assignment) => codeIds.has(assignment.codeId));
	}

	async setAssignment(input: SetAssignmentInput): Promise<Assignment> {
		const existing = Array.from(this.#assignments.values()).find(
			(assignment) => assignment.personId === input.personId && assignment.codeId === input.codeId
		);

		const timestamp = nowIso();
		if (existing) {
			const updated: Assignment = {
				...existing,
				used: input.used,
				resultAmount: input.resultAmount,
				updatedAt: timestamp
			};
			this.#assignments.set(updated.id, updated);
			return updated;
		}

		const assignment: Assignment = {
			id: randomUUID(),
			personId: input.personId,
			codeId: input.codeId,
			used: input.used,
			resultAmount: input.resultAmount,
			updatedAt: timestamp
		};

		this.#assignments.set(assignment.id, assignment);
		return assignment;
	}
}
