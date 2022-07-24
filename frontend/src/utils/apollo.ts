import {
  ApolloClient,
  gql,
  InMemoryCache,
  type NormalizedCacheObject,
} from '@apollo/client/core'

let apollo: ApolloClient<NormalizedCacheObject> | null = null

export const getApollo = () => {
  if (apollo) return apollo
  apollo = new ApolloClient({
    uri: '/graphql',
    cache: new InMemoryCache(),
    headers: localStorage.token
      ? {
          authorization: `Bearer ${localStorage.token}`,
        }
      : {},
  })

  return apollo
}
