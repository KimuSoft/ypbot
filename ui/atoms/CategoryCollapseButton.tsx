import React from 'react'
import clsx from 'clsx'
import { FaChevronDown, FaList } from 'react-icons/fa'
import { motion } from 'framer-motion'

const CategoryCollapseButton: React.FC<{ active: boolean } & React.HTMLAttributes<HTMLDivElement>> = ({ active, className, children, ...props }) => {
    return (
        <div {...props} className={clsx('flex items-center gap-[11px] cursor-pointer', className)}>
            <div className="h-[1px] bg-stone-500 flex-grow" />
            <FaList size={12} />
            <div>{children || '기본 채널'}</div>
            <motion.div
                animate={{ rotate: active ? 180 : 0 }}
                transition={{
                    type: 'spring',
                }}
            >
                <FaChevronDown size={12} className="text-stone-400" />
            </motion.div>
            <div className="h-[1px] bg-stone-500 flex-grow" />
        </div>
    )
}

export default CategoryCollapseButton
