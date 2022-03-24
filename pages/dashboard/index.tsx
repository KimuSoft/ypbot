import React from 'react'
import { NextPageWithLayout } from '../../webUtils/next'
import DefaultHeader from '../../ui/organisms/DefaultHeader'
import { useCurrentUser } from '../../webUtils/hooks/useCurrentUser'

const Dashboard: NextPageWithLayout = () => {
    const { data: user } = useCurrentUser()

    return (
        <div>
            <DefaultHeader user={user} />
            main
        </div>
    )
}

Dashboard.layout = 'dashboard'

export default Dashboard
