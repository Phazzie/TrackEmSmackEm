import type { SupabaseClient } from '@supabase/supabase-js';
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

function mapPerson(row: {
	id: string;
	name: string;
	email: string;
	referred_by: string | null;
	referred_by_fanduel: string | null;
	created_at: string;
	updated_at: string;
}): Person {
	return {
		id: row.id,
		name: row.name,
		email: row.email,
		referredBy: row.referred_by,
		referredByFanduel: row.referred_by_fanduel,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}

function mapCode(row: {
	id: string;
	month: string;
	code: string;
	category: string;
	created_at: string;
}): Code {
	return {
		id: row.id,
		month: row.month as Month,
		code: row.code,
		category: row.category as Code['category'],
		createdAt: row.created_at
	};
}

function mapAssignment(row: {
	id: string;
	person_id: string;
	code_id: string;
	used: boolean;
	result_amount: number | null;
	updated_at: string;
}): Assignment {
	return {
		id: row.id,
		personId: row.person_id,
		codeId: row.code_id,
		used: row.used,
		resultAmount: row.result_amount,
		updatedAt: row.updated_at
	};
}

function getErrorMessage(error: unknown) {
	if (error instanceof Error) return error.message;
	return 'Unknown error';
}

export class SupabaseStorageAdapter implements StoragePort {
	#client: SupabaseClient;

	constructor(client: SupabaseClient) {
		this.#client = client;
	}

	async getMonthSnapshot(month: Month): Promise<MonthSnapshot> {
		const [people, codes, assignments] = await Promise.all([
			this.listPeople(),
			this.listCodes(month),
			this.listAssignments(month)
		]);

		return { month, people, codes, assignments };
	}

	async listPeople(): Promise<Person[]> {
		const result = await this.#client
			.from('people')
			.select('*')
			.order('name', { ascending: true });

		if (result.error) {
			throw new Error(`Supabase listPeople failed: ${getErrorMessage(result.error)}`);
		}

		return (result.data ?? []).map(mapPerson);
	}

	async createPerson(input: CreatePersonInput): Promise<Person> {
		const result = await this.#client
			.from('people')
			.insert({
				name: input.name,
				email: input.email,
				referred_by: input.referredBy,
				referred_by_fanduel: input.referredByFanduel
			})
			.select('*')
			.single();

		if (result.error || !result.data) {
			throw new Error(`Supabase createPerson failed: ${getErrorMessage(result.error)}`);
		}

		return mapPerson(result.data);
	}

	async listCodes(month: Month): Promise<Code[]> {
		const result = await this.#client
			.from('codes')
			.select('*')
			.eq('month', month)
			.order('created_at', { ascending: true });

		if (result.error) {
			throw new Error(`Supabase listCodes failed: ${getErrorMessage(result.error)}`);
		}

		return (result.data ?? []).map(mapCode);
	}

	async createCode(input: CreateCodeInput): Promise<Code> {
		const result = await this.#client
			.from('codes')
			.insert({
				month: input.month,
				code: input.code,
				category: input.category
			})
			.select('*')
			.single();

		if (result.error || !result.data) {
			throw new Error(`Supabase createCode failed: ${getErrorMessage(result.error)}`);
		}

		return mapCode(result.data);
	}

	async listAssignments(month: Month): Promise<Assignment[]> {
		const codes = await this.listCodes(month);
		const codeIds = codes.map((code) => code.id);
		if (codeIds.length === 0) return [];

		const result = await this.#client.from('person_codes').select('*').in('code_id', codeIds);

		if (result.error) {
			throw new Error(`Supabase listAssignments failed: ${getErrorMessage(result.error)}`);
		}

		return (result.data ?? []).map(mapAssignment);
	}

	async setAssignment(input: SetAssignmentInput): Promise<Assignment> {
		const existing = await this.#client
			.from('person_codes')
			.select('*')
			.eq('person_id', input.personId)
			.eq('code_id', input.codeId)
			.maybeSingle();

		if (existing.error) {
			throw new Error(`Supabase setAssignment lookup failed: ${getErrorMessage(existing.error)}`);
		}

		if (existing.data) {
			const updated = await this.#client
				.from('person_codes')
				.update({
					used: input.used,
					result_amount: input.resultAmount
				})
				.eq('id', existing.data.id)
				.select('*')
				.single();

			if (updated.error || !updated.data) {
				throw new Error(`Supabase setAssignment update failed: ${getErrorMessage(updated.error)}`);
			}

			return mapAssignment(updated.data);
		}

		const created = await this.#client
			.from('person_codes')
			.insert({
				person_id: input.personId,
				code_id: input.codeId,
				used: input.used,
				result_amount: input.resultAmount
			})
			.select('*')
			.single();

		if (created.error || !created.data) {
			throw new Error(`Supabase setAssignment create failed: ${getErrorMessage(created.error)}`);
		}

		return mapAssignment(created.data);
	}
}
