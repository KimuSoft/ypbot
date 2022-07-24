<script lang="ts" context="module">
  const initialized = writable(false)

  const fetchInitialData = async () => {
    const apollo = getApollo()

    const {
      data: { me },
    } = await apollo.query<{
      me: YPUser | null
    }>({
      query: gql`
        query FetchUser {
          me {
            id
          }
        }
      `,
    })

    return { user: me }
  }
</script>

<script lang="ts">
  import { browser } from '$app/env'
  import { getApollo } from '@/utils/apollo'
  import { writable } from 'svelte/store'
  import { setClient } from 'svelte-apollo'
  import type { YPUser } from 'shared'
  import { gql } from '@apollo/client/core'

  let loadingPromise: ReturnType<typeof fetchInitialData> | null = null

  $: {
    if (browser && !$initialized) {
      $initialized = true
      const apollo = getApollo()

      setClient(apollo)

      loadingPromise = fetchInitialData()
    }
  }
</script>

{#if loadingPromise}
  {#await loadingPromise}
    <div>Loading...</div>
  {:then}
    <div>
      <slot />
    </div>
  {/await}
{/if}
