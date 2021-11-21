import React from 'react'
import { AccountMenu, HeaderContainer, HeaderTitle } from '../default/Header'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRecoilState } from 'recoil'
import { guildSidebarOpen } from '../../state'

const MenuIcon = styled(FontAwesomeIcon)`
    cursor: pointer;

    display: none;

    width: 30px;
    height: 30px;
    justify-content: center;
    align-items: center;

    @media (max-width: 1024px) {
        display: block;
    }
`

const GuildHeader: React.FC = () => {
    const [sidebar, setSidebar] = useRecoilState(guildSidebarOpen)

    return (
        <HeaderContainer>
            <MenuIcon icon={['fas', sidebar ? 'close' : 'bars']} onClick={() => setSidebar(!sidebar)} />
            <HeaderTitle to="/">YP</HeaderTitle>
            <div style={{ flexGrow: 1 }} />
            <AccountMenu />
        </HeaderContainer>
    )
}

export default GuildHeader
