import React from 'react'
import Sidebar from '../organisms/Sidebar'

const DashboardLayout: React.FC = ({ children }) => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-grow px-[30px] py-[50px] overflow-y-auto h-full">{children}</div>
        </div>
    )
}

export default DashboardLayout
