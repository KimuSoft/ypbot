import React from 'react'
import { Guild } from '../../src/globalTypes'
import Avatar from '../atoms/Avatar'

const GuildDisplay: React.FC<{ guild: Guild }> = ({ guild }) => {
    return (
        <div className="flex gap-[20px] items-center">
            <Avatar size={40} src={guild.meta.icon} />
            <div className="font-bold text-[24px]">{guild.meta.name}</div>
        </div>
    )
}

export default GuildDisplay
