import type { Assignment, Code, Person } from '../../../contracts/storage.contract.js';

export type PersonCodeStatus = {
	code: Code;
	assignment: Assignment | null;
};

export function groupAssignmentsByPerson(assignments: Assignment[]) {
	const map = new Map<string, Map<string, Assignment>>();
	for (const assignment of assignments) {
		const byPerson = map.get(assignment.personId) ?? new Map();
		byPerson.set(assignment.codeId, assignment);
		map.set(assignment.personId, byPerson);
	}
	return map;
}

export function getPersonCodeStatuses(
	personId: string,
	codes: Code[],
	assignments: Assignment[]
): PersonCodeStatus[] {
	const byPerson = groupAssignmentsByPerson(assignments).get(personId) ?? new Map();
	return codes.map((code) => ({
		code,
		assignment: byPerson.get(code.id) ?? null
	}));
}

export function getPersonTotal(personId: string, assignments: Assignment[]): number {
	return assignments
		.filter((assignment) => assignment.personId === personId && assignment.used)
		.reduce((total, assignment) => total + (assignment.resultAmount ?? 0), 0);
}

export function getCodeUsage(codeId: string, people: Person[], assignments: Assignment[]) {
	const usedSet = new Set(
		assignments.filter((assignment) => assignment.codeId === codeId && assignment.used).map((a) => a.personId)
	);

	const used = people.filter((person) => usedSet.has(person.id));
	const unused = people.filter((person) => !usedSet.has(person.id));

	return { used, unused };
}
