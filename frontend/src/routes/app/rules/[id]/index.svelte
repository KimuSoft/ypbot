<script lang="ts">
  import Button from '@/components/atoms/Button.svelte'
  import RuleSelectListItem from '@/components/organisms/RuleSelectListItem.svelte'
  import FaPlus from 'svelte-icons/fa/FaPlus.svelte'

  import type { Rule, RuleCounts, YPUser } from 'shared'

  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'
  import { fade } from 'svelte/transition'
  import RuleAddDialog from '@/components/organisms/RuleAddDialog.svelte'
  import { getApollo } from '@/utils/apollo'
  import { gql } from '@apollo/client/core'
  import { AlertSeverity, enqueueAlert } from '@/utils/alert'
  import { argsToArgsConfig } from 'graphql/type/definition'

  const ruleContext =
    getContext<
      Writable<
        Rule & { references: (Rule & { author: YPUser; counts: RuleCounts })[] }
      >
    >('rule')

  let rule = { ...$ruleContext }

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    const { data } = await getApollo().mutate<{
      rule?: {
        updateMeta?: Rule & {
          references: (Rule & { author: YPUser; counts: RuleCounts })[]
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

    if (id === rule.id || rule.references.find((x) => x.id === id)) return

    const { data } = await getApollo().mutate<{
      rule?: { addReference?: Rule & { author: YPUser; counts: RuleCounts } }
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
      on:close={() => (showReferenceAddDialog = false)}
    />
  </div>
{/if}

<div class="text-3xl font-bold">{rule.name}</div>

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
    <Button class="bg-blue-500 w-full text-center mt-4 py-2">
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
