<script lang="ts">
  import { browser } from '$app/env'
  import { goto } from '$app/navigation'
  import LoadingScreen from '@/components/molecules/LoadingScreen.svelte'
  import { currentUser } from '@/stores'
  import { AlertSeverity, enqueueAlert } from '@/utils/alert'
  import { tick } from 'svelte'

  import { getApollo } from '@/utils/apollo'
  import { fetchUser } from '@/utils/user'
  import { gql } from '@apollo/client/core'
  import type { YPUser } from 'shared'

  if (browser) {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      ;(async () => {
        const apollo = getApollo()

        const { data } = await apollo.mutate<{ invite: string | null }>({
          mutation: gql`
            mutation Login($code: String!) {
              invite(code: $code)
            }
          `,
          variables: {
            code,
          },
        })

        if (data?.invite) {
          return goto(`/app/guilds/${data.invite}`)
        } else {
          return Promise.reject()
        }
      })().catch((e) => {
        enqueueAlert({
          title: '초대 처리 실패',
          description: e.message,
          severity: AlertSeverity.Error,
          time: 10000,
        })
      })
    } else {
      goto('/app')
    }
  }
</script>

<LoadingScreen />
