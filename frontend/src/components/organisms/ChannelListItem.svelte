<script lang="ts">
  import type { Rule, YPChannel } from 'shared'
  import FaAdd from 'svelte-icons/fa/FaPlus.svelte'
  import RuleAddDialog from './RuleAddDialog.svelte'
  import { fade } from 'svelte/transition'

  export let channel: YPChannel & { rules: Rule[] }

  let showAddDialog = false

  const onSelect = (e: CustomEvent<{ id: string }>) => {
    showAddDialog = false
    console.log(e.detail)
  }
</script>

{#if showAddDialog}
  <div
    class="fixed left-0 top-0 w-full h-full bg-slate-900 z-[9999]"
    transition:fade
  >
    <RuleAddDialog
      on:select={onSelect}
      on:close={() => (showAddDialog = false)}
    />
  </div>
{/if}

<div class="bg-black/40 p-4 rounded-xl">
  <div class="flex gap-2 items-center">
    <div class="text-lg">
      {channel.name}
    </div>
    <div class="flex-grow" />
    <div class="bg-red-500 rounded-full px-4 py-1">
      규칙 {channel.rules.length}개
    </div>
  </div>
  <div class="mt-2">
    <div
      on:click={() => (showAddDialog = true)}
      class="w-[24px] h-[24px] p-[4px] bg-white/10 rounded-full transition-all hover:bg-white/20 cursor-pointer"
    >
      <FaAdd />
    </div>
  </div>
</div>
