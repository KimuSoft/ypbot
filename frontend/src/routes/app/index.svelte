<script lang="ts">
  import GuildListItem from '@/components/organisms/GuildListItem.svelte'
  import type { YPGuild } from 'shared'
  import _ from 'lodash'

  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'

  const guilds = getContext<Writable<YPGuild[]>>('guilds')

  $: sortedGuilds = _.sortBy($guilds, 'invited').reverse()
</script>

{#each sortedGuilds as guild (guild.id)}
  <GuildListItem {guild} />
{/each}
