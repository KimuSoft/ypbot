<script lang="ts">
  import type { Rule } from 'shared'
  import FaTimes from 'svelte-icons/fa/FaTimes.svelte'
  import { createEventDispatcher } from 'svelte'

  export let rule: Rule

  const dispatch = createEventDispatcher()

  $: onClick = () => dispatch('click', { id: rule.id })
</script>

<div
  class="h-[24px] flex justify-center items-center pl-[8px] pr-[2px] bg-white/20 rounded-full gap-2"
>
  <div>
    {rule.name}
  </div>
  <div
    on:click={onClick}
    class="bg-white/10 rounded-full hover:bg-white/20 transition-all cursor-pointer w-[20px] h-[20px] flex justify-center items-center"
  >
    <div class="w-[16px] h-[16px]">
      <FaTimes />
    </div>
  </div>
</div>
