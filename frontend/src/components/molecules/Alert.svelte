<script lang="ts" context="module">
  const colors: Record<AlertSeverity, string> = {
    [AlertSeverity.Info]: 'ring-blue-500',
    [AlertSeverity.Success]: 'ring-green-500',
    [AlertSeverity.Error]: 'ring-red-500',
  }
</script>

<script lang="ts">
  import { alerts } from '@/stores'

  import { type Alert as AlertData, AlertSeverity } from '../../utils/alert'

  export let alert: AlertData

  $: close = () => {
    alerts.update((d) => d.filter((x) => x !== alert))
  }
</script>

<div
  class="p-4 bg-slate-900 ring-1 max-w-[360px] w-screen {colors[
    alert.severity
  ]} rounded-lg pointer-events-auto cursor-pointer"
  on:click={close}
>
  <div class="text-xl font-extrabold">
    {alert.title}
  </div>
  {#if alert.description}
    <div class="text-dmg">
      {alert.description}
    </div>
  {/if}
</div>
