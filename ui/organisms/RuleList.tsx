import React from 'react'
import RuleSkeleton from './RuleSkeleton'
import ListCollapse from './ListCollapse'
import { api } from '../../webUtils/api'
import useSWR from 'swr'
import type { Rule } from '@prisma/client'
import RuleCreateModal from './RuleCreateModal'
import ErrorMessage from '../atoms/ErrorMessage'

const fetcher = (url: string) => api.get(url).then((x) => x.data)

const RuleList: React.FC<{ url: string; title: React.ReactNode; creatable?: boolean }> = ({ url, title, creatable }) => {
    const { data, error } = useSWR<Rule[]>(url, { fetcher })

    return (
        <ListCollapse title={title}>
            {(() => {
                if (error) {
                    return <ErrorMessage>{(data as any)?.error ?? error.message}</ErrorMessage>
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
                    if (!data.length && !creatable) {
                        return (
                            <div className="mt-[12px] flex flex-col items-center">
                                <div className="text-xl">규칙이 없습니다</div>
                            </div>
                        )
                    }
                    return (
                        <div className="mt-[12px] grid gap-[12px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {data.map((x, i) => (
                                <div key={i}>
                                    <pre style={{ overflow: 'auto' }}>{JSON.stringify(x, null, 2)}</pre>
                                </div>
                            ))}
                            {creatable && <RuleCreateModal />}
                        </div>
                    )
                }
            })()}
        </ListCollapse>
    )
}

export default RuleList
