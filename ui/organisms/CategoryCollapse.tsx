import React from 'react'
import { YPCategory } from '../../src/globalTypes'
import ListCollapse from './ListCollapse'

const CategoryCollapse: React.FC<{ category: YPCategory }> = ({ category }) => {
    return (
        <ListCollapse title={category.name}>
            <pre>{JSON.stringify(category.channels, null, 2)}</pre>
        </ListCollapse>
    )
}

export default CategoryCollapse
