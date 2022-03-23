import React from 'react'
import Logo from '../atoms/Logo'
import GuildList from './GuildList'

const Sidebar: React.FC = () => {
    return (
        <div className="bg-stone-900 p-[40px] max-w-[300px] w-full flex items-center flex-col gap-[25px]">
            <Logo />
            <div className="border-b-red-300 border-b w-full" />
            <GuildList />
        </div>
    )
}

export default Sidebar
