import { useParams } from 'react-router-dom'
import { api } from '../api'
import useSWR from 'swr'
import { AxiosError } from 'axios'
import { Guild } from '../../../src/sharedTypings'

const fetcher = (id: string) =>
    api
        .get(`/guilds/${id}`)
        .then((x) => {
            return x.data
        })
        .catch((err: AxiosError) => {
            if (err.response.status === 404) {
                return {
                    notFound: true,
                }
            }
        })

export const useCurrentGuild = (): null | Guild => {
    const params = useParams<'id'>()
    const { data } = useSWR<{ notFound: true } | Guild>(params.id, fetcher, { suspense: true })

    if (data['notFound']) {
        return null
    }

    return data as Guild
}
