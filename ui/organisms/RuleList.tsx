import React from 'react'
import RuleSkeleton from './RuleSkeleton'
import ListCollapse from './ListCollapse'
import { api } from '../../webUtils/api'
import useSWR from 'swr'

const fetcher = (url: string) => api.get(url).then((x) => x.data)

const RuleList: React.FC<{ url: string; title: React.ReactNode }> = ({ url, title }) => {
    const { data, error } = useSWR(url, { fetcher })

    console.log(data)

    return (
        <ListCollapse title={title}>
            {(() => {
                if (error) {
                    return <div className="bg-red-500 p-4 rounded-md mt-[12px]">{data?.error ?? error.message}</div>
                }
                if (!data) {
                    return (
                        <div className="mt-[12px] grid gap-[12px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[1, 2, 3, 4, 5, 6].map((_, i) => (
                                <RuleSkeleton key={i} />
                            ))}
                        </div>
                    )
                }
                if (data) {
                    return <div>data</div>
                }
            })()}
        </ListCollapse>
    )
}

export default RuleList
