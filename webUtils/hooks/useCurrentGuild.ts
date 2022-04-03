import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Guild } from '../../src/globalTypes'
import { api } from '../api'

export const useCurrentGuild = () => {
    const router = useRouter()

    return useSWR<Guild>(`/guilds/${router.query.id}`, {
        fetcher: (url) => api.get(url).then((x) => x.data),
    })
}
