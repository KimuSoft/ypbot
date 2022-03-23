import React from 'react'
import Logo from '../atoms/Logo'
import GuildSidebarList from './GuildSidebarList'
import RulesSidebarList from './RulesSidebarList'
import { Guild } from '../../src/globalTypes'

const Sidebar: React.FC<{ guilds: Guild[] }> = ({ guilds }) => {
    return (
        <div className="bg-stone-900 p-[40px] max-w-[300px] w-full flex items-center flex-col gap-[25px]">
            <Logo />
            <div className="border-b-red-300 border-b w-full" />
            <GuildSidebarList guilds={guilds} />
            <RulesSidebarList />
        </div>
    )
}

export default Sidebar
