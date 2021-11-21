import React from 'react'
import { useCurrentUser } from './hooks/useCurrentUser'
import App from './App'

const Root: React.FC = () => {
    useCurrentUser()

    return <App />
}

export default Root
