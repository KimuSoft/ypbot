import { gql } from '@apollo/client/core/index.js'
import type { YPUser } from 'shared'
import { getApollo } from './apollo'

export const fetchUser = async () => {
  const apollo = getApollo()

  const {
    data: { me },
  } = await apollo.query<{
    me: YPUser | null
  }>({
    query: gql`
      query FetchUser {
        me {
          id
          username
          discriminator
          tag
          avatar
        }
      }
    `,
  })

  return me
}
