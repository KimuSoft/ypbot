<script lang="ts">
  import { browser } from '$app/env'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import LoadingScreen from '@/components/molecules/LoadingScreen.svelte'
  import { AlertSeverity, enqueueAlert } from '@/utils/alert'
  import { getApollo } from '@/utils/apollo'
  import { gql } from '@apollo/client/core/index.js'
  import type { YPGuild } from 'shared'
  import { setContext, getContext } from 'svelte'
  import { writable, type Writable } from 'svelte/store'

  let prom: Promise<void> | null = null

  const guild = writable<YPGuild | null>(null)

  const guilds = getContext<Writable<YPGuild[]>>('guilds')

  setContext('guild', guild)

  const load = async () => {
    const apollo = getApollo()
    const { data } = await apollo.query<{ guild: YPGuild | null }>({
      query: gql`
        query Guild($id: String!) {
          guild(id: $id) {
            id
            name
            icon
            invited
            channels {
              id
              name
              type
              parent
              position

              rules {
                id
                name
              }
            }
          }
        }
      `,
      variables: {
        id: $page.params.id,
      },
      fetchPolicy: 'no-cache',
    })

    guild.set(data.guild)

    if (!data.guild) {
      const g = $guilds.find((x) => x.id === $page.params.id)

      if (!g) {
        enqueueAlert({
          title: '서버를 찾을 수 없습니다',
          time: 5000,
          severity: AlertSeverity.Error,
        })
        goto('/app')
      } else {
        const {
          data: { inviteUrl },
        } = await apollo.query<{ inviteUrl: string }>({
          query: gql`
            query GetInvite($id: String!) {
              inviteUrl(guild: $id)
            }
          `,
          variables: {
            id: $page.params.id,
          },
        })

        window.location.replace(inviteUrl)
      }

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
