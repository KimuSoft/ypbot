<script lang="ts">
  import Button from '@/components/atoms/Button.svelte'
  import { AlertSeverity, enqueueAlert } from '@/utils/alert'

  let count = 0
</script>

<a href="/app">
  <Button>App</Button>
</a>
<Button
  on:click={() => {
    enqueueAlert({
      title: `테스트 ${++count}`,
      description: 'wow this is test',
      severity: AlertSeverity.Info,
      time: 10000,
    })
  }}>테스트</Button
>
