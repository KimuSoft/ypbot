import React from 'react'
import { useCurrentUser } from './hooks/useCurrentUser'
import { useTranslation } from 'react-i18next'
import App from './App'

const Root: React.FC = () => {
    useCurrentUser()
    useTranslation()

    return <App />
}

export default Root
