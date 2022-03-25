import React from 'react'
import { Menu } from '@headlessui/react'
import clsx from 'clsx'

const MenuItemsContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
    return (
        <Menu.Items as="div" className={clsx('absolute right-0 mt-4 shadow-lg ring rounded-md p-2 ring-opacity-10 bg-stone-900 ring-stone-50', className)} {...props}>
            {children}
        </Menu.Items>
    )
}

export default MenuItemsContainer
