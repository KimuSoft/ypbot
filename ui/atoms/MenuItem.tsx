import React from 'react'
import { Menu } from '@headlessui/react'
import clsx from 'clsx'

const MenuItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
    return <Menu.Item>{({ active }) => <div {...props} className={clsx('hover:bg-stone-700 py-1 cursor-pointer transition-all rounded-md px-2', className)} />}</Menu.Item>
}

export default MenuItem
