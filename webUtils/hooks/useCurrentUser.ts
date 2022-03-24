import useSWR from 'swr'
import { api } from '../api'

export const useCurrentUser = () => {
    return useSWR('/me', {
        fetcher: (url) => api.get(url).then((x) => x.data),
    })
}
