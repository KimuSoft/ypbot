<script lang="ts">
  let className = 'bg-blue-500'

  export { className as class }
</script>

<button
  on:click
  {...$$restProps}
  class="inline-block px-4 py-[4px] whitespace-nowrap rounded-full select-none font-extrabold text-md hover:brightness-90 active:brightness-75 transition-all cursor-pointer {className}"
>
  <slot />
</button>
