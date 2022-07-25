<script lang="ts">
  import { browser } from '$app/env'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import LoadingScreen from '@/components/molecules/LoadingScreen.svelte'
  import { AlertSeverity, enqueueAlert } from '@/utils/alert'
  import { getApollo } from '@/utils/apollo'
  import { gql } from '@apollo/client/core'
  import type { Rule, YPGuild } from 'shared'
  import { setContext, getContext } from 'svelte'
  import { writable, type Writable } from 'svelte/store'

  let prom: Promise<void> | null = null

  const rule = writable<Rule | null>(null)

  setContext('rule', rule)

  const load = async () => {
    const apollo = getApollo()
    const { data } = await apollo.query<{ rule: Rule | null }>({
      query: gql`
        query Rule($id: String!) {
          rule(id: $id) {
            id
            name
            description
            elements {
              id
              name
              regex
              separate
              ruleType
            }
            references {
              id
              name
              description
              counts {
                black
                white
                include
              }
              author {
                id
                tag
                avatar
              }
            }
            counts {
              black
              white
              include
            }
            shareCode
            sharingEnabled

            isOfficial
          }
        }
      `,
      variables: {
        id: $page.params.id,
      },
      fetchPolicy: 'no-cache',
    })

    rule.set(data.rule)

    if (!data.rule) {
      enqueueAlert({
        title: '규칙을 찾을 수 없습니다',
        time: 5000,
        severity: AlertSeverity.Error,
      })
      goto('/app')

      return Promise.reject()
    }
  }

  $: {
    if (browser && !prom) {
      prom = load()
    }
  }
</script>

{#if prom}
  {#await prom}
    <LoadingScreen />
  {:then}
    <slot />
  {:catch}
    <LoadingScreen />
  {/await}
{:else}
  <LoadingScreen />
{/if}
