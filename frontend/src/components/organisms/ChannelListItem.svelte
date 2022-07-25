<script lang="ts">
  import type { Rule, YPChannel, YPGuild } from 'shared'
  import FaAdd from 'svelte-icons/fa/FaPlus.svelte'
  import RuleAddDialog from './RuleAddDialog.svelte'
  import { fade } from 'svelte/transition'
  import { getApollo } from '@/utils/apollo'
  import { gql } from '@apollo/client/core'
  import { page } from '$app/stores'
  import { AlertSeverity, enqueueAlert } from '@/utils/alert'
  import RuleChip from '../molecules/RuleChip.svelte'
  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'

  export let channel: YPChannel & { rules: Rule[] }

  let showAddDialog = false

  const guild = getContext<
    Writable<
      YPGuild & {
        channels: (YPChannel & { rules: Rule[] })[]
      }
    >
  >('guild')

  const onSelect = async (e: CustomEvent<{ id: string }>) => {
    try {
      showAddDialog = false
      if (channel.rules.find((x) => x.id === e.detail.id))
        return enqueueAlert({
          title: '이미 추가된 규칙입니다',
          severity: AlertSeverity.Error,
        })

      const { data } = await getApollo().mutate<{
        guild?: {
          channel?: {
            addRule?: Rule
          }
        }
      }>({
        mutation: gql`
          mutation AddRuleToChannel(
            $guildId: String!
            $channelId: String!
            $ruleId: String!
          ) {
            guild(id: $guildId) {
              channel(id: $channelId) {
                addRule(id: $ruleId) {
                  id
                  name
                }
              }
            }
          }
        `,
        variables: {
          guildId: $page.params.id,
          channelId: channel.id,
          ruleId: e.detail.id,
        },
      })

      if (data?.guild?.channel?.addRule) {
        guild.update((x) => ({
          ...x,
          channels: [
            ...x.channels.filter((y) => y.id !== channel.id),
            {
              ...channel,
              rules: [...channel.rules, data.guild!.channel!.addRule!],
            },
          ],
        }))
      } else {
        await Promise.reject()
      }
    } catch (e) {
      console.log(e)
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
      if (!channel.rules.find((x) => x.id === e.detail.id)) return

      const { data } = await getApollo().mutate<{
        guild?: {
          channel?: {
            removeRule?: boolean
          }
        }
      }>({
        mutation: gql`
          mutation AddRuleToChannel(
            $guildId: String!
            $channelId: String!
            $ruleId: String!
          ) {
            guild(id: $guildId) {
              channel(id: $channelId) {
                removeRule(id: $ruleId)
              }
            }
          }
        `,
        variables: {
          guildId: $page.params.id,
          channelId: channel.id,
          ruleId: e.detail.id,
        },
      })

      if (data?.guild?.channel?.removeRule) {
        guild.update((x) => ({
          ...x,
          channels: [
            ...x.channels.filter((y) => y.id !== channel.id),
            {
              ...channel,
              rules: channel.rules.filter((x) => x.id !== e.detail.id),
            },
          ],
        }))
      } else {
        await Promise.reject()
      }
    } catch (e) {
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
  <div class="mt-2 flex flex-wrap gap-2">
    {#each channel.rules as rule (rule.id)}
      <RuleChip on:click={onRemoveRule} {rule} />
    {/each}
    <div
      on:click={() => (showAddDialog = true)}
      class="w-[24px] h-[24px] p-[4px] bg-white/10 rounded-full transition-all hover:bg-white/20 cursor-pointer"
    >
      <FaAdd />
    </div>
  </div>
</div>
