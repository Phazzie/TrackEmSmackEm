import type { Month } from '../../../contracts/storage.contract.js';
import { MonthSchema } from '../../../contracts/storage.contract.js';

export function formatMonth(date: Date): Month {
	const year = date.getUTCFullYear();
	const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
	return `${year}-${month}` as Month;
}

export function getDefaultMonth(): Month {
	return formatMonth(new Date());
}

export function coerceMonth(value: string | null | undefined): Month {
	if (!value) return getDefaultMonth();
	const parsed = MonthSchema.safeParse(value);
	return parsed.success ? parsed.data : getDefaultMonth();
}
