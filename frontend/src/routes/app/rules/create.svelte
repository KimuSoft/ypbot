<script lang="ts">
  import { goto } from '$app/navigation'

  import Button from '@/components/atoms/Button.svelte'
  import { getApollo } from '@/utils/apollo'
  import { gql } from '@apollo/client/core/index.js'
  import type { Rule } from 'shared'

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    const { data } = await getApollo().mutate<{ createRule: Rule }>({
      mutation: gql`
        mutation CreateRule($name: String!, $desc: String!) {
          createRule(name: $name, description: $desc) {
            id
          }
        }
      `,
      variables: {
        name,
        desc,
      },
    })
    if (data?.createRule) {
      goto(`/app/rules/${data.createRule.id}`)
    }
  }

  let name: string = ''
  let desc: string = ''
</script>

<form on:submit={onSubmit} class="max-w-[600px] mx-auto">
  <div class="text-3xl font-bold">규칙 만들기</div>

  <label class="flex flex-col mt-4">
    <div class="text-lg pl-2">이름</div>
    <input
      bind:value={name}
      required
      type="text"
      class="bg-transparent mt-1 ring-1 rounded-full text-lg outline-none ring-white/20 focus:ring-blue-500 transition-all py-1 px-4"
    />
  </label>

  <label class="flex flex-col mt-4">
    <div class="text-lg pl-2">설명</div>
    <input
      bind:value={desc}
      required
      type="text"
      class="bg-transparent mt-1 ring-1 rounded-full text-lg outline-none ring-white/20 focus:ring-blue-500 transition-all py-1 px-4"
    />
  </label>

  <Button type="submit" class="bg-blue-500 w-full text-center mt-4 py-2">
    추가하기
  </Button>
</form>
