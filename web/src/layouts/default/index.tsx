import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const DefaultLayout: React.FC = () => {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    )
}

export default DefaultLayout
