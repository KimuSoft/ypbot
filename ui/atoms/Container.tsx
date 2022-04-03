import React from 'react'

const Container: React.FC = ({ children }) => {
    return <div className="p-[24px] bg-stone-900 flex-grow h-0 rounded-[16px] overflow-y-auto">{children}</div>
}

export default Container
