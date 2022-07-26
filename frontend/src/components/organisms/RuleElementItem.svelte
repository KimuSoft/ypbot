<script lang="ts" context="module">
  const ruleTypeStrings: Record<RuleType, string> = {
    Black: '블랙리스트',
    White: '화이트리스트',
  }
</script>

<script lang="ts">
  import { AlertSeverity, enqueueAlert } from '@/utils/alert'

  import { getApollo } from '@/utils/apollo'
  import { gql } from '@apollo/client/core/index.js'

  import type { Rule, RuleCounts, RuleElement, RuleType, YPUser } from 'shared'
  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'
  import Button from '../atoms/Button.svelte'

  export let element: RuleElement

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    try {
      const apollo = getApollo()

      const { data } = await apollo.mutate<{
        rule?: {
          element?: {
            update: RuleElement
          }
        }
      }>({
        mutation: gql`
          mutation UpdateRuleElement(
            $ruleId: String!
            $elementId: String!
            $info: RuleElementUpdateInfo!
          ) {
            rule(id: $ruleId) {
              element(id: $elementId) {
                update(info: $info) {
                  id
                  name
                  ruleType
                  separate
                  regex
                }
              }
            }
          }
        `,
        variables: {
          ruleId: $ruleContext.id,
          elementId: element.id,
          info: {
            name: element.name,
            regex: element.regex,
            separate: element.separate,
          },
        },
      })

      if (data?.rule?.element?.update) {
        const e = data.rule.element.update

        element = e

        enqueueAlert({
          title: '저장 되었습니다.',
          severity: AlertSeverity.Success,
          time: 5000,
        })
      }
    } catch (e) {
      enqueueAlert({
        title: '저장 실패',
        severity: AlertSeverity.Error,
        time: 5000,
      })
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

  const deleteItem = async () => {
    try {
      if (confirm('아이템을 삭제할까요? 되돌릴 수 없습니다.')) {
        const { data } = await getApollo().mutate<{
          rule?: { element?: { delete: boolean } }
        }>({
          mutation: gql`
            mutation DeleteRuleElement($ruleId: String!, $elementId: String!) {
              rule(id: $ruleId) {
                element(id: $elementId) {
                  delete
                }
              }
            }
          `,
          variables: {
            ruleId: $ruleContext.id,
            elementId: element.id,
          },
        })

        if (data?.rule?.element?.delete) {
          ruleContext.update((d) => ({
            ...d,
            elements: d.elements.filter((x) => x !== element),
          }))
          enqueueAlert({
            title: '삭제 성공',
            severity: AlertSeverity.Success,
            time: 5000,
          })
        }
      }
    } catch (e) {
      enqueueAlert({
        title: '삭제 실패',
        severity: AlertSeverity.Error,
        time: 5000,
      })
    }
  }
</script>

<div class="ring-1 p-4 rounded-xl ring-white/20">
  <form on:submit={onSubmit}>
    <label class="flex gap-4 items-center">
      <div class="text-lg pl-2 w-24">이름</div>
      <input
        bind:value={element.name}
        required
        type="text"
        class="bg-transparent mt-1 ring-1 flex-grow rounded-full text-lg outline-none ring-white/20 focus:ring-blue-500 transition-all py-1 px-4"
      />
    </label>

    <label class="flex gap-4 items-center mt-4">
      <div class="text-lg pl-2 w-24">Regexp</div>
      <input
        bind:value={element.regex}
        required
        type="text"
        class="bg-transparent mt-1 ring-1 flex-grow rounded-full text-lg outline-none ring-white/20 focus:ring-blue-500 transition-all py-1 px-4"
      />
    </label>

    <div class="flex gap-4 items-center mt-4">
      <div class="text-lg pl-2 w-24">타입</div>
      <div>
        {ruleTypeStrings[element.ruleType]}
      </div>
    </div>

    <div class="flex gap-4 items-center mt-4">
      <div class="text-lg pl-2 w-24" />
      <div class="flex gap-4 items-center">
        <label class="flex gap-2 items-center">
          <input required bind:checked={element.separate} type="checkbox" />
          <div>자모 분리</div>
        </label>
      </div>
    </div>

    <div class="flex gap-4">
      <Button type="submit" class="bg-blue-500 w-full text-center mt-4 py-2">
        저장하기
      </Button>
      <Button
        on:click={deleteItem}
        type="button"
        class="bg-red-500 w-full text-center mt-4 py-2"
      >
        삭제하기
      </Button>
    </div>
  </form>
</div>
