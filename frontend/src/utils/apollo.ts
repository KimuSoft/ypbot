import {
  ApolloClient,
  InMemoryCache,
  type NormalizedCacheObject,
  createHttpLink,
} from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

let apollo: ApolloClient<NormalizedCacheObject> | null = null

const apolloHttpLink = createHttpLink({
  uri: '/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export const getApollo = () => {
  if (apollo) return apollo
  apollo = new ApolloClient({
    uri: '/graphql',
    cache: new InMemoryCache(),
    link: authLink.concat(apolloHttpLink),
  })

  return apollo
}
