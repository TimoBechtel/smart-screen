<script lang="ts">
	let id;
</script>

<form
	action="#"
	on:submit={(e) => {
		e.preventDefault();
		location.pathname = `/${id}/dashboard`;
	}}
>
	<input type="text" placeholder="id" bind:value={id} />
	<button>open id</button>
</form>
