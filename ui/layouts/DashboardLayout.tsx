import React from 'react'
import Sidebar from '../organisms/Sidebar'
import { Guild } from '../../src/globalTypes'
import { faker } from '@faker-js/faker'
import _ from 'lodash'
import { useCurrentUser } from '../../webUtils/hooks/useCurrentUser'
import LoadingScreen from '../organisms/LoadingScreen'
import { AnimatePresence } from 'framer-motion'

const DashboardLayout: React.FC = ({ children }) => {
    const { data: user, error } = useCurrentUser()

    if (error) {
        window.location.href = '/auth/login'
        return <div>Authentication required</div>
    }

    const guilds = React.useMemo(() => {
        return _.sortBy(user?.guilds ?? ([] as Guild[]), 'isOwner').reverse()
    }, [user])

    return (
        <AnimatePresence>
            {user ? (
                <div className="flex h-screen">
                    <Sidebar guilds={guilds} />
                    <div className="flex-grow px-[30px] py-[50px] overflow-y-auto h-full">{children}</div>
                </div>
            ) : (
                <LoadingScreen />
            )}
        </AnimatePresence>
    )
}

export default DashboardLayout
