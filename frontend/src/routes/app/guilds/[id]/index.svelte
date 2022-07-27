<script lang="ts">
  import { page } from '$app/stores'

  import GuildIcon from '@/components/atoms/GuildIcon.svelte'
  import ChannelListItem from '@/components/organisms/ChannelListItem.svelte'
  import RuleAddDialog from '@/components/organisms/RuleAddDialog.svelte'
  import RuleSelectListItem from '@/components/organisms/RuleSelectListItem.svelte'
  import { AlertSeverity, enqueueAlert } from '@/utils/alert'
  import { getApollo } from '@/utils/apollo'
  import { gql } from '@apollo/client/core'
  import { ChannelType } from 'discord-api-types/v10'
  import _ from 'lodash'

  import type { YPChannel, YPGuild, Rule, YPUser, RuleCounts } from 'shared'

  import { getContext } from 'svelte'
  import FaPlus from 'svelte-icons/fa/FaPlus.svelte'
  import type { Writable } from 'svelte/store'
  import { fade } from 'svelte/transition'

  const guildContext = getContext<
    Writable<
      YPGuild & {
        channels: (YPChannel & {
          rules: Rule[]
        })[]
        alertChannel?: { id: string }
        commonRules: (Rule & { author: YPUser; counts: RuleCounts })[]
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

  let showAddDialog = false

  const onAddRule = async (e: CustomEvent<{ id: string }>) => {
    try {
      showAddDialog = false
      if (guild.commonRules.find((x) => x.id === e.detail.id))
        return enqueueAlert({
          title: '이미 추가된 규칙입니다',
          severity: AlertSeverity.Error,
          time: 5000,
        })

      const { data } = await getApollo().mutate<{
        guild?: {
          addRule?: Rule & { author: YPUser; counts: RuleCounts }
        }
      }>({
        mutation: gql`
          mutation AddRuleToChannel($guildId: String!, $ruleId: String!) {
            guild(id: $guildId) {
              addRule(id: $ruleId) {
                id
                name
                description
                counts {
                  black
                  white
                  include
                }
                shareCode
                sharingEnabled
                author {
                  avatar
                  id
                  tag
                }
              }
            }
          }
        `,
        variables: {
          guildId: $page.params.id,
          ruleId: e.detail.id,
        },
      })

      if (data?.guild?.addRule) {
        guildContext.update((x) => ({
          ...x,
          commonRules: [...guild.commonRules, data.guild!.addRule!],
        }))
      } else {
        await Promise.reject()
      }
    } catch (e) {
      console.error(e)
      enqueueAlert({
        title: '규칙 추가 실패',
        description: '규칙 추가 중 문제가 발생했습니다.',
        severity: AlertSeverity.Error,
        time: 5000,
      })
    }
  }

  $: onRemoveRule = async (e: CustomEvent<{ id: string }>) => {
    try {
      if (!guild.commonRules.find((x) => x.id === e.detail.id)) return

      const { data } = await getApollo().mutate<{
        guild?: {
          removeRule?: boolean
        }
      }>({
        mutation: gql`
          mutation AddRuleToChannel($guildId: String!, $ruleId: String!) {
            guild(id: $guildId) {
              removeRule(id: $ruleId)
            }
          }
        `,
        variables: {
          guildId: $page.params.id,
          ruleId: e.detail.id,
        },
      })

      if (data?.guild?.removeRule) {
        guildContext.update((x) => ({
          ...x,
          commonRules: guild.commonRules.filter((x) => x.id !== e.detail.id),
        }))
      } else {
        await Promise.reject()
      }
    } catch (e) {
      console.error(e)
      enqueueAlert({
        title: '규칙 제거 실패',
        description: '규칙 제거 중 문제가 발생했습니다.',
        severity: AlertSeverity.Error,
        time: 5000,
      })
    }
  }
</script>

{#if showAddDialog}
  <div
    class="fixed left-0 top-0 w-full h-full bg-slate-900 z-[9999]"
    transition:fade
  >
    <RuleAddDialog
      on:select={onAddRule}
      on:close={() => (showAddDialog = false)}
      excludedIds={guild.commonRules.map((x) => x.id)}
    />
  </div>
{/if}

<div class="text-2xl font-bold mt-2 flex items-center gap-4">
  <GuildIcon name={guild.name} icon={guild.icon} />
  <div>
    {guild.name}
  </div>
</div>

<div class="mt-4">
  <div class="text-3xl font-bold flex-grow">서버 공통 규칙</div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-4">
    {#each guild.commonRules as rule (rule.id)}
      <RuleSelectListItem on:select={onRemoveRule} {rule} />
    {/each}
    <div
      on:click={() => (showAddDialog = true)}
      class="flex justify-center items-center min-h-[60px] ring-1 transition-all cursor-pointer ring-white/20 hover:ring-blue-500 rounded-xl"
    >
      <div class="w-[28px] h-[28px]">
        <FaPlus />
      </div>
    </div>
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
