<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const usageMap = new Map(data.usage.map((entry) => [entry.id, entry.usedCount]));
	const categories = [
		{ value: 'points', label: 'Points' },
		{ value: 'wheel_spin', label: 'Wheel spin' },
		{ value: 'scratch_card', label: 'Scratch card' },
		{ value: 'slot_tournament', label: 'Slot tournament' }
	];
</script>

<section class="panel">
	<div class="panel-header">
		<div>
			<h2>Bonus codes</h2>
			<p>Manage monthly code drops and keep categories tidy.</p>
		</div>
		<form class="month-picker" method="get">
			<label>
				<span>Month</span>
				<input name="month" type="month" value={data.month} />
			</label>
			<button type="submit">Load</button>
		</form>
	</div>

	<div class="card-grid">
		{#each data.codes as code}
			<a class="card" href={`/codes/${code.id}?month=${data.month}`}>
				<div>
					<h3>{code.code}</h3>
					<p class="muted">{code.category.replaceAll('_', ' ')}</p>
				</div>
				<div class="metric">
					<span>Used</span>
					<strong>{usageMap.get(code.id) ?? 0}</strong>
				</div>
			</a>
		{/each}
	</div>
</section>

<section class="panel">
	<h2>Add bonus code</h2>
	<form method="post" class="form-grid">
		<label>
			<span>Month</span>
			<input name="month" type="month" value={data.month} required />
		</label>
		<label>
			<span>Code</span>
			<input name="code" placeholder="JAN-POINTS-10" required />
		</label>
		<label>
			<span>Category</span>
			<select name="category" required>
				{#each categories as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</label>
		<button class="primary" type="submit" formaction="?/create">Save code</button>
	</form>
</section>
