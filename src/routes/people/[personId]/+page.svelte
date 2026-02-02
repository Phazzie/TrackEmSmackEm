<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section class="panel">
	<a class="back-link" href={`/people?month=${data.month}`}>← Back to people</a>
	<div class="panel-header">
		<div>
			<h2>{data.person.name}</h2>
			<p class="muted">{data.person.email}</p>
			{#if data.person.referredBy}
				<p class="tag">Referred by {data.person.referredBy}</p>
			{/if}
		</div>
		<div class="metric">
			<span>Total earned</span>
			<strong>${data.total}</strong>
		</div>
	</div>

	<form class="month-picker" method="get">
		<label>
			<span>Month</span>
			<input name="month" type="month" value={data.month} />
		</label>
		<button type="submit">Load</button>
	</form>
</section>

<section class="panel">
	<h2>Monthly bonus codes</h2>
	<div class="table">
		<div class="table-head">
			<span>Code</span>
			<span>Category</span>
			<span>Used</span>
			<span>Result</span>
			<span></span>
		</div>
		{#each data.statuses as row}
			<form class="table-row" method="post" action="?/set" use:enhance>
				<input type="hidden" name="codeId" value={row.code.id} />
				<input type="hidden" name="month" value={data.month} />
				<span>
					<strong>{row.code.code}</strong>
				</span>
				<span class="muted">{row.code.category.replaceAll('_', ' ')}</span>
				<label class="checkbox">
					<input
						name="used"
						type="checkbox"
						value="true"
						checked={row.assignment?.used ?? false}
					/>
					<span>Done</span>
				</label>
				<input
					name="resultAmount"
					type="number"
					step="0.01"
					min="0"
					placeholder="0.00"
					value={row.assignment?.resultAmount ?? ''}
				/>
				<button class="ghost" type="submit">Save</button>
			</form>
		{/each}
	</div>
</section>
