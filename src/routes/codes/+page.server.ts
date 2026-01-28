import { fail, redirect } from '@sveltejs/kit';
import { CreateCodeInputSchema } from '../../../contracts/storage.contract.js';
import { getStorage } from '$lib/server/storage';
import { coerceMonth } from '$lib/domain/month';

export const load = async ({ url }) => {
	const month = coerceMonth(url.searchParams.get('month'));
	const storage = await getStorage();
	const snapshot = await storage.getMonthSnapshot(month);

	const usage = snapshot.codes.map((code) => {
		const usedCount = snapshot.assignments.filter(
			(assignment) => assignment.codeId === code.id && assignment.used
		).length;
		return { id: code.id, usedCount };
	});

	return { month, codes: snapshot.codes, usage };
};

export const actions = {
	create: async ({ request, url }) => {
		const form = await request.formData();
		const payload = {
			month: String(form.get('month') ?? ''),
			code: String(form.get('code') ?? '').trim(),
			category: String(form.get('category') ?? '')
		};

		const parsed = CreateCodeInputSchema.safeParse(payload);
		if (!parsed.success) {
			return fail(400, { error: 'Invalid code details.' });
		}

		const storage = await getStorage();
		await storage.createCode(parsed.data);
		const month = coerceMonth(url.searchParams.get('month'));
		throw redirect(303, `/codes?month=${month}`);
	}
};
