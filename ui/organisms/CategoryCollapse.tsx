import { motion } from 'framer-motion'
import React from 'react'
import { YPCategory } from '../../src/globalTypes'
import CategoryCollapseButton from '../atoms/CategoryCollapseButton'

const CategoryCollapse: React.FC<{ category: YPCategory }> = ({ category }) => {
    const [open, setOpen] = React.useState(true)

    return (
        <div>
            <CategoryCollapseButton onClick={() => setOpen((v) => !v)} active={open}>
                {category.name}
            </CategoryCollapseButton>
            <motion.div className="overflow-hidden" initial={{ height: 0 }} animate={{ height: open ? 'fit-content' : 0 }}>
                <pre>{JSON.stringify(category.channels, null, 2)}</pre>
            </motion.div>
        </div>
    )
}

export default CategoryCollapse
