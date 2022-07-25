<script lang="ts" context="module">
  import type { Rule as RuleBase, RuleCounts, YPUser } from 'shared'
  import FaClose from 'svelte-icons/fa/FaTimes.svelte'

  import { writable, type Writable } from 'svelte/store'
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  import LoadingScreen from '../molecules/LoadingScreen.svelte'
  import { getApollo } from '@/utils/apollo'
  import { gql } from '@apollo/client/core/index.js'

  type Rule = RuleBase & { author: YPUser; counts: RuleCounts }

  type Result = { official: Rule[]; shared: Rule[]; my: Rule[] }

  let rulesPromise: Writable<Promise<Result> | null> = writable(null)

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
    })

    return {
      my: data.rules,
      official: data.officialRules,
      shared: data.sharedRules,
    }
  }
</script>

<script lang="ts">
  import RuleSelectGroup from './RuleSelectGroup.svelte'
  import { AlertSeverity, enqueueAlert } from '@/utils/alert'

  const dispatch = createEventDispatcher()

  export let excludedIds: string[] = []

  const close = () => {
    dispatch('close')
  }

  $: {
    if ($rulesPromise === null) {
      const prom = load()
      rulesPromise.set(prom)
    }
  }

  let mounted = false

  onMount(() => {
    mounted = true
  })

  onDestroy(() => {
    mounted = false
  })

  $: {
    if (mounted && $rulesPromise) {
      $rulesPromise.then((data) => {
        const filter = (rules: Rule[]) =>
          rules.filter((x) => !excludedIds.includes(x.id))
        if (
          !filter(data.my).length &&
          !filter(data.official).length &&
          !filter(data.shared).length
        ) {
          enqueueAlert({
            title: '선택 가능한 규칙이 없습니다',
            severity: AlertSeverity.Error,
            time: 5000,
          })
          close()
        }
      })
    }
  }
</script>

<div class="p-8 overflow-y-auto h-full">
  <div class="container mx-auto">
    <div class="flex">
      <div class="flex-grow text-2xl font-bold">규칙 선택</div>
      <div
        on:click={close}
        class="bg-white/20 cursor-pointer w-[36px] h-[36px] rounded-full flex items-center justify-center p-[8px] hover:bg-white/30 transition-all"
      >
        <FaClose />
      </div>
    </div>

    {#if $rulesPromise === null}
      <div class="mt-8">
        <LoadingScreen />
      </div>
    {:else}
      {#await $rulesPromise}
        <div class="mt-8">
          <LoadingScreen />
        </div>
      {:then data}
        <div class="mt-4">
          <RuleSelectGroup
            on:select
            title="내 규칙"
            rules={data.my.filter((x) => !excludedIds.includes(x.id))}
          />
          <RuleSelectGroup
            on:select
            title="공유받은 규칙"
            rules={data.shared.filter((x) => !excludedIds.includes(x.id))}
          />
          <RuleSelectGroup
            on:select
            title="공식 규칙"
            rules={data.official.filter((x) => !excludedIds.includes(x.id))}
          />
        </div>
      {/await}
    {/if}
  </div>
</div>
