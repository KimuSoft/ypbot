<script lang="ts">
  import Button from '@/components/atoms/Button.svelte'
  import RuleSelectListItem from '@/components/organisms/RuleSelectListItem.svelte'
  import FaPlus from 'svelte-icons/fa/FaPlus.svelte'

  import type { Rule, RuleCounts, YPUser, RuleType, RuleElement } from 'shared'

  import { getContext, setContext } from 'svelte'
  import { writable, type Writable } from 'svelte/store'
  import { fade } from 'svelte/transition'
  import RuleAddDialog from '@/components/organisms/RuleAddDialog.svelte'
  import { getApollo } from '@/utils/apollo'
  import { gql } from '@apollo/client/core'
  import { AlertSeverity, enqueueAlert } from '@/utils/alert'
  import { goto } from '$app/navigation'
  import CreateRuleElementItem from '@/components/organisms/CreateRuleElementItem.svelte'
  import type { CreateRuleElementItemInput } from '@/utils/types'
  import RuleElementItem from '@/components/organisms/RuleElementItem.svelte'

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

  let rule = { ...$ruleContext }

  const onDelete = async () => {
    if (confirm('규칙을 삭제할까요? 되돌릴 수 없습니다.')) {
      const { data } = await getApollo().mutate<{ rule?: { delete: boolean } }>(
        {
          mutation: gql`
            mutation Rule($ruleId: String!) {
              rule(id: $ruleId) {
                delete
              }
            }
          `,
          variables: {
            ruleId: rule.id,
          },
        }
      )

      if (data?.rule?.delete) {
        enqueueAlert({
          title: '규칙이 삭제되었습니다.',
          severity: AlertSeverity.Success,
          time: 5000,
        })
        goto('/app')
      }
    }
  }

  let createdItems = writable<CreateRuleElementItemInput[]>([])

  setContext('createdItems', createdItems)

  const createElement = () => {
    createdItems.update((d) => [
      ...d,
      {
        name: '',
        ruleType: 'Black' as RuleType,
        regex: '',
        separate: false,
      },
    ])
  }

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    const { data } = await getApollo().mutate<{
      rule?: {
        updateMeta?: Rule & {
          references: (Rule & {
            author: YPUser
            counts: RuleCounts
          })[]
          elements: RuleElement[]
        }
      }
    }>({
      mutation: gql`
        mutation Mutation(
          $ruleId: String!
          $name: String
          $description: String
        ) {
          rule(id: $ruleId) {
            updateMeta(name: $name, description: $description) {
              id
              name
              description
              elements {
                id
                name
                regex
                ruleType
              }
              references {
                id
                name
                description
                counts {
                  black
                  white
                  include
                }
                shareCode
                sharingEnabled
                author {
                  id
                  tag
                  avatar
                }
                isOfficial
              }
              counts {
                black
                white
                include
              }
              shareCode
              sharingEnabled
              isOfficial
            }
          }
        }
      `,
      variables: {
        ruleId: rule.id,
        name: rule.name,
        description: rule.description,
      },
    })

    try {
      if (data?.rule?.updateMeta) {
        rule = data.rule.updateMeta
        ruleContext.set(data.rule.updateMeta)
        enqueueAlert({
          title: '저장되었습니다.',
          severity: AlertSeverity.Success,
          time: 5000,
        })
      } else {
        await Promise.reject()
      }
    } catch (e) {
      enqueueAlert({
        title: '저장 실패',
        severity: AlertSeverity.Error,
        time: 5000,
      })
    }
  }

  const onSelect = async (e: CustomEvent<{ id: string }>) => {
    showReferenceAddDialog = false

    const id = e.detail.id

    if (rule.references.find((x) => x.id === id))
      return enqueueAlert({
        title: '이미 포함된 규칙입니다',
        severity: AlertSeverity.Error,
        time: 5000,
      })

    if (rule.id === e.detail.id)
      return enqueueAlert({
        title: '이 규칙을 포함할 수 없습니다',
        severity: AlertSeverity.Error,
        time: 5000,
      })

    const { data } = await getApollo().mutate<{
      rule?: {
        addReference?: Rule & {
          author: YPUser
          counts: RuleCounts
          elements: RuleElement[]
        }
      }
    }>({
      mutation: gql`
        mutation Rule($ruleId: String!, $referenceId: String!) {
          rule(id: $ruleId) {
            addReference(id: $referenceId) {
              id
              name
              description
              counts {
                black
                white
                include
              }
              author {
                id
                tag
                avatar
              }
            }
          }
        }
      `,
      variables: {
        ruleId: rule.id,
        referenceId: e.detail.id,
      },
    })

    if (data?.rule?.addReference) {
      ruleContext.update((d) => ({
        ...d,
        references: [...d.references, data!.rule!.addReference!],
      }))

      rule = {
        ...rule,
        references: [...rule.references, data!.rule!.addReference!],
      }
    }
  }

  const toggleSharing = async () => {
    try {
      await getApollo().mutate({
        mutation: gql`
          mutation Rule($ruleId: String!, $value: Boolean!) {
            rule(id: $ruleId) {
              setSharable(value: $value)
            }
          }
        `,
        variables: {
          ruleId: rule.id,
          value: !rule.sharingEnabled,
        },
      })

      rule = { ...$ruleContext, sharingEnabled: !rule.sharingEnabled }

      ruleContext.set(rule)
    } catch (e) {
      enqueueAlert({
        title: '저장 실패',
        severity: AlertSeverity.Error,
        time: 5000,
      })
    }
  }

  const removeReference = async (e: CustomEvent<{ id: string }>) => {
    const id = e.detail.id

    if (confirm('태그를 포함 해제할까요?')) {
      if (id === rule.id || !rule.references.find((x) => x.id === id)) return

      await getApollo().mutate({
        mutation: gql`
          mutation Rule($ruleId: String!, $referenceId: String!) {
            rule(id: $ruleId) {
              removeReference(id: $referenceId)
            }
          }
        `,
        variables: {
          ruleId: rule.id,
          referenceId: e.detail.id,
        },
      })

      ruleContext.update((d) => ({
        ...d,
        references: d.references.filter((x) => x.id !== id),
      }))

      rule = {
        ...rule,
        references: rule.references.filter((x) => x.id !== id),
      }
    }
  }

  let showReferenceAddDialog = false
</script>

{#if showReferenceAddDialog}
  <div
    class="fixed left-0 top-0 w-full h-full bg-slate-900 z-[9999]"
    transition:fade
  >
    <RuleAddDialog
      on:select={onSelect}
      excludedIds={[rule.id, ...rule.references.map((x) => x.id)]}
      on:close={() => (showReferenceAddDialog = false)}
    />
  </div>
{/if}

<div class="flex items-end">
  <div
    class="text-3xl font-bold flex-grow w-0 text-ellipsis whitespace-nowrap overflow-hidden"
  >
    {rule.name}
  </div>
  <Button class="bg-red-500" on:click={onDelete}>삭제</Button>
</div>

<div class="grid md:grid-cols-2 gap-4">
  <form on:submit={onSubmit}>
    <label class="flex flex-col mt-4">
      <div class="text-lg pl-2">이름</div>
      <input
        bind:value={rule.name}
        required
        type="text"
        class="bg-transparent mt-1 ring-1 rounded-full text-lg outline-none ring-white/20 focus:ring-blue-500 transition-all py-1 px-4"
      />
    </label>

    <label class="flex flex-col mt-4">
      <div class="text-lg pl-2">설명</div>
      <input
        bind:value={rule.description}
        required
        type="text"
        class="bg-transparent mt-1 ring-1 rounded-full text-lg outline-none ring-white/20 focus:ring-blue-500 transition-all py-1 px-4"
      />
    </label>

    <Button type="submit" class="bg-blue-500 w-full text-center mt-4 py-2">
      저장하기
    </Button>
  </form>
  <div class="flex flex-col">
    <label class="flex flex-col mt-4">
      <div class="text-lg pl-2">공유 코드</div>
      <input
        value={rule.shareCode}
        readonly
        required
        type="text"
        class="bg-transparent mt-1 ring-1 rounded-full text-lg outline-none ring-white/20 focus:ring-blue-500 transition-all py-1 px-4"
      />
    </label>
    <label class="flex flex-col mt-4">
      <div class="text-lg pl-2">공유 링크</div>
      <input
        value={`${window.location.protocol}//${window.location.host}/app/rules/share?code=${rule.shareCode}`}
        readonly
        required
        type="text"
        class="bg-transparent mt-1 ring-1 rounded-full text-lg outline-none ring-white/20 focus:ring-blue-500 transition-all py-1 px-4"
      />
    </label>
    <Button
      class="{rule.sharingEnabled
        ? 'bg-red-500'
        : 'bg-blue-500'} w-full text-center mt-4 py-2"
      on:click={toggleSharing}
    >
      공유 {rule.sharingEnabled ? '비활성화' : '활성화'}
    </Button>
  </div>
</div>

<div class="mt-8">
  <div class="text-3xl font-bold">태그 포함</div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-4">
    {#each rule.references as rule (rule.id)}
      <RuleSelectListItem on:select={removeReference} {rule} />
    {/each}
    <div
      on:click={() => (showReferenceAddDialog = true)}
      class="flex justify-center items-center min-h-[60px] ring-1 transition-all cursor-pointer ring-white/20 hover:ring-blue-500 rounded-xl"
    >
      <div class="w-[28px] h-[28px]">
        <FaPlus />
      </div>
    </div>
  </div>
</div>

<div class="mt-8">
  <div class="text-3xl font-bold">규칙 내용 관리</div>
  <div class="flex flex-col gap-4 mt-4">
    {#each $ruleContext.elements as element}
      <RuleElementItem bind:element />
    {/each}
    {#each $createdItems as item}
      <CreateRuleElementItem {item} />
    {/each}
    <div
      on:click={() => createElement()}
      class="flex justify-center items-center min-h-[60px] ring-1 transition-all cursor-pointer ring-white/20 hover:ring-blue-500 rounded-xl"
    >
      <div class="w-[28px] h-[28px]">
        <FaPlus />
      </div>
    </div>
  </div>
</div>
