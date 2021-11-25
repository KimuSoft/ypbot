import React from 'react'
import { useParams } from 'react-router-dom'

const BlackListEdit: React.FC = () => {
    const { blacklistId } = useParams<'blacklistId'>()
    console.log(blacklistId)

    return <div>edit</div>
}

export default BlackListEdit
