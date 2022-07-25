<script lang="ts">
  import { goto } from '$app/navigation'

  import Button from '@/components/atoms/Button.svelte'
  import { AlertSeverity, enqueueAlert } from '@/utils/alert'
  import { getApollo } from '@/utils/apollo'
  import { gql } from '@apollo/client/core/index.js'
  import type { Rule } from 'shared'
  import { onMount } from 'svelte'

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    const { data } = await getApollo().mutate<{ addShared: Rule }>({
      mutation: gql`
        mutation ShareRule($code: String!) {
          addShared(code: $code) {
            id
          }
        }
      `,
      variables: {
        code,
      },
    })
    if (data?.addShared) {
      enqueueAlert({
        title: '규칙이 추가되었습니다',
        severity: AlertSeverity.Success,
        time: 5000,
      })
      goto('/app')
    } else {
      enqueueAlert({
        title: '규칙 추가 실패',
        severity: AlertSeverity.Error,
        description:
          '코드를 찾을 수 없습니다. 만약 코드가 존재한다면 규칙 제작자에게 공유 활성화를 요청해 주세요.',
        time: 5000,
      })
    }
  }

  let code: string = ''

  onMount(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.has('code')) {
      code = url.searchParams.get('code') as string
    }
  })
</script>

<form on:submit={onSubmit} class="max-w-[600px] mx-auto">
  <div class="text-3xl font-bold">규칙 공유받기</div>

  <label class="flex flex-col mt-4">
    <div class="text-lg pl-2">코드</div>
    <input
      bind:value={code}
      required
      type="text"
      class="bg-transparent mt-1 ring-1 rounded-full text-lg outline-none ring-white/20 focus:ring-blue-500 transition-all py-1 px-4"
    />
  </label>

  <Button type="submit" class="bg-blue-500 w-full text-center mt-4 py-2">
    추가하기
  </Button>
</form>
