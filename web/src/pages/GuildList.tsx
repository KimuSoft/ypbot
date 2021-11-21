import React from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { Link, Navigate } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'
import { api } from '../api'
import useSWR from 'swr'

const ItemContainerSkeleton = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    transition: all 0.2s ease-in-out;
`

const ItemContainer = styled(ItemContainerSkeleton)`
    cursor: pointer;
    &:hover {
        background: #292b2f;
    }
`

const GuildItemLoading: React.FC = () => {
    return (
        <ItemContainerSkeleton>
            <div style={{ width: 60, height: 60 }}>
                <Skeleton circle height="100%" width="100%" />
            </div>
            <div style={{ flexGrow: 1 }}>
                <Skeleton />
            </div>
            <div style={{ width: 100, height: 40 }}>
                <Skeleton height="100%" />
            </div>
        </ItemContainerSkeleton>
    )
}

type Guild = {
    id: string
    icon: string
    invited: boolean
    name: string
}

const Button = styled.div<{ invited: boolean }>`
    width: 100px;
    height: 40px;
    overflow: hidden;
    border-radius: 5px;
    background: ${({ invited }) => (invited ? '#346eeb' : '#27a189')};
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    user-select: none;
    transition: filter 0.2s ease;
    &:hover {
        filter: brightness(0.8);
    }
    &:active {
        filter: brightness(0.6);
    }
`

const GuildItem: React.FC<{ guild: Guild }> = ({ guild }) => {
    const content = (
        <ItemContainer>
            <div style={{ width: 60, height: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '50%', background: '#202225' }}>
                {guild.icon ? <img src={guild.icon} width="100%" height="100%" alt="icon" /> : <span style={{ fontSize: 20 }}>{guild.name.slice(0, 1).toUpperCase()}</span>}
            </div>
            <div style={{ flexGrow: 1, fontSize: 20, width: 0 }}>
                <div style={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: 600 }}>{guild.name}</div>
            </div>
            <Button invited={guild.invited}>{guild.invited ? '설정' : '초대'}</Button>
        </ItemContainer>
    )

    return guild.invited ? (
        <Link style={{ color: '#fff', textDecoration: 'none' }} to={`/servers/${guild.id}`}>
            {content}
        </Link>
    ) : (
        <a style={{ color: '#fff', textDecoration: 'none' }} href={`/servers/invite/${guild.id}`}>
            {content}
        </a>
    )
}

const Container = styled.div`
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
    max-width: 768px;
    margin-left: auto;
    margin-right: auto;
`

const List = styled.div`
    display: flex;
    flex-direction: column;
`

const fetcher = (url: string) => api.get(url).then((x) => x.data)

const Content: React.FC = () => {
    const data = useSWR<Guild[]>('/me/guilds', fetcher, { suspense: true }).data!

    data.sort((a, b) => {
        return a.invited === b.invited ? 0 : a.invited ? -1 : 1
    })

    console.log(JSON.stringify(data))

    return (
        <List>
            {data.map((x, i) => (
                <GuildItem key={i} guild={x} />
            ))}
        </List>
    )
}

const GuildList: React.FC = () => {
    const user = useCurrentUser()

    if (!user) return <Navigate to="/" />

    return (
        <Container>
            <React.Suspense
                fallback={
                    <List>
                        <GuildItemLoading />
                        <GuildItemLoading />
                        <GuildItemLoading />
                    </List>
                }
            >
                <Content />
            </React.Suspense>
        </Container>
    )
}

export default GuildList
