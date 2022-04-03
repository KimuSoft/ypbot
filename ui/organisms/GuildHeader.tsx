import React from 'react'
import HeaderContainer from '../atoms/HeaderContainer'
import UserDisplay from '../molecules/UserDisplay'
import { YPUser, Guild } from '../../src/globalTypes'
import GuildDisplay from '../molecules/GuildDisplay'

const DefaultHeader: React.FC<{ user: YPUser; guild: Guild }> = ({ user, guild }) => {
    return (
        <HeaderContainer>
            <GuildDisplay guild={guild} />
            <div className="flex-grow" />
            <UserDisplay user={user} />
        </HeaderContainer>
    )
}

export default DefaultHeader
