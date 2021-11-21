import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const DefaultLayout: React.FC = () => {
    return (
        <div>
            <Header />
            <div style={{ paddingTop: 70 }}>
                <Outlet />
            </div>
        </div>
    )
}

export default DefaultLayout
