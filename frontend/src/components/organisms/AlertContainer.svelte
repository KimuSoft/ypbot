<script lang="ts" context="module">
  const transition = (
    node: ElementCSSInlineStyle & Element,
    params: { easing: EasingFunction }
  ): TransitionConfig => {
    const height = node.scrollHeight

    return {
      duration: 300,
      css: (t: number) => {
        const ease = params.easing(t)
        return `opacity: ${t};height: ${height * ease}px;padding: 0;`
      },
    }
  }
</script>

<script lang="ts">
  import { alerts } from '@/stores'
  import Alert from '../molecules/Alert.svelte'
  import type { EasingFunction, TransitionConfig } from 'svelte/transition'
  import { quadIn, quadOut } from 'svelte/easing'
</script>

<div class="pointer-events-none fixed right-4 top-4 z-[100]">
  {#each $alerts as alert (alert.key)}
    <div
      in:transition={{ easing: quadOut }}
      out:transition={{ easing: quadIn }}
      class="pb-[12px]"
    >
      <Alert {alert} />
    </div>
  {/each}
</div>
