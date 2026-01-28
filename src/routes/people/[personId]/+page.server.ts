import { error, fail, redirect } from '@sveltejs/kit';
import { SetAssignmentInputSchema } from '../../../../contracts/storage.contract.js';
import { getStorage } from '$lib/server/storage';
import { coerceMonth } from '$lib/domain/month';
import { getPersonCodeStatuses, getPersonTotal } from '$lib/reporting/reporting';

export const load = async ({ params, url }) => {
	const month = coerceMonth(url.searchParams.get('month'));
	const storage = await getStorage();
	const snapshot = await storage.getMonthSnapshot(month);
	const person = snapshot.people.find((entry) => entry.id === params.personId);
	if (!person) {
		throw error(404, 'Person not found');
	}

	const statuses = getPersonCodeStatuses(person.id, snapshot.codes, snapshot.assignments);
	const total = getPersonTotal(person.id, snapshot.assignments);

	return { month, person, statuses, total };
};

export const actions = {
	set: async ({ request, params, url }) => {
		const form = await request.formData();
		const formMonth = String(form.get('month') ?? '');
		const payload = {
			personId: params.personId,
			codeId: String(form.get('codeId') ?? ''),
			used: String(form.get('used') ?? '') === 'true',
			resultAmount: form.get('resultAmount') === '' ? null : Number(form.get('resultAmount'))
		};

		const parsed = SetAssignmentInputSchema.safeParse(payload);
		if (!parsed.success) {
			return fail(400, { error: 'Invalid assignment update.' });
		}

		const storage = await getStorage();
		await storage.setAssignment(parsed.data);
		const month = coerceMonth(formMonth || url.searchParams.get('month'));
		throw redirect(303, `/people/${params.personId}?month=${month}`);
	}
};
