import React from 'react'
import SidebarGroup from '../molecules/SidebarGroup'
import { FaCog, FaTag } from 'react-icons/fa'
import SidebarLink from '../molecules/SidebarLink'

const RulesSidebarList: React.FC = () => {
    return (
        <SidebarGroup title="내 규칙" icon={FaTag}>
            <SidebarLink path="/dashboard/rules" title="내 규칙 목록" icon={FaCog} />
            <SidebarLink path="/dashboard/rules/browse" title="규칙 찾아보기" icon={FaCog} />
            <SidebarLink path="/dashboard/rules/new" title="새 커스텀 규칙 만들기" icon={FaCog} />
        </SidebarGroup>
    )
}

export default RulesSidebarList
