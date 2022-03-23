import React from 'react'
import { FaList } from 'react-icons/fa'
import SidebarGroup from '../molecules/SidebarGroup'

const GuildList: React.FC = () => {
    return (
        <SidebarGroup title="서버 관리" icon={FaList}>
            guild
        </SidebarGroup>
    )
}

export default GuildList
