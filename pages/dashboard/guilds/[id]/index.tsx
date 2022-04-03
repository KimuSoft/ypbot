import React from 'react'
import { NextPageWithLayout } from '../../../../webUtils/next'
import { useCurrentGuild } from '../../../../webUtils/hooks/useCurrentGuild'
import { ThreeDots } from 'react-loader-spinner'
import _ from 'lodash'
import { YPCategory } from '../../../../src/globalTypes'
import CategoryCollapse from '../../../../ui/organisms/CategoryCollapse'
import { useCurrentUser } from '../../../../webUtils/hooks/useCurrentUser'
import GuildHeader from '../../../../ui/organisms/GuildHeader'
import Container from '../../../../ui/atoms/Container'

const GuildDashboard: NextPageWithLayout = () => {
    const { data: guild, error } = useCurrentGuild()
    const { data: user } = useCurrentUser()

    const categories = React.useMemo(() => {
        if (!guild) return []

        const categories = _.sortBy([...new Set(guild.channels.map((x) => x.category?.id || null))]).reverse()

        return categories.map((x) => {
            return {
                name: guild.channels.find((y) => (y.category?.id || null) === (x || null))?.category?.name,
                channels: guild.channels.filter((y) => (y.category?.id || null) === (x || null)),
            }
        }) as YPCategory[]
    }, [guild])

    if (error) {
        return <div className="p-4 bg-red-500 rounded-lg">{error.toString()}</div>
    }

    if (!guild) {
        return (
            <div className="w-full flex h-full justify-center items-center">
                <ThreeDots color="#fff" />
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <GuildHeader user={user} guild={guild} />
            <div className="mt-[20px]" />
            <Container>
                <div className="flex flex-col gap-[12px]">
                    {categories.map((x, i) => (
                        <CategoryCollapse key={i} category={x} />
                    ))}
                </div>
            </Container>
            {/*<pre>{JSON.stringify(categories, null, 2)}</pre>*/}
            {/*<pre>{JSON.stringify(guild, null, 2)}</pre>*/}
        </div>
    )
}

GuildDashboard.layout = 'dashboard'

export default GuildDashboard
