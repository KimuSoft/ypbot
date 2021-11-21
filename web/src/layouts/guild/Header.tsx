import React from 'react'
import { AccountMenu, HeaderContainer, HeaderTitle } from '../default/Header'

const GuildHeader: React.FC = () => {
    return (
        <HeaderContainer>
            <HeaderTitle to="/">YP</HeaderTitle>
            <div style={{ flexGrow: 1 }} />
            <AccountMenu />
        </HeaderContainer>
    )
}

export default GuildHeader
