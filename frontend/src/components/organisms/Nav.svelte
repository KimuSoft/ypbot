<script lang="ts">
  import { currentUser } from '@/stores'
  import FaHome from 'svelte-icons/fa/FaHome.svelte'
  import FaSignInAlt from 'svelte-icons/fa/FaSignInAlt.svelte'

  const logOut = () => {
    delete localStorage.token
    window.location.href = '/'
  }
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
    <div class="group h-full relative">
      <div
        class="flex justify-center items-center gap-2 px-2 hover:bg-opacity-20 h-full bg-white bg-opacity-0 transition-colors cursor-pointer"
      >
        <img
          src={$currentUser.avatar}
          class="w-[24px] h-[24px] rounded-full"
          alt="Avatar"
        />
        <span>{$currentUser.tag}</span>
      </div>
      <div
        class="absolute top-[36px] right-0 bg-slate-900 min-w-[100%] invisible opacity-0 transition-all group-hover:visible group-hover:opacity-100"
      >
        <div
          on:click={logOut}
          class="p-2 hover:bg-opacity-20 bg-opacity-0 bg-white transition-all cursor-pointer"
        >
          로그아웃
        </div>
      </div>
    </div>
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
