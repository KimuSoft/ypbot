import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useCurrentUser } from '../../hooks/useCurrentUser'

const Container = styled.div`
    background: #202225;
    display: flex;
    padding-left: 30px;
    padding-right: 30px;
    height: 60px;
    align-items: center;
    gap: 20px;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 99999;
`

const Title = styled(Link)`
    color: #fff;
    font-size: 24px;
    font-weight: 700;
    text-decoration: none;
`

const LogInBtn = styled.a`
    color: white;
    text-decoration: none;
`

const UserDropdown = styled.div`
    position: relative;
    user-select: none;

    .activator {
        cursor: pointer;
        font-weight: 600;

        &:hover + .content {
            top: 100%;
            opacity: 1;
            visibility: visible;
        }
    }

    .content {
        visibility: hidden;
        width: 150px;
        position: absolute;
        top: 40px;
        opacity: 0;
        transition: all 0.2s ease;
        right: 0;
        background: #18191c;
        padding: 10px;

        &:hover {
            top: 100%;
            opacity: 1;
            visibility: visible;
        }

        .item {
            padding: 10px;
            transition: all 0.2s ease;
            cursor: pointer;
            display: flex;
            text-decoration: none;
            color: inherit;
            &:hover {
                background: #262626;
            }
        }
    }
`

const AccountMenu: React.FC = () => {
    const user = useCurrentUser()

    return (
        <div>
            {user ? (
                <UserDropdown>
                    <div className="activator">{user.tag}</div>
                    <div className="content">
                        <a href={'/auth/logout'} className="item">
                            로그아웃
                        </a>
                    </div>
                </UserDropdown>
            ) : (
                <LogInBtn href="/auth/login">로그인</LogInBtn>
            )}
        </div>
    )
}

const DefaultHeader: React.FC = () => {
    return (
        <Container>
            <Title to="/">위브</Title>
            <div style={{ flexGrow: 1 }} />
            <AccountMenu />
        </Container>
    )
}

export default DefaultHeader

export { AccountMenu, Title as HeaderTitle, Container as HeaderContainer }
