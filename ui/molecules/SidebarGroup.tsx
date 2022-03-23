import React from 'react'
import SidebarGroupButton from '../atoms/SidebarGroupButton'
import { IconType } from 'react-icons'
import { MdExpandMore } from 'react-icons/md'
import { AnimatePresence, motion } from 'framer-motion'

const SidebarGroup: React.FC<{ title: React.ReactNode; icon: IconType }> = ({ title, icon: Icon, children }) => {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="w-full flex justify-center flex-col">
            <SidebarGroupButton onClick={() => setOpen((v) => !v)}>
                <Icon size={12} />
                <span className="flex-grow">{title}</span>
                <motion.div
                    transition={{
                        type: 'spring',
                    }}
                    animate={{
                        rotate: open ? 180 : 0,
                    }}
                >
                    <MdExpandMore size={20} />
                </motion.div>
            </SidebarGroupButton>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, marginTop: 0 }}
                        animate={{ height: 'auto', marginTop: 12 }}
                        exit={{ height: 0, marginTop: 0 }}
                        className="overflow-hidden px-[6px] flex flex-col gap-[6px]"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SidebarGroup
