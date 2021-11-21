import { api } from '../api'
import useSWR from 'swr'
import { Guild } from '../../../src/sharedTypings'

const fetcher = (url: string) => api.get(url).then((x) => x.data)

export const useGuildList = () => {
    return useSWR<Guild[]>('/me/guilds', fetcher, { suspense: true }).data!
}
