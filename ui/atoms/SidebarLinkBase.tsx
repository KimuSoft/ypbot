import React from 'react'
import clsx from 'clsx'

const SidebarLinkBase: React.FC<React.HTMLAttributes<HTMLDivElement> & { active: boolean }> = ({ children, className, active, ...props }) => {
    return (
        <div
            className={clsx(
                'px-[10px] py-[6px] cursor-pointer flex items-center gap-6 text-[14px] transition-all rounded-[8px]',
                {
                    'bg-stone-800': active,
                },
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export default SidebarLinkBase
