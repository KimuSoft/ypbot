<script lang="ts" context="module">
  const initialized = writable(false)

  const fetchInitialData = async () => {
    await import('../utils/sentry')

    const me = await fetchUser()

    currentUser.set(me as unknown as YPUser)

    return { user: me }
  }
</script>

<script lang="ts">
  import '../stylesheets/app.scss'
  import { browser } from '$app/env'
  import { getApollo } from '@/utils/apollo'
  import { writable } from 'svelte/store'
  import { setClient } from 'svelte-apollo'
  import type { YPUser } from 'shared'
  import LoadingScreen from '@/components/molecules/LoadingScreen.svelte'
  import Nav from '@/components/organisms/Nav.svelte'
  import { currentUser } from '@/stores'
  import AlertContainer from '@/components/organisms/AlertContainer.svelte'
  import { fetchUser } from '@/utils/user'
  import { builtAt, commitId } from 'virtual:build-info'

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

<svelte:head>
  <title>YPBOT</title>
</svelte:head>

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

      <div class="bg-black/20 p-4 flex items-center mt-8">
        <div class="text-md">
          YPBOT (version
          <a
            class="text-blue-500"
            href="https://github.com/KimuSoft/ypbot/commit/{commitId}"
            target="_blank">{commitId}</a
          >)
        </div>
      </div>
    </div>
  {/await}
{/if}
