import React from 'react'
import clsx from 'clsx'

const HeaderContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
    return <div {...props} className={clsx('px-[20px] py-[10px] flex', className)} />
}

export default HeaderContainer
