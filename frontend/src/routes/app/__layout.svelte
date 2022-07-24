<script lang="ts">
  import { browser } from '$app/env'
  import { goto } from '$app/navigation'
  import LoadingScreen from '@/components/molecules/LoadingScreen.svelte'
  import { getApollo } from '@/utils/apollo'
  import { gql } from '@apollo/client/core'
  import type { YPGuild } from 'shared'
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { currentUser } from '../../stores'

  let prom: Promise<void> | null = null

  const guilds = writable<YPGuild[]>([])

  setContext('guilds', guilds)

  const load = async () => {
    const { data } = await getApollo().query<{ guilds: YPGuild[] }>({
      query: gql`
        query Guilds {
          guilds {
            id
            name
            icon
            invited
          }
        }
      `,
    })

    guilds.set(data.guilds)
  }

  $: {
    if (browser && !prom) {
      if (!$currentUser) {
        goto('/login')
      } else {
        prom = load()
      }
    }
  }
</script>

{#if prom}
  {#await prom}
    <LoadingScreen />
  {:then}
    <div class="container mx-auto px-4">
      <div class="mt-8">
        <slot />
      </div>
    </div>
  {/await}
{:else}
  <LoadingScreen />
{/if}
