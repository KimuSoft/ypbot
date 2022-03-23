import React from 'react'
import { FaList } from 'react-icons/fa'
import SidebarGroup from '../molecules/SidebarGroup'
import { Guild } from '../../src/globalTypes'
import GuildListItem from '../molecules/GuildListItem'

const GuildSidebarList: React.FC<{ guilds: Guild[] }> = ({ guilds }) => {
    return (
        <SidebarGroup title="서버 관리" icon={FaList}>
            {guilds.map((x, i) => (
                <GuildListItem guild={x} key={i} />
            ))}
        </SidebarGroup>
    )
}

export default GuildSidebarList
