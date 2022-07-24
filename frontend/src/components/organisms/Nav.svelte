<script lang="ts">
  import { currentUser } from '@/stores'
  import FaHome from 'svelte-icons/fa/FaHome.svelte'
  import FaSignInAlt from 'svelte-icons/fa/FaSignInAlt.svelte'
</script>

<nav class="h-[36px] bg-black bg-opacity-40 flex items-center">
  <a
    href="/"
    class="flex justify-center items-center px-4 hover:bg-opacity-20 h-full bg-white bg-opacity-0 transition-colors"
  >
    <div class="w-[16px]">
      <FaHome />
    </div>
  </a>
  <div class="flex-grow" />
  {#if $currentUser}
    {$currentUser.username}
  {:else}
    <a
      href="/login"
      class="flex justify-center items-center px-4 hover:bg-opacity-20 h-full bg-white bg-opacity-0 transition-colors"
    >
      <div class="w-[16px]">
        <FaSignInAlt />
      </div>
    </a>
  {/if}
</nav>
