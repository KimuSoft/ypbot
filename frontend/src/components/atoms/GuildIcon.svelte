<script lang="ts">
  export let name: string

  export let icon: string | undefined
</script>

{#if !icon}
  <div
    class="w-[48px] h-[48px] bg-slate-900 rounded-full overflow-hidden flex justify-center items-center text-lg font-extrabold"
  >
    {name[0]}
  </div>
{:else}
  <img src={icon} class="w-[48px] h-[48px] rounded-full" alt="Icon" />
{/if}
