import React from 'react'
import { YPUser } from '../../src/globalTypes'
import { Menu } from '@headlessui/react'
import MenuItem from '../atoms/MenuItem'
import MenuItemsContainer from '../atoms/MenuItemsContainer'
import { AnimatePresence } from 'framer-motion'

const UserDisplay: React.FC<{ user: YPUser }> = ({ user }) => {
    return (
        <Menu as="div" className="relative">
            <Menu.Button className="flex gap-[20px] items-center">
                <span className="text-[20px] font-bold">{user.tag}</span>
                <img src={user.avatar} alt={user.tag} className="w-[48px] h-[48px] rounded-full" />
            </Menu.Button>
            <AnimatePresence>
                <MenuItemsContainer>
                    <MenuItem onClick={() => (window.location.href = '/auth/logout')}>로그아웃</MenuItem>
                </MenuItemsContainer>
            </AnimatePresence>
        </Menu>
    )
}

export default UserDisplay
