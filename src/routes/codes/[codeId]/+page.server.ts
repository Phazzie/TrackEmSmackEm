import { error } from '@sveltejs/kit';
import { getStorage } from '$lib/server/storage';
import { coerceMonth } from '$lib/domain/month';
import { getCodeUsage } from '$lib/reporting/reporting';

export const load = async ({ params, url }) => {
	const month = coerceMonth(url.searchParams.get('month'));
	const storage = await getStorage();
	const snapshot = await storage.getMonthSnapshot(month);
	const code = snapshot.codes.find((entry) => entry.id === params.codeId);
	if (!code) {
		throw error(404, 'Code not found');
	}

	const usage = getCodeUsage(code.id, snapshot.people, snapshot.assignments);

	return { month, code, usage };
};
