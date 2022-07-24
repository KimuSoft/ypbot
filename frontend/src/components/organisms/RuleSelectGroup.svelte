<script lang="ts">
  import type { Rule, RuleCounts, YPUser } from 'shared'
  import RuleSelectListItem from './RuleSelectListItem.svelte'

  export let title: string

  export let rules: (Rule & { author: YPUser; counts: RuleCounts })[]
</script>

{#if rules.length}
  <div class="mb-8">
    <div class="flex items-center gap-4">
      <div class="text-lg">{title}</div>
      <div class="flex-grow border-t border-white/20" />
    </div>
    <div class="mt-2 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {#each rules as rule}
        <RuleSelectListItem on:select {rule} />
      {/each}
    </div>
  </div>
{/if}
