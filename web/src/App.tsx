import React from 'react'
import { Route, Routes } from 'react-router-dom'
import DefaultLayout from './layouts/default'
import GuildList from './pages/GuildList'

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="*" element={<DefaultLayout />}>
                <Route path="servers" element={<GuildList />} />
                <Route path="*" element={<div>Not Found</div>} />
            </Route>
        </Routes>
    )
}

export default App
