import React from 'react'

import SidebarLink from './SidebarLink'
import { Guild } from '../../src/globalTypes'
import SidebarLinkBase from '../atoms/SidebarLinkBase'
import Link from 'next/link'
import ListBadge from '../atoms/ListBadge'
import { useRouter } from 'next/router'

const GuildListItem: React.FC<{ guild: Guild }> = ({ guild }) => {
    const router = useRouter()

    return (
        <Link href={'/guilds/[id]'} as={`/guilds/${guild.id}`} passHref>
            <a>
                <SidebarLinkBase active={router.query.id === guild.id}>
                    <img src={guild.iconURL} alt={guild.name} className="w-[20px] h-[20px] rounded-full" />
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap flex-grow w-0">{guild.name}</div>
                    {guild.isOwner && <ListBadge>OWNER</ListBadge>}
                </SidebarLinkBase>
            </a>
        </Link>
    )
}

export default GuildListItem
