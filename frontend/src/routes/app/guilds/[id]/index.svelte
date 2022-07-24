<script lang="ts">
  import GuildIcon from '@/components/atoms/GuildIcon.svelte'
  import ChannelListItem from '@/components/organisms/ChannelListItem.svelte'
  import { ChannelType } from 'discord-api-types/v10'
  import _ from 'lodash'

  import type { YPChannel, YPGuild, Rule } from 'shared'

  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'

  const guildContext = getContext<
    Writable<
      YPGuild & {
        channels: (YPChannel & { rules: Rule[] })[]
      }
    >
  >('guild')

  $: guild = $guildContext

  type Category = {
    name: string
    position: number
    channels: YPChannel[]
  }

  $: categories = ((): Category[] => {
    const arr = guild.channels.filter(
      (x) => x.type !== ChannelType.GuildCategory
    )
    const categories = guild.channels.filter(
      (x) => x.type === ChannelType.GuildCategory
    )

    return _.sortBy(
      categories.map((x) => ({
        name: x.name,
        position: x.position,
        channels: _.sortBy(
          arr.filter((y) => y.parent === x.id),
          'position'
        ),
      })),
      'position',
      'type'
    )
  })()
</script>

<div class="text-2xl font-bold mt-2 flex items-center gap-4">
  <GuildIcon name={guild.name} icon={guild.icon} />
  <div>
    {guild.name}
  </div>
</div>

<div class="mt-4">
  <div class="text-3xl font-bold">채널</div>
  <div>
    {#each categories as category}
      <div class="mt-2">
        <div class="flex items-center gap-2 text-lg">
          <div>{category.name}</div>
          <div class="flex-grow border-t border-white/20" />
        </div>
        <div class="mt-2 flex flex-col gap-2">
          {#each category.channels as channel}
            <ChannelListItem {channel} />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
