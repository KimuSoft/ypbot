import React from 'react'

import SidebarLink from './SidebarLink'
import { Guild } from '../../src/globalTypes'
import SidebarLinkBase from '../atoms/SidebarLinkBase'
import Link from 'next/link'
import ListBadge from '../atoms/ListBadge'
import { useRouter } from 'next/router'

const GuildListItem: React.FC<{ guild: Guild }> = ({ guild }) => {
    const router = useRouter()

    const content = (
        <SidebarLinkBase active={router.pathname === '/dashboard/guilds/[id]' && router.query.id === guild.meta.id}>
            {guild.meta.icon ? (
                <img src={guild.meta.icon} alt={guild.meta.name} className="w-[20px] h-[20px] rounded-full" />
            ) : (
                <div className="w-[20px] h-[20px] bg-stone-800 rounded-full text-xs flex justify-center items-center">{guild.meta.name[0]}</div>
            )}
            <div className="overflow-hidden text-ellipsis whitespace-nowrap flex-grow w-0">{guild.meta.name}</div>
            {guild.isOwner && <ListBadge>OWNER</ListBadge>}
        </SidebarLinkBase>
    )

    return guild.invited ? (
        <Link href={'/dashboard/guilds/[id]'} as={`/dashboard/guilds/${guild.meta.id}`} passHref>
            <a>{content}</a>
        </Link>
    ) : (
        <a href={`/invite/${guild.meta.id}`}>{content}</a>
    )
}

export default GuildListItem
