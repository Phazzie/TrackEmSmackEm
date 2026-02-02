<script>
	import { page } from '$app/stores';
</script>

<div class="panel login-card" style="text-align: center;">
	<h1>Oops! Something went wrong.</h1>
	
	{#if $page.status === 404}
		<p class="muted">We couldn't find the page you're looking for.</p>
	{:else}
		<p class="muted">An unexpected error occurred. Please try again.</p>
		{#if $page.error}
			<p style="color: var(--accent-strong); font-size: 0.9rem; margin-top: 1rem;">
				{$page.error.message}
			</p>
		{/if}
	{/if}

	<div style="margin-top: 2rem;">
		<a href="/" class="chip">Go Home</a>
	</div>
</div>
