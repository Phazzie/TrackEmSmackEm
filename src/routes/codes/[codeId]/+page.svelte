<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section class="panel">
	<a class="back-link" href={`/codes?month=${data.month}`}>← Back to codes</a>
	<div class="panel-header">
		<div>
			<h2>{data.code.code}</h2>
			<p class="muted">{data.code.category.replaceAll('_', ' ')}</p>
		</div>
		<div class="metric">
			<span>Used</span>
			<strong>{data.usage.used.length}</strong>
		</div>
	</div>
</section>

<section class="panel">
	<h3>Used</h3>
	<div class="chip-row">
		{#if data.usage.used.length === 0}
			<p class="muted">No one has used this yet.</p>
		{:else}
			{#each data.usage.used as person}
				<span class="chip">{person.name}</span>
			{/each}
		{/if}
	</div>
</section>

<section class="panel">
	<h3>Not used</h3>
	<div class="chip-row">
		{#if data.usage.unused.length === 0}
			<p class="muted">Everyone has used this code.</p>
		{:else}
			{#each data.usage.unused as person}
				<span class="chip ghost">{person.name}</span>
			{/each}
		{/if}
	</div>
</section>
