import React from 'react'
import { YPUser } from '../../src/globalTypes'

const UserDisplay: React.FC<{ user: YPUser }> = ({ user }) => {
    return (
        <div className="flex gap-[20px] items-center">
            <span className="text-[20px] font-bold">{user.tag}</span>
            <img src={user.avatar} alt={user.tag} className="w-[48px] h-[48px] rounded-full" />
        </div>
    )
}

export default UserDisplay
