import React from 'react'
import { MdError } from 'react-icons/md'

const ErrorMessage: React.FC = ({ children }) => {
    return (
        <div className="bg-red-500 px-4 py-2 rounded-[16px] mt-[12px] flex gap-4 items-center">
            <MdError size={24} />
            <span className="text-lg">{children}</span>
        </div>
    )
}

export default ErrorMessage
