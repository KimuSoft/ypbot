<script lang="ts">
  import { page } from '$app/stores'

  import GuildIcon from '@/components/atoms/GuildIcon.svelte'
  import ChannelListItem from '@/components/organisms/ChannelListItem.svelte'
  import { AlertSeverity, enqueueAlert } from '@/utils/alert'
  import { getApollo } from '@/utils/apollo'
  import { gql } from '@apollo/client/core'
  import { ChannelType } from 'discord-api-types/v10'
  import _ from 'lodash'

  import type { YPChannel, YPGuild, Rule } from 'shared'

  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'

  const guildContext = getContext<
    Writable<
      YPGuild & {
        channels: (YPChannel & {
          rules: Rule[]
        })[]
        alertChannel?: { id: string }
      }
    >
  >('guild')

  $: guild = $guildContext

  type Category = {
    id: string
    name: string
    position: number
    channels: (YPChannel & { rules: Rule[] })[]
  }

  $: categories = ((): Category[] => {
    const arr = guild.channels.filter(
      (x) => x.type !== ChannelType.GuildCategory
    )
    const categories = guild.channels.filter(
      (x) => x.type === ChannelType.GuildCategory
    )

    return _.sortBy(
      categories
        .map((x) => ({
          id: x.id,
          name: x.name,
          position: x.position,
          channels: _.sortBy(
            arr.filter((y) => y.parent === x.id),
            'position'
          ),
        }))
        .filter((x) => x.channels.length),
      'position',
      'type'
    )
  })()

  const resetAlertChannel = async () => {
    try {
      const { data } = await getApollo().mutate<{
        guild?: {
          resetAlertChannel: boolean
        }
      }>({
        mutation: gql`
          mutation SetAlertChannel($guildId: String!) {
            guild(id: $guildId) {
              resetAlertChannel
            }
          }
        `,
        variables: {
          guildId: $page.params.id,
        },
      })
      if (data?.guild?.resetAlertChannel) {
        guildContext.update((x) => ({
          ...x,
          alertChannel: undefined,
        }))
      }
    } catch (e) {
      console.error(e)
      enqueueAlert({
        title: '변경 실패',
        description: '알림 채널 설정 중 오류가 발생했습니다',
        severity: AlertSeverity.Error,
      })
    }
  }
</script>

<div class="text-2xl font-bold mt-2 flex items-center gap-4">
  <GuildIcon name={guild.name} icon={guild.icon} />
  <div>
    {guild.name}
  </div>
</div>

<div class="mt-4">
  <div class="flex items-end">
    <div class="text-3xl font-bold flex-grow">채널</div>
    {#if !!guild.alertChannel}
      <div
        on:click={resetAlertChannel}
        class="bg-red-500 px-4 py-1 rounded-lg transition-all cursor-pointer select-none hover:brightness-90 active:brightness-75"
      >
        알림 채널 초기화
      </div>
    {/if}
  </div>
  <div>
    {#each categories as category (category.id)}
      <div class="mt-2">
        <div class="flex items-center gap-2 text-lg">
          <div>{category.name}</div>
          <div class="flex-grow border-t border-white/20" />
        </div>
        <div class="mt-2 flex flex-col gap-2">
          {#each category.channels as channel}
            <ChannelListItem
              bind:channel
              alertChannel={guild.alertChannel?.id}
            />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
