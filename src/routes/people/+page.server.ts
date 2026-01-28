import { fail, redirect } from '@sveltejs/kit';
import { CreatePersonInputSchema } from '../../../contracts/storage.contract.js';
import { getStorage } from '$lib/server/storage';
import { coerceMonth } from '$lib/domain/month';
import { getPersonTotal } from '$lib/reporting/reporting';

export const load = async ({ url }) => {
	const month = coerceMonth(url.searchParams.get('month'));
	const storage = await getStorage();
	const snapshot = await storage.getMonthSnapshot(month);

	const totals = snapshot.people.map((person) => ({
		id: person.id,
		amount: getPersonTotal(person.id, snapshot.assignments)
	}));

	return {
		month,
		people: snapshot.people,
		totals
	};
};

export const actions = {
	create: async ({ request, url }) => {
		const form = await request.formData();
		const payload = {
			name: String(form.get('name') ?? '').trim(),
			email: String(form.get('email') ?? '').trim(),
			referredBy: String(form.get('referredBy') ?? '').trim() || null
		};

		const parsed = CreatePersonInputSchema.safeParse(payload);
		if (!parsed.success) {
			return fail(400, { error: 'Invalid person details.' });
		}

		const storage = await getStorage();
		await storage.createPerson(parsed.data);
		const month = coerceMonth(url.searchParams.get('month'));
		throw redirect(303, `/people?month=${month}`);
	}
};
