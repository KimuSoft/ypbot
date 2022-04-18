import React from 'react'
import { NextPageWithLayout } from '../../../webUtils/next'

import RuleList from '../../../ui/organisms/RuleList'

const Rules: NextPageWithLayout = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="bg-stone-900 flex-grow p-[24px] rounded-[16px] overflow-auto">
                <RuleList url="/rules/me" title="내 커스텀 규칙" />
            </div>
        </div>
    )
}

Rules.layout = 'dashboard'

export default Rules
