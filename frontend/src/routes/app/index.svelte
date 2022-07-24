<script lang="ts">
  import GuildListItem from '@/components/organisms/GuildListItem.svelte'
  import type { YPGuild, Rule as RuleBase, RuleCounts, YPUser } from 'shared'
  import _ from 'lodash'

  import { getContext, tick } from 'svelte'
  import type { Writable } from 'svelte/store'
  import Button from '@/components/atoms/Button.svelte'
  import RuleSelectGroup from '@/components/organisms/RuleSelectGroup.svelte'
  import { getApollo } from '@/utils/apollo'
  import { gql } from '@apollo/client/core'
  import LoadingSpinner from '@/components/atoms/LoadingSpinner.svelte'
  import { goto } from '$app/navigation'

  const guilds = getContext<Writable<YPGuild[]>>('guilds')

  $: sortedGuilds = _.sortBy($guilds, 'invited').reverse()

  type Rule = RuleBase & { author: YPUser; counts: RuleCounts }

  type Result = { official: Rule[]; shared: Rule[]; my: Rule[] }

  let rulesPromise: Promise<Result> | null = null

  const load = async (): Promise<Result> => {
    const apollo = getApollo()

    const { data } = await apollo.query<{
      officialRules: Rule[]
      sharedRules: Rule[]
      rules: Rule[]
    }>({
      query: gql`
        query MyRules {
          rules {
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
            isOfficial
          }
          sharedRules {
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
            isOfficial
          }
          officialRules {
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
            isOfficial
          }
        }
      `,
      fetchPolicy: 'no-cache',
    })

    return {
      my: data.rules,
      official: data.officialRules,
      shared: data.sharedRules,
    }
  }

  $: {
    rulesPromise = load()
  }

  const onSelectMyRule = async (e: CustomEvent<{ id: string }>) => {
    goto(`/app/rules/${e.detail.id}`)
  }

  $: onSelectSharedRule = async (e: CustomEvent<{ id: string }>) => {
    const id = e.detail.id

    if (
      confirm(
        '규칙 공유를 해제할까요? 공유 코드 없이는 다시 추가할 수 없습니다.'
      )
    ) {
      await getApollo().mutate({
        mutation: gql`
          mutation RemoveSharedRule($ruleId: String!) {
            removeShared(id: $ruleId)
          }
        `,
        variables: {
          ruleId: id,
        },
      })

      rulesPromise = null

      await tick()

      rulesPromise = load()
    }
  }
</script>

<div>
  <div class="flex items-end gap-2">
    <div class="flex-grow font-bold text-3xl">규칙 관리</div>
    <a href="/app/rules/share"><Button>공유코드 입력</Button></a>
    <a href="/app/rules/create"><Button>추가하기</Button></a>
  </div>
  {#if rulesPromise}
    {#await rulesPromise}
      <div class="flex justify-center mt-12">
        <LoadingSpinner />
      </div>
    {:then rules}
      <div class="mt-4">
        <RuleSelectGroup
          on:select={onSelectMyRule}
          title="내 규칙"
          rules={rules.my}
        />
        <RuleSelectGroup
          on:select={onSelectSharedRule}
          title="공유받은 규칙"
          rules={rules.shared}
        />
        <RuleSelectGroup title="공식 규칙" rules={rules.official} />
      </div>
    {/await}
  {:else}
    <div class="flex justify-center mt-12">
      <LoadingSpinner />
    </div>
  {/if}
</div>

<div class="mt-12">
  <div class="font-bold text-3xl">서버 선택</div>
  <div class="flex flex-col gap-4 mt-4">
    {#each sortedGuilds as guild (guild.id)}
      <GuildListItem {guild} />
    {/each}
  </div>
</div>
