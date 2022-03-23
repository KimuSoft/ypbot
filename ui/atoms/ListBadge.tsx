import React from 'react'
import clsx from 'clsx'

const ListBadge: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, color, className, ...props }) => {
    return (
        <div {...props} className={clsx('h-[18px] font-bold text-[12px] px-[6px] border rounded-full text-red-500 border-red-500', className)}>
            {children}
        </div>
    )
}

export default ListBadge
