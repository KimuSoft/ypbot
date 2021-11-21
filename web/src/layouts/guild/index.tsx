import React from 'react'
import { useCurrentGuild } from '../../hooks/useCurrentGuild'
import { Navigate, Outlet } from 'react-router-dom'
import GuildHeader from './Header'
import Sidebar from './Sidebar'

const GuildLayout: React.FC = () => {
    const guild = useCurrentGuild()

    if (!guild) {
        return <Navigate to="/servers" />
    }

    return (
        <div style={{ height: '100vh' }}>
            <GuildHeader />
            <div style={{ display: 'flex', paddingTop: 60, height: '100%' }}>
                <Sidebar />
                <div style={{ paddingTop: 10 }}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default GuildLayout
