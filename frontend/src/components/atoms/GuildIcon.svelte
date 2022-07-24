<script lang="ts">
  export let name: string

  export let icon: string | undefined
</script>

{#if !icon}
  <div
    class="w-[64px] h-[64px] bg-slate-900 rounded-full overflow-hidden flex justify-center items-center text-2xl font-extrabold"
  >
    {name[0]}
  </div>
{:else}
  <img src={icon} class="w-[64px] h-[64px] rounded-full" alt="Icon" />
{/if}
