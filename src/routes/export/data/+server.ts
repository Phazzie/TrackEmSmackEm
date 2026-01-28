import { json } from '@sveltejs/kit';
import { getStorage } from '$lib/server/storage';
import { coerceMonth } from '$lib/domain/month';

function escapeCsv(value: string) {
	const needsQuotes = value.includes(',') || value.includes('"') || value.includes('\n');
	const escaped = value.replaceAll('"', '""');
	return needsQuotes ? `"${escaped}"` : escaped;
}

function buildCsv(rows: string[][]) {
	return `${rows.map((row) => row.map(escapeCsv).join(',')).join('\n')}\n`;
}

export const GET = async ({ url }) => {
	const month = coerceMonth(url.searchParams.get('month'));
	const format = url.searchParams.get('format') ?? 'json';
	const storage = await getStorage();
	const snapshot = await storage.getMonthSnapshot(month);

	const peopleById = new Map(snapshot.people.map((person) => [person.id, person]));
	const codesById = new Map(snapshot.codes.map((code) => [code.id, code]));

	const rows = snapshot.assignments.map((assignment) => {
		const person = peopleById.get(assignment.personId);
		const code = codesById.get(assignment.codeId);
		return {
			personName: person?.name ?? 'Unknown',
			personEmail: person?.email ?? 'Unknown',
			referredBy: person?.referredBy ?? '',
			code: code?.code ?? 'Unknown',
			category: code?.category ?? 'Unknown',
			used: assignment.used ? 'yes' : 'no',
			resultAmount: assignment.resultAmount?.toString() ?? ''
		};
	});

	if (format === 'csv') {
		const header = [
			'person_name',
			'person_email',
			'referred_by',
			'code',
			'category',
			'used',
			'result_amount'
		];
		const csvRows = [header, ...rows.map((row) => Object.values(row))];
		const csv = buildCsv(csvRows);
		return new Response(csv, {
			headers: {
				'content-type': 'text/csv',
				'content-disposition': `attachment; filename=trackem-${month}.csv`
			}
		});
	}

	return json({ month, rows });
};
