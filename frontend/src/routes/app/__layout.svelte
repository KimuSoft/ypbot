<script lang="ts">
  import { browser } from '$app/env'
  import { goto } from '$app/navigation'
  import LoadingScreen from '@/components/molecules/LoadingScreen.svelte'
  import { currentUser } from '../../stores'

  let loaded = false

  $: {
    if (browser && !loaded) {
      if (!$currentUser) {
        goto('/login')
      } else {
        loaded = true
      }
    }
  }
</script>

{#if loaded}
  <div>hi sans</div>
{:else}
  <LoadingScreen />
{/if}
