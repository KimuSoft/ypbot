<script lang="ts">
  import { browser } from '$app/env'
  import { goto } from '$app/navigation'
  import LoadingScreen from '@/components/molecules/LoadingScreen.svelte'
  import { AlertSeverity, enqueueAlert } from '@/utils/alert'

  import { getApollo } from '@/utils/apollo'
  import { gql } from '@apollo/client/core/index.js'

  if (browser) {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      ;(async () => {
        const apollo = getApollo()

        const { data } = await apollo.mutate<{ login: string | null }>({
          mutation: gql`
            mutation Login($code: String!) {
              login(code: $code)
            }
          `,
          variables: {
            code,
          },
        })

        if (data?.login) {
          localStorage.setItem('token', data.login)

          const lastPath = localStorage.lastPath

          delete localStorage.lastPath

          window.location.href = lastPath || '/'
        }
      })().catch((e) => {
        enqueueAlert({
          title: '로그인 실패',
          description: e.message,
          severity: AlertSeverity.Error,
          time: 10000,
        })
      })
    } else {
      getApollo()
        .query<{ loginUrl: string }>({
          query: gql`
            query GetLoginUrl {
              loginUrl
            }
          `,
        })
        .then(({ data: { loginUrl } }) => {
          window.location.href = loginUrl
        })
    }
  }
</script>

<LoadingScreen />
