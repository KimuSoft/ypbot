<script lang="ts">
  import type { CreateRuleElementItemInput } from '@/utils/types'
  import type { Writable } from 'svelte/store'
  import { getContext } from 'svelte'
  import Button from '../atoms/Button.svelte'
  import { getApollo } from '@/utils/apollo'
  import { gql } from '@apollo/client/core'
  import type { Rule, RuleCounts, RuleElement, RuleType, YPUser } from 'shared'
  import { AlertSeverity, enqueueAlert } from '@/utils/alert'

  export let item: CreateRuleElementItemInput

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    try {
      createdRules.update((d) => d.filter((x) => x !== item))

      const apollo = getApollo()

      const { data } = await apollo.mutate<{
        rule?: { createElement: RuleElement }
      }>({
        mutation: gql`
          mutation CreateElement(
            $info: RuleElementCreateInfo!
            $ruleId: String!
          ) {
            rule(id: $ruleId) {
              createElement(info: $info) {
                id
                name
                ruleType
                separate
                regex
              }
            }
          }
        `,
        variables: {
          info: item,
          ruleId: $ruleContext.id,
        },
      })

      if (data?.rule?.createElement) {
        ruleContext.update((d) => ({
          ...d,
          elements: [...d.elements, data!.rule!.createElement],
        }))
      }
    } catch (e) {
      enqueueAlert({
        title: (e as { message: string }).message,
        severity: AlertSeverity.Error,
        time: 5000,
      })
      createdRules.update((d) => [...d, item])
    }
  }

  const ruleContext = getContext<
    Writable<
      Rule & {
        references: (Rule & {
          author: YPUser
          counts: RuleCounts
        })[]
        elements: RuleElement[]
      }
    >
  >('rule')

  const createdRules =
    getContext<Writable<CreateRuleElementItemInput[]>>('createdItems')

  const cancel = () => {
    createdRules.update((d) => d.filter((x) => x !== item))
  }
</script>

<div class="ring-1 p-4 rounded-xl ring-green-500">
  <form on:submit={onSubmit}>
    <label class="flex gap-4 items-center">
      <div class="text-lg pl-2 w-24">이름</div>
      <input
        bind:value={item.name}
        required
        type="text"
        class="bg-transparent mt-1 ring-1 flex-grow rounded-full text-lg outline-none ring-white/20 focus:ring-blue-500 transition-all py-1 px-4"
      />
    </label>

    <label class="flex gap-4 items-center mt-4">
      <div class="text-lg pl-2 w-24">Regexp</div>
      <input
        bind:value={item.regex}
        required
        type="text"
        class="bg-transparent mt-1 ring-1 flex-grow rounded-full text-lg outline-none ring-white/20 focus:ring-blue-500 transition-all py-1 px-4"
      />
    </label>

    <div class="flex gap-4 items-center mt-4">
      <div class="text-lg pl-2 w-24">타입</div>
      <div class="flex gap-4 items-center">
        <label class="flex gap-2 items-center">
          <input
            required
            bind:group={item.ruleType}
            value="Black"
            type="radio"
          />
          <div>블랙리스트</div>
        </label>
        <label class="flex gap-2 items-center">
          <input
            required
            bind:group={item.ruleType}
            value="White"
            type="radio"
          />
          <div>화이트리스트</div>
        </label>
      </div>
    </div>

    <div class="flex gap-4">
      <Button type="submit" class="bg-blue-500 w-full text-center mt-4 py-2">
        추가하기
      </Button>
      <Button
        on:click={cancel}
        type="button"
        class="bg-red-500 w-full text-center mt-4 py-2"
      >
        취소하기
      </Button>
    </div>
  </form>
</div>
