<script lang="ts">
  import type { Rule, RuleCounts, YPUser } from 'shared'
  import { createEventDispatcher } from 'svelte'
  import FaPlus from 'svelte-icons/fa/FaPlus.svelte'
  import FaMinus from 'svelte-icons/fa/FaMinus.svelte'
  import FaInclude from 'svelte-icons/fa/FaList.svelte'

  export let rule: Rule & { author: YPUser; counts: RuleCounts }

  export let hideAuthor = false

  const dispatch = createEventDispatcher()

  $: onClick = () => {
    dispatch('select', { id: rule.id })
  }
</script>

<div
  on:click={onClick}
  class="bg-black/40 flex gap-2 rounded-xl p-4 cursor-pointer ring-1 ring-white/20 hover:ring-blue-500 transition-all"
>
  <div class="flex flex-col gap-2 flex-grow h-full justify-between">
    <div>
      <div class="text-lg font-bold">
        {rule.name}
      </div>
      <div class="text-md text-white/60">{rule.description}</div>
    </div>
    {#if !hideAuthor}
      <div class="flex items-center gap-2">
        <img
          src={rule.author.avatar}
          alt="Avatar"
          class="w-[28px] h-[28px] rounded-full"
        />
        <div class="text-lg">{rule.author.tag}</div>
      </div>
    {/if}
  </div>
  <div class="text-right flex flex-col gap-2 items-end">
    <div class="flex gap-2 items-center">
      <div class="leading-[16px]">
        {rule.counts.white}
      </div>
      <div class="w-[16px] h-[16px] text-blue-500">
        <FaPlus />
      </div>
    </div>
    <div class="flex gap-2 items-center">
      <div class="leading-[16px]">
        {rule.counts.black}
      </div>
      <div class="w-[16px] h-[16px] text-red-500">
        <FaMinus />
      </div>
    </div>
    <div class="flex gap-2 items-center">
      <div class="leading-[16px]">
        {rule.counts.include}
      </div>
      <div class="w-[16px] h-[16px] text-yellow-300">
        <FaInclude />
      </div>
    </div>
  </div>
</div>
