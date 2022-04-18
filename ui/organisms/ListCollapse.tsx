import React from 'react'
import ListCollapseButton from '../atoms/ListCollapseButton'
import { motion } from 'framer-motion'

const ListCollapse: React.FC<{title: React.ReactNode}> = ({title, children}) => {
    const [open, setOpen] = React.useState(true)

    return (
        <div>
            <ListCollapseButton onClick={() => setOpen((v) => !v)} active={open}>
                {title}
            </ListCollapseButton>
            <motion.div className="overflow-hidden" initial={{ height: 0 }} animate={{ height: open ? 'fit-content' : 0 }}>
                {children}
            </motion.div>
        </div>
    )
}

export default ListCollapse
