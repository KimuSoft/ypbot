<script lang="ts">
  import type { Rule, YPChannel } from 'shared'
  import FaAdd from 'svelte-icons/fa/FaPlus.svelte'

  export let channel: YPChannel & { rules: Rule[] }
</script>

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
      class="w-[24px] h-[24px] p-[4px] bg-white/10 rounded-full transition-all hover:bg-white/20 cursor-pointer"
    >
      <FaAdd />
    </div>
  </div>
</div>
