import React from 'react'
import clsx from 'clsx'

const SidebarGroupButton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, title, ...props }) => {
    return (
        <div className={clsx('bg-red-400 px-[20px] py-[12px] cursor-pointer select-none flex gap-[12px] rounded-[8px] font-bold text-[14px] items-center', className)} {...props}>
            {children}
        </div>
    )
}

export default SidebarGroupButton
