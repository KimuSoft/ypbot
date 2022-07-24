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
  class="p-4 bg-slate-900 ring max-w-[320px] w-[300px] {colors[
    alert.severity
  ]} rounded-lg pointer-events-auto cursor-pointer"
  on:click={close}
>
  <div class="text-2xl font-extrabold">
    {alert.title}
  </div>
  <div class="text-lg">
    {alert.description}
  </div>
</div>
