<script lang="ts">
  import type { YPGuild } from 'shared'
  import Button from '../atoms/Button.svelte'
  import GuildIcon from '../atoms/GuildIcon.svelte'

  export let guild: YPGuild
</script>

<a
  href="/app/guilds/{guild.id}"
  class="flex select-none items-center gap-[24px] p-4 ring-1 ring-white/20 hover:ring-blue-500 rounded-xl cursor-pointer transition-all"
>
  <GuildIcon icon={guild.icon} name={guild.name} />
  <div
    class="text-2xl font-bold flex-grow text-ellipsis overflow-hidden whitespace-nowrap"
  >
    {guild.name}
  </div>
  {#if !guild.invited}
    <Button class="bg-red-500">초대하기</Button>
  {/if}
</a>
