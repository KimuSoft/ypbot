<script lang="ts">
  import type { YPGuild } from 'shared'
  import Button from '../atoms/Button.svelte'
  import GuildIcon from '../atoms/GuildIcon.svelte'

  export let guild: YPGuild
</script>

<a
  href="/app/guilds/{guild.id}"
  class="flex select-none items-center gap-[24px] p-4 hover:bg-black/20 rounded-xl cursor-pointer transition-all"
>
  <GuildIcon icon={guild.icon} name={guild.name} />
  <div
    class="text-2xl font-bold flex-grow text-ellipsis overflow-hidden whitespace-nowrap"
  >
    {guild.name}
  </div>
  {#if !guild.invited}
    <Button className="bg-red-500">초대하기</Button>
  {/if}
</a>
