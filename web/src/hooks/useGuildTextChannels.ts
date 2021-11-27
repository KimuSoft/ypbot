import { api } from '../api'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import { YPChannel } from '../../../src/sharedTypings'

const fetcher = (url: string) => api.get(url).then((x) => x.data)

export const useGuildTextChannels = () => {
    const { id } = useParams<'id'>()

    return useSWR<YPChannel[]>(`/guilds/${id}/channels/text`, fetcher, { suspense: true }).data!
}
