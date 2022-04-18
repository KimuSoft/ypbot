import React from 'react'
import Skeleton from 'react-loading-skeleton'

const RuleSkeleton: React.FC = () => {
    return (
        <div className="bg-stone-800 p-[24px] rounded-[16px]">
            <div className="flex gap-[5px]">
                <div className="flex-grow">
                    <Skeleton height={12} />
                </div>
                <div>
                    <Skeleton height={12} width={12} />
                </div>
                <div>
                    <Skeleton height={12} width={12} />
                </div>
            </div>
            <Skeleton height={12} count={2} />
        </div>
    )
}

export default RuleSkeleton
