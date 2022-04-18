import React from 'react'
import { MdError } from 'react-icons/md'

const LabelledInput: React.FC<{ label?: React.ReactNode; error?: React.ReactNode }> = ({ label, error, children }) => {
    return (
        <label className="flex flex-col gap-2">
            <div className="pl-[12px]">{label}</div>
            <div>{children}</div>
            {error && (
                <div className="pl-[12px] flex items-center gap-2 text-red-500">
                    <MdError size={16} />
                    <span>{error}</span>
                </div>
            )}
        </label>
    )
}

export default LabelledInput
