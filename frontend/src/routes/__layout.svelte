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
            username
            discriminator
            tag
            avatar
          }
        }
      `,
    })

    currentUser.set(me)

    return { user: me }
  }
</script>

<script lang="ts">
  import '../stylesheets/app.css'
  import { browser } from '$app/env'
  import { getApollo } from '@/utils/apollo'
  import { writable } from 'svelte/store'
  import { setClient } from 'svelte-apollo'
  import type { YPUser } from 'shared'
  import { gql } from '@apollo/client/core'
  import LoadingScreen from '@/components/molecules/LoadingScreen.svelte'
  import Nav from '@/components/organisms/Nav.svelte'
  import { currentUser } from '@/stores'
  import AlertContainer from '@/components/organisms/AlertContainer.svelte'

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

<AlertContainer />

{#if loadingPromise}
  {#await loadingPromise}
    <LoadingScreen />
  {:then}
    <div class="w-full h-full flex flex-col">
      <div class="w-full">
        <Nav />
      </div>
      <div class="flex-grow w-full">
        <slot />
      </div>
    </div>
  {/await}
{/if}
