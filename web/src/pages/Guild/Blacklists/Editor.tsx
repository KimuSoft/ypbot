import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { api } from '../../../api'
import { useGuildTextChannels } from '../../../hooks/useGuildTextChannels'

const fetcher = (url: string) =>
    api
        .get(url)
        .then((x) => x.data)
        .catch(() => null)

const BlackListEdit: React.FC = () => {
    const { blacklistId, id } = useParams<'blacklistId' | 'id'>()

    const { data } = useSWR(`/guilds/${id}/blacklists/${blacklistId}`, fetcher, { suspense: true })

    const channels = useGuildTextChannels()

    console.log(channels)

    if (!data) {
        return <Navigate to=".." />
    }

    return <div>{JSON.stringify(data)}</div>
}

export default BlackListEdit
