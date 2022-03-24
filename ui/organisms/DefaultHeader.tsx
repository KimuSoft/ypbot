import React from 'react'
import HeaderContainer from '../atoms/HeaderContainer'
import UserDisplay from '../molecules/UserDisplay'
import { YPUser } from '../../src/globalTypes'

const DefaultHeader: React.FC<{ user: YPUser }> = ({ user }) => {
    return (
        <HeaderContainer>
            <div className="flex-grow" />
            <UserDisplay user={user} />
        </HeaderContainer>
    )
}

export default DefaultHeader
