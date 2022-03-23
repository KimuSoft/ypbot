import React from 'react'
import Sidebar from '../organisms/Sidebar'
import { Guild } from '../../src/globalTypes'
import { faker } from '@faker-js/faker'
import _ from 'lodash'

const DashboardLayout: React.FC = ({ children }) => {
    const fakeGuilds = React.useMemo(() => {
        return _.sortBy(
            new Array(10).fill(void 0).map(
                () =>
                    ({
                        id: faker.datatype.uuid(),
                        name: faker.name.title(),
                        iconURL: faker.image.avatar(),
                        isOwner: faker.datatype.boolean(),
                    } as Guild)
            ),
            'isOwner'
        ).reverse()
    }, [])

    return (
        <div className="flex h-screen">
            <Sidebar guilds={fakeGuilds} />
            <div className="flex-grow px-[30px] py-[50px] overflow-y-auto h-full">{children}</div>
        </div>
    )
}

export default DashboardLayout
