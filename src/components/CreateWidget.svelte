<script lang="ts">
	/**
	 * Dialog for creating a widget. (WIP)
	 */

	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';

	const dispatch = createEventDispatcher();
</script>

<textarea />
<Button>Save</Button>
<Button>Cancel</Button>
